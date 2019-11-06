/**
 * Created by terry.chen on 2019/04/10
 * Name : hidPlugin - usb-hid设备管理工具
 * Version : v0.1
 * Copyright (c) 2019 Terry.Chen
 */
import APP_CONFIG from '@/app.config'
import HID from 'node-hid'
import Utils from '@modules/Utils'
import usbDetect from 'usb-detection'
import USBBuffer from '@plugins/usbBuffer'

// 设备的vid和pid值
const AX_USB_CONFIG = APP_CONFIG['AX_USB_CONFIG']
const VID = AX_USB_CONFIG['VID']
const PID = AX_USB_CONFIG['PID']

// PC => device 指令代码
const commadPrefix = ''
const OUT_COMMADS = {
    'Blow': 0xB4,
    'cancelBlow': 0xB5,
    'deviceInfo': 0xA5,
    'MVVBlow': 0xDA,
    'SVCBlow': 0xD6,
    'voiceOn': 0xBE,
    /**
     * 设备标准定标接口
     * @param calibration {Number} 定标升数，单位：L(升)【2：2L, 3: 3L】
     * @param temperature {Number} 环境温度，单位：℃(摄氏度)
     * @param humidity {Number} 环境湿度，单位：%(百分比)
     * @param pressure {Number} 大气压力，单位：mmHg
     * @param altitude {Number} 海拔高度，单位：m(米)
     * @return {Array|Promise.reject}
     */
    'calibrateBlow': function(calibration, temperature, humidity, pressure, altitude) {
        let errMsg = '';
        let _data = [0xE3, 0x09];
        if (!Utils.isNumeric(calibration)) {
            errMsg = '抱歉，缺少定标升数！'
        } else if (!Utils.isNumeric(temperature)) {
            errMsg = '抱歉，缺少环境温度！'
        } else if (!Utils.isNumeric(humidity)) {
            errMsg = '抱歉，缺少环境湿度！'
        } else if (!Utils.isNumeric(pressure)) {
            errMsg = '抱歉，缺少大气压力！'
        } else if (!Utils.isNumeric(altitude)) {
            errMsg = '抱歉，缺少海拔高度！'
        } else {
            calibration = Number(calibration) || 0;
            temperature = Number(temperature) || 0;
            humidity = Number(humidity) || 0;
            pressure = Number(pressure) || 0;
            altitude = Number(altitude) || 0;
            _data.push(calibration, temperature, humidity);
            let pressureBuffer = writeUInt16LE(pressure);
            let altitudeBuffer = writeUInt16LE(altitude);
            _data = _data.concat(pressureBuffer, altitudeBuffer);
        }
        return errMsg ? Promise.reject(new Error(errMsg)) : _data
    },
    /**
     * 设备3流量定标验证接口
     * @param calibration {Number} 定标升数，单位：L(升)【2：2L, 3: 3L】
     * @param temperature {Number} 环境温度，单位：℃(摄氏度)
     * @param humidity {Number} 环境湿度，单位：%(百分比)
     * @param pressure {Number} 大气压力，单位：mmHg
     * @param altitude {Number} 海拔高度，单位：m(米)
     * @return {Array|Promise.reject}
     */
    'calibrateBlow3': function(calibration, temperature, humidity, pressure, altitude) {
        let errMsg = '';
        let _data = [0xc0, 0x09];
        if (!Utils.isNumeric(calibration)) {
            errMsg = '抱歉，缺少定标升数！'
        } else if (!Utils.isNumeric(temperature)) {
            errMsg = '抱歉，缺少环境温度！'
        } else if (!Utils.isNumeric(humidity)) {
            errMsg = '抱歉，缺少环境湿度！'
        } else if (!Utils.isNumeric(pressure)) {
            errMsg = '抱歉，缺少大气压力！'
        } else if (!Utils.isNumeric(altitude)) {
            errMsg = '抱歉，缺少海拔高度！'
        } else {
            calibration = Number(calibration) || 0;
            temperature = Number(temperature) || 0;
            humidity = Number(humidity) || 0;
            pressure = Number(pressure) || 0;
            altitude = Number(altitude) || 0;
            _data.push(calibration, temperature, humidity);
            let pressureBuffer = writeUInt16LE(pressure);
            let altitudeBuffer = writeUInt16LE(altitude);
            _data = _data.concat(pressureBuffer, altitudeBuffer);
        }
        return errMsg ? Promise.reject(new Error(errMsg)) : _data
    },
    /**
     * 声音开关
     */
    'voiceSwitchBlow': function(config) {
        let _data = [0xBD, 0x03];
        config = Number(config);
        _data.push(config);
        return _data
    },
    /**
     * 传输检测人信息接口
     * @param model {Strong} 预计值模式
     * @param gender {Number} 性别 0：男  1：女
     * @param age {Number} 年龄，单位 ：岁
     * @param height {Number} 身高，单位：cm
     * @param weight {Number} 体重，单位：kg
     * @return {Array|Promise.reject}
     */
    'transferUserInfo': function(model, gender, age, height, weight) {
        let errMsg = '';
        let _data = [0x80, 0x09];
        if (Number(gender) != 0 && Number(gender) != 1) {
            errMsg = '抱歉，缺少性别！'
        } else if (!Utils.isNumeric(age)) {
            errMsg = '抱歉，缺少年龄！'
        } else if (!Utils.isNumeric(height)) {
            errMsg = '抱歉，缺少身高！'
        } else if (!Utils.isNumeric(weight)) {
            errMsg = '抱歉，缺少海拔高度！'
        } else {
            model = model || 0x00;
            gender = Number(gender) || 0;
            age = Number(age) || 0;
            height = Number(height) || 0;
            weight = Number(weight) || 0;
            _data.push(model, gender, age);
            let heightBuffer = writeUInt16LE(height);
            let weightBuffer = writeUInt16LE(weight);
            _data = _data.concat(heightBuffer, weightBuffer);
        }
        return errMsg ? Promise.reject(new Error(errMsg)) : _data
    },
    /**
     * 定标系数信息接口
     * @param calibration {Number} 定标结果
     * @param caliParaIn {Number} 吸气校准系数
     * @param caliParaEx {Number} 呼气校准系数
     * @return {Array|Promise.reject}
     */
    'calibration': function(calibration, caliParaIn, caliParaEx) {
        let errMsg = '';
        let _data = [0x81, 0x09];
        if (!Utils.isNumeric(caliParaIn)) {
            errMsg = '抱歉，缺少吸气校准系数！'
        } else if (!Utils.isNumeric(caliParaEx)) {
            errMsg = '抱歉，缺少呼气校准系数！'
        } else {
            calibration = Number(calibration) || 0
            let heightBuffer = writeFloatLE(caliParaIn);
            let weightBuffer = writeFloatLE(caliParaEx);
            _data = _data.concat(calibration, heightBuffer, weightBuffer);
        }
        return errMsg ? Promise.reject(new Error(errMsg)) : _data
    }
}

