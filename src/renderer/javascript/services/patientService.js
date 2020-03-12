import BaseService from '@services/baseService'
import Utils from '@modules/Utils'

class PatientService extends BaseService {
    /***
     * 患者列表
     * @param config
     * @constructor
     */
    getPatients(config = {}) {
        // return this.httpClient.post('api.client.patient.findPatientPage', _config)
        return this.httpClientJson.post('api.patient.list', config)
    }

    /***
     * 患者详情
     * @param id 患者ID
     * @constructor
     */
    getPatient(id) {
        // return this.httpClient.post('api.client.patient.getPatientInfo', {
        return this.httpClientJson.post('api.patient.info', {
            patientId: id
        })
    }

    /**
     * 查询患者报告列表
     * @param config
     */
    findReportPage(config = {}) {
        config['pageSize'] = config['pageSize'] || this.NORMAL_LIMIT
        config['currPage'] = config['currPage'] || this.NORMAL_PAGE
        let _config = Utils.toJson(config)
        return this.httpClientJson.post('api.report.list', _config)
    }

    /**
     * 下载患者报告
     */
    reportUrl(id) {
        return this.httpClient.post('api.report.reportUrl', {
            reportId: id
        })
    }

    /**
     * 查看患者报告
     * @param config
     */
    pdfView(id) {
        return this.httpClient.post('api.report.pdfView', {
            reportId: id
        })
    }

    /**
     * 预约获取用户信息
     */
    getHisInfo(_config) {
        return this.httpClientJson.post('api.reservation.getHisInfo', _config)
    }

    /**
     * 预约获取用户信息时间段
     */
    reservationInfo(config = {}) {
        let _config = Utils.toJson(config)
        return this.httpClientJson.post('api.reservationApply.list', _config)
    }

    /**
     * 9.3.保存预约申请单信息
     */
    reservationSave(config) {
        let _config = Utils.toJson(config)
        return this.httpClientJson.post('api.reservation.save', _config)
    }

    /**
     * 获取表单信息
     */
    reservationApplyForm(config) {
        let _config = Utils.toJson(config)
        return this.httpClientJson.post('api.reservationApply.getView', _config)
    }

    /**
     * 获取用户预约历史
     * @param {*} config
     */
    getReservationList(config) {
        let _config = Utils.toJson(config)
        return this.httpClientJson.post('api.reservationApply.pageList', _config)
    }

    /**
     * 9.2.查询指定月份每天预约人数
     * @param {*} config
     */
    getDateNumberList(config) {
        let _config = Utils.toJson(config)
        return this.httpClientJson.post('api.reservationApply.getDailyReservationApplyNumber', _config)
    }

    /**
     * 获取配置文件输入的是申请号还是hisId
     */
    getAppointment(config) {
        return this.httpClientJson.post('api.reservation.appointment', config)
    }

    /**
     * 获取身高体重
=    */
    getMeasure(config) {
        return this.httpClientJson.post('api.reservation.measure', config)
    }

    /**
     * 获取设备列表
     */
    deviceListAll(config = {}) {
        return this.httpClientJson.post('api.device.listAll', config)
    }

    /**
     * 获取报告类型
     */
    reservationType(config = {}) {
        return this.httpClientJson.post('api.reporttemplate.reservationType', config)
    }

    /**
     * 获取报告类型
     */
    findByDevice(config = {}) {
        return this.httpClientJson.post('api.reporttemplate.findByDevice', config)
    }

    /**
     * 查询患者类型 门诊/住院 等
     */
    findPatientTypeList(config = {}) {
        return this.httpClientJson.post('api.reportpatientpara.patientType', config)
    }

    /**
     * 获取连接状态
     */
    connect(config = {}) {
        return this.httpClientJson.post('api.sysConfig.connect', config)
    }

    /**
     * 取消预约
     */
    cancelApplyFun(config = {}) {
        return this.httpClientJson.post('api.reservationApply.cancel', config)
    }

    /***
     * 排序数据
     * @param 预计值数据
     * @constructor
     */
    filterEstimated(data) {
        var sortedObjKeys = Object.keys(data).sort()
        let arrData = []
        for (var index in sortedObjKeys) {
            arrData.push(data[sortedObjKeys[index]]);
        }
        return arrData
    }

    /***
     * 获取年龄
     * @param data 时间戳
     * @return number
     */
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

export default new PatientService()
