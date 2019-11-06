<template>
    <div class="user-detail">
        <site-head></site-head>
        <div class="content clearfix">
            <div class="test-info">
                <div class="step">
                    <router-link tag="span"
                                 :to="{ name: 'User', query: {page: userPage, search: userSearch, currentTime: userCurrentTime} }">
                        &lt; 患者列表 /
                    </router-link><span class="current-step">患者详情</span>
                </div>
                <el-form label-width="100px"
                         ref="form"
                         :model="form"
                         size="small"
                         :validate-on-rule-change="false">
                    <el-row class="">
                        <el-col :span="8"
                                class="from-wrapper">
                            <el-col :span="20"
                                    class="from-input">
                                <el-form-item prop="birthName" label="姓名：">
                                    <span v-text="form.birthName"></span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="20"
                                    class="from-input">
                                <el-form-item prop="hisOrderId" label="HIS ID：">
                                    <span v-text="form.hisOrderId"></span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="20"
                                    class="from-input">
                                <el-form-item prop="gender" label="性别：">
                                    <span v-text="form.gender"></span>
                                </el-form-item>
                            </el-col>  
                            <el-col :span="20"
                                    class="from-input">
                                <el-form-item label="年龄：">
                                    <span v-text="form.age"></span>
                                </el-form-item>
                            </el-col>                         
                        </el-col>
                        <el-col :span="8"
                                class="from-wrapper">
                            <el-col :span="22"
                                    class="from-input unit">
                                <el-form-item prop="height" label="身高(cm)：">
                                    <span v-text="form.height"></span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="22"
                                    class="from-input unit">
                                <el-form-item prop="weight" label="体重(kg)：">
                                    <span v-text="form.weight"></span>
                                </el-form-item>
                            </el-col>                            
                            <el-col :span="20"
                                    class="from-input">
                                <el-form-item label="BMI：">
                                    <span v-text="BMI"></span>
                                </el-form-item>
                            </el-col>
                        </el-col>
                        <el-col :span="8">
                            <el-col :span="20"
                                    class="from-input">
                                <el-form-item label="联系电话：">
                                    <span v-text="form.phone"></span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="20"
                                    class="from-input">
                                <el-form-item label="身份证号：">
                                    <span v-text="form.ssn"></span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="20"
                                    class="from-input">
                                <el-form-item label="联系地址：">
                                    <span v-text="form.area"></span>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="test-title">测量记录</div>
                <div class="table">
                    <el-table v-loading="loading"
                              ref="table"
                              :data="List"
                              height="355"
                              border
                              highlight-current-row
                              size="medium"
                              @current-change="handleCurrentChange"
                              style="width: 100%">
                        <el-table-column property="reportUniqKey" label="编号"></el-table-column>
                        <el-table-column property="typeName" label="报告类型"></el-table-column>
                        <el-table-column property="birthName" label="患者"></el-table-column>
                        <el-table-column property="sourceEquipment"  label="来源设备"></el-table-column>
                        <el-table-column property="buildTime" label="生成时间"></el-table-column>
                        <!-- <el-table-column property="countFVC" :width="60" label="FVC">
                            <template slot-scope="scope">
                                <div v-if="scope.row.countFVC == 1" class="seat"></div>
                            </template>
                        </el-table-column>  -->                       
                        <el-table-column label="操作">
                            <template slot-scope="score">
                                <el-button @click="goReport(score.row)" type="text" size="small">预览</el-button>
                                <el-button @click="exportFile(score.row)" type="text" size="small">下载</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <site-page @change="handlePageChange"
                           :total="total"
                           :page="page"
                           :size="10"></site-page>
            </div>
        </div>

    </div>
