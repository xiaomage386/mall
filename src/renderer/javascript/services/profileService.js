import BaseService from '@services/baseService'
import Utils from '@modules/Utils'

class ProfileService extends BaseService {
    /***
	 * 忘记密码
     * @param username 帐号
	 * @constructor
	 */
    forgetPassword(username) {
        return this.httpClient.post('api.client.doctor.forgetPassword', {username: username}, { login: false })
    }

    /***
	* 修改密码
	* @constructor
    * @param oldPassword [旧密码]  newPassword [新密码]
	*/
    modifyPassword(oldPassword, newPassword) {
        return this.httpClient.post('api.client.doctor.modifyPassword', {oldPassword, newPassword})
    }
}

export default new ProfileService()
