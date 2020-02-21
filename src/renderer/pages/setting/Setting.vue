<template>
    <div class="Setting">
        <site-head showTitle="肺功能预约补录系统"></site-head>
        <Menus slot="menus"></Menus>
        <div class="content clearfix">
            <!-- tab -->
            <div class="tabs">
                <div :class="{tab: true, active : selection == 2 }"
                     @click="setSelectTab(2)">帐号管理</div>
            </div>
            <!-- <config v-if="selection == 1"></config> -->
            <account v-if="selection == 2"></account>
        </div>
    </div>
</template>
<script>
import patientService from '@services/patientService'
import Popup from '@modules/Popup'
import SiteHead from '@/components/SiteHead/SiteHead'
import SitePage from '@/components/sitePage/SitePage'
import Config from './components/Config'
import Account from './components/Account'
import Utils from '@modules/Utils';
import Menus from '@/components/Menu/Menus.vue'
export default {
    name: 'UserDetail',
    components: { SitePage, SiteHead, Config, Account, Menus },
    data() {
        return {
            selection: this.$route.query.type || 2
        }
    },
    created() {
    },
    methods: {
        setSelectTab (index) {
            this.selection = index;
        }
    }
};
</script>
<style scoped lang="scss">
.Setting {height: 100%;background-color: #fff;overflow: hidden;}
.Setting .content{position: relative;padding-left: 265px;height: calc(100% - 32px);}
.Setting .tabs{position: absolute;left: 65px;top: 0;bottom: 0;width: 199px;border-right: 1px solid #e2e2e2}
.Setting .tabs .tab{height: 48px;line-height: 48px;font-size: 14px;color: #323232;padding: 0 15px;cursor: pointer;}
.Setting .tabs .tab.active{background-color: #d5dde6}
</style>