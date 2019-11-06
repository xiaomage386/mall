<template>
    <div class="Bronchus clearfix">
        <div class="noPrn">
            <site-head showTitle="打印结果预览"></site-head>
            <el-dialog title="诊断结果"
                       :visible.sync="dialogFormVisible">
                <el-col :span="10">
                    <el-select placeholder="选择评估内容"
                               v-model="assessName"
                               multiple
                               collapse-tags
                               @change="assessChange">
                        <el-option v-for="item in tipList"
                                   :key="item.autoAssess"
                                   :label="item.autoAssess"
                                   :value="item.autoAssess"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="23">
                    <el-input type="textarea"
                              :rows="3"
                              placeholder="请输入诊断结果"
                              v-model="remarks">
                    </el-input>
                </el-col>
                <div slot="footer"
                     class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary"
                               @click="upDateRemarks">确 定</el-button>
                </div>
            </el-dialog>
            <div class="btn-list">
                <el-button @click="openPrint">
                    <i class="icon-btn icon-printing"></i>
                    打印
                </el-button>                
                <el-button @click="handleEnlarge"
                           :disabled="magnification == 1">
                    <i class="icon-btn icon-enlarge"></i>
                    放大
                </el-button>
                <el-button @click="handleNarrow"
                           :disabled="magnification < 0.5">
                    <i class="icon-btn icon-narrow"></i>
                    缩小
                </el-button>
                <el-button :disabled="downloadPdfBtn"
                           @click="downloadPdf">
                    <i class="icon-btn icon-update-o"></i>
                    下载报告
                </el-button>
                <!-- <el-button @click="exportFile" :disabled="!exportFileStatus" v-if="!isReport">
                    <i class="icon-btn icon-update-d"></i>
                    生成报告
                </el-button> -->
                <!-- <el-button @click="dialogFormVisible = true"
                           :disabled="isReport">
                    <i class="icon-btn icon-report"></i>
                    诊断填写
                </el-button> -->
                <!-- <div class="template">
                    <i class="icon-btn icon-switch"></i>
                    <el-select v-model="templateCode"
                               @change="handleTemplateChange"
                               :disabled="isReport"
                               placeholder="切换报告模板">
                        <el-option v-for="item in templateList"
                                   :key="item.templateCode"
                                   :label="item.templateName"
                                   :value="item.templateCode"></el-option>
                    </el-select>
                </div> -->
                <el-button @click="returnPage">
                    <i class="icon-btn icon-stop"></i>
                    关闭
                </el-button>
            </div>
        </div>

        <div class="content"
             ref="content">
            <div v-show="page == 1">
                <div class="title"
                     v-if="!!testData.reportTitlePrefix">{{testData.reportTitlePrefix || ''}}</div>
                <div class="title">支气管扩张试验检查报告</div>
                <div class="time">{{testData.buildTime}}</div>
                <div class="info clearfix">
                    <div class="info-text">
                        <span class="lable">姓名：</span>
                        {{ testData.patientName || "--" }}
                    </div>
                    <div class="info-text">
                        <span class="lable">性别：</span>
                        {{ testData.patientGender || "--" }}
                    </div>
                    <div class="info-text">
                        <span class="lable">年龄：</span>
                        {{ timeChange(testData.patientBirthday) || testData.patientAge || "0" }}
                    </div>
                    <div class="info-text">
                        <span class="lable">身高(cm)：</span>
                        {{ testData.patientHeight || "0" }}
                    </div>
                    <div class="info-text">
                        <span class="lable">体重(kg)：</span>
                        {{ testData.patientWeight || "0" }}
                    </div>
                    <div class="info-text">
                        <span class="lable">BMI：</span>
                        {{ bmi || "0" }}kg/m²
                    </div>
                    <div class="info-text">
                        <span class="lable">检测仪器：</span>
                        {{testData.deviceImei || ''}}
                    </div>
                    <div class="info-text">
                        <span class="lable">预计值模式：</span>
                        {{testData.pcModel || ''}}
                    </div>
                </div>
            </div>
            <el-row>
                <el-col :span="24"
                        class="table-info"
                        v-show="page == 1">
                    <div>
                        <el-table ref="singleTable"
                                  :data="testDetail"
                                  size="small"
                                  style="width: 100%">
                            <el-table-column property="name"
                                             :min-width="150"
                                             label="项目"></el-table-column>
                            <el-table-column property="unit"
                                             :min-width="55"
                                             label="单位"></el-table-column>
                            <el-table-column property="Pred"
                                             :min-width="55"
                                             label="Pred"></el-table-column>
                            <el-table-column property="A1"
                                             :min-width="55"
                                             label="A1"></el-table-column>
                            <el-table-column property="A1/Pd"
                                             :min-width="55"
                                             label="A1/Pd"></el-table-column>
                            <el-table-column property="P1"
                                             :min-width="50"
                                             label="P1"></el-table-column>
                            <el-table-column property="A2/Pd"
                                             :min-width="55"
                                             label="A2/Pd"></el-table-column>
                            <el-table-column property="chg%1"
                                             :min-width="55"
                                             label="chg%1"></el-table-column>
                            <el-table-column property="P2"
                                             :min-width="50"
                                             label="P2"></el-table-column>
                            <el-table-column property="A3/Pd"
                                             :min-width="55"
                                             label="A3/Pd"></el-table-column>
                            <el-table-column property="chg%2"
                                             :min-width="55"
                                             label="chg%2"></el-table-column>
                            <el-table-column property="P3"
                                             :min-width="50"
                                             label="P3"></el-table-column>
                            <el-table-column property="A4/Pd"
                                             :min-width="55"
                                             label="A4/Pd"></el-table-column>
                            <el-table-column property="chg%3"
                                             :min-width="55"
                                             label="chg%3"></el-table-column>
                        </el-table>
                    </div>
                </el-col>
                <el-col :span="24"
                        v-show="showChart == page">
                    <el-col :span="12"
                            class="chart-wrapper chart">
                        <div class="chart-btns clearfix">
                            <div :class="{'chart-btn': true, 'hide': !!item.visible}"
                                 v-for="(item, index) in testHead"
                                 :key="index"
                                 @click="FVCVisibleLine(item)"
                                 :style="{color: chartBtnColor[index]}">
                                <div class="chart-btn-icon"
                                     :style="{backgroundColor: chartBtnColor[index]}"></div>
                                实测{{index + 1}}
                            </div>
                        </div>
                        <v-chart :options="options"
                                 :autoresize="true"
                                 ref="fvcChart"
                                 :manualUpdate="false"></v-chart>
                    </el-col>
                    <el-col :span="12">
                        <div class="chart-wrapper chart-time">
                            <div class="chart-btns clearfix">
                                <div :class="{'chart-btn': true, 'hide': !!item.timeVisible}"
                                     v-for="(item, index) in testHead"
                                     :key="index"
                                     @click="TimeVisibleLine(item)"
                                     :style="{color: chartBtnColor[index]}">
                                    <div class="chart-btn-icon"
                                         :style="{backgroundColor: chartBtnColor[index]}"></div>
                                    实测{{index + 1}}
                                </div>
                            </div>
                            <v-chart :options="FVCTime"
                                     :autoresize="true"
                                     ref="fvcChartTime"
                                     :manualUpdate="false"></v-chart>
                        </div>
                    </el-col>
                </el-col>
                <el-col :span="24"
                        class="evaluate"
                        v-show="showDiagnosis == page">
                    <el-col :span="14"
                            class="text-left">
                        <div class="evaluate-title">结果分析：</div>
                        <div class="remarkText"
                             v-html="remarkText || ''"></div>
                    </el-col>
                    <el-col :span="10"
                            class="autograph text-left">
                        <el-col :span="12">操作者：</el-col>
                        <el-col :span="12">审核：</el-col>
                        <el-col :span="24"
                                class="tip">注：本报告仅供临床参考</el-col>
                    </el-col>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import Config from '@modules/chartConfig'
