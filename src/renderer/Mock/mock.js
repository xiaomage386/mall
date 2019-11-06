/**
 * Created by terry.chen on 2019/03/11
 * Name : mock.js
 * Version : v0.1
 * Copyright (c) 2019 Terry.Chen
 */
import Mock from 'mockjs';
import mockData from './routes'
import Utils from '@modules/Utils'
import httpClient from '@modules/httpClient'

const mockDataPath = ''

// 配置拦截 Ajax 请求时的行为
// Mock.setup({
//     timeout: '100-300'
// });
let timeout = [100, 300]

// httpClient 拦截器
httpClient.interceptor.request(function (config) {
	if (!(config['isAJAX'] && config['mock'])) {
		return config;
	}
	return (new Promise(function (resolve, reject) {
		reject(config)
	}))
});
httpClient.interceptor.response(null, function(config){
	return ajaxPrefilter(config)
});

// 重写 wxp.request接口
// let wxp = {}
// let wxpRequest = wxp.request
// wxp.request = function (config) {
//     if (!config.isAJAX) {
//         return wxpRequest(config)
//     }
//     return ajaxPrefilter(config)
// }

/***
 * 格式化控制台提示信息
 * @param url 请求地址
 * @param params 请求参数
 * @param data 请求返回结果
 * @param title 控制台显示title
 * @param config AJAX请求参数
 */
function formatMessage(url, params, data, title, config) {
	config || (config = {})
	console.groupCollapsed('%c发起请求:' + (title || url), 'color:#009a61; font-size: 12px; font-weight: 300')
	console.log('API：', url)
	console.log('Config：', config)
	console.log('Params：', params)
	console.log('DATA:', data)
	console.groupEnd()
}

// 拦截接口业务逻辑
function ajaxPrefilter(config) {
	let access = config.mock && config.mock.access && config.mock.access.split('.') || []
	let params = config.mock && config.mock.params || config.params || config.data || {}
	let accessURL = access.join('/');
	// 有值说明加载为js， 否则为json文件
	let loadPrefix = !mockData[accessURL] ? 'json!' : '';
	let mockURL = mockDataPath + accessURL + (loadPrefix ? '.json' : '');
	return new Promise(function (resolve, reject) {
		try {
			let response = require('@/Mock/' + mockURL);
			// es6方式加载，处理返回数据
			if (!loadPrefix) {
				response = response.default || Utils.noop;
			}
			let _data = Mock.mock(Utils.isFunction(response) ? response.call(config, params) : response);
			formatMessage(config.url, params, _data, access.join('.'), config)
			setTimeout(function () {
				resolve({config: config, data: _data, header: {}, status: 200, statusText: 'request:ok'})
			}, Mock.Random.int(timeout[0], timeout[1]))
		} catch (error) {
			console.error('注意，此接口没有模拟数据:', config.url)
			setTimeout(function () {
				reject({config: config, data: error, header: {}, status: 404, statusText: 'request:fail'})
			}, Mock.Random.int(timeout[0], timeout[1]))
		}
	})
}

export default Mock
// module.exports = Mock
