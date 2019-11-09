<template>
    <div class="printing clearfix">
        <div class="noPrn">
            <!-- <site-head showTitle="打印结果预览"></site-head> -->
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
                <el-button @click="returnPage">
                    <i class="icon-btn icon-stop"></i>
                    返回
                </el-button>
            </div>
        </div>
        <div class="content">
            <div class="title">
                <div class="barcode" id="div128"></div>
                <h3 v-text="tableData.hospitalName">-</h3>
                <span>{{tableData.checkProject == 0 ? '常规肺功能' : '激发试验'}}检查单</span>
                <span class="time">打印日期： {{nowTime}}</span>
            </div>
            <div class="print-table">
                <table>
                    <tr><th>HIS ID:</th><td v-text="tableData.hisId"></td><th>住院号：</th><td v-text="tableData.clinicNum"></td><th>申请号：</th><td v-text="tableData.reservationNumber"></td></tr>
                    <tr><th>患者ID：</th><td v-text="tableData.id"></td><th>姓名：</th><td v-text="tableData.name"></td><th>性别：</th><td v-text="tableData.gender == '0' ? '男' : '女'"></td></tr>
                    <tr><th>体重：</th><td><span v-text="tableData.weight"></span> kg</td><th>身高：</th><td><span v-text="tableData.height"></span> cm</td><th>BMI：</th><td v-text="bmi"></td></tr>
                    <tr><th>出生日期：</th><td v-text="tableData.birthday"></td><th>年龄：</th><td><span v-text="age"></span> 岁</td><th>电话：</th><td v-text="tableData.mobile"></td></tr>
                    <tr><th>职业：</th><td v-text="tableData.job"></td><th>吸烟史：</th><td><span v-text="tableData.smokingHistory"></span> 年</td><th>吸烟量：</th><td><span v-text="tableData.smokingVolume"></span> 支/天</td></tr>
                    <tr><th>已戒烟：</th><td><span v-text="tableData.quitSmoking"></span> 年</td><th>既往史：</th><td></td><th>检查时间：</th><td v-text="tableData.applyDate"></td></tr>
                    <tr><th>检查项目：</th><td>{{tableData.checkProject == 0 ? '常规肺功能' : '激发试验'}}</td><th>籍贯：</th><td colspan="3" v-text="tableData.address"></td></tr>
                    <tr><th>备注：</th><td colspan="5"></td></tr>
                    <tr><td colspan="6" style="height: 750px;"></td></tr>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import commonService from '@services/commonService'
