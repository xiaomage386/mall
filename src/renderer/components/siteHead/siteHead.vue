<template>
    <div class="site-head clearfix">
        <div class="siteHeadBar winDrag">
            <i class="icon-logo"></i>
            <div class="title" v-if="!!showTitle">
                {{showTitle}}</div>
            <div class="window-btn winNoDrag">
                <el-button icon="icon-btn icon-hide" @click="Minimize()"></el-button>
                <!-- <el-button icon="icon-btn icon-screen" @click="Maximize()"></el-button> -->
                <el-button icon="icon-btn icon-close" @click="Close()"></el-button>
            </div>
        </div>
    </div>
</template>
<script>
import Utils from '@modules/Utils';
import Popup from '@modules/Popup'
const { remote, ipcRenderer } = require('electron')
const currentWindow = remote.getCurrentWindow();
export default {
    name: 'SiteHead',
    props: {
        showTitle: String
    },
    methods: {
        /**
         * 最小化window窗口
         */
        Minimize(){
            currentWindow.minimize();
        },
        /**
         * 最大化、恢复window窗口
         */
        Maximize(){
            currentWindow.isMaximized() ? currentWindow.unmaximize() : currentWindow.maximize();
        },
        /**
         * 退出软件
         */
        Close(){
            // ipcRenderer.send('hideMainWindow')
            Popup.confirm(`是否退出该软件？`).then(flag => {
                if (flag) {
                   currentWindow.close();
                }
            })
        }
    },
    data() {
        return {
        }
    }
};
</script>

<style>
.site-head {padding:0;height: 32px;z-index: 3;-webkit-user-select: none;-ms-user-select: none;user-select: none;}
.site-head .siteHeadBar{position: fixed;top: 0;left: 0;right: 0;height: 32px;background-color: #e6eef7;background: #3394f5;}
.site-head .title{line-height: 32px;font-size: 14px;color:#323232;padding-left: 10px;position:relative;color: #fff; float: left;}
.site-head .icon-logo{background: url("../../assets/images/logo.png") no-repeat;background-size: cover; width: 20px;height: 20px; float:left;margin-top: 5px;margin-left: 10px;}
.site-head .window-btn{float: right;}
.site-head .window-btn > .el-button{padding: 9px 10px;border-width: 0;border-radius: 0;background: none;margin: auto;}
.site-head .window-btn > .el-button:hover{background: rgba(0, 0, 0, 0.05);}
.site-head .window-btn .icon-btn{cursor: pointer;}
</style>