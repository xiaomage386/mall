<template>
    <div class="filter">
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <!-- <component v-for="(item, index) in param" :key="index" v-bind:is="item.componentName"></component> -->
            <el-form-item label="姓名">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="年龄">
                <el-input v-model="form.age"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker
                    v-model="form.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">搜索</el-button>
                <el-button type="primary" @click="resetForm">重置</el-button>
                <el-button type="primary">打印</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
// import input from '@/components/siteFilter/components/Input'

export default {
    name: 'SiteFilter',
    methods: {
        submitForm() {
            this.handleCurrentChange()
        },
        resetForm() {
            this.form = {}
            this.handleCurrentChange()
        },
        handleCurrentChange() {
            let data = Object.assign({}, this.form)
            if (data.time) {
                data.startTime = data.time[0]
                data.endTime = data.time[1]
            }
            delete data.time
            this.$emit('change', data)
        }
    },
    props: {
        param: Array
    },
    data() {
        return {
            form: {}
        }
    }
};
</script>

<style scoped>
.filter {padding:0 5px;margin-bottom: 10px;position: relative;}
.filter .input-list {padding:0 5px;margin-bottom: 10px;}
.filter .input-list .input-item{padding:0 5px;margin-bottom: 10px}
.filter .input-list .title{padding-right: 10px;display: inline-block;width: 20%;}
.filter .input-list .el-input{width: initial;width: 70%}
.filter .input-list .el-date-editor.el-input{width: 30%}
.filter .input-list .el-input input{padding-right: 0;}
</style>