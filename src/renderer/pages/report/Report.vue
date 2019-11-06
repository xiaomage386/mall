<template>
    <div class="Report">
        <site-head></site-head>
        <div class="btn-list clearfix">
            <el-input placeholder="请输入患者姓名/报告编号"
                      v-model="search"
                      class="input"
                      clearable
                      @keyup.enter.native="submitForm">
                <i slot="prefix"
                   class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-date-picker v-model="currentTime"
                            type="daterange"
                            class="date"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary"
                       class="search"
                       @click="submitForm">
                <i class="icon icon-search"></i>搜索</el-button>
            <!-- <div class="right-btn">
                <el-button @click="exportFile"
                           :disabled="!downloadReportBtn">
                    <i class="icon-btn icon-update-o"></i>PDF报告</el-button>
            </div> -->
        </div>
        <div class="table">
            <el-table v-loading="loading"
                      ref="singleTable"
                      :data="List"
                      height="575"
                      border
                      highlight-current-row
                      @current-change="handleCurrentChange"
                      size="medium"
                      style="width: 100%">
                <el-table-column property="reportUniqKey"
                                 label="报告编号"></el-table-column>
                <el-table-column property="hisOrderId"
                                 label="HIS ID"></el-table-column>
                <el-table-column property="typeName" label="报告类型"></el-table-column>
                <el-table-column width="80" property="birthName"
                                 label="患者"></el-table-column>
                <el-table-column width="80" property="physician" label="医生"></el-table-column>
                <el-table-column width="80" property="operator" label="操作者"></el-table-column>
                <el-table-column width="65" property="gender" label="性别"></el-table-column>
                <el-table-column width="65" property="age" label="年龄"></el-table-column>
                <el-table-column width="65" property="height" label="身高"></el-table-column>
                <el-table-column width="65" property="weight" label="体重"></el-table-column>
                <el-table-column property="sourceEquipment" label="来源设备"></el-table-column>
                <el-table-column property="buildTime" label="生成时间"></el-table-column>
                <!-- <el-table-column label="状态" width="65">
                    <template slot-scope="scope">
                        <span style="color:#3394f5" v-if="scope.row.type == 0">合格</span>
                        <span style="color: #f00" v-else>不合格</span>
                    </template>
                </el-table-column> -->
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="goReport(scope.row)"
                                   type="text"
                                   size="small">预览</el-button>
                        <el-button @click="exportFile(scope.row)"
                                   type="text"
                                   size="small">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <site-page @change="handlePageChange"
                   :total="total"
                   :page="page"
                   :size="12"></site-page>
    </div>
</template>
<script>
import SitePage from '@/components/sitePage/SitePage'
import patientService from '@services/patientService'
import Popup from '@modules/Popup'
import Utils from '@modules/Utils';
export default {
    name: 'Report',
    components: { SitePage },
    data () {
        return {
            search: this.$route.query.search || '',
            currentTime: this.$route.query.currentTime || '',
            List: [],
            page: this.$route.query.page || 1,
            total: 0,
            loading: true,
            reportType: '',
            reportId: '',
            downloadReportBtn: false
        }
    },
    created: function() {
        this.updateListData()
    },
    methods: {
        submitForm() {
            // 搜索
            let data = {}
            this.search && (data['searchValue'] = this.search.trim())
            !!Utils.size(this.currentTime) && (data['buildStartTime'] = this.currentTime[0])
            !!Utils.size(this.currentTime) && (data['buildEndTime'] = this.currentTime[1])
            this.page = 1
            this.updateListData(null, null, data)
        },
        updateListData(page, limit, config) {
            // 报告列表
            let _data = {
                pageSize: limit || 12,
                currPage: page || this.page || 1
            }
            if (config === undefined) {
                config = {}
                this.search && (config['searchValue'] = this.search.trim())
                !!Utils.size(this.currentTime) && (config['buildStartTime'] = this.currentTime[0])
                !!Utils.size(this.currentTime) && (config['buildEndTime'] = this.currentTime[1])
            }
            Object.assign(_data, config)
            patientService.findReportPage(_data).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.List = data.object && data.object.list || []
                this.total = parseInt(data.object && data.object.totalCount)
            }, patientService.NetWorkFail).finally(() => {
                this.loadingTime = setTimeout(() => {
                    this.loading = false
                }, 500)
            })
        },
        goReport(scope) {
            console.log(scope)
            // 查看报告
            let urlName = 'RoutinePrinting'
            if (scope.typeName == '肺功能报告') {
                urlName = 'RoutinePrinting'
            } else if (scope.typeName == '舒张试验报告') {
                urlName = 'BronchusPrinting'
            }
            // isReport 判断是否是报告列表页传来的值
            // this.$router.push({ name: urlName, query: { id: scope.patientId, fvcReportId: scope.reportId, buildTime: scope.buildTime, isReport: true, page: this.page, search: this.search, currentTime: this.currentTime } })
            this.$router.push({ name: 'RoutinePrinting', query: { id: scope.id } })
        },
        handleCurrentChange(val) {
            this.downloadReportBtn = true
            this.reportId = val.reportId
            // 点击报告
            if (val.reportType == '常规通气报告') {
                this.reportType = 'SpiroALL'
            } else if (val.reportType == '舒张试验报告') {
                this.reportType = 'DiastolicReport'
            }
        },
        updateReport() {
            // 上传报告到格创肺功能平台
            this.updateReportBtn = false
            Popup.showToast.Success('正在上传报告，请耐心等候！', {duration: 0})
            patientService.pushReport().then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    patientService.Warning(data['code'], data['msg'])
                    return data
                }
                this.updateListData()
            }, patientService.NetWorkFail).finally(() => {
                setTimeout(() => {
                    Popup.hideToast()
                    this.updateReportBtn = true
                }, 500)
            })
        },
        exportFile(scope) {
            // 导出报告
            Popup.showToast.Success('正在全力下载，请耐心等候！', {duration: 0})
            patientService.reportUrl(scope.id).then(data => {
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
        handlePageChange(val) {
            // 分页
            this.loading = true
            clearTimeout(this.loadingTime)
            this.updateListData(val, null, {searchValue: this.search})
            this.page = val
        }
    }
}
</script>
<style scoped>
.btn-list {position:relative; padding: 12px;padding-right:210px;}
.btn-list .el-button{float: left;padding: 0;min-width: 94px;height: 40px;line-height: 40px;text-align: left}
.btn-list .search{margin-left: 10px}
.btn-list .icon{float: left;margin: 5px 0 0 10px;transform: scale(0.7)}
.btn-list .input{width: 315px;float: left;}
.btn-list .date{float: left;width: 400px;margin-left: 10px;}
.btn-list .date-s{float: left;width: 200px;margin-left: 10px;}
.btn-list .right-btn{position:absolute; right:10px;}
.btn-list .right-btn .icon-btn{position:relative;top:1px; width:15px;height:13px;margin-left:10px;margin-right: 3px;}
.site-page{margin:0;}
.Report table{margin: 0 10px;}
</style>
