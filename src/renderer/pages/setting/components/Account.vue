<template>
    <div class="Account">
        <div class="title">帐号管理</div>
        <div class="lable-item">
            <span class="lable">帐号</span><span>{{Profile.username || '--'}}<!--  ( {{isRemote}} ) --></span>
        </div>
        <div class="lable-item">
            <span class="lable">密码</span><span>**********</span>
        </div>
        <!-- <div class="lable-item">
            <span class="lable">医院</span><span>{{Profile.hospitalName || '--'}}</span>
        </div>
        <div class="lable-item">
            <span class="lable">科室</span><span>{{Profile.departmentName || '--'}}</span>
        </div> -->
        <div class="clearfix">
            <div class="account-btn"
                 @click="outLogin">
                <i class="icon icon-logout"></i>
                注销
            </div>
            <!-- <div class="account-btn"
                 @click="dialogFormVisible = true">
                <i class="icon icon-key"></i>
                修改密码
            </div> -->
        </div>
        <el-dialog :visible.sync="dialogFormVisible"
                   width="424px"
                   title="修改密码">
            <el-form ref="form"
                     :model="form"
                     :rules="formRules"
                     size="small"
                     :validate-on-rule-change="false">
                <el-row class="content">
                    <div class="sub-title">原密码</div>
                    <el-col class="from-input">
                        <el-form-item prop="oldPassword">
                            <el-input v-model="form.oldPassword"
                                      show-password></el-input>
                        </el-form-item>
                    </el-col>
                    <div class="sub-title">新密码</div>
                    <el-col class="from-input">
                        <el-form-item prop="newPassword">
                            <el-input v-model="form.newPassword"
                                      show-password></el-input>
                        </el-form-item>
                    </el-col>
                    <div class="sub-title">确认新密码</div>
                    <el-col class="from-input">
                        <el-form-item prop="confirmPassword">
                            <el-input v-model="form.confirmPassword"
                                      show-password
                                      maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="btn-list text-right">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary"
                               @click="submitForm()">确定</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import profileService from '@services/profileService'
import commonService from '@services/commonService'
import Popup from '@modules/Popup'
import Utils from '@modules/Utils';
import APP_CONFIG from '@/app.config'
import localStorage from '@modules/localStorage'
const SERVICE_TYPE = APP_CONFIG['NAME'] + '_SERVICE_TYPE';
export default {
    name: 'Account',
    components: {},
    data() {
       var validatePass = (rule, value, callback) => {
            if (value !== this.form.newPassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        }
        return {
            form: {},
            Profile: {},
            dialogFormVisible: false,
            outLoginStatus: true,
            formRules: {
                oldPassword: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请输入确认新密码', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ]
            },
            isRemote: localStorage.getObject(SERVICE_TYPE) === 1 ? '本地服务' : '远程服务'
        }
    },
    created() {
        this.Profile = commonService.Profile()
    },
    methods: {
         outLogin() {
             if (this.outLoginStatus) {
                commonService.Logout().then(data => {
                    commonService.Authorize('注销成功！请重新登录！');
                })
                this.outLoginStatus = false
             }
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (!valid) return
                profileService.modifyPassword(this.form.oldPassword, this.form.newPassword).then(data => {
                    data || (data = {})
                    if (data['code'] != commonService.STATUS_SUCCESS) {
                        commonService.Warning(data['code'], data['msg'])
                        return data
                    }
                    commonService.Logout().then(data => {
                        commonService.Authorize('密码修改成功，请重新登录！');
                    })
                }, commonService.NetWorkFail)
            });
        }
    }
};
</script>
<style>
.Account {padding: 15px;font-size: 14px;color: #323232;width: 544px;background-color: #fff;overflow-y: auto;height: 100%;}
.Account .title{margin-bottom: 17px;}
.Account .lable-item{margin-bottom: 15px;height: 32px;line-height: 32px;}
.Account .lable-item .lable{min-width: 60px;display: inline-block;}
.Account .account-btn {float: left;margin:0 30px 0 10px;line-height: 30px;cursor: pointer;margin-top: 10px;}
.Account .account-btn .icon{float: left;margin-right: 10px}
.el-dialog .content{padding-left: 0;}
</style>