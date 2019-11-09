<template>
    <div class="home">
        <div class="noPrn">
            <site-head showTitle="肺功能预约补录系统"></site-head>
        </div>
        <div v-show="!isPrint">
            <Menus slot="menus"></Menus>
            <div class="content">
                <el-form :model="ruleForm" label-position="right" :rules="rules" ref="ruleForm" label-width="100px">
                    <el-row>
                        <el-col :span="7">
                            <div class="title">填写基本信息</div>
                            <el-form-item label="ID" prop="hisId">
                                <el-input v-model="hisId" @blur="hisIdChange"></el-input>
                            </el-form-item>
                            <el-form-item label="住院号">
                                <el-input v-model="ruleForm.clinicNum"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="性别" prop="gender">
                                <el-radio-group v-model="gender">
                                    <el-radio label="男">男</el-radio>
                                    <el-radio label="女">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="出生年月" prop="birthday">
                                <el-date-picker
                                    v-model="ruleForm.birthday"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    @change="timeChange"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="年龄">
                                <el-col :span="12">
                                    <el-input v-model="age"></el-input>
                                </el-col>
                                <el-col :span="12">岁</el-col>
                            </el-form-item>
                            <el-form-item label="体重" prop="weight">
                                <el-col :span="12">
                                    <el-input v-model="ruleForm.weight" @blur="setBMI"></el-input>
                                </el-col>
                                <el-col :span="12">kg</el-col>
                            </el-form-item>
                            <el-form-item label="身高" prop="height">
                                <el-col :span="12">
                                    <el-input v-model="ruleForm.height" @blur="setBMI"></el-input>
                                </el-col>
                                <el-col :span="12">cm</el-col>
                            </el-form-item>
                            <el-form-item label="BMI">
                                <el-col :span="12">
                                    <el-input v-model="BMI"></el-input>
                                </el-col>
                            </el-form-item>
                            <div class="foot-btn">
                                <el-button type="danger" @click="resetForm('ruleForm')">清空</el-button>
                                <el-button type="primary" @click="showPrint()">打印</el-button>
                                <el-button type="primary" @click="reservationSaveFun('ruleForm')">提交</el-button>
                            </div>
                        </el-col>
                        <el-col :span="7">
                            <div class="title">填写选填信息</div>
                            <el-form-item label="籍贯">
                                <el-input v-model="ruleForm.address"></el-input>
                            </el-form-item>
                            <el-form-item label="电话">
                                <el-input v-model="ruleForm.mobile"></el-input>
                            </el-form-item>
                            <el-form-item label="职业">
                                <el-input v-model="ruleForm.job"></el-input>
                            </el-form-item>
                            <el-form-item label="既往史">
                                <el-input v-model="ruleForm.medicalHistory"></el-input>
                            </el-form-item>
                            <el-form-item label="吸烟史">
                                <el-col :span="12">
                                    <el-input v-model="ruleForm.smokingHistory"></el-input>
                                </el-col>
                                <el-col :span="12">年</el-col>
                            </el-form-item>
                            <el-form-item label="吸烟量">
                                <el-col :span="12">
                                    <el-input v-model="ruleForm.smokingVolume"></el-input>
                                </el-col>
                                <el-col :span="12">支/天</el-col>
                            </el-form-item>
                            <el-form-item label="已戒烟">
                                <el-col :span="12">
                                    <el-input v-model="ruleForm.quitSmoking"></el-input>
                                </el-col>
                                <el-col :span="12">年</el-col>
                            </el-form-item>
                            <el-form-item label="备注">
                                <el-input type="textarea" v-model="ruleForm.remarks"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <div class="title">选择时间地点项目</div>
                            <el-col :span="18">
                                <el-form-item label="检测地点">
                                    <el-input v-model="checkAddress"></el-input>
                                </el-form-item>
                                <el-form-item label="检测项目">
                                    <el-select v-model="typeSelect" placeholder="请选择检测项目" @change="getCalendarDate">
                                        <el-option label="常规肺功能" value="0"></el-option>
                                        <el-option label="激发试验" value="1"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item>
                                    <calendar ref="calendarRef" @calendarDate="calendarDate" @calendarMonth="calendarMonth" :calIndex="calIndex"></calendar>
                                </el-form-item>
                            </el-col>
                            <!-- <el-col :span="18" >
                                <el-form-item label="检测项目">
                                    <div v-if="isReservation">
                                        <div class="type-item" v-for="(item, index) in reservationApplys" :key="index">
                                            <b>{{item.checkProject == 0 ? '常规肺功能' : '激发实验'}}</b>
                                            <p>{{item.applyDate}}</p>
                                            <i @click="delReservationFun" class="icon-btn icon-close-white"></i>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="type-item">
                                            <b>检测项目</b>
                                            <p>0000-00-00 00:00:00</p>
                                        </div>
                                    </div>
                                    <el-button v-else @click="reservationInfoFun" class="type-btn" type="primary">+选择时间段</el-button>
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="24">
                                <el-form-item label="预约信息" class="re-scroll" v-if="List.length > 0">
                                    <div class="box">
                                        <div class="re-info" v-for="(item, index) in List" :key="index"><b>{{item.checkProject == 0 ? '常规肺功能' : '激发实验'}}</b> {{item.applyDate}} <span @click="readPrint(item.id)">查看</span></div>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
                </el-form>
                <el-dialog :visible.sync="dialogFormVisible.isVisble"
                    width="630px"
                    title="预约时间">
                    <el-row>
                        <span class="label-item">预约时间</span>
                        <el-col :span="10">
                            <el-date-picker
                                v-model="date"
                                type="date"
                                value-format="yyyy-MM-dd"
                                @change="reservationInfoFun"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-col>
                    </el-row>
                    <div class="time-box">
                        <el-row>
                            <el-col :span="12" v-for="(item, index) in reservationArray" :key="index">
                                <span v-text="index == '0' ? '上午' : '下午'"></span>
                                <table>
                                    <tr v-for='(value, index) in item' :key="index">
                                        <th :class="{blue:i===value.index}" @click="timeSlotFun(value)">{{value.timeSlot}}</th>
                                        <td v-for='(tds, index) in value.list' :key="index">{{tds.name}}</td>
                                    </tr>
                                </table>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="btn-list">
                        <el-button @click="dialogFormVisible.isVisble = false">取 消</el-button>
                        <el-button type="primary" @click="dialogFun">确定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
        <printing ref="printRef" v-show="isPrint" :printID="printID" @close="closePrint"></printing>
    </div>