import patientService from '@services/patientService'
import Popup from '@modules/Popup'
import Utils from '@modules/Utils'
    // if (!exports)
    var exports = window;
      var BARS = [212222, 222122, 222221, 121223, 121322, 131222, 122213, 122312, 132212, 221213, 221312, 231212, 112232, 122132, 122231, 113222, 123122, 123221, 223211, 221132, 221231, 213212, 223112, 312131, 311222, 321122, 321221, 312212, 322112, 322211, 212123, 212321, 232121, 111323, 131123, 131321, 112313, 132113, 132311, 211313, 231113, 231311, 112133, 112331, 132131, 113123, 113321, 133121, 313121, 211331, 231131, 213113, 213311, 213131, 311123, 311321, 331121, 312113, 312311, 332111, 314111, 221411, 431111, 111224, 111422, 121124, 121421, 141122, 141221, 112214, 112412, 122114, 122411, 142112, 142211, 241211, 221114, 413111, 241112, 134111, 111242, 121142, 121241, 114212, 124112, 124211, 411212, 421112, 421211, 212141, 214121, 412121, 111143, 111341, 131141, 114113, 114311, 411113, 411311, 113141, 114131, 311141, 411131, 211412, 211214, 211232, 23311120],
      START_BASE = 38,
      STOP = 106
    function code128(code, barcodeType) {
        if (arguments.length < 2) {
            barcodeType = code128Detect(code);
        }
        if (barcodeType == 'C' && code.length % 2 == 1) {
            code = '0' + code;
        }
        var a = parseBarcode(code, barcodeType);
        return bar2html(a.join('')) + '<label>' + code + '</label>';
    }
    function bar2html(s) {
        for (var pos = 0, sb = []; pos < s.length; pos += 2) {
            sb.push('<div class="bar' + s.charAt(pos) + ' space' + s.charAt(pos + 1) + '"></div>');
        }
        return sb.join('');
    }
    function code128Detect(code) {
        if (/^[0-9]+$/.test(code)) return 'C';
        if (/[a-z]/.test(code)) return 'B';
        return 'A';
    }
    function parseBarcode(barcode, barcodeType) {
        var bars = [];
        bars.add = function(nr) {
            var nrCode = BARS[nr];
            this.check = this.length == 0 ? nr : this.check + nr * this.length;
            this.push(nrCode || ('UNDEFINED: ' + nr + '->' + nrCode));
        };
        bars.add(START_BASE + barcodeType.charCodeAt(0));
        for (var i = 0; i < barcode.length; i++) {
            var code = barcodeType == 'C' ? +barcode.substr(i++, 2) : barcode.charCodeAt(i);
            var converted = fromType[barcodeType](code);
        if (isNaN(converted) || converted < 0 || converted > 106) throw new Error('Unrecognized character (' + code + ') at position ' + i + ' in code "' + barcode + '".')
            bars.add(converted);
        }
        bars.push(BARS[bars.check % 103], BARS[STOP]);
        return bars;
    }
    var fromType = {
      A: function(charCode) {
          if (charCode >= 0 && charCode < 32) return charCode + 64;
          if (charCode >= 32 && charCode < 96) return charCode - 32;
          return charCode;
      },
      B: function(charCode) {
          if (charCode >= 32 && charCode < 128) return charCode - 32;
          return charCode;
      },
      C: function(charCode) {
          return charCode;
      }
    };
    // --| Export
    exports.code128 = code128;
