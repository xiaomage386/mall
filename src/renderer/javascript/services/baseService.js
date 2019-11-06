/**
 * Created by terry.chen on 2019/03/11
 * Name : BaseService
 * Version : v0.1
 * Copyright (c) 2019 Terry.Chen
 */
import httpClient from '@modules/httpClient'
import httpClientJson from '@modules/httpClientJson'
import Popup from '@modules/Popup'
import Utils from '@modules/Utils'
import APP_CONFIG from '@/app.config'
import ERRORS from '@/assets/http_error_status.json'

class BaseService {
	constructor() {
		this.Popup = Popup;
        this.httpClient = httpClient;
        this.httpClientJson = httpClientJson;
        this.STATUS_FIELD = APP_CONFIG.HTTP_CLIENT.AUTH_TIMEOUT_FIELD;
        this.STATUS_SUCCESS = APP_CONFIG.HTTP_CLIENT.STATUS_SUCCESS;
        this.NORMAL_PAGE = APP_CONFIG.PAGES.INIT;
        this.NORMAL_LIMIT = APP_CONFIG.PAGES.LIMIT;
	}

	/***
	 * 接口状态码异常处理
	 * @param cid {int} 错误码
	 * @param configs {object、string} 额外异常数据【选填；默认:{}】
	 * @param isReturn {boolean、functions} 只返回错误信息，不作处理【选填；默认:false】
	 * @return isReturn ? String错误信息 : Promise对象
	 * @examples
	 *  LB.commonService.Warning(110); ==> LB.warning("~");
	 *  LB.commonService.Warning(110, 'Login');     //取Login接口报错信息
	 *  LB.commonService.Warning(110, {110:"报警啦！"}); ==> LB.warning("报警啦！");
	 *  LB.commonService.Warning(110, {110:"报警啦！"}, true); ==> "报警啦！";
	 *  LB.commonService.Warning(110, {110:"报警啦！"}, function(text){
         *      text ==> "报警啦！";
         *      //如果有返回值，继续走标准报错流程
         *  })
	 */
	Warning(cid, configs, isReturn) {
		if (Utils.isString(configs)){
			let _configs = {}; _configs[cid] = configs;
			configs = _configs; _configs = null;
		}
		let errTips = '接口异常，状态码：';
		configs = Utils.isObject(configs) ? configs : {};
		let tips = configs[cid] || ERRORS[cid] || errTips + (cid || null);
		if (Utils.isFunction(isReturn)){
			let returned = isReturn(tips);
			// 如果有返回值，则继续按返回值走标准报错流程
			if (returned){
				tips = returned;
			} else {
				// 否则只返回报错信息
				return tips;
			}
		}
		return Popup.showNotification.Warning(tips);
	}

	/***
	 * 接口异常 - 常规处理
	 * @param error {object} 接口异常数据
	 * @return Promise对象
	 */
	NetWorkFail(error) {
		let request = Utils.isObject(error) ? (error.request || {}) : {};
		let errorText = request['status'] || request['statusText'] || error.message;
		errorText = errorText ? '(' + errorText + ')' : '';
		return Popup.showToast.Error('网络异常，请稍后再试：' + errorText);
	}
}

export default BaseService
