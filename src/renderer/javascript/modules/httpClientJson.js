/**
 * Created by terry.chen on 2019/03/11
 * Name : httpClientJson
 * Version : v0.1
 * Copyright (c) 2019 Terry.Chen
 */
import axios from 'axios'
import axiosJsonpAdapter from 'axios-jsonp'
import APP_CONFIG from '@/app.config'
import Utils from '@modules/Utils'
import Auth from '@modules/Auth'
import commonService from '@services/commonService'
import localStorage from '@modules/localStorage'

// HTTP_CLIENT配置项
const HTTP_CLIENT = APP_CONFIG['HTTP_CLIENT'];

// Auth time out
const AUTH_TIMEOUT = HTTP_CLIENT['AUTH_TIMEOUT_EVENT'];

// 获取refreshtoken
const COOKIE_UCENTER = APP_CONFIG['NAME'] + '_USER';

// URL 路径后缀
const URL_EXT = HTTP_CLIENT['URL_EXT'] || '';

/**
 * 模拟$q Promise
 * @param Fn
 * @returns {Promise<any>}
 */
let $q = function(Fn){
	return new Promise(Fn);
};
$q.defer = function(){
	var _defer = {};
	_defer.promise = $q(function(resolve, reject){
		_defer.resolve = resolve;
		_defer.reject = reject;
	});
	return _defer;
};

// loading
let httpLoading = {
	show: function (title) {
		// wx.wxshowLoading({
		//     title : title,
		//     mask : true
		// })
		// wx.showNavigationBarLoading();
	},
	hide: function () {
		// wx.hideLoading();
		// wx.hideNavigationBarLoading();
	}
};

/**
 * 接管 $http
 * @param extraParams
 * @returns Promise对象
 */
let $http = function (extraParams) {
	return $q(function(resvole, reject) {
		axios.request(extraParams).then(function (response) {
			if (response.status == 200) {
				resvole(response);
			} else {
				reject(response);
			}
		}, reject);
	});
};

// 全局播报权限过期 TODO【下次更新要考虑一个权限周期内只能触发一次】
var callAuthsTimeout = Utils.debounce(function () {
	Auth.trigger(AUTH_TIMEOUT);
}, 200);

// 此句非常重要，配合服务器接口配置信息
let VAR_SERVER_URL = HTTP_CLIENT.VAR_SERVER_URL = HTTP_CLIENT.SERVER_URL ? HTTP_CLIENT.SERVER_URL : (HTTP_CLIENT.SERVER + HTTP_CLIENT.SERVER_RUNTIME || '');

/**
 * url拼接方法
 * @param action [string] 期望格式 : Home.Index.index
 * @return [string] 返回绝对地址
 * 【http://www.example.com/index.php/Home/Index/index
 * ||
 * http://www.example.com/index.php?m=Home&c=Index&a=index】
 * */
let actionMethods = (function() {
	if (HTTP_CLIENT.URL_MODEL == 1) {
		return function (action) {
            action = action.split('.');
            let urlPath = '/' + action.join('/');
			return VAR_SERVER_URL + urlPath + URL_EXT;
			// return VAR_SERVER_URL + '/' + action[0] + '/' + action[1] + (action[2] ? '/' + action[2] : '') + URL_EXT;
		}
	}
	return function (action) {
		action = action.split('.');
		return VAR_SERVER_URL + '?' + HTTP_CLIENT.VAR_MODULE +
			'=' + action[0] + '&' + HTTP_CLIENT.VAR_CONTROLLER +
			'=' + action[1] + '&' + HTTP_CLIENT.VAR_ACTION +
			'=' + (action[2] ? action[2] : '') + URL_EXT;
	}
}());

// 过期后重新登录，是否重新发起请求
let RE_ENTRY_SEND = !!HTTP_CLIENT.RE_ENTRY_SEND;
let LOADING_TEXT = HTTP_CLIENT.LOADING || '加载中...';

// 权限相关
let AUTH_TIMEOUT_FIELD = HTTP_CLIENT.AUTH_TIMEOUT_FIELD || 'status';
let AUTH_TIMEOUT_CODE = HTTP_CLIENT.AUTH_TIMEOUT_CODE || 8;

/**
 * $http 接口封装【Beta】
 * @param method [string] Axios 的type参数 默认: GET
 * @param action [string] 接口url地址，期望参数：'Home.Index.index'
 * @param extraParams [object] 当前$http参数 【可选】
 * */
