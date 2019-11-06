<template>
    <div class="photo">
        <div class="title">定标列表</div>
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
            </el-table>
        </div>
    </div>
</template>
<script>
// import profileService from '@services/profileService'
import patientService from '@services/patientService'
import Popup from '@modules/Popup'
import Utils from '@modules/Utils';
// import APP_CONFIG from '@/app.config'
export default {
    name: 'Photo',
    components: {},
    data() {
        return {
            loading: false,
            list: [],
            currentTime: [],
            pageSize: 12,
            page: 1
        }
    },
    created() {
        this.updateListData()
    },
    methods: {
        handleCurrentChange() {

        },
        // 定标列表
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
            console.log(_data)
            patientService.scalingUpload(_data).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                console.log(data)
                this.List = data.object && data.object.list || []
                this.total = parseInt(data.object && data.object.totalCount)
            }, patientService.NetWorkFail).finally(() => {
                this.loadingTime = setTimeout(() => {
                    this.loading = false
                }, 500)
            })
        }
    }
};
</script>
<style lang="scss" scoped>
.photo {
    padding: 15px;font-size: 14px;color: #323232;width: 544px;background-color: #fff;overflow-y: auto;height: 100%;
    .title{margin-bottom: 17px;}
    table{margin: 0 10px;width: 100%;}
}
</style>
