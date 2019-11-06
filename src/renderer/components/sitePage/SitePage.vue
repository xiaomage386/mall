<template>
    <div class="site-page clearfix">
        <div class="peags">共 {{peags}} 页</div>
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="size || 10"
            background
            :pager-count="count"
            layout="total, prev, pager, next, jumper, slot"
            :total="total"
        ></el-pagination>
    </div>
</template>
<script>
import Utils from '@modules/Utils';
export default {
    name: 'SitePage',
    props: {
        total: Number,
        page: Number,
        size: Number
    },
    methods: {
        handleCurrentChange(val) {
            this.$emit('change', val)
        }
    },
    data() {
        return {
            count: 5
        }
    },
    computed: {
        peags() {
            return Math.ceil(this.total / this.size)
        }
    }
};
</script>

<style>
.site-page {padding:5px;background-color: #fff;margin: 0 10px 5px 10px;border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;border-bottom: 1px solid #EBEEF5;}
.site-page .el-pagination{float: right}
.site-page .peags{float: right;margin:0 10px;font-size: 13px;min-width: 35.5px;height: 32px;line-height: 32px;vertical-align: top;font-weight: 400;color: #606266;}
/* .site-page .el-pagination{color: #fff}
.site-page .el-pagination > span{color: #fff} */
</style>