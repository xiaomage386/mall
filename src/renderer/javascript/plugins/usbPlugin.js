/**
 * Created by terry.chen on 2019/03/11
 * Name : usbPlugin - usb设备管理
 * Version : v0.1
 * Copyright (c) 2019 Terry.Chen
 */
import APP_CONFIG from '@/app.config'
import usb from 'usb'
import Utils from '@modules/Utils'
import { Message } from 'element-ui'
import USBBuffer from '@plugins/usbBuffer'
const EventEmitter = require('events').EventEmitter

// TODO 调试代码
// const usb = {
//     setDebugLevel: function(){},
//     findByIds: function () {},
//     addListener: function () {}
// }

// 设备的vid和pid值
const AX_USB_CONFIG = APP_CONFIG['AX_USB_CONFIG'];
const VID = AX_USB_CONFIG['VID'];
const PID = AX_USB_CONFIG['PID'];

// PC => device 指令代码
const commadPrefix = 'BH_';
const OUT_COMMADS = {
    'Blow': bufferFrom(0xB4),
    'CancelBlow': bufferFrom(0xB5)
}

// 组装To设备的执行数据
function bufferFrom (commad) {
    return Buffer.from([commad])
}

class USBPlugin extends USBBuffer {
    constructor (vid, pid) {
        super();
        this.usb = usb;
        this.vid = vid || VID;
        this.pid = pid || PID;
        this.device = this.findDevice(this.vid, this.pid);
        this.isConnect = !!this.device;
        this.deviceInterface = null;
        this.endpoints = null;
        this.inEndpoint = null;
        this.outEndpoint = null;

        // Event 事件处理方法
        this.Event = new EventEmitter();

        // 开始初始化逻辑
        this.isConnect && this.init();

        let self = this
        this.on('attach', function (device) {
            let deviceDesc = device.deviceDescriptor
            if ((deviceDesc.idVendor == self.vid) && (deviceDesc.idProduct == self.pid)) {
                self._logger('Device attach...')
                // Utils.forEach(self._attachs, (callback) => callback(device));
                self.Event.emit('attach');
                self.isConnect = true;
                self.device = device
                self.init()
            }
        })
        this.on('detach', function (device) {
            let deviceDesc = device.deviceDescriptor
            if ((deviceDesc.idVendor == self.vid) && (deviceDesc.idProduct == self.pid)) {
                self._logger('Device detach...')
                // Message.warning('设备连接已断开！')
                // Utils.forEach(self._detachs, (callback) => callback(device))
                self.Event.emit('detach');
                self.isConnect = false;
            }
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
     * 监听设备事件 => on('attach', FUNCTION)
     * @param type {String} 监听的设备事件
     * @param listener {Function} 回调函数
     * @return {Function} 关闭监听的闭包函数
     */
    on (type, listener) {
        if (!Utils.isFunction(listener)) return false;
        usb.addListener(type, listener);
        return () => this.off(type, listener);
    }

    /**
     * 关闭监听设备事件 => off('attach', FUNCTION) 【不建议使用，可以使用监听时返回的闭包函数关闭】
     * @param type {String} 监听的设备事件
     * @param listener {Function} 回调函数(需原始回调函数)
     * @return {*}
     */
    off (type, listener) {
        if (!Utils.isFunction(listener)) return false;
        return usb.removeListener(type, listener);
    }

    /**
     * 监听设备接入（注意：这里是所有的USB设备）
     * @param listener {Function} 回调函数
     * @return {Function} 关闭监听闭包函数
     */
    attach (listener) {
        return this.on('attach', listener);
    }

    /**
     * 监听设备断开（注意：这里是所有的USB设备）
     * @param listener {Function} 回调函数
     * @return {Function} 关闭监听闭包函数
     */
    detach (listener) {
        return this.on('detach', listener);
    }

    /**
     * invode执行usb插件函数【废弃】
     * @param name
     * @return {boolean}
     */
    invoke (name) {
        if (this.device && Utils.isDefined(usb[name])) {
            var args = Utils.sliceArgs(arguments, 1)
            if (!args.length) {
                args.push({})
            }
            return usb[name].apply(null, args)
        }
        return false
    }

    /**
     * 设备初始化流程
     * @return {*}
     */
    init () {
        let device = this.device
        let openResult = this.open()
        if (openResult) {
            return this._logger('Device open ERROR:', openResult.message)
        }
        let deviceInterface = this.deviceInterface = device.interfaces[0]
        let claimResult = this.claim()
        if (claimResult) {
            return this._logger('Device claim ERROR:', claimResult.message)
        }
        this.endpoints = deviceInterface.endpoints
        this.inEndpoint = this.endpoints[0]
        this.outEndpoint = this.endpoints[1]

        // Message.success('设备连接成功！')
        this.createConnect()
        // let endpoints = deviceInterface.endpoints, inEndpoint = endpoints[0], outEndpoint = endpoints[1];
        return device
    }

    /**
     * 创建设备连接
     */
    createConnect () {
        let self = this,
          endpoints = self.endpoints,
          inEndpoint = this.inEndpoint,
          outEndpoint = this.outEndpoint
        if (inEndpoint.pollActive){
            return inEndpoint;
        }
        inEndpoint.startPoll()
        // inEndpoint.transferType = usb.LIBUSB_TRANSFER_TYPE_INTERRUPT
        inEndpoint.on('data', function (data) {
            self.autoTransfer(data)
            // TODO 调试代码
            // outBuffer.push(data)
            // self._logger('inEndpoint Data:', data.toString('utf-8'))
        })
        inEndpoint.on('end', function (data) {
            self._logger('inEndpoint end:', data)
        })
        inEndpoint.on('error', function (error) {
            self._logger('inEndpoint error:', error.message)
        })
    }

    /**
     * 查找实例指定的设备
     * @return {Object||undefined}
     */
    findDevice () {
        return usb.findByIds(this.vid, this.pid)
    }

    /**
     * 往设备传输指令数据
     * @param buffer {Buffer||String} 传送Buffer的指定数据
     * @return {*}
     */
    transfer (buffer){
        if (!this.outEndpoint) return Promise.reject(new Error('注意：设备未连接/实例化成功！'));
        let self = this;
        if (!Buffer.isBuffer(buffer)){
            buffer = Buffer.from([buffer])
        }
        return new Promise(function(resolve, reject){
            self.outEndpoint.transfer(buffer, function(error, data){
                if (error) {
                    reject(error);
                    self._logger('outEndpoint transfer Error:', error);
                } else {
                    resolve(data);
                    self._logger('outEndpoint transfer Success:', data);
                }
            })
        })
        // outEndpoint.on('error', function (data) {
        // 	self._logger('outEndpoint error:', data);
        // });
        // outEndpoint.on('end', function (data) {
        // 	self._logger('outEndpoint end:', data);
        // });
    }

    /**
     * 打开设备
     * @param flag {Boolean} 是否马上打开设备
     * @return {*}
     */
    open (flag) {
        let self = this
        flag = Utils.isDefined(flag) ? flag : true
        try {
            return self.device.open(!!flag)
        } catch (e) {
            return e
        }
    }

    /**
     * 获得设备交互接口
     * @return {*}
     */
    claim () {
        let self = this
        try {
            self.deviceInterface.endpoint(function (error) {
                self._logger('setAltSetting Error:', error.message)
            })
            return self.deviceInterface.claim()
        } catch (e) {
            return e
        }
    }

    /**
     * 销毁实例
     */
    destroy () {
        let self = this
        self.inEndpoint && self.inEndpoint.pollActive && self.inEndpoint.stopPoll(self._logger);
        self.outEndpoint && self.outEndpoint.pollActive && self.outEndpoint.stopPoll(self._logger);
        // self.device.reset();
        try {
            self.device.close();
        } catch (e){}
        self.device = null;
        self.deviceInterface = null;
        self.endpoints = null;
        self.inEndpoint = null;
        self.outEndpoint = null;
        usb && usb.removeAllListeners && usb.removeAllListeners();
        self.destroyBuffer && self.destroyBuffer();
    }
}

// 格创肺功能设备私有 设备交互方法
Utils.forEach(OUT_COMMADS, function(commad, key){
    USBPlugin.prototype[commadPrefix + key] = function(){
        return this.transfer(commad);
    }
})

// 调试代码
usb.setDebugLevel(4)
// window.usb = usb
// window.Utils = Utils
// let outBuffer = window.outBuffer = []
// let usbPlugin = window.usbPlugin = new USBPlugin();

export default USBPlugin
