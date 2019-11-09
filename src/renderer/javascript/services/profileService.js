import BaseService from '@services/baseService'
import Utils from '@modules/Utils'

class ProfileService extends BaseService {
    /***
	 * 忘记密码
     * @param username 帐号
	 * @constructor
	 */
    forgetPassword(username) {
        return this.httpClientJson.post('api.doctor.forgetPassword', {username: username}, { login: false })
    }

    /***
	* 修改密码
	* @constructor
    * @param oldPassword [旧密码]  newPassword [新密码]
	*/
    modifyPassword(config = {}) {
        let _config = Utils.toJson(config)
        return this.httpClientJson.post('api.doctor.modifyPassword', _config)
    }
}

export default new ProfileService()
