<template>
    <div class="Setting">
        <site-head></site-head>
        <div class="contents clearfix">
            <!-- tab -->
            <div class="tabs">
                <div :class="{tab: true, active : selection == 2 }"
                     @click="setSelectTab(2)">帐号管理</div>
            </div>
            <!-- <config v-if="selection == 1"></config> -->
            <account v-if="selection == 2"></account>
            <!-- <photo v-if="selection == 3"></photo> -->
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
import Photo from './components/Photo'
import Utils from '@modules/Utils';
export default {
    name: 'UserDetail',
    components: { SitePage, SiteHead, Config, Account, Photo },
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
<style>
.Setting {height: 100%;background-color: #fff;overflow: hidden;}
.Setting .contents{position: relative;padding-left: 265px;height: calc(100% - 32px);}
.Setting .tabs{position: absolute;left: 0;top: 0;bottom: 0;width: 264px;border-right: 1px solid #e2e2e2}
.Setting .tabs .tab{height: 48px;line-height: 48px;font-size: 14px;color: #323232;padding: 0 15px;cursor: pointer;}
.Setting .tabs .tab.active{background-color: #d5dde6}
</style>