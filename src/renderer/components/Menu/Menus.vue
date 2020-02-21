<template>
    <!--左侧菜单组件-->
    <div class="menus">
        <!-- <router-link tag="div"
                     class="img"
                     :to="{ name: 'Setting' , query: { type: 2 } }">
            <img src="../../assets/images/default_head.png" />
        </router-link> -->
        <el-menu :default-active="index"
                 class="el-menu-vertical-demo"
                 @select="menuSelected"
                 background-color="#F0F6F6"
                 text-color="#3C3F41"
                 router
                 :collapse="false"
                 active-text-color="black">
            <Menu :Menu="leftMenus"></Menu>
        </el-menu>
        <el-menu :default-active="setIndex"
                 class="el-menu-vertical-demo set-menus"
                 @select="menuSelected"
                 background-color="#F0F6F6"
                 text-color="#3C3F41"
                 router
                 :collapse="false"
                 active-text-color="black">
            <Menu :Menu="setMenus"></Menu>
        </el-menu>
    </div>
</template>

<script>
import Menu from './Menu.vue'
import MenuData from './MenuData.js'
import commonService from '@services/commonService'
export default {
    name: 'Menus',
    data() {
        return {
            leftMenus: MenuData.list,
            setMenus: MenuData.setting,
            index: '1',
            setIndex: '1',
            menuConfig: {
                Home: '1',
                Reserve: '2',
                Setting: '100'
            }
        }
    },
    components: {
        Menu
    },
    created() {
    //    this.index = this.$store.state.menu.menuIndex
       this.index = this.menuConfig[this.$route.name]
    },
    methods: {
        menuSelected(index, indexPath) {
            if (index == 100) {
                this.index = ''
                this.setIndex = index
            } else {
                this.setIndex = ''
                this.index = index
            }
        }
    },
    computed: {
        indexComputed() {
            return this.index
        },
        setIndexComputed() {
            return this.setIndex
        }
    },
    watch: {
        '$route' (to, from) {
            let index = this.menuConfig[to.name]
            if (index == 100) {
                this.setIndex = index || ''
                this.index = ''
            } else {
                this.index = index || ''
                this.setIndex = ''
            }
        }
    }
}
</script>

<style>
.menus {position: fixed; z-index: 11; padding: 0px 0 10px 0;width: 65px;background-color: #3394f5;height: 100%;}
.menus .img{text-align: center;margin: 0 auto 15px auto;width: 34px;height: 34px;border-radius: 50%;cursor: pointer;}
.menus .el-menu {height: 100%;background-color: #3394f5!important;overflow: hidden;border: 0;}
.menus .el-menu .el-menu-item{background-color: #3394f5!important;color: #fff!important;}
.menus .el-menu .el-menu-item i{color: #fff!important;}
.menus .el-menu .el-menu-item.is-active{background-color: #1984f7!important;}
.menus .set-menus {position: fixed;bottom: 20px;left: 0;right:0;height: auto;width: 65px;}
.menus .navMenu > label:last-child{display: none}
</style>