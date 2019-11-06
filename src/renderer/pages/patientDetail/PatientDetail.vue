<template>
    <div class="patientDetail"
         ref="patientDetail">
        <el-dialog @open="openDialg"
                   @close="closeDialg"
                   :visible.sync="dialogFormVisible.isVisble"
                   width="75%"
                   class="decorate"
                   title="患者资料">
            <div class="title">基础资料</div>
            <el-form label-width="100px"
                     ref="form"
                     :model="form"
                     size="small"
                     :rules="formRules"
                     :validate-on-rule-change="false">
                <el-row class="content">
                    <el-col :span="12"
                            class="from-wrapper">
                        <el-col :span="20"
                                class="from-input">
                            <el-form-item label="ID">
                                <el-input v-model="form.sysId"
                                          :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20"
                                class="from-input">
                            <el-form-item prop="clinicNum"
                                          label="HIS ID">
                                <el-input v-model="form.clinicNum"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="20"
                                class="from-input">
                            <el-form-item prop="name"
                                          label="姓名">
                                <el-input v-model="form.name"
                                          maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        
                        <el-col :span="20"
                                class="from-input">
                            <el-form-item prop="gender"
                                          label="性别">
                                <el-radio-group v-model="form.gender">
                                    <el-radio label="男"></el-radio>
                                    <el-radio label="女"></el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20"
                                class="from-input">
                            <el-form-item prop="birthday"
                                          label="出生日期">
                                <el-date-picker v-model="form.birthday"
                                                type="date"
                                                placeholder="选择日期"
                                                format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd"
                                                @change="timeChange"
                                                :picker-options="pickerOptions">
                                    <span>YYY-MM-DD</span>
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20"
                                class="from-input unit">
                            <el-form-item prop="height"
                                          label="身高">
                                <el-input v-model.number="form.height"
                                          @blur="setBMI"></el-input>
                                <span>cm</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20"
                                class="from-input unit">
                            <el-form-item prop="weight"
                                          label="体重">
                                <el-input v-model.number="form.weight"
                                          @blur="setBMI"></el-input>
                                <span>kg</span>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="12"
                            class="from-wrapper">
                        <el-col :span="20"
                                class="from-input">
                            <el-form-item label="年龄">
                                <el-input v-model="age"
                                          class="input"
                                          disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20"
                                class="from-input">
                            <el-form-item label="BMI">
                                <el-input v-model="BMI"
                                          class="input"
                                          disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20"
                                class="from-input">
                            <el-form-item prop="mobile"
                                          label="手机号码">
                                <el-input v-model.number="form.mobile"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="select-list">
                            <el-col :span="24"
                                    class="from-input">
                                <el-form-item label="种族"
                                              prop="nationId">
                                    <el-select v-model="form.nationId"
                                               placeholder="请选择">
                                        <el-option v-for="item in nations"
                                                   :key="item.nationId"
                                                   :label="item.nationName"
                                                   :value="item.nationId"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24"
                                    class="from-input">
                                <el-form-item label="当前设置"
                                              prop="typeCode">
                                    <el-select v-model="form.typeCode"
                                               placeholder="请选择">
                                        <el-option v-for="item in types"
                                                   :key="item.code"
                                                   :label="item.name"
                                                   :value="item.code"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24"
                                    class="from-input">
                                <el-form-item label="预计值模式"
                                              prop="patientCountryId">
                                    <el-select v-model="form.patientCountryId"
                                               placeholder="请选择">
                                        <el-option v-for="item in countrys"
                                                   :key="item.pcId"
                                                   :label="item.pcModel"
                                                   :value="item.pcId"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-col>
                </el-row>
                <div class="title">操作人员资料</div>
                <el-row class="content">
                    <el-col :span="12"
                            class="from-wrapper">
                        <el-col :span="24"
                                class="from-input">
                            <el-form-item label="操作者">
                                <el-select v-model="form.operatorId"
                                           placeholder="请选择"
                                           clearable>
                                    <el-option v-for="item in operators"
                                               :key="item.operatorId"
                                               :label="item.operatorName"
                                               :value="item.operatorId"></el-option>
                                </el-select>
                            </el-form-item>
                            <div class="add-btn"
                                 @click="showModal(3)">+</div>
                        </el-col>
                        <el-col :span="24"
                                class="from-input">
                            <el-form-item label="医生">
                                <el-select v-model="form.doctorId"
                                           placeholder="请选择"
                                           clearable>
                                    <el-option v-for="item in doctors"
                                               :key="item.doctorId"
                                               :label="item.doctorName"
                                               :value="item.doctorId"></el-option>
                                </el-select>
                            </el-form-item>
                            <div class="add-btn"
                                 @click="showModal(4)">+</div>
                        </el-col>
                        <el-col :span="24"
                                class="from-input">
                            <el-form-item label="负责医生">
                                <el-input v-model="form.responsibleDoctor"
                                          class="input"
                                          disabled
                                          placeholder="登录医生名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content bg-purple-light"></div>
                    </el-col>
                    <el-col :span="12"
                            class="from-wrapper"> </el-col>
                    <el-col :span="12"
                            class="from-wrapper"> </el-col>
                    <el-col :span="12">
                        <div class="grid-content bg-purple-light"></div>
                    </el-col>
                </el-row>
                <div class="btn-list">
                    <el-button @click="dialogFormVisible.isVisble = false">取 消（F3）</el-button>
                    <el-button type="primary"
                               @click="submitForm()">确定（F1）</el-button>
                </div>
                <div slot="footer"
                     class="dialog-footer"></div>
            </el-form>

        </el-dialog>
        <el-dialog class="config-select" :visible.sync="dialogAddFormVisible"
                   width="600px"
                   :title="modalTitle">
            <el-form ref="form"
                     :model="formModal"
                     label-width="100px"
                     size="small"
                     class="clearfix"
                     :validate-on-rule-change="false">
                <div class="clearfix">
                    <el-col :span="11"
                            class="from-input"
                            v-if="isCode">
                        <el-form-item label="编号">
                            <el-input v-model="formModal.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11"
                            class="from-input">
                        <el-form-item :label="modalLable">
                            <el-input v-model="formModal.name"
                                      maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                </div>
                <el-col :span="10"
                        class="from-input radio"
                        v-if="isDefault">
                    <el-form-item label="设为默认">
                        <el-radio-group v-model="formModal.isDefault">
                            <el-radio label="是"
                                      value="1"></el-radio>
                            <el-radio label="否"
                                      value="2"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-form>
            <span slot="footer"
                  class="dialog-footer">
                <div class="btn-list">
                    <el-button type="primary"
                               @click="addSubmitForm()">确 定</el-button>
                    <el-button @click="dialogAddFormVisible = false">取 消</el-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import patientService from '@services/patientService'