</template>
<script>
import commonService from '@services/commonService'
import patientService from '@services/patientService'
import Popup from '@modules/Popup'
import Utils from '@modules/Utils';
import APP_CONFIG from '@/app.config'
import REMOTE_CONFIG from '@/../main/config'
import localStorage from '@modules/localStorage'
import Printing from '@/pages/Printing/Printing'
import Menus from '@/components/Menu/Menus.vue'
import calendar from './components/calendar'
const HOSPITAL = APP_CONFIG['NAME'] + '_HOSPITAL_LOCAL';
const { remote, ipcRenderer } = require('electron')
var spawn = require('child_process').spawn;
const os = require('os')
// 原生窗口信息
const currentWindow = remote.getCurrentWindow();
const WIN_CONFIG = REMOTE_CONFIG['BrowserWindow'];
var keycode = '';
var lastTime = null;
var nextTime = null;
var lastCode = null;
var nextCode = null;
export default {
    name: 'Home',
    components: {Printing, Menus, calendar},
    data() {
        return {
            loading: false,
            dialogFormVisible: {
                isVisble: false
            },
            hisId: '',
            gender: '', // 性别
            ruleForm: {
                hisId: '',
                clinicNum: '',
                name: '',
                gender: '', // 0-男 1-女
                birthday: '',
                weight: '',
                height: '',
                mobile: '',
                address: '',
                job: '',
                medicalHistory: '',
                smokingVolume: '',
                quitSmoking: '',
                remarks: ''
            },
            rules: {
                hisId: [
                    { required: true, message: '请输入ID', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '请选择性别', trigger: 'change' }
                ],
                birthday: [
                    { required: true, message: '请选择日期', trigger: 'change' }
                ],
                weight: [
                    { required: true, message: '请输入体重', trigger: 'blur' }
                ],
                height: [
                    { required: true, message: '请输入身高', trigger: 'blur' }
                ]
            },
            List: {}, // 已预约信息
            BMI: '', // bmi
            age: '', // 年龄
            checkAddress: '', // 检测地址
            typeSelect: '', // 检测项目
            date: '', // 检测时间
            array: [], // 预约时间段
            reservationArray: [], // 预约时间段重组数组
            i: '', // 时间段选择变色
            reservationApplys: [], // 预约提交数据
            reservationDate: '', // 预约的时间段
            printID: 0, // 打印页面上传数据的id
            isReservation: 0, // 新增预约按钮隐藏与显示
            isPrint: false, // 报告页还是打印页
            calIndex: '', // 点击日历变色
            calDate: '', // 上传给日历的天数
            isUpdate: 0 // 0 数据未上传，1 数据已上传
        }
    },
    mounted() {
        // 扫描枪
        let _this = this;
        document.onkeydown = function(e){
            let code = ''
            // 兼容性处理
            if (window.event) {
                nextCode = e.keyCode
            } else if (e.which) {
                nextCode = e.which
            }
            // 获取当前时间
            nextTime = new Date().getTime();
            if (e.keyCode == 13) {
                if (Utils.size(_this.hisId) > 0) {
                } else if (Utils.size(keycode) > 0) {
                    _this.hisId = keycode
                    code = ''
                }
                _this.getHisInfoFun(_this.hisId)
            }
            if (nextCode == 13 && keycode != '' && nextTime - lastTime <= 100) { // 回车字符
                code = keycode;
                keycode = '';
                lastCode = null;
                lastTime = null;
            } else { // 此处可以增加限制nextCode的种类例如数字
                if (lastCode == null && lastTime == null) { // 初始字母
                    keycode = String.fromCharCode(nextCode);
                } else if (lastCode != null && lastTime != null && nextTime - lastTime <= 100){
                    keycode += String.fromCharCode(nextCode);
                } else { // 手动输入
                    keycode = '';
                    lastCode = null;
                    lastTime = null;
                }
                lastCode = nextCode;
                lastTime = nextTime;
            }
        }
    },
    created() {
        this.checkAddress = localStorage.get(HOSPITAL) ? localStorage.get(HOSPITAL) : ''
    },
    methods: {
        // 获取患者数据
        getHisInfoFun(data) {
            if (Utils.size(this.hisId) < 3) {
                return false
            } else {
                let _data = {
                    hisId: data
                }
                Popup.showToast.Success('扫描成功，正在获取数据')
                patientService.getHisInfo(_data).then(data => {
                    data || (data = {})
                    if (data['code'] != commonService.STATUS_SUCCESS) {
                        commonService.Warning(data['code'], data['msg'])
                        return data
                    }
                    this.ruleForm = data.object || {}
                    this.gender = this.ruleForm.gender == '0' ? '男' : '女'
                    this.setBMI()
                    this.timeChange()
                    this.hisId = this.ruleForm.hisId
                    this.$refs['ruleForm'].resetFields()
                    this.getReservationList()
                }, error => {
                    Popup.hideLoading()
                    patientService.NetWorkFail()
                })
            }
        },
        hisIdChange() {
            this.ruleForm.hisId = this.hisId
        },
        // 获取已预约信息
        getReservationList() {
            if (!this.ruleForm.id) {
                return false
            }
            let _data = {
                reservationId: this.ruleForm.id
            }
            patientService.getReservationList(_data).then(data => {
                data || (data = {})
                if (data['code'] != commonService.STATUS_SUCCESS) {
                    commonService.Warning(data['code'], data['msg'])
                    return data
                }
                this.List = data.object.list
            }, error => {
                Popup.hideLoading()
                patientService.NetWorkFail()
            })
        },
        // 预约时间弹窗确定选择
        dialogFun() {
            let isFull = 0
            let time = this.date + ' ' + this.reservationDate;
            if (Utils.size(this.array) > 0) {
                if (this.i !== '') {
                    let list = this.array[this.i].list
                    for (let i = 0; i < list.length; i++) {
                        if (Utils.size(list[i]) > 0) {
                            isFull = isFull + 1
                        }
                    }
                }
            }
            if (!Utils.size(this.reservationDate)) {
                Popup.showToast.Warning('请选择预约时间段')
                return
            }
            if (isFull == 3) {
                Popup.showToast.Warning('此预约已满，请选择其他时间段')
                return
            }
            // this.reservationApplys.push({'checkProject': this.typeSelect, 'applyDate': time})
            this.reservationApplys = [{'checkProject': this.typeSelect, 'applyDate': time}]
            this.dialogFormVisible.isVisble = false
            this.isReservation = 1
        },
         // 查询预约时间段
        reservationInfoFun() {
            if (!Utils.size(this.typeSelect)) {
                Popup.showToast.Warning('请选择检测项目')
                return
            }
            if (!Utils.size(this.date)) {
                Popup.showToast.Warning('请选择预约日期')
                return
            }
            this.dialogFormVisible.isVisble = true
            let _data = {
                applyDate: this.date,
                checkProject: this.typeSelect || ''
            }
            patientService.reservationInfo(_data).then(data => {
                data || (data = {})
                if (data['code'] != commonService.STATUS_SUCCESS) {
                    commonService.Warning(data['code'], data['msg'])
                    return data
                }
                this.array = data.object
                this.timeFun()
            }, error => {
                Popup.hideLoading()
                patientService.NetWorkFail()
            })
        },
        // 删除检测项目
        delReservationFun() {
            this.isReservation = 0
            this.reservationApplys = []
            this.reservationDate = ''
            this.i = ''
            this.reservationArray = []
        },
        // 点击提交数据
        reservationSaveFun(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
            if (Utils.size(this.reservationApplys) == 0) {
                Popup.showToast.Warning('请选择预约项目和时间')
                return
            }
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            this.ruleForm.gender = this.gender == '男' ? '0' : '1'
            let _data = this.ruleForm
            _data.gender = this.gender == '男' ? '0' : '1'
            _data.reservationApplys = this.reservationApplys
            patientService.reservationSave(_data).then(data => {
                data || (data = {})
                if (data['code'] != commonService.STATUS_SUCCESS) {
                    commonService.Warning(data['code'], data['msg'])
                    return data
                }
                Popup.showToast.Success('提交成功！')
                this.printID = data.object.applyId
                this.isPrint = true
                this.$refs.printRef.reservationApplyFun(this.printID);
                this.isUpdate = 1
                this.getReservationList()
                localStorage.set(HOSPITAL, this.checkAddress)
            }, error => {
                Popup.hideLoading()
                patientService.NetWorkFail()
            })
        },
        // 清空数据
        resetForm() {
            if (this.isUpdate === 0) {
                Popup.confirm(`预约数据未提交，是否确定清除数据？`).then(flag => {
                    if (flag) {
                        this.clearInfo()
                    }
                })
            } else {
                this.clearInfo()
            }
        },
        clearInfo() {
            this.$refs['ruleForm'].resetFields();
            this.ruleForm = {
                hisId: '',
                clinicNum: '',
                name: '',
                gender: '',
                birthday: '',
                weight: '',
                height: '',
                mobile: '',
                address: '',
                job: '',
                medicalHistory: '',
                smokingVolume: '',
                quitSmoking: '',
                remarks: ''
            }
            this.List = {}
            this.isReservation = 0
            this.reservationApplys = []
            this.typeSelect = ''
            this.date = ''
            this.reservationArray = []
            this.age = ''
            this.BMI = ''
            this.i = ''
            this.hisId = ''
            this.gender = ''
            this.calIndex = ''
            this.calDate = ''
            this.$refs.calendarRef.clearI()
        },
        // 关闭打印页面
        closePrint() {
            this.isPrint = false
        },
        // 打开打印页面
        showPrint() {
            this.$refs.printRef.updateNowTime()
            this.isPrint = true
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        },
        // 预约信息查看打印页面
        readPrint(val) {
            this.showPrint()
            this.$refs.printRef.reservationApplyFun(val);
        },
        // 获取自组件日历点击的返回天数
        calendarDate(val) {
            this.date = val
            this.reservationInfoFun()
        },
        // 获取自组件日历点击上月下月返回天数
        calendarMonth(val) {
            this.calDate = val
            this.getCalendarDate(val)
        },
        // 获取日历列表
        getCalendarDate(val) {
            this.delReservationFun()
            if (!Utils.size(this.typeSelect)) {
                return
            }
            this.$refs.calendarRef.getDateNumberList(this.calDate, this.typeSelect)
        },
        // 计算 BMI
        setBMI() {
            if (this.ruleForm.height && this.ruleForm.weight) {
                this.BMI = parseInt(this.ruleForm.weight / (this.ruleForm.height * this.ruleForm.height / 10000))
            }
        },
        // 计算年龄
        timeChange() {
            if (this.ruleForm.birthday) {
                let birthday = Utils.formatStringTime(this.ruleForm.birthday) / 1000
                let time = parseInt(Utils.getTime() / 1000) - birthday
                let ageTime = 24 * 60 * 60 * 365
                this.age = Math.floor(time / ageTime)
            } else {
                this.age = 0
            }
        },
        // 重新计算时间段数组
        timeFun () {
            for (var i = 0; i < this.array.length; i++) {
                this.array[i].index = i;
                if (i == 0) this.array[i].time = '08:01:00';
                if (i == 1) this.array[i].time = '08:31:00';
                if (i == 2) this.array[i].time = '09:01:00';
                if (i == 3) this.array[i].time = '09:31:00';
                if (i == 4) this.array[i].time = '10:01:00';
                if (i == 5) this.array[i].time = '10:31:00';
                if (i == 6) this.array[i].time = '11:01:00';
                if (i == 7) this.array[i].time = '13:01:00';
                if (i == 8) this.array[i].time = '13:31:00';
                if (i == 9) this.array[i].time = '14:01:00';
                if (i == 10) this.array[i].time = '14:31:00';
                if (i == 11) this.array[i].time = '15:01:00';
                if (i == 12) this.array[i].time = '15:31:00';
                if (i == 13) this.array[i].time = '16:01:00';
                if (Utils.size(this.array[i].list) == 0) { this.array[i].list.push(''); this.array[i].list.push(''); this.array[i].list.push(''); }
                if (Utils.size(this.array[i].list) == 1) { this.array[i].list.push(''); this.array[i].list.push(''); }
                if (Utils.size(this.array[i].list) == 2) { this.array[i].list.push(''); }
            }
            var arr1 = this.array.filter(function(item, index) {
                if (index < 7) {
                    return item
                }
            })
            var arr2 = this.array.filter(function(item, index) {
                if (index >= 7) {
                    return item
                }
            })
            this.reservationArray = [arr1, arr2];
        },
        // 选择时间段同时变色
        timeSlotFun(val) {
            this.i = val.index
            this.reservationDate = val.time
        }
    }
};
</script>
<style scoped lang="scss">
.home{
    .content {
        position: relative;
        padding: 16px 0;
        padding-left: 65px;
        .foot{
            position: fixed;left: 65px;right: 0;bottom: 20px;text-align: center;font-size: 14px;color: #666666;}
    }
    .title {
        margin-bottom: 20px;
        padding-left: 16px;
    }
    .el-col{
        padding-right: 32px;
        .el-col{
            padding-right: 10px;
        }
    }
    .el-date-editor.el-input{
        width: 100%;
    }
    .el-select{
        width: 100%;
    }
    .el-dialog{
        .label-item{
            float: left;
            width: 100px;
            line-height: 40px;
        }
        .el-row{
            margin-bottom: 10px;
        }
    }
    .type-item{
        position: relative;
        background: #3394f5;
        color: #fff;
        padding: 16px 16px 16px;
        border-radius: 5px;
        line-height: 1;
        margin-bottom: 5px;
        cursor: default;
        b{
            font-size: 16px;
        }
        p{
            color: #fff;
            margin-top: 5px;
        }
        .icon-btn{
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
        }
    }
    .type-btn{
        width: 100%;
    }
    .btn-list{
        text-align: right;
        margin-top: 10px;padding:13px 0px 0 0;
        .el-button{
            background-color: #f8fbff;
            color: #323232;
            border-radius: 3px
        }
        .el-button--primary{
            color: #fff;
            background-color: #3498fa;
        }
    }
    .time-box{
        .el-col{
            padding-right: 0;
            &:last-child{
                margin-left: -1px;
            }
        }
        table{
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            th{
                font-weight: 400;
                
                width: 90px;
                cursor: pointer;
            }
            th, td{
                padding: 6px 0;
                border: 1px solid #ccc;
            }
            td{
                text-align: center;
                width: 65px;
            }
        }
    }
    .foot-btn{
        padding: 0 16px;
        text-align: right;
    }
} 
.home-head{
    position: relative;
    padding-left: 62px;
    margin-top: 32px;
    .icon-doctor{
        position: absolute;
        left: 0;
        top: 0;
        width: 49px;
        height: 49px;
        display: block;
        background: url(../../assets/images/doctor.png) no-repeat 0 0;
    }
    span{
        font-size: 18px;
    }
    p{
        font-size: 18px;
        padding-top: 2px;
    }
}
.blue {
    background: #3394f5;
    color: #fff;
}
.re-info{
    line-height: 1;
    margin-top: 13px;
}
.re-info b{
    font-weight: 400;
    display: inline-block;
    width: 80px;
}
.re-info span{padding-left: 5px;}
.re-scroll{
    height: 170px; 
    overflow: auto;
    line-height: 1;
    margin-bottom: 0;
}
</style>