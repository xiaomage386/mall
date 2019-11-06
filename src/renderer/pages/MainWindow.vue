<template>
    <MainFrame>
        <!-- <MainHeader slot="header"></MainHeader> -->
        <Menus slot="menus"></Menus>
        <!-- <MainFooter slot="footer"></MainFooter> -->
    </MainFrame>
</template>
<script>
import MainFrame from '@/components/Main/Frame.vue'
import Menus from '@/components/Menu/Menus.vue'
import MainHeader from '@/components/Main/Header.vue'
// import MainHeader from '@/components/siteHead/siteHead.vue'
import MainFooter from '@/components/Main/Footer.vue'
import REMOTE_CONFIG from '@/../main/config'
const { remote } = require('electron')
const currentWindow = remote.getCurrentWindow();
const WIN_CONFIG = REMOTE_CONFIG['BrowserWindow'];
export default {
    name: 'MainWindow',
    components: { MainFrame, Menus, MainHeader, MainFooter },
    created: function(){
        console.log(this.$route.name)
        currentWindow.setSize(WIN_CONFIG['width'], WIN_CONFIG['height'])
    }
}
</script>
<style>
.iconfont {
    cursor: pointer;
}
</style>