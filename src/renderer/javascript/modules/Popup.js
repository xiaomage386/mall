/**
 * Created by terry.chen on 2019/03/11
 * Name : Popup
 * Version : v0.1
 * Copyright (c) 2019 Terry.Chen
 */
import Utils from '@modules/Utils';
import {MessageBox, Message, Loading, Notification} from 'element-ui'

let CONFIG = {
	alert: {
		title: '温馨提示',
		confirmButtonText: '确定',
		showClose: false
	},
	confirm: {
		title: '温馨提示',
		confirmButtonText: '确定',
		cancelButtonText: '取消'
	},
	prompt: {
		title: '温馨提示',
		inputPlaceholder: '请在此输入'
	},
	showToast: {
		title: '温馨提示'
	},
	showToastSuccess: {
		title: '温馨提示',
		type: 'success'
	},
	showToastError: {
		title: '温馨提示',
		type: 'error'
	},
	showToastInfo: {
		title: '温馨提示',
		type: 'info'
	},
	showToastWarning: {
		title: '温馨提示',
		type: 'warning'
	},
	showNotification: {
		title: '温馨提示'
	},
	showNotificationSuccess: {
		title: '温馨提示',
		type: 'success'
	},
	showNotificationError: {
		title: '温馨提示',
		type: 'error'
	},
	showNotificationInfo: {
		title: '温馨提示',
		type: 'info'
	},
	showNotificationWarning: {
		title: '温馨提示',
		type: 'warning'
	},
	showLoading: {
		text: '加载中...'
	}
};

let promisify = function () {
}

const POPUP = {};

/**
 * ElementUI#MessageBox弹框
 * @param message {string} 提示的内容
 * @param config {Object} MessageBox需要的参数
 * @param extraConfig {Object} 额外参数
 * @param action {string} 需要执行的MessageBox弹框方法【默认：alert】
 * @return Promise对象
 */
let showMessageBox = function (message, config, extraConfig, action) {
	action || (action = 'alert');
	config || (config = {});
	if (Utils.isObject(message)) {
		config = message;
		message = '';
	}
	config['message'] = message || '';
	return MessageBox[action](message, Utils.extend({}, extraConfig, config))
};

/**
 * 提示框
 * @param message {string} 提示的内容
 * @param config {Object} showMessageBox需要的参数
 * @return Promise对象
 */
POPUP.alert = function (message, config) {
	return showMessageBox(message, config, CONFIG.alert, 'alert');
};

/**
 * 确定框
 * @param message {string} 提示的内容
 * @param config {Object} showMessageBox需要的参数
 * @return Promise对象
 */
POPUP.confirm = function (message, config) {
	return showMessageBox(message, config, CONFIG.confirm, 'confirm');
};

/**
 * 输入框
 * @param message {string} 提示的内容
 * @param config {Object} showMessageBox需要的参数
 * @return Promise对象
 */
POPUP.prompt = function (message, config) {
	return showMessageBox(message, config, CONFIG.prompt, 'prompt');
};

/**
 * ElementUI#Message消息提示
 * @param message {string} 提示的内容
 * @param config {Object} Message 需要的参数
 * @param extraConfig {Object} 额外参数
 * @return Promise对象
 */
let showToast = function (message, config, extraConfig) {
	config || (config = {});
	if (Utils.isObject(message)) {
		config = message;
		message = '';
	}
	config['message'] = message || extraConfig['title'] || '';
	let _config = Utils.extend({}, extraConfig, config);
	return new Promise(function (resolve, reject) {
		let _onClose = Utils.isFunction(_config) ? _config : Utils.noop;
		_config['onClose'] = function($vm){
			_onClose($vm);
			resolve($vm);
		};
		Message(_config);
	})
};
/**
 * 提醒框
 * @param message {string} 提示的内容
 * @param config {Object} showToast 需要的参数
 * @return Promise对象
 */
POPUP.toast = POPUP.showToast = function (message, config) {
	return showToast(message, config, CONFIG.showToast)
};
/**
 * 提示框#成功
 * @param message {string} 提示的内容
 * @param config {Object} showToast 需要的参数
 * @return Promise对象
 */