export default {
    name: 'Printing',
    props: {
        printID: Number
    },
    data() {
        return {
            // applyId: this.$route.query.applyId,
            magnification: 1,
            testData: {},
            tableData: {
                hospitalName: '',
                address: '',
                applyDate: '',
                birthday: '',
                checkProject: '',
                clinicNum: '',
                gender: '',
                height: '',
                hisId: '',
                id: '',
                job: '',
                mobile: '',
                name: '',
                quitSmoking: '',
                reservationNumber: '',
                smokingHistory: '',
                smokingVolume: '',
                weight: ''
            },
            age: '',
            bmi: '',
            nowTime: '',
            value: this.printID
        }
    },
    created() {
        // this.id && Popup.showLoading('数据加载中...')
        // this.reservationApplyFun()
        this.nowTime = Utils.formatTime(Utils.getTime())
    },
    methods: {
        // 获取报告数据
        reservationApplyFun(val) {
            let _data = {
                applyId: val
            }
            patientService.reservationApplyForm(_data).then(data => {
                data || (data = {})
                if (data['code'] != commonService.STATUS_SUCCESS) {
                    commonService.Warning(data['code'], data['msg'])
                    return data
                }
                this.tableData = data.object
                this.age = this.timeChange(this.tableData.birthday)
                this.setBMI()
                document.getElementById('div128').innerHTML = code128(this.tableData.reservationNumber, 'B');
            }, error => {
                Popup.hideLoading()
                patientService.NetWorkFail()
            })
        },
        // 打印
        openPrint() {
            window.print()
        },
        // 放大
        handleEnlarge() {
            this.$refs.content.style.transform = `scale(${(this.magnification += 0.05).toFixed(2)})`
        },
        // 缩小
        handleNarrow() {
            this.$refs.content.style.transform = `scale(${(this.magnification -= 0.05).toFixed(2)})`
        },
        // 返回上一页
        returnPage(){
            this.$emit('close', true)
        },
        // 计算 BMI
        setBMI() {
            if (this.tableData.height && this.tableData.weight) {
                this.bmi = parseInt(this.tableData.weight / (this.tableData.height * this.tableData.height / 10000))
            }
        },
        // 计算年龄
        timeChange(data) {
            if (data) {
                let birthday = Utils.formatStringTime(data) / 1000
                let time = parseInt(Utils.getTime() / 1000) - birthday;
                let ageTime = 24 * 60 * 60 * 365;
                return parseInt(time / ageTime);
            } else {
                return 0;
            }
        }
    }
};
</script>
<style>
.printing {color: #333;margin: 0 auto;background-color: #c3c3c3;padding:0 0 15px 0}
.printing .el-table{padding-bottom: 15px;color: #323232;}
.printing .el-table td,.printing .el-table th.is-leaf{border: 0;}
.printing .el-table .cell{white-space: nowrap;text-overflow: initial;overflow: visible;padding:0 3px;}
.printing .el-table th.is-leaf{color: #323232;font-weight: bold}
.printing .btn-list{background-color: #e3e9f3;border-bottom: 1px solid #e2e2e2;z-index: 10;position: relative;left: 0;right: 0;top: 0;padding: 10px 10px;margin-bottom: 15px}
.printing .btn-list .el-button{padding: 8px 20px;font-size: 14px}
.printing .content{transition: .3s;text-align: center;background-color: #fff;padding:50px 40px 30px 40px; width: 870px; margin: 0px auto 0 auto;}
.printing .content .info{font-size: 15px;text-align: left;margin-top: 5px;color: #323232;border-bottom: 1px solid #999}
.printing .content .info .info-text .lable{min-width: 68px;display: inline-block;}
.printing .content .info .info-text{float: left;margin-bottom: 5px;width: 25%;}
.printing .content .title{font-size: 21px;margin-bottom: 20px;}
.printing .content .time{font-size: 14px;margin-bottom: 10px;text-align: right;}
.printing .table-info {margin-top: 15px;}
.printing .el-select {display: block;margin-bottom: 10px}
.printing .content .title{position: relative; text-align: center; }
.printing .content .title h3{font-size: 24px;color: #333;margin-bottom: 10px;height: 31px;}
.printing .content .title span{font-size: 20px;}
.printing .content .title .time{position: absolute; right: 0; bottom: 0; font-size: 14px;color: #333;margin-bottom: 0;}
.printing .content .title .barcode{position: absolute;left: 0;}
.printing .content table{width: 100%; border-collapse: collapse; font-size: 14px;border: 2px solid #333;}
.printing .content table td{text-align: center; width: 172px;}
.printing .content table th{width: 90px;}
.printing .content table th, .printing .content table td{border: 1px solid #333;padding: 10px 6px;color: #000;}
@media print {
    .noPrn {display: none}
    .printing .content{padding:40px 0px 40px 0px;width:920px;}
}
.barcode {
 float:left;
 clear:both;
 padding: 0 10px; /*quiet zone*/
 overflow:auto;
 height:0.5in; /*size*/
}
.right { float:right; }
.barcode + * { clear:both; }
.barcode div {
 float:left;
 height: 0.35in; /*size*/
}
.barcode .bar1 { border-left:1px solid black; }
.barcode .bar2 { border-left:2px solid black; }
.barcode .bar3 { border-left:3px solid black; }
.barcode .bar4 { border-left:4px solid black; }
.barcode .space0 { margin-right:0 }
.barcode .space1 { margin-right:1px }
.barcode .space2 { margin-right:2px }
.barcode .space3 { margin-right:3px }
.barcode .space4 { margin-right:4px }
.barcode label {
 clear:both;
 display:block;
 text-align:center;
 font: 0.125in/100% helvetica; /*size*/
}
/*** bigger ******************************************/
.barcode2 {
 float:left;
 clear:both;
 padding: 0 10px; /*quiet zone*/
 overflow:auto;
 height:1in; /*size*/
}
.barcode2 + * { clear:both; }
.barcode2 div {
 float:left;
 height: 50px; /*size*/
}
.barcode2 .bar1 { border-left:2px solid black; }
.barcode2 .bar2 { border-left:4px solid black; }
.barcode2 .bar3 { border-left:6px solid black; }
.barcode2 .bar4 { border-left:8px solid black; }
.barcode2 .space0 { margin-right:0 }
.barcode2 .space1 { margin-right:2px }
.barcode2 .space2 { margin-right:4px }
.barcode2 .space3 { margin-right:6px }
.barcode2 .space4 { margin-right:8px }
.barcode2 label {
 clear:both;
 display:block;
 text-align:center;
 font-size: 16px;
}
</style>

