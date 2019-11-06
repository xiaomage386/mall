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

    /***
     * 增加、修改患者
     * @param config
     * @constructor
     */
    setPatient(config = {}) {
        let _config = {
            addOrUpdateJson: Utils.toJson(config)
        }
        return this.httpClient.post('api.client.patient.addOrUpdatePatient', _config)
    }

    /***
     * 删除患者
     * @param config
     * @constructor
     */
    delPatient(id) {
        let _config = Utils.toJson({
            patientIds: id
        })
        return this.httpClient.post('api.client.patient.deletePatient', _config)
    }

    /***
     * 患者测试列表（FVC报告）
     * @param config
     * @constructor
     */
    getFVCReports(config = {}) {
        config['pageSize'] = config['pageSize'] || this.NORMAL_LIMIT
        config['pageNumber'] = config['pageNumber'] || this.NORMAL_PAGE
        let _config = {
            conditionJson: Utils.toJson(config)
        }
        return this.httpClient.post('api.client.fvcReport.findFVCReportPage', _config)
    }

    /***
     * 获取 svc 潮气基线
     * @param
     */
    getSvcVtBaseline(config = {}) {
        return this.httpClientJson.post('api.client.svcActual.getSvcVtBaseline', config)
    }

    /***
     * 上传MVV患者测试数据
     * @param config [obj]
     * @constructor
     */
    addMVVTest(config = {}) {
        let _config = {
            uploadData: Utils.toJson(config)
        }
        return this.httpClient.post('api.client.mvvActual.addMVVActual', _config)
    }

    /***
     * 上传SVC患者测试数据
     * @param config [obj]
     * @constructor
     */
    addSVCTest(config = {}) {
        let _config = {
            uploadData: Utils.toJson(config)
        }
        return this.httpClient.post('api.client.svcActual.addSVCActual', _config)
    }

    /***
     * 上传FVC患者测试报告(FVC报告)
     * @param config [obj]
     * @constructor
     */
    buildFVCReport(id, templateCode) {
        let _config = {
            gradeId: id,
            reportType: templateCode
        }
        return this.httpClient.post('api.client.fvcReport.buildFVCReport', _config)
    }

    /***
     * 上传FVC患者测试报告(FVC报告)
     * @param patientId [id]
     * @constructor
     */
    findPreValueCoordinate(patientId) {
        return this.httpClient.post('api.client.medicationGrade.findPreValueCoordinate', {
            patientId: patientId
        })
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
