<template>
    <div class="search-user"
         ref="search-user">
        <el-dialog @open="openDialg"
                   @close="closeDialg"
                   :visible.sync="searchUserDialog.isVisble"
                   width="75%"
                   title="查找患者"
                   class="decorate">
            <el-form label-width="100px"
                     ref="form"
                     :model="form"
                     size="small"
                     :validate-on-rule-change="false">
                <el-row class="content">
                    <el-col :span="12"
                            class="from-wrapper">
                        <el-col :span="20"
                                class="from-input">
                            <el-form-item label="ID">
                                <el-input v-model="form.sysId"></el-input>
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
                    </el-col>
                    <el-col :span="12"
                            class="from-wrapper">
                        <el-col :span="20"
                                class="from-input time-class">
                            <el-form-item prop="birthday"
                                          label="创建时间">
                                <el-date-picker v-model="form.time"
                                                type="daterange"
                                                class="date"
                                                value-format="yyyy-MM-dd"
                                                range-separator="——"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20"
                                class="from-input time-class">
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
                        </el-col>
                        <el-col :span="20"
                                class="from-input time-class">
                            <el-form-item prop="mobile"
                                          label="手机号码">
                                <el-input v-model="form.mobile"
                                          maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
                <div class="search-btn">
                    <el-button type="primary"
                               @click="submitSearchForm()">搜索</el-button>
                </div>
                <div class="title">患者结果列表</div>
                <div class="table">
                    <el-table v-loading="loading"
                              ref="singleTable"
                              :data="List"
                              height="250"
                              border
                              highlight-current-row
                              size="medium"
                              @current-change="handleCurrentChange"
                              @cell-dblclick="handleCurrentDblclick"
                              style="width: 100%">
                        <el-table-column property="sysId"
                                         label="ID"></el-table-column>
                        <el-table-column property="clinicNum"
                                         label="HIS ID"></el-table-column>
                        <el-table-column property="name"
                                         label="姓名"></el-table-column>
                        <el-table-column property="gender"
                                         label="性别"></el-table-column>
                        <el-table-column property="birthday"
                                         label="年龄"
                                         :formatter="timeChange"></el-table-column>
                        <el-table-column property="mobile"
                                         label="手机号码"></el-table-column>                 
                        <el-table-column property="doctorName"
                                         label="医生"></el-table-column>
                    </el-table>
                </div>
                <site-page @change="handlePageChange"
                           :total="total"
                           :page="page"
                           :size="10"></site-page>
                <div class="btn-list">
                    <el-button @click="searchUserDialog.isVisble = false">取 消（F3）</el-button>
                    <el-button type="primary"
                               @click="submitForm()">确定（F1）</el-button>
                </div>
                <div slot="footer"
                     class="dialog-footer"></div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import patientService from '@services/patientService'
