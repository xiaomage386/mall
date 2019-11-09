<template>
  <div class="header">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#223460"
      text-color="#fff"
    >
    <el-row class="logo">
        <el-col :span="12">
            <img class="logo-img" />
            <div class="title">预约补录系统</div>
        </el-col>
        <el-col :span="12">
        </el-col>
    </el-row>
    </el-menu> 
  </div>
</template>

<script>
export default {
  name: 'MainHeader',
  data() {
      return {
      }
    },
    methods: {}
};
</script>

<style scoped>
.header{color: #fff;height: 50px;line-height: 50px;}
.header .logo{padding: 0 10px}
.header .logo .logo-img{float: left;}
.header .logo .title{float: left;font-size: 20px}
</style>