import patientService from '@services/patientService'
import chartService from '@services/chartService'
import configService from '@services/configService'
import usbService from '@services/usbService'
import Popup from '@modules/Popup'
import Utils from '@modules/Utils'
const { ipcRenderer } = require('electron')

export default {
    name: 'BronchusPrinting',
    components: {},
    data() {
        return {
            id: this.$route.query.id,
            fvcReportId: this.$route.query.fvcReportId,
            buildTime: this.$route.query.buildTime,
            reportType: this.$route.query.reportType || {},
            isReport: this.$route.query.isReport || false,
            exportFileStatus: true,
            downloadPdfBtn: false,
            polar: chartService.getConfig('bronchusChart'),
            FVCTime: chartService.getConfig('bronchusTime'),
            testDetail: [],
            tipList: [],
            testList: [],
            testHead: [],
            templateList: [],
            detail: {},
            testData: {},
            estimated: {},
            templateCode: 'DiastolicReport',
            showDiagnosis: 1,
            showChart: 1,
            page: 1,
            magnification: 1,
            totalPage: 1,
            chartBtnColor: chartService.getColor(),
            imei: '',
            preValue: '',
            remarks: '',
            assessName: '',
            bmi: '',
            templateData: '',
            dialogFormVisible: false,
            reportPage: this.$route.query.page || 1,
            reportSearch: this.$route.query.search || '',
            reportCurrentTime: this.$route.query.currentTime || ''
        }
    },
    created() {
        this.id && Popup.showLoading('数据加载中...')
        this.id && this.getPatient(this.id)
        this.id && this.findPreValueCoordinate(this.id)
        this.updateReportTemplate()
        this.doctorTips()
        ipcRenderer.on('selected-directory', (event, path) => {
            ipcRenderer.send('print-to-pdf', path)
        })
        ipcRenderer.on('wrote-pdf', (event, data) => {
            Popup.showToast.Success('报告下载成功！', {showClose: true, duration: 1200})
        })
        // this.uploadTime && this.getPatientTest(this.id, this.uploadTime)
        // this.fvcReportId && this.getPatientTest(this.fvcReportId)
    },
    methods: {
        removeAllListeners() {
            // 移除监听
            ipcRenderer.removeAllListeners('wrote-pdf')
            ipcRenderer.removeAllListeners('selected-directory')
        },
        // 报告模板列表
        updateReportTemplate(page, limit) {
            let _data = {
                pageSize: limit || 10000,
                pageNumber: page || 1
            }
            patientService.reportTemplate(_data).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                let list = data.object && data.object.reportTemplates || []
                for (let i in list) {
                    if (list[i].templateCode == this.templateCode) {
                        this.templateData = list[i]
                        break
                    }
                }
                this.templateList = list
                this.templateData && this.fvcReportId && this.getPatientTest(this.fvcReportId, this.templateData.templateCode)
            }, error => {
                Popup.hideLoading()
                patientService.NetWorkFail()
            })
        },
        // 患者详情
        getPatient(id) {
            patientService.getPatient(id).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.detail = data.object || {}
            }, patientService.NetWorkFail)
        },
        // 患者测试详情
        getPatientTest(id, templateCode) {
            this.loading = true
            patientService.findDiastolicReport(id, templateCode, this.isReport).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    patientService.Warning(data['code'], data['msg'])
                    return data
                }
                let _object = data.object || {}
                this.testList = _object.fvc || []
                this.testData = _object
                this.testDetail = _object.table || []
                this.testHead = _object._testHead || []
                let VTGraps = chartService.setFvcTime(_object._chartTime || [], this.preValue.FVC || 0)
                let chartData = chartService.setFvcConfig(_object._chart || [])

                // 清除图表
                this.$refs.fvcChart.clear()
                this.$refs.fvcChartTime.clear()

                this.setBMI()

                 // 显示隐藏图表按钮
                let testLegend = []
                for (let i in this.testHead) {
                    testLegend.push(this.testHead[i].name)
                    chartData.speed[i].name = this.testHead[i].name
                    VTGraps[i].name = this.testHead[i].name
                }
                // 预计值线
                let _chartConfig = {
                    data: [],
                    id: 0,
                    lineStyle: {
                        width: 1
                    },
                    smooth: true,
                    symbol: 'none',
                    type: 'line',
                    color: '#000000'
                }

                // 预计值线
                setTimeout(() => {
                    let chartTp = Utils.extend(true, _chartConfig, {})
                    chartTp.id = Utils.size(chartData.speed) + 1
                    chartTp.data = this.estimated && patientService.filterEstimated(this.estimated) || []
                    !!Utils.size(chartTp) && chartData.speed.push(chartTp)
                    this.polar.series = chartData.speed
                    this.FVCTime.series = VTGraps
                }, 100);
                this.remarks = _object.doctorDiagnosis || ''
                this.setPage(Utils.size(_object._table))
            }, patientService.NetWorkFail).finally(() => {
                setTimeout(() => {
                    this.loading = false
                    Popup.hideLoading()
                }, 200)
            })
        },
          // 图表预计值
        findPreValueCoordinate(id) {
            patientService.findPreValueCoordinate(id).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.estimated = data.object && data.object.preValue && data.object.preValue.preWave || []
                this.preValue = data.object && data.object.preValue || {}
            }, patientService.NetWorkFail)
        },
        // 医生提示语句
        doctorTips() {
            patientService.doctorTips().then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                this.tipList = data.object && data.object.autoAssesss || []
            }, patientService.NetWorkFail)
        },
        // FVC显示隐藏图标数据线条
        FVCVisibleLine(scope) {
            let name = scope.name
            this.$refs.fvcChart.dispatchAction({
                name: name,
                type: scope.visible ? 'legendSelect' : 'legendUnSelect'
            })
            this.$set(scope, 'visible', !scope.visible)
        },
        // TIME显示隐藏图标数据线条
        TimeVisibleLine(scope) {
            let name = scope.name
            this.$refs.fvcChartTime.dispatchAction({
                name: name,
                type: scope.timeVisible ? 'legendSelect' : 'legendUnSelect'
            })
            this.$set(scope, 'timeVisible', !scope.timeVisible)
        },
        assessChange(tips) {
            for (let i in tips) {
                if (this.remarks.indexOf(tips[i]) == -1) {
                    if (this.remarks) {
                        this.remarks += '\n' + tips[i]
                    } else {
                        this.remarks += tips[i]
                    }
                }
            }
            // this.assessName = ''
        },
        // 切换模板
        handleTemplateChange(val) {
            this.removeAllListeners()
            if (val == 'SpiroBasic') {
                this.$router.replace({ name: 'Printing', query: { id: this.id, fvcReportId: this.fvcReportId, buildTime: this.buildTime } })
            } else if (val == 'SpiroALL') {
                this.$router.replace({ name: 'RoutinePrinting', query: { id: this.id, fvcReportId: this.fvcReportId, buildTime: this.buildTime } })
            }
        },
        // 导出
        exportFile() {
            this.exportFileStatus = false
            patientService.buildFVCReport(this.fvcReportId, this.templateData.templateCode).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    patientService.Warning(data['code'], data['msg'])
                    return data
                }
                Popup.showToast.Success('报告生成成功！', {showClose: true, duration: 1200})
            }, patientService.NetWorkFail).finally(() => {
                setTimeout(() => {
                    this.exportFileStatus = true
                }, 200)
            })
        },
        downloadPdf() {
            this.nowTime = Utils.getTime()
            ipcRenderer.send('open-file-dialog', [this.testData.patientName + '_' + this.testData.patientClinicNum + '_' + this.nowTime])
        },
        // 目前只做两页
        setPage(lenght) {
            if (lenght <= 20) {
                this.totalPage = 1
            } else if (lenght > 20 && lenght <= 1000) {
                this.totalPage = 2
                this.showDiagnosis = 2
            } else {
                this.totalPage = 2
                this.showChart = 2
                this.showDiagnosis = 2
            }
        },
        // 上一页
        handleLastPage() {
            this.page -= 1
        },
        // 下一页
        handleNextPage() {
            this.page += 1
        },
        // 打印
        openPrint() {
            window.print()
        },
        timeChange(data) {
            if (data) {
                let birthday = Utils.formatStringTime(data) / 1000
                let time = parseInt(Utils.getTime() / 1000) - birthday;
                let ageTime = 24 * 60 * 60 * 365;
                return parseInt(time / ageTime);
            } else {
                return 0;
            }
        },
        handleEnlarge() {
            this.$refs.content.style.transform = `scale(${(this.magnification += 0.05).toFixed(2)})`
        },
        handleNarrow() {
            this.$refs.content.style.transform = `scale(${(this.magnification -= 0.05).toFixed(2)})`
        },
        upDateRemarks() {
            let _config = {
                gradeId: this.fvcReportId,
                doctorDiagnosis: this.remarks || ''
            }
            patientService.upDateValuation(_config).then(data => {
                data || (data = {})
                if (data['code'] != patientService.STATUS_SUCCESS) {
                    return patientService.Warning(data['code'], data['msg'])
                }
                Popup.showToast.Success('保存成功！')
                this.dialogFormVisible = false
            })
            //     this.remarkText = this.remarks
            // }, patientService.NetWorkFail)
        },
        setBMI() {
            if (this.testData.patientHeight && this.testData.patientWeight) {
                this.bmi = parseInt(this.testData.patientWeight / (this.testData.patientHeight * this.testData.patientHeight / 10000))
            }
        },
        returnPage(){
            this.removeAllListeners()
            if (this.isReport) {
                this.$router.replace({ name: 'Report', query: { page: this.reportPage, search: this.reportSearch, currentTime: this.reportCurrentTime } })
            } else {
                this.$router.go(-1);
            }
        }
    },
    computed: {
        options() {
            return this.polar
        },
        remarkText() {
            return this.remarks.replace(/\n/g, '；')
        }
    }
};
</script>
<style>
.Bronchus {color: #333;margin: 0 auto;background-color: #c3c3c3;padding:0 0 15px 0}
.Bronchus .el-table{padding-bottom: 15px;color: #323232;}
.Bronchus .el-table td,.Bronchus .el-table th.is-leaf{border: 0;}
.Bronchus .el-table .cell{white-space: nowrap;text-overflow: initial;overflow: visible;padding:0 3px;}
.Bronchus .el-table th.is-leaf{color: #323232;font-weight: bold}
.Bronchus .btn-list{background-color: #e3e9f3;border-bottom: 1px solid #e2e2e2;z-index: 10;position: relative;left: 0;right: 0;top: 0;padding: 10px 10px;margin-bottom: 15px}
.Bronchus .btn-list .el-button{padding: 8px 20px;font-size: 14px}
.Bronchus .content{transition: .3s;text-align: center;background-color: #fff;padding:30px 40px 30px 40px; width: 870px;margin: 0px auto 0 auto;}
.Bronchus .content .info{font-size: 15px;text-align: left;margin-top: 5px;color: #323232;border-bottom: 1px solid #999}
.Bronchus .content .info .info-text .lable{min-width: 68px;display: inline-block;}
.Bronchus .content .info .info-text{float: left;margin-bottom: 5px;width: 25%;}
.Bronchus .content .title{font-size: 21px;margin-bottom: 5px}
.Bronchus .content .time{font-size: 14px;margin-bottom: 10px;text-align: right;}
.Bronchus .table-info {margin-top: 15px;}
.Bronchus .el-select {display: block;margin-bottom: 10px}
.Bronchus .chart{margin-top: 10px;}
.Bronchus .chart {padding-right: 50px}
.Bronchus .chart .echarts{height: 500px;position: relative;background-color: #fff;}
.Bronchus .chart-time .echarts{height: 280px;position: relative;background-color: #fff;}
.Bronchus .evaluate{font-size: 16px}
.Bronchus .evaluate .evaluate-title{margin-bottom: 10px;}
.Bronchus .evaluate .autograph{padding-top: 110px;}
.Bronchus .evaluate .autograph .tip{padding-top: 15px;}
.Bronchus .evaluate .remarkText{padding-right: 30px;}
.Bronchus .el-table::before {background-color: #eee}
.Bronchus .el-table th{background-color: #fff!important}
.Bronchus .el-table--small td,.Bronchus .el-table--small th{padding: 2px 0;}
.Bronchus .el-table td .cell{line-height: 17px;}
.Bronchus .chart-wrapper{position: relative;}
.Bronchus .chart-btns{position: absolute;right: 0px;top: 30px;z-index: 1;}
.Bronchus .chart-btn{font-size: 12px;position: relative;padding: 0 15px;float: left;cursor: pointer;}
.Bronchus .chart-btn.hide{opacity: 0.6;}
.Bronchus .chart-btn .chart-btn-icon{position: absolute;left: 0;top: 4px;width: 10px;height: 10px;border-radius: 50%;background-color: #333;}
.Bronchus .dialog-footer{margin-top: 20px}
.Bronchus .template{position: relative;display: inline-block;width: 140px;margin: 0 10px}
.Bronchus .template .icon-btn{position: absolute;left: 15px;z-index: 10;top: 10px;}
.Bronchus .template .el-input__inner{padding: 0 15px 0 30px;height: 32px;}
.Bronchus .template .el-select__caret{line-height: 32px;}
.Bronchus .el-table .cell,.Bronchus .el-table th div{padding: 0 5px;font-size: 15px}
@media print {
    .noPrn {display: none}
    .Bronchus .content{padding:20px 0px 40px 0px;width:920px;}
}
</style>

