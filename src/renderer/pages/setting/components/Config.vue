<template>
    <div class="config">
        <el-dialog :visible.sync="dialogExeVisible" width="400px" title="请先选择启动软件">
            <div class="file-wapper">
                <el-button>选择软件</el-button>
                <el-input type="file" :id="fileid" @change="preview($event)"></el-input>
                <span v-text="exefile"></span>
            </div>
            <div class="btn-list text-right">
                <el-button size="mini" @click="dialogExeVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="sevriceSubmitForm()">确定</el-button>
            </div>
        </el-dialog>
        <div class="title">默认选项配置</div>
        <div class="config-list">
            <div class="list-title">检测扫描报告路径</div>
            <el-button @click="pdfFile">选择目录</el-button><span v-text="pdfFildPath"></span>
        </div> 
        <div class="config-list">
            <div class="list-title">修改测试软件默认位置</div>
            <el-button @click="exebtn">选择软件</el-button><span v-text="exefileSave"></span>
        </div>
    </div>
</template>
<script>
import patientService from '@services/patientService'
import configService from '@services/configService'
import APP_CONFIG from '@/app.config'
import Popup from '@modules/Popup'
import Utils from '@modules/Utils';
import localStorage from '@modules/localStorage'
import {ipcRenderer} from 'electron'
const PDF_FILE = APP_CONFIG['NAME'] + '_pdfFile'
const TEST_EXE = APP_CONFIG['NAME'] + '_TEST_EXE';
export default {
    name: 'Config',
    components: {},
    data() {
        return {
            pdfFildPath: '',
            exefile: '',
            exefileSave: '',
            fileid: 'file',
            dialogExeVisible: false
        }
    },
    created() {
        // 接收 pdf 上传路径
        ipcRenderer.removeAllListeners('selected-directory')
        ipcRenderer.on('selected-directory', (event, path) => {
            patientService.updateTargetFilepath(path[0]).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.pdfFildPath = path[0]
            }, error => {
                Popup.hideLoading()
                patientService.NetWorkFail()
            })
        })
        // 获取测试软件路径
        if (localStorage.get(TEST_EXE)){
            this.exefileSave = localStorage.get(TEST_EXE)
        }
    },
    methods: {
        // 选择 pdf 上传路径
        pdfFile() {
            ipcRenderer.send('select-file-dialog')
        },
        // 选择测试默认路径
        exebtn() {
            this.dialogExeVisible = true
        },
        preview(event){
            // 获取软件路径
            let files = document.getElementById(this.fileid).files[0]
            this.exefile = files.path
        },
        sevriceSubmitForm() {
            localStorage.set(TEST_EXE, this.exefile)
            this.exefileSave = this.exefile
            this.dialogExeVisible = false
            Popup.showToast.Success('修改成功')
        }
    }
};
</script>
<style lang="scss" scoped>
.config {
    padding: 15px;font-size: 14px;color: #323232;width: 950px;background-color: #fff;overflow-y: auto;height:100%;
    .lable-item{
        margin-bottom: 15px;height: 32px;line-height: 32px;
        .lable{
            min-width: 60px;display: inline-block;
        }
    }
    .config-list{
        .list-title{padding: 8px 0;height: 32px;line-height: 32px;}
        span{padding-left: 15px;}
    }
}
</style>