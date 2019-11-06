/**
 * Created by terry.chen on 2019/03/11
 * Name : Auth
 * Version : v0.1
 * Copyright (c) 2019 Terry.Chen
 */
import APP_CONFIG from '@/app.config'
import Utils from '@modules/Utils'
import localStorage from '@modules/localStorage'
import $store from '@/store';

// CONFIG
const LOCAL_TOKEN = APP_CONFIG['NAME'] + '_token';
const COOKIE_UCENTER = APP_CONFIG['NAME'] + '_USER';

// 全新通知 事件名
const AUTH_LOGIN = 'auth_login';

/*
 * SimplePubSub from https://github.com/mbenford/ngTagsInput/blob/master/src/util.js
 * */
function SimplePubSub() {
	var events = {};
	return {
		on: function (names, handler) {
			names.split(' ').forEach(function (name) {
				if (!events[name]) {
					events[name] = [];
				}
				events[name].push(handler);
			});
			return this;
		},
		trigger: function (name, args) {
			events[name].forEach(function (handler) {
				handler.call(null, args);
			});
			return this;
		}
	};
};

var _user = localStorage.getObject(COOKIE_UCENTER, {});
var setUser = function (user) {
	// if ((!user.uid || user.uid <= 0)) {
	//     user.role = GLOBAL.ACCESS_LEVELS.guest;
	// }else{
	//     user.role = GLOBAL.ACCESS_LEVELS.user;
	// }
	_user = user || {};

	// 同时设置全局资料（初始化有可能设置不成功 set LOG）
	// let app = getApp();
	// if (app && app.globalData.init){
	// 	app.globalData.init.Profile = _user;
	// }else {
	// 	console.warn('auth.setUser to globalData fail...');
	// }
	$store.dispatch('CHANGE_PROFILE', _user);
	localStorage.setObject(COOKIE_UCENTER, _user);
};
var getUserObject = function (key) {
	return key ? _user[key] : _user;
};

// 登录后callbacks
var Fns = [];
var AuthEvent = new SimplePubSub();
AuthEvent.on(AUTH_LOGIN, function (flag) {
	if (!flag) return;
	Fns.forEach(function (callBack) {
		// callBack && Utils.requestAnimationFrame(callBack);
		callBack && callBack();
	});
	Fns = [];
});

var AuthServices = {
	isAuthorized: function () {
		return !Utils.isEmptyObject(_user);
	},
	getToken: function () {
		return _user.token || localStorage.get(LOCAL_TOKEN, '');
	},
	isLogin: function () {
		return !!this.getToken();
	},
	LoginFn: function (Fn) {
		Fn = Utils.isFunction(Fn) ? Fn : Utils.noop;
		this.isLogin() ? Fn(true) : Fns.push(Fn);
		// !!getApp().globalData.init.isLogin ? Fn(true) : Fns.push(Fn);
	},
	trggerLogin: function () {
		$store.dispatch('AUTH_CHANGE', true);
		AuthEvent.trigger(AUTH_LOGIN, true);
		// AuthEvent.trigger(AUTH_LOGIN, !!getApp().globalData.init.isLogin);
	},
	setUser: setUser,
	getUser: getUserObject,
	setToken: function (token) {
		if (token == 'remove') {
			_user.token = '';
			localStorage.remove(LOCAL_TOKEN);
			return _user.token;
		}
		_user.token = token;
		localStorage.set(LOCAL_TOKEN, token);
		return this.getToken();
	},
	Logout: function () {
		// 清空用户信息
		// if (getApp().globalData) {
		// 	getApp().globalData.init.isLogin = false;
		// 	getApp().globalData.init.Profile = {};
		// } else {
		// 	console.warn('Auth.Logout to init Data fail...');
		// }
		this.setToken('remove');
		this.setUser({});
		AuthEvent.trigger(AUTH_LOGIN, false);
		setTimeout(() => { $store.dispatch('AUTH_CHANGE', null) }, 200);
	},
	on: function (method, callback) {
		return AuthEvent.on(method, callback);
	},
	trigger: function (method, args) {
		return AuthEvent.trigger(method, args);
	}
};

// 监听登录状态
$store.subscribe(function (mutation, state) {
	if (mutation.type == 'AUTH_CHANGE'){
		AuthEvent.trigger(AUTH_LOGIN, state.User.isLogin);
	}
})

export default AuthServices