let ajaxMethods = function (method, action, extraParams) {
	extraParams || (extraParams = {});
	method = Utils.upperCase(method || HTTP_CLIENT.METHOD || 'GET');

	// 参数为params字段
	let isParams = (method == 'GET' || method == 'JSONP');

	// 初始化摆放参数的对象
	extraParams.data || (extraParams.data = {});
	if (isParams) {
		extraParams.params = extraParams.data;
		delete extraParams.data;
	}

	// 开发版开放模拟数据接口（外部接口或jsonp不指定mockData参数会直接发起请求，不做数据拦截）
	if (APP_CONFIG.DEBUG && (!extraParams.unURL || !!extraParams.mockData)) {
		extraParams.isAJAX = true;
		extraParams.mock = {
			access: extraParams.mockData || action,
			params: isParams ? extraParams.params : extraParams.data
		}
	}

	// 确定接口发起时机
	extraParams.login = !Utils.isUndefined(extraParams.login) ? !!extraParams.login : !!HTTP_CLIENT.LOGIN;

	// 初始化请求
	let defer = $q.defer(),
		RETRY_NUM = HTTP_CLIENT.RETRY,
		RETRY_TIME = HTTP_CLIENT.RETRY_TIME,
		currentRetry = 0;

	defer.promise.execute = function() {
		// 添加$http的GET请求默认参数
		let _token = Auth.getToken();

		// 合并参数
		extraParams = Utils.extend({
			url: extraParams.unURL ? action : actionMethods(action),
			method: method,
			headers: {'Content-Type': 'application/json'}
		}, extraParams);

		// 默认开启loading
		extraParams.loading = !Utils.isUndefined(extraParams.loading) ? extraParams.loading : LOADING_TEXT;
		if (extraParams.loading) {
			httpLoading.show(extraParams.loading);
		}

		// 发起请求
		let httpPromise = $http(extraParams);
		httpPromise.then(function(response) {
			var data = response.data || {};
			// Token过期
			if (data[AUTH_TIMEOUT_FIELD] == AUTH_TIMEOUT_CODE) {
				Auth.Logout();
				callAuthsTimeout();
				// 考虑到checkToken比较特殊
				RE_ENTRY_SEND && Auth.LoginFn(defer.promise.execute);

				// Auth.Logout();
				// $rootScope.Toast("登录状态过期，请重新登录！").then(function(){
				//     $state.current.name!="auths" && $rootScope.stateGo('app.home');
				// });
			} else {
				// 增加返回值拦截器调用
				// 按原先值返回，防止接口需要字符串类型 TODO 注意处理拦截器
				defer.resolve(response.data);
				delete defer.promise.execute;

				// Promise.all(executeInterceptor(httpClientJson.interceptor.responseIntercepts, response)).then(function(){
				// 	defer.resolve(response.data);   //按原先值返回，防止接口需要字符串类型
				// 	delete defer.promise.execute;
				// }, defer.reject);
			}
		}, function(error) {
			// TODO 拦截器处理模拟数据有问题
			if (error.status == 200) {
				return defer.resolve(error.data);
			}

			// 接口异常重试
			if (currentRetry < RETRY_NUM) {
				currentRetry++;
				console.warn('接口错误重试：', currentRetry, error);
				Utils.isNumber(RETRY_TIME) ? setTimeout(launchRequest, RETRY_TIME) : launchRequest();
			} else {
				defer.reject(error);
				delete defer.promise.execute;
			}
		}).finally(function () {
			// 执行完成所有请求后 TODO 如果有loading，注意处理
			if (defer.promise._bitField > 0) {
				!!extraParams.loading && setTimeout(httpLoading.hide);
			}
		});
	}

	// 发起请求 注意：checkToken等特殊接口有可能出现死循环，注意恰当处理
	let launchRequest = function () {
        // 已登录 或 不需要登录的
		if (Auth.isLogin() || !extraParams.login) {
			defer.promise.execute();
		} else {
			Auth.LoginFn(defer.promise.execute);
		}
	};
	launchRequest();

	return defer.promise;
};