/**
 * 写入16无符号正数（小端模式）
 */
function writeUInt16LE (Num) {
    let _buffer = Buffer.alloc(2);
    _buffer.writeUInt16LE(Num);
    return _buffer.toJSON()['data']
}

/**
 * 写入单精度浮点数（小端模式）
 */
function writeFloatLE (Num) {
    let _buffer = Buffer.alloc(4);
    _buffer.writeFloatLE(Num);
    return _buffer.toJSON()['data']
}

// 设备平台
const isWindow = process.platform == 'win32'

// hid_write增加缓存区数据
const PREPEND_BUFFER_DATA = 0

// 开启USB设备监听
usbDetect.startMonitoring()

class HIDPlugin extends USBBuffer {
    constructor (vid, pid) {
        super()
        this.vid = vid || VID
        this.pid = pid || PID
        this.device = this.findDevice()
        this.isConnect = !!this.device

        // 设备报错提示's
        this.TIPS_DEVICE_NOFOUND = '设备未连接或者设备未开机';

        // 设备监听事件名称
        this._USB_EVENTS = {
            ADD: ['add', this.vid, this.pid].join(':'),
            REMOVE: ['remove', this.vid, this.pid].join(':'),
            CHANGE: ['change', this.vid, this.pid].join(':')
        }

        // 开始初始化逻辑
        this.isConnect && this.init()
        let self = this
        self.attach(function (device) {
            self._logger('Device attach...')
            self.device = self.findDevice();
            self.isConnect = true
            self.init()
        })
        self.detach(function (device) {
            self._logger('Device detach...')
            self.device = null;
            self.isConnect = false
            self.destroyConnect()
        })
    }

    _logger () {
        let args = Utils.sliceArgs(arguments)
        let sliceTag = ' ---------- '
        args.unshift(sliceTag)
        args.push(sliceTag)
        window.console.log.apply(null, args)
    }