import commonService from '@services/commonService'
import configService from '@services/configService'
import Popup from '@modules/Popup'
import Utils from '@modules/Utils'
export default {
    name: 'PatientDetail',
    components: {},
    props: {
        dialogFormVisible: Object
    },
    data() {
        return {
            dialogAddFormVisible: false,
            gender: 1,
            BMI: '',
            age: '',
            form: {},
            Profile: {},
            formModal: {},
            nations: [],
            countrys: [],
            operators: [],
            types: [],
            doctors: [],
            keyDownFn: '',
            modalTitle: '',
            modalLable: '',
            type: '',
            isDefault: false,
            isCode: false,
            typeConfig: {
                3: {
                    title: '新增操作者',
                    lable: '姓名',
                    isDefault: true,
                    isCode: true,
                    url: 'addOperator',
                    update: 'getOperators',
                    delUrl: 'deleteOperator'
                },
                4: {
                    title: '新增医生',
                    lable: '姓名',
                    isDefault: false,
                    isCode: true,
                    url: 'addDoctor',
                    update: 'getDoctors',
                    delUrl: 'deleteDoctor'
                }
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            formRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { type: 'number', message: '手机号必须为数字', trigger: 'change' }
                ],
                clinicNum: [
                    { required: true, message: '请输入HIS ID', trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '请选择性别', trigger: 'change' }
                ],
                nationId: [
                    { required: true, message: '请选择种族', trigger: 'change' }
                ],
                typeCode: [
                    { required: true, message: '请选择当前设置', trigger: 'change' }
                ],
                patientCountryId: [
                    { required: true, message: '请选择预计值模式', trigger: 'change' }
                ],
                height: [
                    { required: true, message: '请输入身高', trigger: 'blur' },
                    { type: 'number', message: '身高必须为数字', trigger: 'change' }
                ],
                weight: [
                    { required: true, message: '请输入体重', trigger: 'blur' },
                    { type: 'number', message: '体重必须为数字', trigger: 'change' }
                ],
                birthday: [
                    { required: true, message: '请选择出生日期', trigger: 'blur' }
                ]
            }
        };
    },
    created: function () {
        this.form = {}
        this.Profile = commonService.Profile()
        this.dialogFormVisible.id && this.getPatient(this.dialogFormVisible.id)
        this.getConfigInfo()
    },
    methods: {
        // 患者详情
        getPatient(id) {
            patientService.getPatient(id).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.form = data.object || {}
                this.form.gender = this.form.gender == 'MALE' ? '男' : '女'
                this.form.weight = parseInt(this.form.weight)
                this.form.height = parseInt(this.form.height)
                this.form.mobile = parseInt(this.form.mobile)
                this.form.responsibleDoctor = this.Profile.name
                this.setBMI()
                this.timeChange()
            }, patientService.NetWorkFail)
        },
        // 下拉列表列表
        getConfigInfo() {
            patientService.getConfigInfo().then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                let _object = data.object || {}
                this.nations = _object.nations || []
                this.countrys = _object.patientCountries || []
                this.operators = _object.operators || []
                this.doctors = _object.doctors || []
                this.types = _object.types || []
                // 新增默认第一项
                 if (!this.dialogFormVisible.id) {
                    let operatorId, patientCountryId
                    this.operators.forEach(item => {
                        if (item.isDefault) {
                            operatorId = item.operatorId
                        }
                    })
                    this.countrys.forEach(item => {
                        if (item.isDefault) {
                            patientCountryId = item.pcId
                        }
                    })
                    this.form = {
                        nationId: Utils.size(this.nations) && this.nations[0]['nationId'] || '',
                        typeCode: Utils.size(this.types) && this.types[0]['code'] || '',
                        doctorId: Utils.size(this.doctors) && this.doctors[0]['doctorId'] || '',
                        responsibleDoctor: this.Profile.name,
                        gender: this.form.gender || '男',
                        operatorId: operatorId,
                        patientCountryId: patientCountryId,
                        clinicNum: this.form.clinicNum,
                        name: this.form.name,
                        mobile: this.form.mobile,
                        birthday: this.form.birthday,
                        height: this.form.height,
                        weight: this.form.weight
                    }
                }
            }, patientService.NetWorkFail)
        },
        // 种族列表
        getNations(page, limit) {
            let _data = {
                pageSize: limit || 10000,
                pageNumber: page || 1
            }
            patientService.getNations(_data).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.nations = data.object || []
            }, patientService.NetWorkFail)
        },
        // 预计值列表
        getCountrys(page, limit) {
            let _data = {
                pageSize: limit || 10000,
                pageNumber: page || 1
            }
            patientService.getCountrys(_data).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.countrys = data.object || []
            }, patientService.NetWorkFail)
        },
        // 操作者列表
        getOperators(page, limit) {
            let _data = {
                pageSize: limit || 10000,
                pageNumber: page || 1
            }
            patientService.getOperators(_data).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.operators = data.object || []
            }, patientService.NetWorkFail)
        },
        // 医生列表
        getDoctors(page, limit) {
            let _data = {
                pageSize: limit || 10000,
                pageNumber: page || 1
            }
            patientService.getDoctors(_data).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.doctors = data.object || []
            }, patientService.NetWorkFail)
        },
        resetForm() {
            this.form = {}
            this.dialogFormVisible.id = ''
        },
        delPatient() {
            Popup.confirm('是否确定删除测试？').then(flag => {
                flag && patientService.delPatient([this.dialogFormVisible.id]).then(data => {
                    data || (data = {})
                    if (data['code'] != patientService.STATUS_SUCCESS) {
                        return patientService.Warning(data['code'], data['msg'])
                    }
                    Popup.showToast.Success('删除成功！')
                    this.$router.push('/mainWindow')
                }, patientService.NetWorkFail)
            })
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (!valid) return
                if (this.age < 3) {
                    Popup.showToast.Error('患者年龄必须大于2岁！')
                    return
                }
                var config = {}
                Object.assign(config, this.form)
                config['gender'] = config['gender'] == '男' ? 'male' : 'female'
                let _config = {
                    name: config['name'],
                    mobile: config['mobile'],
                    clinicNum: config['clinicNum'],
                    gender: config['gender'],
                    birthday: config['birthday'],
                    weight: config['weight'],
                    height: config['height'],
                    nationId: config['nationId'] || 0,
                    type: config['typeCode'] || 0,
                    patientId: config['patientId'] || 0,
                    patientCountryId: config['patientCountryId'] || 0,
                    doctorId: config['doctorId'] || 0,
                    operatorId: config['operatorId'] || 0,
                    responsibleDoctorId: this.Profile.doctorId
                }

                patientService.setPatient(_config).then(data => {
                    data || (data = {})
                    if (data['code'] != patientService.STATUS_SUCCESS) {
                        return patientService.Warning(data['code'], data['msg'])
                    }
                    let toastText = this.dialogFormVisible.id ? '修改成功！' : '创建成功！'
                    Popup.showToast.Success(toastText)
                    this.resetForm()
                    // this.handelDialogVisble()
                    this.dialogFormVisible.isVisble = false
                    this.$emit('submit', data.object && data.object.patientId)
                }, patientService.NetWorkFail)
            })
        },
        handelDialogVisble() {
            this.$emit('change', false)
        },
        openDialg() {
            this.form = {}
            this.dialogFormVisible.id && this.getPatient(this.dialogFormVisible.id)
        },
        closeDialg() {
            this.resetForm()
        },
        setBMI() {
            if (this.form.height && this.form.weight) {
                this.BMI = parseInt(this.form.weight / (this.form.height * this.form.height / 10000))
            }
        },
        timeChange() {
            if (this.form.birthday) {
                let birthday = Utils.formatStringTime(this.form.birthday) / 1000
                let time = parseInt(Utils.getTime() / 1000) - birthday
                let ageTime = 24 * 60 * 60 * 365
                this.age = Math.floor(time / ageTime)
            } else {
                this.age = 0
            }
        },
        showModal(type, scope) {
            this.formModal = {}
            this.type = type
            this.modalTitle = this.typeConfig[type].title
            this.isCode = this.typeConfig[type].isCode
            this.modalLable = this.typeConfig[type].lable
            this.isDefault = this.typeConfig[type].isDefault
            this.dialogAddFormVisible = true
        },
        addSubmitForm() {
            if (!this.dialogAddFormVisible) {
                return false
            }
            if (!this.formModal.name) {
                Popup.showToast.Warning('请输入信息！')
                return false
            }
            configService[this.typeConfig[this.type].url](this.type == 1 ? {
                hospitalId: this.formModal.id,
                hospitalName: this.formModal.name
            } : this.formModal.name, this.formModal.code, this.formModal.isDefault == '是').then(data => {
                data || (data = {})
                if (data['code'] != configService.STATUS_SUCCESS) {
                    return configService.Warning(data['code'], data['msg'])
                }
                Popup.showToast.Success('操作成功！')
                this.dialogAddFormVisible = false
                this.formModal = {}
                this.type = ''
                this.getConfigInfo()
            }, configService.NetWorkFail)
        }
    }
}
</script>
<style>
.patientDetail {background-color: #f8fbff;color: #323232;}
.patientDetail .el-dialog {margin: 50px auto 0 auto!important;}
.patientDetail .el-dialog__body {padding: 0}
.patientDetail .title{padding: 0 20px;font-size: 14px;height: 30px;line-height: 30px;border-bottom: 1px solid #e2e2e2;margin-bottom: 10px}
.patientDetail .content {width: 80%;margin:0 auto;}
.patientDetail .content .select-list{margin-top: 50px}
.patientDetail .content .el-select{width: 65%;float: left;}
.patientDetail .content .input{width: 65%;}
.patientDetail .content .add-select{cursor: pointer;width: 32px;height: 32px;line-height: 32px;text-align: center;background-color: #e2e2e2;font-size: 16px;margin-left: 9px;display: block;font-size: 20px;float: left;margin-top: 2px;}
.patientDetail .btn-list{text-align: right;margin-top: 10px;padding:13px 20px;border-top: 1px solid #e2e2e2}
.patientDetail .btn-list .el-button{background-color: #f8fbff;color: #323232;padding: 8px 26px;border-radius: 2px}
.patientDetail .btn-list .el-button--primary{color: #fff;background-color: #3498fa;}
.from-wrapper{padding: 0 10px;}
.from-wrapper .el-input input{border-radius: 2px;background-color: #fff}
.el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label::before{display: none}
.el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label::after{content: '*';color: red;margin-left: 1px;text-align: right;}
.from-wrapper .from-input.unit .el-input{width: 128px;}
.from-wrapper .from-input.radio{height: 40px;line-height: 40px;}
.from-wrapper .from-input {position: relative;}
.from-wrapper .from-input .add-btn{position: absolute;right: 15%;top: 2px;height: 32px;line-height: 30px;width: 32px;text-align: center;background-color: #e2e2e2;color: #323232;font-size: 24px;cursor: pointer;}
/* .from-wrapper .from-input.radio .el-radio{color: #fff} */
.from-wrapper .title{padding: 0 10px;text-align: right;line-height: 40px;height: 40px;}
/* .from-wrapper .el-radio{color: #fff} */
.patientDetail .el-date-editor.el-input, .el-date-editor.el-input__inner{width: 100%;}
.patientDetail .config-select .el-dialog__body{padding: 30px 20px;}
.patientDetail .config-select .el-dialog{background-color: #fff;}
.patientDetail .config-select .el-dialog__footer{padding: 10px 0 0 0}
.patientDetail .config-select .from-input.radio{margin: 0 auto;float: unset;}
</style>