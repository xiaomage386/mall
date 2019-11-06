<template>
    <div class="auth">
        <div class="auth-bg"></div>
        <div class="inside padding">
            <div class="content">
                <div class="decorate">
                    <i slot="suffix"
                       class="icon-btn icon-hide-white winNoDrag"
                       @click="Minimize()"></i>
                    <i slot="suffix"
                       class="icon-btn icon-close-white winNoDrag"
                       @click="Close()"></i>
                </div>
                <div class="window-bar winDrag"></div>
                <div class="title">肺功能预约补录系统</div>
                <el-form ref="form"
                         :rules="formRules"
                         :model="form">
                    <el-form-item prop="user">
                        <el-input placeholder="请输入帐号"
                                  v-model="form.user"
                                  @keyup.enter.native="submitForm">
                            <i slot="prefix"
                               class="icon-btn icon-user-o"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input show-password
                                  autocomplete="off"
                                  placeholder="请输入密码"
                                  v-model="form.password"
                                  @keyup.enter.native="submitForm">
                            <i slot="prefix"
                               class="icon-btn icon-pw"></i>
                        </el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary"
                           @click="submitForm"
                           :loading="loading" :disabled="loginDisabled">登录</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import REMOTE_CONFIG from '@/../main/config'
import commonService from '@services/commonService'
import profileService from '@services/profileService'
import patientService from '@services/patientService'
import Popup from '@modules/Popup'
import APP_CONFIG from '@/app.config'
import localStorage from '@modules/localStorage'
import Utils from '@modules/Utils';
import { setTimeout } from 'timers';
const { remote, screen } = require('electron');
const currentWindow = remote.getCurrentWindow();
const COOKIE_CLAUSE = APP_CONFIG['NAME'] + '_CLAUSE';
const SERVICE_TYPE = APP_CONFIG['NAME'] + '_SERVICE_TYPE';
const LOGIN_NAME = APP_CONFIG['NAME'] + '_LOGIN_NAME';
// 原生窗口信息
const WIN_CONFIG = REMOTE_CONFIG['BrowserWindow'];
export default {
    name: 'Auth',
    components: {},
    data() {
        return {
            isLoginCache: true,
            loading: false,
            // SERVICE_TYPE 1：本地服务器 2：远程服务器
            // 默认为远程服务
            radio: localStorage.getObject(SERVICE_TYPE) == 1 ? localStorage.getObject(SERVICE_TYPE) : 2,
            isRemote: false,
            dialogFormVisible: false,
            loginDisabled: false,
            exportFileStatus: true,
            sevriceForm: {},
            form: {
                user: '',
                password: ''
            },
            formRules: {
                user: [
                    { required: true, message: '请输入帐号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码' }
                    // { min: 6, message: '密码不少于6位', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        if (this.radio == 2) this.isRemote = true
        Popup.hideLoading()
        this.isLoginCache = localStorage.getObject(COOKIE_CLAUSE) === true ? localStorage.getObject(COOKIE_CLAUSE) : false
        if (localStorage.get(LOGIN_NAME)){
            this.form.user = localStorage.get(LOGIN_NAME)
        }
    },
    methods: {
        handleForgetPw() {
            if (!this.form.user) {
                Popup.showToast.Warning('请先输入要重置的帐号！')
                return false
            }
            Popup.confirm('是否确定将密码重置为初始密码？').then(flag => {
                if (flag) {
                    profileService.forgetPassword(this.form.user).then(data => {
                        data || (data = {})
                        if (data['code'] != profileService.STATUS_SUCCESS) {
                            return profileService.Warning(data['code'], data['msg'])
                        }
                        Popup.showToast.Success('密码已重置！')
                    })
                }
            })
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (!valid) return
                if (this.loading) return
                this.loading = true
                let _data = {
                    username: this.form.user.trim(),
                    password: this.form.password
                }
                commonService.Login(_data).then(data => {
                    data || (data = {})
                    if (data['code'] != commonService.STATUS_SUCCESS) {
                        commonService.Warning(data['code'], data['msg'])
                        return data
                    }
                    currentWindow.setResizable(WIN_CONFIG['useContentSize'])
                    currentWindow.setMinimumSize(WIN_CONFIG['minWidth'], WIN_CONFIG['minHeight'])
                    currentWindow.setSize(WIN_CONFIG['width'], WIN_CONFIG['height'])
                    currentWindow.center()
                    localStorage.set(COOKIE_CLAUSE, true);
                    localStorage.set(LOGIN_NAME, _data.username)
                    Popup.showToast.Success('登录成功！')
                    this.$router.push('/mainWindow')
                    // 同步数据到本地服务
                    /* if (this.radio == 2) {
                        commonService.LocalLogin(_data)
                    } */
                }, error => {
                     this.radio == 1 && Popup.showToast.Error('本地服务器访问不成功，请检查')
                     this.radio == 2 && commonService.NetWorkFail()
                }).catch(function (reason) {
                    Popup.showToast.Error('连接失败，请检查网络设置')
                }).finally(() => {
                    this.loading = false
                })
            });
        },
        /**
         * 最小化window窗口
         */
        Minimize(){
            currentWindow.minimize();
        },
        /**
         * 退出软件
         */
        Close(){
            currentWindow.close();
        },
        configService() {
            this.dialogFormVisible = true
        },
        // 切换服务器
        // SERVICE_TYPE 1：本地服务器 2：远程服务器
        sevriceSubmitForm() {
            localStorage.set(SERVICE_TYPE, this.radio);
            this.dialogFormVisible = false
            this.loginDisabled = true
            Popup.showToast.Success('切换服务器成功，即将重启！', {showClose: true}).then(data => {
                location.reload()
            })
        },
        // 下载协议
        updataAgreement() {
            this.isLoginCache = !this.isLoginCache
            if (this.exportFileStatus) {
                this.exportFileStatus = false
                Popup.showToast.Success('正在全力下载，请耐心等候！', {duration: 3000})
                patientService.downloadUsageProtocal().then(data => {
                    data || (data = {})
                    if (data['code'] != patientService.STATUS_SUCCESS) {
                        patientService.Warning(data['code'], data['msg'])
                        return data
                    }
                    window.location = data.object && data.object.downloadUrl
                }, patientService.NetWorkFail).finally(() => {
                    setTimeout(() => {
                        Popup.hideToast()
                        this.exportFileStatus = true
                    }, 200)
                })
            }
        }
    }
};
</script>

<style scoped>
.auth {position: relative;height: 100%;}
.auth .auth-bg{position: fixed;top: 0;right: 0;bottom: 0;left: 0;background: #4d6aa4;}
.auth .inside .el-input input{height: 40px;line-height: 40px;border: 0;border-radius: 1px;font-size: 12px;background-color: #e9ecf0;}
.auth .inside .el-input input::placeholder{color: #babcbf}
.auth .content .el-input__prefix{left: 11px;top:2px;}
.auth .inside .el-input .el-input__prefix{left: 11px; top: 2px;}
.auth .inside .el-input .el-input__suffix-inner{margin-right: 10px;display: inherit}
.auth .content {padding: 20px 180px 10px 180px;position: relative;}
.auth .content .set-wrapper{margin-top: 15px;font-size: 12px;}
.auth .content .el-form-item__error{padding-top:1px}
.auth .content .settings a{cursor: pointer;font-size: 12px;color: #d7d7d7;height: 12px;line-height: 12px;display: inline-block}
.auth .content .decorate{position: absolute;right: 0;top:0;color: #fff;width: 272px;height: 170px;text-align: center;}
.auth .content .decorate .text{font-size: 18px;font-weight: bold;margin-bottom: 15px;}
.auth .content .decorate .desc{font-size: 14px;}
.auth .content .decorate .icon-btn{position: absolute;right: 5px;top: 5px;cursor: pointer;}
.auth .content .decorate .icon-btn.icon-hide-white{right: 25px;}
.auth .content .title{font-size: 18px;color: #fff;margin-bottom: 18px; margin-top: 8px; text-align: center;}
.auth .content .window-bar{position: absolute;left: 0;right: 50px;top: 0;height: 40px;}
.auth .content .el-form-item{margin-bottom: 15px;}
.auth .content .el-button {padding: 0;width: 100%;border-radius: 2px;height: 40px;line-height: 40px;font-size: 14px;background-color: #fff;color: #333; border-color: #fff; }
.auth .service {cursor: pointer;position: absolute;bottom: 5px;left: 5px;font-size: 14px;display: flex;flex-direction: row;line-height: 30px;}
.auth .el-dialog {margin: 40px auto 0 auto!important;}
.auth .el-dialog .el-dialog__body {padding: 20px;}
.auth .el-dialog .btn-list {margin-top: 15px;}
</style>
