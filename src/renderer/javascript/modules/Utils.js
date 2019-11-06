/**
 * Created by terry.chen on 2019/03/11
 * Name : Utils
 * Version : v0.1
 * Copyright (c) 2019 Terry.Chen
 */
import Utils from 'lodash'

let slice = [].slice,
    splice = [].splice,
    push = [].push,
    indexOf = Array.prototype.indexOf;

/**
 * 转换成标准数组格式
 * @param args [array] 待转换的非标准数组
 * @param startIndex [int] 开始索引【默认 0】
 * @return 标准数组格式
 * */
Utils.sliceArgs = function (args, startIndex) {
    return slice.call(args, startIndex || 0);
};

// isArray
function isArray (value) {
    return value instanceof Array
}
Utils.isArray = isArray

/**
 * 判断变量是否定义
 * @param value
 * @returns {boolean}
 */
Utils.isDefined = function (value) {
    return !Utils.isUndefined(value)
};

// isNumeric
Utils.isNumeric = function (num) {
    let realString = num && num.toString()
    return typeof num !== 'object' && (realString - parseFloat(realString) + 1) >= 0
}

/**
 * 转换成JSON字符串
 * @param obj {object} 需要转换的对象
 * @returns {string}
 */
Utils.toJson = function (obj) {
    return JSON.stringify(obj);
};

/**
 * 转换成JSON对象
 * @param json {string} 需要转换的json字符串
 * @returns {object}
 */
Utils.fromJson = function (json) {
    return Utils.isString(json) ? JSON.parse(json) : json;
};

/***
 * 获得随机字符串
 * @params len {number} 获得字符串的长度
 * @return {string} 随机字符串
 */
Utils.randomString = (function () {
    // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let maxPos = $chars.length;
    return function (len, prefix) {
        len = len || 32;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return (prefix || '') + pwd;
    }
}());

/**
* 计算数组、对象、字符串长度
* @param obj {object || array} 计算的对象或数组
* */
Utils.count = Utils.size;

/**
 * 获得当前时间戳
 * */
Utils.getTime = (Date.now || function () {
    return new Date().getTime();
});

/**
* 将字符串转换成时间戳
* @param stringTime [string] 字符串时间格式；如 '2017-01-01 01:02:03'
* @return 时间戳
* */
Utils.formatStringTime = function (stringTime) {
    stringTime = new Date(Date.parse(stringTime.replace(/-/g, '/')));
    return stringTime.getTime();
};

/**
   * 将时间戳转换成标准时间格式
   * @param time [int、DATE] 待格式化的时间戳或DATE对象【选填，默认当前时间戳】
   * @param format [string] 标准时间的格式【选填，默认'yyyy-MM-dd hh:mm:ss'】
   * */
Utils.formatTime = (function () {
    var _format = 'yyyy-MM-dd hh:mm:ss';
    var newDate = new Date();
    var date;
    var setData = function () {
        date = {
            'M+': newDate.getMonth() + 1,
            'd+': newDate.getDate(),
            'h+': newDate.getHours(),
            'm+': newDate.getMinutes(),
            's+': newDate.getSeconds(),
            'q+': Math.floor((newDate.getMonth() + 3) / 3),
            'S+': newDate.getMilliseconds()
        }
    };
    var Timestamp = function (time) {
        time || (time = Utils.getTime());
        if (Utils.isDate(time)) { // 如果传入time为DATE对象则直接复制，并return掉
            newDate = time; return;
        }
        if (Utils.size(time.toString()) === 10) { // 转成高精度时间戳
            time = time * 1000;
        }
        newDate.setTime(time);
    };
    return function (time, format) {
        Timestamp(time); // 标准化时间戳
        format || (format = _format);
        setData(); // 设置当前时间
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (newDate.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
            }
        }
        return format;
    }
})();

// 模拟$q Promise
Utils.$q = function (Fn) {
    return new Promise(Fn)
};
Utils.$q.defer = function () {
    let _defer = {}
    _defer.promise = Utils.$q(function (resolve, reject) {
        _defer.resolve = resolve
        _defer.reject = reject
    })
    return _defer
}
Utils.$q.all = function (promises) {
    return Promise.all(promises)
}

export default Utils;
