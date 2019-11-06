import BaseService from '@services/baseService'
import Utils from '@modules/Utils'

class ConfigService extends BaseService {
    /***
	 * 预计值列表
	 * @param config
	 * @constructor
	 */
    getCountrys(config = {}) {
        config['pageSize'] = config['pageSize'] || this.NORMAL_LIMIT
        config['pageNumber'] = config['pageNumber'] || this.NORMAL_PAGE
        let _config = {
            conditionJson: Utils.toJson(config)
        }
        return this.httpClient.post('api.client.patientCountry.findPatientCountryPage', _config)
    }

    /***
	 * 修改报告模板
	 * @param pcCode 预计值code
	 * @constructor
	 */
    updatePatientCountry(pcCode) {
        let _config = {
            updateJson: Utils.toJson({
                pcCode: pcCode,
                isDefault: true
            })
        }
        return this.httpClient.post('api.client.patientCountry.updatePatientCountry', _config)
    }

     /***
	 * 医院列表
	 */
    getHospital() {
        return this.httpClient.post('api.client.hospital.findHospitalInfo', {})
    }

     /***
	 * 修改医院信息
     * @param config
	 */
    updateHospital(config = {}) {
        let _config = {
            updateJson: Utils.toJson(config)
        }
        return this.httpClient.post('api.client.hospital.updateHospital', _config)
    }

    /***
	 * 操作者列表
	 * @param config
	 * @constructor
	 */
    getOperators(config = {}) {
        config['pageSize'] = config['pageSize'] || this.NORMAL_LIMIT
        config['pageNumber'] = config['pageNumber'] || this.NORMAL_PAGE
        let _config = {
            conditionJson: Utils.toJson(config)
        }
        return this.httpClient.post('api.client.operator.findOperatorPage', _config)
    }

     /***
	 * 添加操作者
	 * @param code [编码], name [名字], isDefault[是否默认]
	 * @constructor
	 */
    addOperator(name, code, isDefault) {
        let _config = {
            addJson: Utils.toJson({
                name: name,
                code: code,
                isDefault: isDefault
            })
        }
        return this.httpClient.post('api.client.operator.addOperator', _config)
    }

     /***
	 * 修改操作者
	 * @param config
	 * @constructor
	 */
    setOperator(config) {
        let _config = {
            updateJson: Utils.toJson(config)
        }
        return this.httpClient.post('api.client.operator.updateOperator', _config)
    }

    /***
	 * 删除操作者
	 * @param id [操作者ID]
	 * @constructor
	 */
    deleteOperator(id) {
        let _config = {
            deleteJson: Utils.toJson({operatorIds: id})
        }
        return this.httpClient.post('api.client.operator.deleteOperator', _config)
    }

    /***
	 * 科室列表
	 * @param config
	 * @constructor
	 */
    getDepartments(config = {}) {
        config['pageSize'] = config['pageSize'] || this.NORMAL_LIMIT
        config['pageNumber'] = config['pageNumber'] || this.NORMAL_PAGE
        let _config = {
            conditionJson: Utils.toJson(config)
        }
        return this.httpClient.post('api.client.department.findDepartmentPage', _config)
    }

     /***
	 * 添加科室
	 * @param code [编码], name [名字], isDefault[是否默认]
	 * @constructor
	 */
    addDepartment(name, code, isDefault) {
        let _config = {
            addJson: Utils.toJson({
                departmentName: name,
                departmentCode: code,
                isDefault: isDefault
            })
        }
        return this.httpClient.post('api.client.department.addDepartment', _config)
    }

      /***
	 * 修改科室
	 * @param config
	 * @constructor
	 */
    setDepartment(config) {
        let _config = {
            updateJson: Utils.toJson(config)
        }
        return this.httpClient.post('api.client.department.updateDepartment', _config)
    }

     /***
	 * 删除科室
	 * @param id[科室ID]
	 * @constructor
	 */
    deleteDepartment(id) {
        let _config = {
            deleteJson: Utils.toJson({departmentIds: id})
        }
        return this.httpClient.post('api.client.department.deleteDepartment', _config)
    }

     /***
	 * 医生列表
	 * @param config
	 * @constructor
	 */
    getDoctors(config = {}) {
        config['pageSize'] = config['pageSize'] || this.NORMAL_LIMIT
        config['pageNumber'] = config['pageNumber'] || this.NORMAL_PAGE
        let _config = {
            conditionJson: Utils.toJson(config)
        }
        return this.httpClient.post('api.client.doctor.findDoctorPage', _config)
    }

     /***
	 * 添加医生
	 * @param code [编码], name [名字]
	 * @constructor
	 */
    addDoctor(name, code) {
        let _config = {
            addJson: Utils.toJson({
                name: name,
                code: code
            })
        }
        return this.httpClient.post('api.client.doctor.addDoctor', _config)
    }

     /***
	 * 删除医生
	 * @param id[医生ID]
	 * @constructor
	 */
    deleteDoctor(id) {
        let _config = {
            deleteJson: Utils.toJson({doctorIds: id})
        }
        return this.httpClient.post('api.client.doctor.deleteDoctor', _config)
    }
}

export default new ConfigService()
