<template>
    <div class="reserve">
        <div class="noPrn">
            <site-head showTitle="肺功能预约补录系统"></site-head>
        </div>
        <div id="main" v-show="!isPrint">
            <Menus slot="menus"></Menus>
            <div class="content">
                <div class="btn-list clearfix">
                    <el-input v-model="search.clinicNum" clearable @keyup.enter.native="submitForm" placeholder="申请单ID/ID/门诊/住院号"></el-input>
                    <el-input v-model="search.name" clearable @keyup.enter.native="submitForm" placeholder="姓名"></el-input>
                    <el-date-picker v-model="currentTime"
                                type="daterange"
                                class="date"
                                range-separator="至"
                                value-format="yyyy-MM-dd"
                                start-placeholder="申请开始日期"
                                end-placeholder="申请结束日期">
                    </el-date-picker>
                    <el-button type="primary" class="search" @click="submitForm">搜索</el-button>
                    <!-- <el-button type="primary" @click="addDrugDialog()"><i class="icon icon-add"></i>新建</el-button> -->
                </div>
                <div class="table">
                    <el-table v-loading="loading"
                        ref="singleTable"
                        border
                        :data="reserveList"
                        height="570px"
                        highlight-current-row
                        size="medium"
                        style="width: 100%">
                        <el-table-column property="id" width="120" label="ID"></el-table-column>
                        <el-table-column property="applyId" label="申请单ID"></el-table-column>
                        <el-table-column property="clinicNum" label="门诊/住院号"></el-table-column>
                        <el-table-column property="name" label="姓名" width="100"></el-table-column>
                        <el-table-column property="projectName" label="预约项目"></el-table-column>
                        <el-table-column property="temporary" width="80" label="类型"></el-table-column>
                        <el-table-column property="applyDate" label="预约时间"></el-table-column>
                        <el-table-column label="状态" width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.isComplete == 0" style="color: #3394f5">未检查</span>
                                <span v-if="scope.row.isComplete == 1" style="color: gray">已检查</span>
                                <span v-if="scope.row.isComplete == 2" style="color: gray">已取消</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="140">
                            <template slot-scope="scope">
                                <el-button @click="readPrint(scope.$index, scope.row)" type="text" size="small">查看</el-button>
                                <el-button v-if="scope.row.isComplete == 0" @click="cancelApply(scope.$index, scope.row)" type="text" size="small">取消预约</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <site-page @change="handlePageChange"
                   :total="total"
                   :page="page"
                   :size="pageSize"></site-page>
            </div>
        </div>
        <printing ref="printRef" v-show="isPrint" :printID="printID" :reportTypeList="reportTypeList" @close="closePrint"></printing>
    </div>
</template>
<script>
import Popup from '@modules/Popup'
import Utils from '@modules/Utils';
import patientService from '@services/patientService'
import Menus from '@/components/Menu/Menus.vue'
import Printing from '@/pages/Printing/Printing'
import SitePage from '@/components/sitePage/SitePage'
export default {
    name: 'Reserve',
    components: { Menus, Printing, SitePage },
    data() {
        return {
            loading: false,
            reserveList: [],
            currentTime: '', // 日期范围
            search: {
                name: '',
                clinicNum: '',
                applyStartTime: '',
                applyEndTime: ''
            },
            page: 1,
            total: 0,
            pageSize: 12,
            isPrint: false, // 列表页和详情页
            printID: 0, // 打印页面上传数据的id
            reportTypeList: [] // 报告类型列表
        }
    },
    created() {
        this.getReportType()
        this.getReservationList()
    },
    methods: {
        // 获取已预约信息列表
        getReservationList(page, limit, config) {
            this.loading = true
            let _data = {
                pageSize: limit || this.pageSize,
                currPage: page || this.page || 1
            }
            Object.assign(_data, config)
            patientService.getReservationList(_data).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    patientService.Warning(data['code'], data['msg'])
                    return data
                }
                this.reserveList = data.object.list
                this.loading = false
                this.total = parseInt(data.object && data.object.totalCount)
            }, error => {
                this.loading = false
                Popup.hideLoading()
                patientService.NetWorkFail()
            }).finally(() => {
                this.loadingTime = setTimeout(() => {
                    this.loading = false
                }, 500)
            })
        },
        handlePageChange(val) {
            // 分页
            this.loading = true
            let data = {}
            this.getReservationList(null, val, data)
            this.page = val
        },
        // 搜索
        submitForm() {
            let data = {}
            data.name = this.search.name.trim()
            data.clinicNum = this.search.clinicNum.trim()
            !!Utils.size(this.currentTime) && (data['applyStartTime'] = this.currentTime[0])
            !!Utils.size(this.currentTime) && (data['applyEndTime'] = this.currentTime[1])
            this.page = 1
            this.getReservationList(null, null, data)
        },
        readPrint(index, val) {
            this.showPrint()
            this.$refs.printRef.reservationApplyFun(val.reservationId);
        },
        showPrint() {
            this.isPrint = true
        },
        // 关闭打印页面
        closePrint() {
            this.isPrint = false
        },
        // 获取报告类型
        getReportType() {
            patientService.reservationType().then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.reportTypeList = data && data.list || []
                this.reportTypeList.push({name: '其他', type: ''})
            }, patientService.NetWorkFail)
        },
        // 取消预约
        cancelApply(index, val) {
            let _data = {
                ids: val.id
            }
            patientService.cancelApplyFun(_data).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.reserveList[index].isComplete = 2
                Popup.showToast.Success('取消预约成功')
            }, patientService.NetWorkFail)
        }
    }
}
</script>
<style scoped>
.content{padding:10px 0 0; padding-left: 65px;}
.table{margin-top: 10px;}
.el-button--small{font-size: 14px;}
.btn-list{padding: 0 10px;}
.table{padding: 0 10px;}
</style>