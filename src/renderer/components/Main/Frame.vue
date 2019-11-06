<template>
    <div class="fullWindow" :style="fontColor">
        <div class="backgroundclass" style="transition: all 0.5s" :style="backGroundParent">
            <div class="backBodyClass" style="transition: all 0.5s" :style="backGroundChild"></div>
        </div>
            
            
        <el-row class="tac">
            <el-col class="nav-tabs" :span="3">
            </el-col>
            <el-col :span="21">
            
            </el-col>
        </el-row>
        
        <el-container>
            <!-- <el-header class="headDiv">
                <slot name="header"></slot>
            </el-header> -->
             <el-container>
                <el-aside width="65px">
                    <slot name="menus"></slot>
                </el-aside>
                <el-main class="bodyDiv">
                <slot>
                    <transition name="el-fade-in-linear">
                        <router-view :class="transitionGroup.routerClass"></router-view>
                    </transition>
                </slot>
            </el-main>
            </el-container>
            <!-- <div class="footer">
                <el-footer class="footDiv">
                    <slot name="footer"></slot>
                 </el-footer>
            </div> -->
        </el-container>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    name: 'MainFrame',
    computed: {
        ...mapGetters([
            'backGroundParent',
            'backGroundChild',
            'fontColor',
            'transitionGroup'
        ])
    },
    created() {
        // console.log(this);
    }
}
</script>

<style>
    .fullWindow {
        border-radius: 3px;
        width: 100%;
        height: 100%;
        box-shadow: 0 1px 6px 1px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        position: relative;
    }

    /* .fullWindow  .nav-tabs {width: 200px} */

    .fullWindow .el-header{padding: 0;height: 32px!important;}
    .fullWindow .el-aside{background-color: #3394f5;position: relative;z-index: 10001;z-index: 2;}
    .fullWindow .el-footer{padding: 0;height: 40px!important;position: absolute;z-index: auto;left: 0;right: 0;bottom: 0;}
    .fullWindow .footer{padding-top: 40px;height: 0;width: 0;}
    /* .fullWindow .el-main{background-color: #101e3c} */
        
    .fullWindow .el-main{padding: 0;background-color: #f6fafd;}
    .bodyDiv {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        word-break: break-all;
        flex-grow: 1;
        position: relative;
        overflow-x: hidden;
    }

    .headDiv {
        flex-shrink: 0;
        -webkit-app-region: drag;
    }

    .footDiv {
        flex-shrink: 0;
    }

    .backgroundclass {
        z-index: -1;
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
    }

    /* .backgroundclass::after{
        content: "";
        width:100%;
        height:100%;
        position: absolute;
        background: inherit;
        filter: attr(data-attr);
        overflow: hidden;
        box-sizing: border-box;
    } */
    .backBodyClass {
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
    }
</style>