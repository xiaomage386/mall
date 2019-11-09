import BaseService from '@services/baseService'
import Auth from '@modules/Auth'
import Utils from '@modules/Utils'
import Router from '@/router/index'
import APP_CONFIG from '@/app.config'
import $store from '@/store';
import localStorage from '@modules/localStorage'
import REMOTE_CONFIG from '@/../main/config'
const { remote } = require('electron')

const COOKIE_UCENTER = APP_CONFIG['NAME'] + '_USER';
const COOKIE_UID = APP_CONFIG['NAME'] + '_UID';

// 原生窗口信息
const currentWindow = remote.getCurrentWindow();
const WIN_CONFIG = REMOTE_CONFIG['BrowserWindow'];

// 获取服务器信息
// SERVICE_TYPE 1：本地服务器 2：远程服务器
const SERVICE_TYPE = APP_CONFIG['NAME'] + '_SERVICE_TYPE';
let isRemote = localStorage.getObject(SERVICE_TYPE) == 1 ? localStorage.getObject(SERVICE_TYPE) : 2

class CommonService extends BaseService {
    /***
	 * 查看用户资料
	 * @param isRequest
	 * @constructor
	 */
    checkLogin() {
        let checkLoginPromise = this.httpClientJson.post('api.patient.list', {'currPage': 1, 'pageSize': 12}, { login: false });
        checkLoginPromise.then((data = {}) => {
            if (data[this.STATUS_FIELD] != this.STATUS_SUCCESS) {
                this.Authorize();
                return data
            }
            // self.Profile()
        }, (error) => {
            this.Authorize();
            console.log('checkToken Error:', error);
        });
        return checkLoginPromise;
    }

    Login(config = {}) {
        config = Utils.extend({
            client_id: APP_CONFIG.DESKTOP_CLIENT.ID,
            client_secret: APP_CONFIG.DESKTOP_CLIENT.SERCET,
            grant_type: 'password',
            version: 'V1.0'
        }, config);
        let loginPromise = this.httpClient.post('auth2.accessToken', config, { login: false });
        loginPromise.then((data = {}) => {
            if (data[this.STATUS_FIELD] == this.STATUS_SUCCESS) {
                let _data = data['object'] || {}
                let accessToken = 'Bearer ' + (_data['access_token'] || '');
                this.updateToken(accessToken)
                Auth.setUser(_data)
                setTimeout(Auth.trggerLogin, 100)
            }
        });
        return loginPromise;
    }

    // 登录远程时同时传递账号到本地
    LocalLogin(config = {}) {
        config = Utils.extend({
            client_id: APP_CONFIG.DESKTOP_CLIENT.ID,
            client_secret: APP_CONFIG.DESKTOP_CLIENT.SERCET,
            grant_type: 'password',
            version: 'V1.0'
        }, config);
        console.log(isRemote)
        this.httpClient.post('auth2.accessToken', config, { localLogin: isRemote });
    }

    /**
	 * 退出登录
     * @return Promise （resolve）
	 */
    Logout() {
        return Promise.resolve().finally(() => {
            this.httpClient.post('api.client.doctor.logout', {}).finally(() => {
                        // 设置为全屏
                currentWindow.isFullScreen() && currentWindow.setFullScreen(false)
                Auth.Logout()
            });
        });
    }

	/**
	 * 跳转到授权页
	 * @constructor
	 */
    Authorize(text) {
        Auth.Logout();
        let contentSize = currentWindow.getContentSize();
        let winWidth = 600, winHeight = 255;
        currentWindow.setFullScreen(false);
        currentWindow.setResizable(false)
        currentWindow.setMinimumSize(winWidth, winHeight)
        currentWindow.setSize(winWidth, winHeight)
        currentWindow.center();
        Auth.LoginFn(function () {
            // setTimeout(() => {
            //     currentWindow.setResizable(WIN_CONFIG['useContentSize'])
            //     currentWindow.setMinimumSize(WIN_CONFIG['minWidth'], WIN_CONFIG['minHeight'])
            //     // currentWindow.setSize(WIN_CONFIG['width'], WIN_CONFIG['height'])
            //     currentWindow.setFullScreen(true);
            //     currentWindow.center();
            // })
        }, 100)
        Router.push({ name: 'Auth' })
        text && this.Popup.toast.Warning(text)
    }

    /**
     * 更新Ajax携带的token值
     * @param token [string] 指定token值 【默认选填： 读取缓存token值】【当为remove时，删除缓存】
     * @return 最新token
     * */
    updateToken(token = '') {
        if (token === 'remove') {
            console.log('settoken')
            return Auth.setToken('');
        }
        let accessToken = token || Auth.getToken();
        if (accessToken) {
            Auth.setToken(accessToken)
            this.httpClient.defaults({
                headers: {
                    common: {
                        Authorization: accessToken
                    }
                }
            })
            this.httpClientJson.defaults({
                headers: {
                    common: {
                        Authorization: accessToken
                    }
                }
            })
        }
        return accessToken;
    }

    /**
     * 获取详细用户资料
     * @return 请求信息Promise对象
     * */
    Profile () {
        return localStorage.getObject(COOKIE_UCENTER);
    };

    /**
     * 获取选取的用户UID
     * @return 请求信息Promise对象
     * */
    getActiveId () {
        let id = localStorage.getObject(COOKIE_UID)
        return (isNaN(parseInt(id)) ? '' : localStorage.getObject(COOKIE_UID));
    };

    /**
     * 缓存选取的用户UID
     * @param 用户UID
    */

    setActiveId (id) {
        localStorage.set(COOKIE_UID, parseInt(id));
    };

    /**
     * 删除缓存选取的用户UID
    */

   removeActiveId () {
        localStorage.remove(COOKIE_UID);
    };

    /**
     * 用户缓存名称
     */
    COOKIE_UID = COOKIE_UID
}
export default new CommonService()
