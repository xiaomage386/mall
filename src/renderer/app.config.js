/**
 * Created by terry.chen on 2019/03/11
 * Name : app.config.js
 * Version : v0.1
 * Copyright (c) 2019 Terry.Chen
 */
import localStorage from '@modules/localStorage'
const CONFIG = {};
const {name, version} = require('@/../../package.json')

// 项目参数
CONFIG['NAME'] = name || 'creakerReserve';
CONFIG['Version'] = version || '1.0.0';

// 服务器配置名称
const SERVICE_TYPE = CONFIG['NAME'] + '_SERVICE_TYPE';

// 运行环境配置
CONFIG['DEPLOY'] = true;
CONFIG['DEBUG'] = !CONFIG['DEPLOY'];

/* CONFIG['LOCAL_ADDRESS'] = 'http://127.0.0.1/';
CONFIG['REMOTE_ADDRESS'] = 'http://www.creaker.net/';
 */
CONFIG['HOST'] = localStorage.getObject(SERVICE_TYPE) == 1 ? CONFIG['LOCAL_ADDRESS'] : CONFIG['REMOTE_ADDRESS'];
CONFIG['HOST'] = 'http://192.168.3.84:10241/';
CONFIG['DOMAIN'] = 'creaker.net';
CONFIG['APP_RUNTIME'] = 'webapp'
CONFIG['RUNTIME'] = 'creaker';
CONFIG['SERVER'] = CONFIG['HOST'] + CONFIG['RUNTIME'];
CONFIG['LOCAL_SERVER'] = CONFIG['LOCAL_ADDRESS'] + CONFIG['RUNTIME'];
CONFIG['WS_SERVER'] = 'ws://127.0.0.1:10241/' + CONFIG['RUNTIME'] + '/websocket/';
CONFIG['SERVER_RUNTIME'] = '';

// 客户端配置
CONFIG['DESKTOP_CLIENT'] = {
    ID: 'pwd_desktop',
    // SERCET: '14152452CFC2E9B9CB625C1CD926DF78'
    SERCET: 'D044746E5DFA0A9587A056BE9FA58DCB39E10F0B0D92F8C06A84785518126A3C089F7CB097B66EE2'
};

// USB设备配置
CONFIG['AX_USB_CONFIG'] = {
    VID: 1155,
    PID: 41221
};

// HTTP_CLIENT配置
CONFIG['HTTP_CLIENT'] = {
    // 是否默认需要登录
    LOGIN: true,
    // 默认请求类型
    METHOD: 'GET',
    // 重试次数
    RETRY: 1,
    // 重试时间间隔
    RETRY_TIME: 1000,
    // 当接口过期后，是否重新登录后重新发起请求（谨慎修改，需配合处理页面缓存问题）
    RE_ENTRY_SEND: false,
    // 接口状态：正常
    STATUS_SUCCESS: 0,
    // 权限过期判断参数
    AUTH_TIMEOUT_FIELD: 'code',
    // 权限过期判读状态码
    AUTH_TIMEOUT_CODE: 40104,
    // 权限过期全局通知事件
	AUTH_TIMEOUT_EVENT: 'auth_timeout',
    // 登录成功通知事件
	AUTH_LOGIN_EVENT: 'auth_login',
    LOADING: '加载中...',
    AJAX_TOKEN: 'token',

    // SERVER CONFIG
    SERVER: CONFIG.SERVER,
    RUNTIME: CONFIG.RUNTIME,
    SERVER_RUNTIME: '',
    WS_SERVER: CONFIG.WS_SERVER,
    LOCAL_SERVER: CONFIG.LOCAL_SERVER,
    VAR_MODULE: 'm',
    VAR_CONTROLLER: 'c',
    VAR_ACTION: 'a',
    URL_MODEL: '1',
    URL_EXT: '',

    // axios defaults
    axios: {
        method: 'GET',
        baseURL: CONFIG['SERVER'],
        timeout: 80000,
        headers: {
	        'Content-Type': 'application/x-www-form-urlencoded',
            common: {
                client_id: CONFIG.DESKTOP_CLIENT.ID
            }
        }
    }
};

CONFIG['PAGES'] = {
    INIT: 1, // 初始页
    LIMIT: 10, // 每页条数
    MAXLENGTH: 10000 // 最大长度
}
export default CONFIG
