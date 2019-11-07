<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import Auth from '@modules/Auth'
import commonService from '@services/commonService'
import APP_CONFIG from '@/app.config'
import localStorage from '@modules/localStorage'
import Popup from '@modules/Popup'
import Utils from '@modules/Utils';
import REMOTE_CONFIG from '@/../main/config'
const { remote, ipcRenderer } = require('electron')
// 原生窗口信息
const currentWindow = remote.getCurrentWindow();
const WIN_CONFIG = REMOTE_CONFIG['BrowserWindow'];
const COOKIE_UCENTER = APP_CONFIG['NAME'] + '_USER';
const HTTP_CLIENT = APP_CONFIG['HTTP_CLIENT'];
let ws;
let _user;
let wsUrl;
// SERVICE_TYPE 1：本地服务器 2：远程服务器
const SERVICE_TYPE = APP_CONFIG['NAME'] + '_SERVICE_TYPE';
let isRemote = localStorage.getObject(SERVICE_TYPE) == 1 ? localStorage.getObject(SERVICE_TYPE) : 2
let IntervalWesoket;
export default {
    name: 'creaker-reserve',
    created() {
        let isInAuth = this.$route.name == 'Auth';
        // 登录过期广播
        Auth.on('auth_timeout', function () {
            let timeoutText = isInAuth ? '抱歉，登录失败，请稍后再试！' : '登录状态过期，请重新登录！';
            timeoutText = !commonService.updateToken() ? '' : timeoutText
            commonService.Authorize(timeoutText);
        });
        if (commonService.updateToken()) {
            commonService.checkLogin();
            console.log('checkLogin')
        } else if (!isInAuth) {
            console.log('isInAuth')
            commonService.Authorize();
        }
    },
    computed: {
        isLogin() {
            return this.$store.state.User.isLogin
        }
    }
}
</script>