</template>
<script>
import patientService from '@services/patientService'
import Popup from '@modules/Popup'
import SiteHead from '@/components/SiteHead/SiteHead'
import SitePage from '@/components/sitePage/SitePage'
import Utils from '@modules/Utils';
export default {
    name: 'UserDetail',
    components: { SitePage, SiteHead },
    data() {
        return {
            id: this.$route.query.id,
            page: 1,
            total: 0,
            age: 0,
            BMI: 0,
            List: [],
            tableData: [],
            tableHead: [],
            currentRow: null,
            gradeId: '',
            fvcReportId: '',
            templateCode: 'SpiroBasic',
            nations: [],
            countrys: [],
            types: [],
            form: {},
            polar: {},
            loading: true,
            loadingTime: '',
            testLoadingTime: '',
            testLoading: false,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            userPage: this.$route.query.page || 1,
            userSearch: this.$route.query.name || '',
            userCurrentTime: this.$route.query.currentTime || ''
        }
    },
    created: function () {
        this.id && this.getPatient();
        this.id && this.updateListData();
        // this.id && this.getConfigInfo();
    },
    methods: {
        // 患者详情
        getPatient() {
            patientService.getPatient(this.id).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.form = data.object || {}
                this.form.gender = this.form.gender == 'MALE' ? '男' : '女'
                this.form.weight = parseInt(this.form.weight)
                this.form.height = parseInt(this.form.height)
                this.setBMI()
                // this.timeChange()
            }, patientService.NetWorkFail)
        },
        // 患者测试列表
        updateListData(page, limit, config) {
            let _data = {
                pageSize: limit || 10,
                pageNumber: page || 1,
                patientId: this.id
            }
            Object.assign(_data, config)
            patientService.findReportPage(_data).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                let _obj = data.object || {}
                this.List = _obj.list || []
                this.total = parseInt(_obj.totalCount || 0)
                // 默认选中
                setTimeout(() => {
                    this.$refs.table.setCurrentRow(this.$refs.table.data[0])
                }, 200)
            }, patientService.NetWorkFail).finally(() => {
                this.loadingTime = setTimeout(() => {
                    this.loading = false
                }, 500)
            })
        },
        // 选中的患者
        handleCurrentChange(val) {
            if (val) {
                this.testLoading = true
                clearTimeout(this.testLoadingTime)
                this.currentRow = val;
                this.gradeId = val.gradeId
                this.fvcReportId = ''
            }
        },
        // 分页
        handlePageChange(val) {
            this.loading = true
            clearTimeout(this.loadingTime)
            // this.updateListData(val, null)
            this.delSelectUser()
            this.page = val
        },
        delSelectUser() {
            this.currentRow = null
            this.tableData = []
            this.fvcReportId = ''
        },
        goReport(score) {
            let urlName = 'RoutinePrinting'
            if (this.templateCode == 'SpiroALL') {
                urlName = 'RoutinePrinting'
            } else if (this.templateCode == 'DiastolicReport') {
                urlName = 'BronchusPrinting'
            }
            this.$router.push({ name: 'RoutinePrinting', query: { id: score.id } })
        },
        exportFile(score) {
            // 导出报告
            Popup.showToast.Success('正在全力下载，请耐心等候！', {duration: 0})
            patientService.reportUrl(score.id).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    Popup.hideToast()
                    patientService.Warning(data['code'], data['msg'])
                    return data
                }
                if (data.object) {
                    window.location = data.object
                }
            }, patientService.NetWorkFail).finally(() => {
                setTimeout(() => {
                    Popup.hideToast()
                }, 8000)
            })
        },
        setBMI() {
            if (this.form.height && this.form.weight) {
                this.BMI = parseInt(this.form.weight / (this.form.height * this.form.height / 10000))
            }
        },
        timeChange() {
            if (this.form.birthDate) {
                let birthday = Utils.formatStringTime(this.form.birthday) / 1000
                let time = parseInt(Utils.getTime() / 1000) - birthday
                let ageTime = 24 * 60 * 60 * 365
                this.age = Math.floor(time / ageTime)
            } else {
                this.age = 0
            }
        }
    }
};
</script>
<style>
.user-detail .patientDetail .el-date-editor.el-input,.user-detail .el-date-editor.el-input__inner {width: auto;margin: 0 10px}
.user-detail .content {padding: 0 20px;}
.user-detail .site-page {margin: 0;}
.user-detail .el-input.is-disabled .el-input__inner {background-color: #fff}
.user-detail .step {margin: 15px 0 20px 0;font-size: 14px;color: #323232;cursor: pointer;}
.user-detail .step .current-step{color: #3393f7}
.user-detail .content .select-list{margin-top: 50px}
.user-detail .test-title {font-size: 14px;margin: 25px 0 15px 0;color: #323232}
.user-detail .test-info {position: relative}
.user-detail .line {position: absolute;left: 57%;top:32px;bottom:0;border-right: 1px solid #e2e2e2;z-index: 1;}
.user-detail .report-info {float: right;width: 40%;}
.user-detail .table .el-table--medium td,.user-detail .el-table--medium th{padding: 0!important;}
.user-detail .table .seat {width: 12px;height: 12px;border-radius: 50%;background: #409EFF;}
.user-detail .btn-list {padding: 12px}
.user-detail .btn-list .el-button{float: left;border-radius: 2px;padding: 0;min-width: 110px;height: 40px;line-height: 40px;text-align: left}
.user-detail .btn-list .icon{float: left;margin: 5px 0 0 10px;transform: scale(0.7)}
.user-detail .btn-list .input{width: 315px;float: left;}
.user-detail .el-table td,.user-detail .el-table th.is-leaf{color: #323232}
.user-detail .el-input.is-disabled .el-input__inner{color: #323232}
.user-detail .el-radio__input.is-disabled.is-checked .el-radio__inner{border-color: #409EFF;background: #409EFF;}
.user-detail .el-form-item span{white-space: nowrap;}
.user-detail .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{margin-bottom: 5px;}
</style>