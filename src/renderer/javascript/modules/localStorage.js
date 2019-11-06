/**
 * Created by terry.chen on 2019/03/11
 * Name : localStorage
 * Version : v0.1
 * Copyright (c) 2019 Terry.Chen
 */
const $Storage = window.localStorage;
export default {
	set: function (key, value) {
		$Storage[key] = value;
	},
	get: function (key, defaultValue) {
		return $Storage[key] || defaultValue;
	},
	setObject: function (key, value) {
		try {
			$Storage.setItem(key, JSON.stringify(value));
		} catch (e) {
			console.error('Got an error!', e);
		}
	},
	getObject: function (key) {
		return JSON.parse($Storage[key] || '{}');
	},
	remove: function (key) {
		$Storage.removeItem(key);
	},
	clear: function () {
		$Storage.clear();
	}
}