<style>
    .text-center{text-align: center;}
    .text-right{text-align: right;}
    .text-left{text-align: left;}
    .float-left{float: left;}
    .float-right{float: right;}
    html,body,#app,.fullWindow, .el-container{height: 100%;position: relative;}
    .echarts {width: 100%;height: 100%;}
    .el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .el-table__body tr.current-row>td, .el-table__body tr.hover-row.current-row>td, .el-table__body tr.hover-row.el-table__row--striped.current-row>td, .el-table__body tr.hover-row.el-table__row--striped>td, .el-table__body tr.hover-row>td {background-color: #f6f7f8;}
    .el-table th {background-color: #e9eef4}
    .el-table td, .el-table th.is-leaf {border-color: #e8e8e8}

    /* 窗口拖动 */
    .winDrag{-webkit-app-region: drag;z-index: 10000;position: relative;}
    .winNoDrag{-webkit-app-region: no-drag;}

    /* 自定义窗口后调整 */
    .el-message{top: 35px;}
    .el-notification.left,
    .el-notification.right{margin-top: 20px;}

    /* 模态框 */
    .el-dialog{background-color: #f8fbff}
    .el-dialog .el-dialog__header{padding: 5px 20px 5px 30px;font-weight: bold;background-color: #e6eef7;position: relative;}
    .decorate .el-dialog .el-dialog__header::after{content: '';position: absolute;left:16px;top:9px;width: 4px;height: 16px;background-color: #3498fa;}
    .el-dialog .el-dialog__header .el-dialog__headerbtn{top: 8px}
    .el-dialog .el-dialog__header .el-dialog__title{font-size: 16px}

    /* 表格选中颜色 */

    .el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .el-table__body tr.current-row>td, .el-table__body tr.hover-row.current-row>td, .el-table__body tr.hover-row.el-table__row--striped.current-row>td, .el-table__body tr.hover-row.el-table__row--striped>td, .el-table__body tr.hover-row>td {background-color: #dedede;}

    /*图标 */
    .icon{width: 30px;height: 30px;background: url("./assets/images/icon.png") center no-repeat;display: inline-block;background-position-x: center}
    .icon.icon-user{background-position-y: -6px;}
    .icon.icon-pw{background-position-y: -59px;}
    .icon.icon-home{background-position-y: -107px;}
    .icon.icon-play{background-position-y: -153px;}
    .icon.icon-sigh{background-position-y: -199px;}
    .icon.icon-setting{background-position-y: -246px;}
    .icon.icon-navigation{background-position-y: -291px;}
    .icon.icon-stop{background-position-y: -338px;}
    .icon.icon-edit{background-position-y: -389px;}
    .icon.icon-move{background-position-y: -439px;}
    .icon.icon-yLink{background-position-y: -564px;}
    .icon.icon-nLink{background-position-y: -503px;}
    .icon.icon-logout{background-position-y: -627px;}
    .icon.icon-instrument{background-position-y: -758px;}
    .icon.icon-printing{background-position-y: -825px;}
    .icon.icon-disk{background-position-y: -885px;}
    .icon.icon-index{background-position-y: -685px;}
    .icon.icon-search{background-position-y: -952px;}
    .icon.icon-logout{background-position-y: -1023px;}
    .icon.icon-key{background-position-y: -1095px;}
    .icon.icon-success{background-position-y: -1164px;}
    .icon.icon-no{background-position-y: -1242px;}
    .icon.icon-success-black{background-position-y: -1342px;}
    .icon.icon-return{background-position-y: -1398px;}
    .icon.icon-preserve{background-position-y: -1460px;}
    .icon.icon-success-o{background-position-y: -1523px;}
    .icon.icon-report{background-position-y: -1575px;width:28px !important;}
    .icon.icon-add{background-position-y: -1623px;}
    .icon.icon-download{background-position-y: -1661px;}
    .icon.icon-delete{background-position-y: -1704px;}
    .icon.icon-list{background-position-y: -1747px;}


    /* btn图标 */
    .icon-btn{width: 12px;height: 12px;background: url("./assets/images/icon-btn.png") center no-repeat;display: inline-block;background-position-x: center}
    .icon-btn.icon-printing{background-position-y: -4px;}
    .icon-btn.icon-next{background-position-y: -28px;}
    .icon-btn.icon-previous{background-position-y: -52px;}
    .icon-btn.icon-enlarge{background-position-y: -77px;}
    .icon-btn.icon-narrow{background-position-y: -101px;}
    .icon-btn.icon-update-o{background-position-y: -125px;}
    .icon-btn.icon-report{background-position-y: -148px;}
    .icon-btn.icon-user{background-position-y: -173px;}
    .icon-btn.icon-del{background-position-y: -201px;}
    .icon-btn.icon-add{background-position-y: -230px;}
    .icon-btn.icon-search{background-position-y: -258px;}
    .icon-btn.icon-play{background-position-y: -286px;}
    .icon-btn.icon-preview{background-position-y: -315px;}
    .icon-btn.icon-update{background-position-y: -343px;}
    .icon-btn.icon-ok{background-position-y: -412px;}
    .icon-btn.icon-errow{background-position-y: -378px;}
    .icon-btn.icon-hide{background-position-y: -444px;}
    .icon-btn.icon-screen{background-position-y: -479px;}
    .icon-btn.icon-close{background-position-y: -517px;}
    .icon-btn.icon-user-o{background-position-y: -555px;}
    .icon-btn.icon-pw{background-position-y: -595px;}
    .icon-btn.icon-glasses{background-position-y: -638px;}
    .icon-btn.icon-glasses-o{background-position-y: -674px;}
    .icon-btn.icon-hide-white{background-position-y: -743px;}
    .icon-btn.icon-close-white{background-position-y: -783px;}
    .icon-btn.icon-recycle{background-position-y: -820px;}
    .icon-btn.icon-success{background-position-y: -859px;}
    .icon-btn.icon-fvc{background-position-y: -906px;}
    .icon-btn.icon-mvv{background-position-y: -946px;}
    .icon-btn.icon-svc{background-position-y: -986px;}
    .icon-btn.icon-switch{background-position-y: -1032px;}
    .icon-btn.icon-stop{background-position-y: -1069px;}
    .icon-btn.icon-scaling{background-position-y: -1109px;}
    .icon-btn.icon-update-d{background-position-y: -1149px; width:15px;height:13px;position:relative;top:1px;}
    .icon-btn.icon-database{background-position-y: -1210px;}

    /* 首页功能图标 */
    .icon-device{width: 32px;height: 32px;background: url("./assets/images/icon_device.png") center no-repeat;display: inline-block;background-position-x: center}
    .icon-device.icon-set{background-position-y: -7px;}
    .icon-device.icon-data{background-position-y: -90px;}
    .icon-device.icon-base{background-position-y: -172px;}
    .icon-device.icon-tool{background-position-y: -255px;}
    .icon-device.icon-course{background-position-y: -336px;}
    .icon-device.icon-list{background-position-y: -419px;}
    .icon-device.icon-customer{background-position-y: -501px;}
    .icon-device.icon-config{background-position-y: -584px;}

    /* input type="file" */
    .file-wapper { position: relative; overflow: hidden; margin: 0 auto 10px;}
    .file-wapper .el-input { position: absolute; top: 0; left: 0; z-index: 1; opacity: 0; width: 100px; height: 40px; cursor: pointer; }
    .file-wapper .el-button { width: 100px; height: 40px;  cursor: pointer; }
</style>
