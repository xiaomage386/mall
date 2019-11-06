<template>
    <div class="User">
        <site-head></site-head>
        <patient-detail ref="editPatient" :dialogFormVisible="dialogFormVisible"
                        @change="handelDialogVisble"
                        @submit="handelDialogSubmit"
                        v-if="dialogFormVisible.isVisble"></patient-detail>
        <div class="btn-list clearfix">
            <!-- <el-button type="primary"
                       @click="
                    dialogFormVisible.isVisble = true;
                    dialogFormVisible.id = '';
                "><i class="icon icon-home"></i>患者</el-button> -->
            <el-input placeholder="请输入患者姓名/HIS ID"
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
                            start-placeholder="生成开始日期"
                            end-placeholder="生成结束日期">
            </el-date-picker>
            <el-button type="primary"
                       class="search"
                       @click="submitForm">
                <i class="icon icon-search"></i>搜索</el-button>
        </div>
        <div class="table">
            <el-table v-loading="loading"
                      ref="singleTable"
                      :data="List"
                      height="575"
                      border
                      highlight-current-row
                      size="medium"
                      @current-change="handleCurrentChange"
                      style="width: 100%">
                <el-table-column property="hisOrderId" min-width="120"
                                 label="HIS ID"></el-table-column>
                <el-table-column property="birthName" min-width="120" label="患者"></el-table-column>
                <el-table-column property="reprotNumber" min-width="120" label="报告数量"></el-table-column>
                <el-table-column property="sourceEquipment" min-width="120" label="来源设备"></el-table-column>
                <el-table-column property="currentTime" min-width="160"
                                 label="最近检测时间"></el-table-column>
                <el-table-column fixed="right"
                                 label="操作" min-width="220">
                    <template slot-scope="scope">
                        <!-- <el-button @click="handleCurrentEdit(scope.row)"
                                   type="text"
                                   size="small">编辑</el-button> -->
                        <el-button @click="handleClick(scope.row)"
                                   type="text"
                                   size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <site-page @change="handlePageChange"
                   :total="total"
                   :page="page"
                   :size="pageSize"></site-page>
    </div>
</template>
<script>
import patientService from '@services/patientService'
import Popup from '@modules/Popup'
import SiteHead from '@/components/SiteHead/SiteHead'
import SitePage from '@/components/sitePage/SitePage'
import Utils from '@modules/Utils';
export default {
    name: 'Home',
    components: { SitePage, SiteHead },
    data() {
        return {
            currentTime: this.$route.query.currentTime || '',
            page: this.$route.query.page || 1,
            total: 0,
            pageSize: 12,
            List: [],
            tableData: [],
            testRow: null,
            patientId: '',
            fvcReportId: '',
            polar: {},
            loading: true,
            loadingTime: '',
            keyDownFn: '',
            search: this.$route.query.search || '',
            dialogFormVisible: {
                isVisble: false
            }
        }
    },
    created: function () {
        this.page = parseInt(this.page)
        this.updateListData()
        this.keyDownFn = (params) => {
            let key = window.event.keyCode;
            if (key == 112) {
                this.$refs.editPatient.submitForm()
            } else if (key == 114) {
                this.dialogFormVisible.isVisble = false
            }
        }
        document.addEventListener('keydown', this.keyDownFn)
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.keyDownFn)
    },
    methods: {
        // 患者列表
        updateListData(page, limit, config) {
            let _data = {
                pageSize: limit || this.pageSize,
                currPage: page || this.page || 1
            }
            if (config === undefined) {
                config = {}
                this.search && (config['searchValue'] = this.trim(this.search))
                !!Utils.size(this.currentTime) && (config['currentStartTime'] = this.currentTime[0])
                !!Utils.size(this.currentTime) && (config['currentEndTime'] = this.currentTime[1])
            }
            Object.assign(_data, config)
            patientService.getPatients(_data).then(data => {
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
        // 选中的患者
        handleCurrentChange(val) {
            if (val) {
                this.patientId = val.patientId;
            }
        },
        handleCurrentEdit(socpe) {
            this.dialogFormVisible.id = socpe.patientId;
            this.dialogFormVisible.isVisble = true;
        },
        // 删除测试
        delTest() {
            Popup.confirm('是否确定删除测试？').then(flag => {
                flag && patientService.delPatientTest([this.testRow.fvcReportId]).then(data => {
                    data || (data = {})
                    if (data['code'] != patientService.STATUS_SUCCESS) {
                        return patientService.Warning(data['code'], data['msg'])
                    }
                    Popup.showToast.Success('删除成功！')
                }, patientService.NetWorkFail)
            })
        },
        // 分页
        handlePageChange(val) {
            this.loading = true
            clearTimeout(this.loadingTime)
            this.updateListData(val, null, { searchValue: this.trim(this.search) })
            this.delSelectUser()
            this.page = val
        },
        handelDialogSubmit() {
            this.updateListData()
            this.page = 1
        },
        // 搜索
        submitForm() {
            let data = {}
            this.search && (data['searchValue'] = this.trim(this.search))
            !!Utils.size(this.currentTime) && (data['currentStartTime'] = this.currentTime[0])
            !!Utils.size(this.currentTime) && (data['currentEndTime'] = this.currentTime[1])
            this.page = 1
            this.updateListData(null, null, data)
            this.delSelectUser()
        },
        delSelectUser() {
            this.testRow = null
            this.tableData = []
            this.fvcReportId = ''
        },
        handelDialogVisble(data) {
            this.dialogFormVisible.isVisble = data
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
        handleClick(scope) {
            this.$router.push({ name: 'UserDetail', query: { id: scope.id, page: this.page, searchValue: this.search, currentTime: this.currentTime } })
        },
        trim(s){
            return s.replace(/(^\s*)|(\s*$)/g, '');
        }
    },
    computed: {
        options() {
            return this.polar
        }
    }
};
</script>
<style scoped>
.User .btn-list {padding: 12px}
.User .btn-list .el-button{float: left;border-radius: 2px;padding: 0;min-width: 94px;height: 40px;line-height: 40px;text-align: left}
.User .btn-list .search{margin-left: 10px}
.User .btn-list .icon{float: left;margin: 5px 0 0 10px;transform: scale(0.7)}
.User .btn-list .input{width: 315px;float: left;}
.User .btn-list .date{float: left;}
.User .patientDetail .el-date-editor.el-input,.User .el-date-editor.el-input__inner {width: auto;margin: 0 10px}
.User .table {margin:0 10px}
.User .el-table--medium td,.User .el-table--medium th{padding: 13px 0}
</style>