import SitePage from '@/components/sitePage/SitePage'
import Popup from '@modules/Popup'
import Utils from '@modules/Utils'
export default {
    name: 'PatientDetail',
    components: { SitePage },
    props: {
        searchUserDialog: Object
    },
    data() {
        return {
            page: 1,
            total: 0,
            List: [],
            loading: true,
            loadingTime: '',
            patientId: '',
            gender: 1,
            BMI: '',
            age: '',
            form: {},
            searchData: {},
            doctors: [],
            keyDownFn: '',
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            }
        };
    },
    created: function () {
        this.updateListData()
        this.getConfigInfo()
        // this.keyDownFn = (params) => {
        //     let key = window.event.keyCode;
        //     if (key == 112) {
        //         this.submitForm()
        //     } else if (key == 114) {
        //         this.searchUserDialog.isVisble = false
        //     }
        // }
        // document.addEventListener('keydown', this.keyDownFn)
    },
    methods: {
         // 患者列表
        updateListData(page, limit, config) {
            let _data = {
                pageSize: limit,
                pageNumber: page
            }
            Object.assign(_data, config)
            patientService.getPatients(_data).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.List = data.object && data.object.patients || []
                this.total = parseInt(data.object && data.object.total)
            }, patientService.NetWorkFail).finally(() => {
                this.loadingTime = setTimeout(() => {
                    this.loading = false
                }, 500)
            })
        },
         // 选中的患者
        handleCurrentChange(val) {
            if (val) {
                this.patientId = val.patientId;
            }
        },
        // 双击选中
        handleCurrentDblclick(val, column, cell, event) {
            this.$emit('submit', val.patientId)
        },
        // 分页
        handlePageChange(val) {
            this.loading = true
            clearTimeout(this.loadingTime)
            this.updateListData(val, null, this.searchData)
            this.patientId = ''
            this.page = val
        },
         // 下拉列表列表
        getConfigInfo() {
            patientService.getConfigInfo().then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.doctors = data.object.doctors || []
            }, patientService.NetWorkFail)
        },
        sexFormatter(row, column) {
            return row.gender == 'MALE' ? '男' : '女'
        },
        timeChange(row, column) {
            let birthday = Utils.formatStringTime(row.birthday) / 1000
            let time = parseInt(Utils.getTime() / 1000) - birthday
            let ageTime = 24 * 60 * 60 * 365
            return Math.floor(time / ageTime) || 0
        },
        resetForm() {
            this.form = {}
        },
        submitSearchForm() {
            let data = {}
            this.form.name && (data['name'] = this.form.name)
            this.form.mobile && (data['mobile'] = this.form.mobile)
            this.form.doctorId && (data['doctorId'] = this.form.doctorId)
            this.form.sysId && (data['sysId'] = this.form.sysId)
            this.form.clinicNum && (data['clinicNum'] = this.form.clinicNum)
            !!Utils.size(this.form.time) && (data['startTime'] = this.form.time[0])
            !!Utils.size(this.form.time) && (data['endTime'] = this.form.time[1])
            this.searchData = data
            this.updateListData(null, null, data)
            this.page = 1
        },
        submitForm() {
            if (this.patientId) {
                this.$emit('submit', this.patientId)
            } else {
                Popup.showToast.Warning('请选择患者！')
            }
        },
        handelDialogVisble() {
            this.$emit('change', false)
        },
        openDialg() {
            this.form = {}
        },
        closeDialg() {
            this.resetForm()
        }
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.keyDownFn)
    }
}
</script>
<style>
.search-user {background-color: #f8fbff;color: #323232;}
.search-user .el-dialog {margin: 50px auto 0 auto!important;}
.search-user .el-dialog__body {padding: 0}
.search-user .content {width: 80%;margin:50px auto 20px auto;}
.search-user .content .select-list{margin-top: 100px}
.search-user .content .el-select{width: 100%;float: left;}
.search-user .content .input{width: 65%;}
.search-user .content .add-select{cursor: pointer;width: 32px;height: 32px;line-height: 32px;text-align: center;background-color: #e2e2e2;font-size: 16px;margin-left: 9px;font-size: 20px;float: left;margin-top: 2px;}
.search-user .search-btn{padding: 15px 10px;border-top: 1px solid #e8e8e8;text-align: right}
.search-user .search-btn .el-button{padding: 8px 40px;border-radius: 2px}
.search-user .title{position: relative;padding: 2px 30px;font-size: 16px;margin-bottom: 15px}
.search-user .title::after{content: '';position: absolute;left:16px;top:5px;width: 4px;height: 16px;background-color: #3498fa;}
.search-user .table{padding: 0 20px;}
.search-user .btn-list{text-align: right;margin-top: 10px;padding:13px 20px;border-top: 1px solid #e2e2e2}
.search-user .btn-list .el-button{background-color: #f8fbff;color: #323232;padding: 8px 26px;border-radius: 2px}
.search-user .btn-list .el-button--primary{color: #fff;background-color: #3498fa;}
.search-user .el-table--medium td,.search-user .el-table--medium th {padding: 0}
.search-user .el-table th {background-color: #e9eef4;}
.from-wrapper{padding: 0 10px;}
.from-wrapper .el-input input{border-radius: 2px;background-color: #fff}
.el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label::before{display: none}
.el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label::after{content: '*';color: red;margin-left: 1px;text-align: right;}
.from-wrapper .from-input.unit .el-input{width: 128px;}
.from-wrapper .from-input.time-class{min-width: 350px;}
.from-wrapper .from-input.radio{height: 40px;line-height: 40px;}
/* .from-wrapper .from-input.radio .el-radio{color: #fff} */
.from-wrapper .title{padding: 0 10px;text-align: right;line-height: 40px;height: 40px;}
/* .from-wrapper .el-radio{color: #fff} */
.search-user .el-date-editor.el-input, .el-date-editor.el-input__inner{width: 100%;}
</style>