POPUP.showToast.Success = function(message, config){
	return showToast(message, config, CONFIG.showToastSuccess);
};
/**
 * 提示框#失败
 * @param message {string} 提示的内容
 * @param config {Object} showToast 需要的参数
 * @return Promise对象
 */
POPUP.showToast.Error = function(message, config){
	return showToast(message, config, CONFIG.showToastError);
};
/**
 * 提示框#消息
 * @param message {string} 提示的内容
 * @param config {Object} showToast 需要的参数
 * @return Promise对象
 */
POPUP.showToast.Info = function(message, config){
	return showToast(message, config, CONFIG.showToastInfo);
};
/**
 * 提示框#警告
 * @param message {string} 提示的内容
 * @param config {Object} showToast 需要的参数
 * @return Promise对象
 */
POPUP.showToast.Warning = function(message, config){
	return showToast(message, config, CONFIG.showToastWarning);
};
/**
 * 关闭提醒框
 */
POPUP.hideToast = function(){
	return Message.closeAll();
};

/**
 * ElementUI#Notification通知
 * @param message {string} 提示的内容
 * @param config {Object} Notification 需要的参数
 * @param extraConfig {Object} 额外参数
 * @return Promise对象
 */
let showNotification = function (message, config, extraConfig) {
	config || (config = {});
	if (Utils.isObject(message)) {
		config = message;
		message = '';
	}
	config['message'] = message || '';
	let _config = Utils.extend({}, extraConfig, config);
	return new Promise(function (resolve, reject) {
		let _onClose = Utils.isFunction(_config) ? _config : Utils.noop;
		_config['onClose'] = function($vm){
			_onClose($vm);
			resolve($vm);
		};
		Notification(_config);
	})
};
/**
 * 通知消息框
 * @param message {string} 提示的内容
 * @param config {Object} showNotification 需要的参数
 * @return Promise对象
 */
POPUP.Notification = POPUP.showNotification = function (message, config) {
	return showNotification(message, config, CONFIG.showNotification)
};
/**
 * 通知消息框#成功
 * @param message {string} 提示的内容
 * @param config {Object} showNotification 需要的参数
 * @return Promise对象
 */
POPUP.Notification.Success = function(message, config){
	return showNotification(message, config, CONFIG.showNotificationSuccess);
};
/**
 * 通知消息框#失败
 * @param message {string} 提示的内容
 * @param config {Object} showNotification 需要的参数
 * @return Promise对象
 */
POPUP.Notification.Error = function(message, config){
	return showNotification(message, config, CONFIG.showNotificationError);
};
/**
 * 通知消息框#消息
 * @param message {string} 提示的内容
 * @param config {Object} showNotification 需要的参数
 * @return Promise对象
 */
POPUP.Notification.Info = function(message, config){
	return showNotification(message, config, CONFIG.showNotificationInfo);
};
/**
 * 通知消息框#警告
 * @param message {string} 提示的内容
 * @param config {Object} showNotification 需要的参数
 * @return Promise对象
 */
POPUP.Notification.Warning = function(message, config){
	return showNotification(message, config, CONFIG.showNotificationWarning);
};
/**
 * 关闭通知消息框
 */
POPUP.hideNotification = function(){
	return Notification.closeAll();
};

/**
 * Loading 加载
 * @param message {string} 提示的内容
 * @param config {Object} showNotification 需要的参数
 * @return Promise对象
 */
let loadingInstance;
POPUP.Loading = POPUP.showLoading = function (message, config) {
	let _config = Utils.extend({}, CONFIG.showLoading, config);
	_config['text'] = message || _config['text'] || '';
	loadingInstance = Loading.service(_config);
	return loadingInstance;
};
/**
 * 关闭 Loading 加载
 */
POPUP.hideLoading = function(){
	return loadingInstance && loadingInstance.$nextTick(() => {
		loadingInstance.close();
	});
};

/**
 * 关闭所有Popup框
 */
POPUP.hideAll = POPUP.closeAll = function () {
    POPUP.hideToast();
    POPUP.hideLoading();
    POPUP.hideNotification();
    try {
        MessageBox.close();
    } catch (e) {}
};

export default POPUP;
