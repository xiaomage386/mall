<template>
    <div class="navMenu">

        <label v-for="navMenu in Menu" :key="navMenu.entity.id">
            <!--只有一级菜单-->
            <el-menu-item v-if="navMenu.childs==null&&navMenu.entity&&navMenu.entity.state==='ENABLE'"
                          :key="navMenu.entity.id" :data="navMenu" :route="navMenu.entity.value" :index="''+navMenu.entity.id"
            >
                <!--图标-->
                <i :title="navMenu.entity.alias" :class="navMenu.entity.icon"></i>
                <!--标题-->
                <!-- <span slot="title">{{navMenu.entity.alias}}</span> -->
            </el-menu-item>
            <!--有多级菜单-->
            <el-submenu v-if="navMenu.childs&&navMenu.entity&&navMenu.entity.state==='ENABLE'"
                        :key="navMenu.entity.id" :data="navMenu" :index="''+navMenu.entity.id">
                <template slot="title">
                    <i :class="navMenu.entity.icon"></i>
                    <span> {{navMenu.entity.alias}}</span>
                </template>
                <!--递归组件，把遍历的值传回子组件，完成递归调用-->
                <Menu :Menu="navMenu.childs"></Menu>
            </el-submenu>
        </label>

    </div>
</template>

<script>
    export default {
        name: 'Menu',
        props: {
            Menu: Array
        },
        data() {
            return {
            }
        },
        methods: {}
    }
</script>

<style scoped>
.navMenu .el-menu-item i {width: 25px;}
</style>