    /**
     * 设备初始化流程
     * @return {*}
     */
    init () {
        // if (this.isConnect) return this.device
        let device = this.device = this.findDevice()
        this.createConnect()
        return device
    }

    /**
     * 创建设备连接
     */
    createConnect () {
        let self = this
        self.device.on('data', function (data) {
            self.autoTransfer(data)
            // self._logger('hid data:', data)
        })
        // 注意：不监听会导致Electron崩溃
        self.device.on('error', Utils.noop)
        // self.device.on('error', function (error) {
        //     self._logger('hid error:', error.message)
        // })
        self.device.resume();
    }

    /**
     * 销毁设备连接（比如监听、设备状态等）
     */
    destroyConnect () {
        // if (this.isConnect) return false;
        if (this.device){
            this.device.pause()
            // this.device.close();
            this.device.removeAllListeners()
        }
    }

    /**
     * 监听设备事件 => on('add:vid:pid', FUNCTION)
     * @param type {String} 监听的设备事件
     * @param listener {Function} 回调函数
     * @return {Function} 关闭监听的闭包函数
     */
    on (type, listener) {
        if (!Utils.isFunction(listener)) return false
        usbDetect.on(type, listener)
        return () => this.off(type, listener)
    }

    /**
     * 关闭监听设备事件 => off('add:vid:pid', FUNCTION) 【不建议使用，可以使用监听时返回的闭包函数关闭】
     * @param type {String} 监听的设备事件
     * @param listener {Function} 回调函数(需原始回调函数)
     * @return {*}
     */
    off (type, listener) {
        if (!Utils.isFunction(listener)) return false
        return usbDetect.off(type, listener)
    }

    /**
     * 监听设备接入（注意：仅监听初始化时的设备）
     * @param listener {Function} 回调函数
     * @return {Function} 关闭监听闭包函数
     */
    attach (listener) {
        return this.on(this._USB_EVENTS.ADD, listener)
    }

    /**
     * 监听设备断开（注意：仅监听初始化时的设备）
     * @param listener {Function} 回调函数
     * @return {Function} 关闭监听闭包函数
     */
    detach (listener) {
        return this.on(this._USB_EVENTS.REMOVE, listener)
    }

    /**
     * 查找实例指定的设备
     * @return {Object||null}
     */
    findDevice () {
        let device = HID.devices(this.vid, this.pid)
        return device && device.length ? new HID.HID(this.vid, this.pid) : null
    }

    /**
     * 处理发往设备的传输指令
     * @param data {Buffer||Array||String} 传送到设备的数据
     * @return {*}
     */
    transformCommad (data) {
        if (!data) return [PREPEND_BUFFER_DATA]
        if (Buffer.isBuffer(data)) {
            data = data.toJSON()['data'] || []
        }
        if (!Utils.isArray(data)) {
            data = [data]
        }
        // 由于底层hidapi库限制，使用hid_write方法需在任何数据缓冲区前加一个字节
        isWindow && data.unshift(PREPEND_BUFFER_DATA)
        return data
    }

    /**
     * 往设备传输指令数据
     * @param data {Buffer||Array||String} 传送到设备的数据
     * @return {*}
     */
    transfer (data) {
        let self = this
        data = self.transformCommad(data)
        return new Promise(function (resolve, reject) {
            if (!self.device){
                return reject(new Error(self.TIPS_DEVICE_NOFOUND))
            }
            requestAnimationFrame(() => {
                try {
                    resolve(self.device.write(data));
                    self._logger('transfer Success:', data);
                } catch (error) {
                    reject(error)
                    self._logger('transfer Error:', error);
                }
            })
        })
    }

    /**
     * 销毁实例 TODO:实验功能
     */
    destroy () {
        let self = this
        self.destroyConnect()
        self.device = null
        self.isConnect = false
    }
}

// 格创肺功能设备私有 设备交互方法
Utils.forEach(OUT_COMMADS, function(commad, key){
    HIDPlugin.prototype[commadPrefix + key] = function(){
        if (Utils.isFunction(commad)) {
            let args = Utils.sliceArgs(arguments);
            let defer = Utils.$q.defer();
            Utils.$q.all([commad.apply(null, args)]).then((data) => {
                let _commad = data[0];
                this.transfer(_commad).then(defer.resolve, defer.reject);
            }, defer.reject)
            return defer.promise;
        } else {
            return this.transfer(commad);
        }
    }
})

// 测试代码
// window.HID = HID
// window.Utils = Utils
// window.hidPlugin = new HIDPlugin()

export default HIDPlugin