const httpClientJson = {
	get: function (action, data, implemOptions) {
		return ajaxMethods('GET', action, Utils.extend({}, implemOptions, {data: data}));
	},
	post: function (action, data, implemOptions) {
		return ajaxMethods('POST', action, Utils.extend({}, implemOptions, {data: data}));
	},
	put: function (action, data, implemOptions) {
		return ajaxMethods('PUT', action, Utils.extend({}, implemOptions, {data: data}));
	},
	patch: function (action, data, implemOptions) {
		return ajaxMethods('PATCH', action, Utils.extend({}, implemOptions, {data: data}));
	},
	delete: function (action, implemOptions) {
		return ajaxMethods('DELETE', action, implemOptions);
	},
	jsonp: function(action, data, implemOptions){
		data || (data = {});
		// data['callback'] = 'JSON_CALLBACK';
		return ajaxMethods('GET', action, Utils.extend({
			unURL: true,
			login: false,
			// callbackParamName: 'callback',
			adapter: axiosJsonpAdapter
		}, implemOptions, {data: data}));
	},
	actionMethods: actionMethods,
	interceptor: (function () {
		let TYPE_REQUEST = 'request',
			TYPE_RESPONSE = 'response';
		let destoryInterceptor = function(intercepts, type){
			if (axios.interceptors[type]){
				axios.interceptors[type].eject(intercepts);
			}
		};
		let _createInterceptor = function(fulfilled, rejected, type){
			if (!axios.interceptors[type]){
				return false;
			}
			let interceptor = axios.interceptors[type].use(fulfilled, rejected);
			return function(){
				destoryInterceptor(interceptor, type);
			};
		};
		/**
		 * 批量组装拦截器
		 * @param config {Object} 参数模板：{request:'请求成功', requestError:'请求失败', response:'响应成功', responseError:'响应失败'}
		 * @returns {*}
		 */
		let createInterceptor = function(config){
			if (!config) return Utils.noop;
			config || (config = {});
			let watchRequest = createInterceptor.request(config.request, config.requestError);
			let watchResponse = createInterceptor.response(config.response, config.responseError);
			return function(){
				watchRequest && watchRequest();
				watchResponse && watchResponse();
			}
		};
		createInterceptor.request = function(fulfilled, rejected){
			return _createInterceptor(fulfilled, rejected, TYPE_REQUEST);
		};
		createInterceptor.response = function(fulfilled, rejected){
			return _createInterceptor(fulfilled, rejected, TYPE_RESPONSE);
		};
		return createInterceptor;
	})(),
	defaults: function(config) {
        config = Utils.isObject(config) ? config : {};
		// return Utils.defaultsDeep(axios.defaults, config || {});
        return Utils.merge(axios.defaults, config);
	}
};

// 配置全局请求参数
httpClientJson.defaults(HTTP_CLIENT['axios'] || '');

// 拦截器示例
// httpClientJson.interceptor.request(function(config){
// 	console.log('request:', config);
// 	return $q(function(resolve, reject){
// 	})
// })
// 刷新token的请求方法
/* function getRefreshToken() {
	let refreshToken = localStorage.getObject(COOKIE_UCENTER).refresh_token;
	let data = {
		refresh_token: refreshToken,
		client_id: 'refresh_desktop',
		client_secret: '41CAAE288C2A8CC07EABA6E2611A958AE95BF084EEDDBA25753639445A9FA3AF',
		grant_type: 'refresh_token',
		version: 'V1.0'
	}
	return axios.post('auth2/accessToken', data)
}
axios.defaults.isRetryRequest = false
axios.interceptors.request.use(
    config => {
        return config
    },
    err => {
        return Promise.reject(err)
    }
);
axios.interceptors.response.use(response => {
	let config = response.config
	if (!config.isRetryRequest && response.data.code == AUTH_TIMEOUT_CODE) {
		console.log(AUTH_TIMEOUT_CODE)
		return getRefreshToken().then(function(data){
			if (data.data.code == 0) {
				let _data = data.data['object'] || {}
				let _user = localStorage.getObject(COOKIE_UCENTER)
                _user['refresh_token'] = _data['refresh_token']
                _user['access_token'] = _data['access_token']
				localStorage.setObject(COOKIE_UCENTER, _user);
                let accessToken = 'Bearer ' + (_data['access_token'] || '')
                commonService.updateToken(accessToken)
				config.baseURL = '';
				config.headers.Authorization = accessToken;
				axios.defaults.isRetryRequest = true
				return axios(config)
			} else {
				Auth.Logout();
				callAuthsTimeout();
			}
		}).catch(function () {
			// 刷新token失败只能跳转到登录页重新登录
			Auth.Logout();
		})
	} else {
		axios.defaults.isRetryRequest = false
	}
	return response
}, err => {
	console.log(err)
	return Promise.reject(err)
}) */
export default httpClientJson
