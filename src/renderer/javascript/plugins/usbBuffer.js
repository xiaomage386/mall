import Utils from '@modules/Utils';
const EventEmitter = require('events').EventEmitter;

// 字节修正补齐数据
const CORRECT_OFFSET = 256;

// 不需要确保缓冲区没有试图写越界。（容易导致报错过载，建议设置为true打开）
const NO_ASSERT = true;

// 数据处理命令
const commands = {
    D3: '_FVC',
    D4: '_SVC',
    D5: '_MVV',
    BC: '_CALIBRATE',
    C1: '_CALIBRATE3',

    // 检测完后传输的值
    83: '_FVC_RESULT',
    D8: '_SVC_RESULT',
    DC: '_MVV_RESULT',
    E3: '_CALIBRATE_RESULT',
    C0: '_CALIBRATE_RESULT3',
    BA: '_BLOW_TIMEOUT',
    A5: '_DEVICE_IMEI',
    BE: '_VOICE_ON'
};

// Buffer数据处理流程
const BUFFER_TRANSFORM = {
    D3: 'bufferTransform',
    D4: 'bufferTransform',
    D5: 'bufferTransform',
    BC: 'bufferTransform',

    83: 'bufferTransform2',
    D8: 'bufferTransform2',
    DC: 'bufferTransform2',
    E3: 'bufferTransform2',
    BA: 'bufferTransform2',
    A5: 'bufferTransform2'
}

class USBBuffer {
    constructor (){
        this.Event = new EventEmitter();
    }

    _logger () {
        let args = Utils.sliceArgs(arguments);
        let sliceTag = ' ---------- ';
        args.unshift(sliceTag);
        args.push(sliceTag);
        window.console.log.apply(null, args);
    }

    /**
     * 获得Buffer数据命令代码（比如：D3）
     * @param buffer {Buffer} 设备返回的原始Buffer数据
     * @return {string|*}
     */
    getCommand (buffer){
        return Utils.toUpper(this.getRealValue(buffer.readInt8(0, NO_ASSERT)).toString(16));
    }

    /**
     * Buffer数据处理流程
     * @param buffer {Buffer} 设备返回的Buffer数据
     * @return {{command: (string|*), commandNumber: int, length: int, type: int, count: int, data, _raw: *}}
     */
    bufferTransform (buffer) {
        if (!Buffer.isBuffer(buffer)) {
            throw new Error('need buffer of Buffer type!');
        }
        let self = this;
        let fieldLength = 5;
        let length = self.getRealValue(buffer.readInt8(1, NO_ASSERT)),
          bufferData = buffer.slice(fieldLength, length);
        return {
            command: self.getCommand(buffer),
            length: length,
            type: self.getRealValue(buffer.readInt8(2, NO_ASSERT)),
            count: self.getRealValue(buffer.readInt16LE(3, NO_ASSERT)),
            // _raw: buffer,
            data: bufferData
        }
    }

    /**
     * Buffer数据处理流程 (第二套)
     * @param buffer {Buffer} 设备返回的原始Buffer数据
     * @return {{command: (string|*), length: int, data}}
     */
    bufferTransform2 (buffer) {
        if (!Buffer.isBuffer(buffer)) {
            throw new Error('need buffer of Buffer type!');
        }
        let self = this;
        let fieldLength = 2;
        let length = self.getRealValue(buffer.readInt8(1, NO_ASSERT)),
          bufferData = buffer.slice(fieldLength, length);
        return {
            command: self.getCommand(buffer),
            length: length,
            _raw: buffer,
            data: bufferData
        }
    }

    /**
     * 获取Buffer数据的真实数据 【根据协议，当数据小于零的时候，加上修正数据】
     * @param value {int} Buffer的数据
     * @return {int}
     */
    getRealValue (value) {
        return value >= 0 ? value : (value + CORRECT_OFFSET);
    }

    /**
     * 设备Buffer数据自动分流处理流程
     * @param buffer {Buffer} 设备返回的Buffer数据
     * @return {*}
     */
    autoTransfer (buffer) {
        let _command = this.getCommand(buffer);
        // TODO 测试代码
        // this._logger('Buffer command:', _command);
        let response = this[ BUFFER_TRANSFORM[_command] || 'bufferTransform' ](buffer);
        let command = response ? response['command'] : ''
        if (!commands[command] || !this[commands[command]]) {
            return false;
        }
        return this[commands[command]](response);
    }

    /**
     * 监听指定格式数据 => on('FVC', FUNCTION)
     * @param type {String} 监听的数据格式【具体看变量：commands】
     * @param listener {Function} 回调函数
     * @return {Function} 关闭监听的闭包函数
     */
    onBuffer (type, listener) {
        if (!Utils.isFunction(listener)) return false;
        this.Event.addListener(type, listener);
        return () => this.offBuffer(type, listener);
    }

    /**
     * 关闭数据监听 => off('FVC', FUNCTION) 【不建议使用，可以使用监听时返回的闭包函数关闭】
     * @param type {String} 监听的数据格式【具体看变量：commands】
     * @param listener {Function} 回调函数(需原始回调函数)
     * @return {*}
     */
    offBuffer (type, listener) {
        if (!Utils.isFunction(listener)) return false;
        return this.Event.removeListener(type, listener);
    }

    /**
     * 触发监听响应
     * @param type {String} 监听的数据格式【具体看变量：commands】
     * @param data {Object} 监听回调函数的参数
     */
    triggerBuffer (type, data) {
        return this.Event.emit.apply(this.Event, arguments);
    }

    /**
     * 销毁实例
     */
    destroyBuffer () {
        this.Event && this.Event.removeAllListeners();
    }

    /**
     * Buffer数据转换(按指定索引偏移读取数据)【16位无符号整数（Little Endian）小端模式】
     * @param bufferData {Buffer} usb返回的Buffer数据
     * @param sliceNum {int} 数据切片读取数量【选填，默认：2】
     * @param offset {int} 数据读取索引偏移【选填，默认空】
     * @return {Array} USB设备实际数据数组集合
     * @private
     */
    _dataTransfer(bufferData, sliceNum, offset){
        if (!Buffer.isBuffer(bufferData)) return false;
        sliceNum = Utils.isNumber(sliceNum) ? sliceNum : 2;
        if (Utils.isNumber(offset)) {
            bufferData = bufferData.slice(offset);
        }
        let data = [];
        bufferData.forEach(function(value, index){
            if (index % sliceNum == 0){
                data.push(bufferData.readUInt16LE(index, NO_ASSERT));
            }
        });
        return data;
    }

    /**
     * Buffer数据转换(按指定索引偏移读取数据)【8位无符号整数（Little Endian）小端模式】
     * @param bufferData {Buffer} usb返回的Buffer数据
     * @param sliceNum {int} 数据切片读取数量【选填，默认：2】
     * @param offset {int} 数据读取索引偏移【选填，默认空】
     * @return {Array} USB设备实际数据数组集合
     * @private
     */
    _dataTransferUInt8(bufferData, sliceNum, offset){
        if (!Buffer.isBuffer(bufferData)) return false;
        sliceNum = Utils.isNumber(sliceNum) ? sliceNum : 2;
        if (Utils.isNumber(offset)) {
            bufferData = bufferData.slice(offset);
        }
        let data = [];
        bufferData.forEach(function(value, index){
            if (index % sliceNum == 0){
                data.push(bufferData.readUInt8(index, NO_ASSERT));
            }
        });
        return data;
    }

    /**
     * Buffer数据转换(按指定索引偏移读取数据)【单精度浮点数（Little Endian）小端模式】
     * @param bufferData {Buffer} usb返回的Buffer数据
     * @param sliceNum {int} 数据切片读取数量【选填，默认：4】
     * @param offset {int} 数据读取索引偏移【选填，默认空】
     * @return {Array} USB设备实际数据数组集合
     * @private
     */
    _dataTransferFloatLE(bufferData, sliceNum, offset){
        if (!Buffer.isBuffer(bufferData)) return false;
        sliceNum = Utils.isNumber(sliceNum) ? sliceNum : 4;
        if (Utils.isNumber(offset)) {
            bufferData = bufferData.slice(offset);
        }
        let data = [];
        bufferData.forEach(function(value, index){
            if (index % sliceNum == 0){
                data.push(bufferData.readFloatLE(index, NO_ASSERT));
            }
        });
        return data;
    }

    /**
     * FVC实时数据处理流程
     * @param response {object} 数据由this.bufferTransform函数格式化的格式；
     * @return {*}
     * @private
     */
    _FVC (response) {
        response['data'] = this._dataTransfer(response['data']);
        return this.triggerBuffer('FVC', response);
    }

    /**
     * 设备吹气超时处理流程
     * @param response {object} 数据由this.bufferTransform函数格式化的格式；
     * @return {*}
     * @private
     */
    _BLOW_TIMEOUT (response) {
        response['data'] = this._dataTransfer(response['data']);
        return this.triggerBuffer('BLOW_TIMEOUT', response);
    }

    _DEVICE_IMEI (response) {
        response['imei'] = response['data'].toString();
        return this.triggerBuffer('DEVICE_IMEI', response);
    }

    /**
     * 获取设备声音开关
     * @param {*} response
     */
    _VOICE_ON (response) {
        // response['data'] = response['type']
        return this.triggerBuffer('VOICE_ON', response);
    }

    /**
     * SVC实时数据处理流程
     * @param response {object} 数据由this.bufferTransform函数格式化的格式；
     * @return {*}
     * @private
     */
    _SVC (response) {
        response['data'] = this._dataTransfer(response['data']);
        return this.triggerBuffer('SVC', response);
    }

    /**
     * MVV实时数据处理流程
     * @param response {object} 数据由this.bufferTransform函数格式化的格式；
     * @return {*}
     * @private
     */
    _MVV (response) {
        response['data'] = this._dataTransfer(response['data']);
        return this.triggerBuffer('MVV', response);
    }

    /**
     * 定标实时数据处理流程
     * @param response {object} 数据由this.bufferTransform函数格式化的格式；
     * @return {*}
     * @private
     */
    _CALIBRATE (response) {
        response['data'] = this._dataTransfer(response['data']);
        return this.triggerBuffer('CALIBRATE', response);
    }

    /**
     * 3流量定标验证实时数据处理流程
     * @param response {object} 数据由this.bufferTransform函数格式化的格式；
     * @return {*}
     * @private
     */
    _CALIBRATE3 (response) {
        response['data'] = this._dataTransfer(response['data']);
        return this.triggerBuffer('CALIBRATE3', response);
    }

    /**
     * FVC检测完成后数据处理流程
     * @param response {object} 数据由this.bufferTransform2函数格式化的格式；
     * @return {*}
     * @private
     */
    _FVC_RESULT (response) {
        let _bufferData = response['data'] || [];
        // 先单独计算PEF
        let PEFBuffer = _bufferData.slice(0, 2);
        response['PEF'] = this._dataTransfer(PEFBuffer)[0];
        // 单精度浮点数：FEV1,FVC,MMEF,FEF75,FEF50,FEF25,FEV6,FVCIN,FIV1,Vex,FIF50
        let floatLEBuffer = _bufferData.slice(2, 46);
        let _data = this._dataTransferFloatLE(floatLEBuffer);
        response['FEV1'] = this.toFixed(_data[0]);
        response['FVC'] = this.toFixed(_data[1]);
        response['MMEF'] = this.toFixed(_data[2]);
        response['FEF75'] = this.toFixed(_data[3]);
        response['FEF50'] = this.toFixed(_data[4]);
        response['FEF25'] = this.toFixed(_data[5]);
        response['FEV6'] = this.toFixed(_data[6]);
        response['FVC_IN'] = this.toFixed(_data[7]);
        response['FIV1'] = this.toFixed(_data[8]);
        response['VEX'] = this.toFixed(_data[9]);
        response['FIF50'] = this.toFixed(_data[10]);
        // 16位无符号整数：PIF TEX,TIN
        let uInt16LEBuffer = _bufferData.slice(46, 52);
        let _data16LE = this._dataTransfer(uInt16LEBuffer);
        response['PIF'] = _data16LE[0];
        response['TEX'] = _data16LE[1];
        response['TIN'] = _data16LE[2];
        // 16位无符号整数：FEF200-1200,MEP,MIP
        let uInt16LEBuffer2 = _bufferData.slice(52, 58);
        let _data16LE2 = this._dataTransfer(uInt16LEBuffer2);
        response['FEF200-1200'] = _data16LE2[0];
        response['MEP'] = _data16LE2[1];
        response['MIP'] = _data16LE2[2];
        return this.triggerBuffer('FVC_RESULT', response);
    }

    /**
     * SVC检测完成后数据处理流程
     * @param response {object} 数据由this.bufferTransform2函数格式化的格式；
     * @return {*}
     * @private
     */
    _SVC_RESULT(response) {
        let _bufferData = response['data'] || [];
        let floatLEBuffer = _bufferData.slice(0, 32)
        let _data = this._dataTransferFloatLE(floatLEBuffer);
        response['VCIN'] = this.toFixed(_data[0]);
        response['IC'] = this.toFixed(_data[1]);
        response['ERV'] = this.toFixed(_data[2]);
        response['VT'] = this.toFixed(_data[3]);
        response['MV'] = this.toFixed(_data[4]);
        response['IRV'] = this.toFixed(_data[5]);
        response['VCEX'] = this.toFixed(_data[6]);
        response['VCMAX'] = this.toFixed(_data[7]);
        let bf = this._dataTransferUInt8(_bufferData.slice(32));
        response['BF'] = bf ? bf[0] : ''
        return this.triggerBuffer('SVC_RESULT', response);
    }

     /**
     * MVV检测完成后数据处理流程
     * @param response {object} 数据由this.bufferTransform2函数格式化的格式；
     * @return {*}
     * @private
     */
    _MVV_RESULT(response) {
        let _bufferData = response['data'] || [];
        let floatLEBuffer = _bufferData.slice(0, 8)
        let _data = this._dataTransferFloatLE(floatLEBuffer);
        response['MVV'] = this.toFixed(_data[0]);
        response['VTMVV'] = this.toFixed(_data[1]);
        let uInt16LEBuffer = _bufferData.slice(8, 10);
        let _data16LE = this._dataTransfer(uInt16LEBuffer);
        response['TIMEMVV'] = _data16LE[0];
        let BFMVV = this._dataTransferUInt8(_bufferData.slice(10));
        response['BFMVV'] = BFMVV ? BFMVV[0] : ''
        return this.triggerBuffer('MVV_RESULT', response);
    }

     /**
     * 定标检测完成后数据处理流程
     * @param response {object} 数据由this.bufferTransform2函数格式化的格式；
     * @return {*}
     * @private
     */
    _CALIBRATE_RESULT(response) {
        let _bufferData = response['data'] || [];
        let floatLEBuffer = _bufferData.slice(0, 24)
        let _data = this._dataTransferFloatLE(floatLEBuffer);
        response['capacityEx'] = this.toFixed(_data[0]);
        response['flowEx'] = this.toFixed(_data[1]);
        response['gainEx'] = this.toFixed(_data[2], 3);
        response['capacityIn'] = this.toFixed(_data[3]);
        response['flowIn'] = this.toFixed(_data[4]);
        response['gainIn'] = this.toFixed(_data[5], 3);
        response['temperature'] = this.toFixed(_bufferData.slice(24, 25)[0]);
        response['humidity'] = this.toFixed(_bufferData.slice(25, 26)[0]);
        let uInt8LEBuffer = _bufferData.slice(26, 30);
        let _data8LE = this._dataTransfer(uInt8LEBuffer);
        response['pressure'] = _data8LE[0];
        response['altitude'] = _data8LE[1];
        return this.triggerBuffer('CALIBRATE_RESULT', response);
    }

    /**
     * 3流量定标验证检测完成后数据处理流程
     * @param response {object} 数据由this.bufferTransform2函数格式化的格式；
     * @return {*}
     * @private
     */
    _CALIBRATE_RESULT3(response) {
        let _bufferData = response['data'] || [];
        let floatLEBuffer = _bufferData.slice(0, 24)
        let _data = this._dataTransferFloatLE(floatLEBuffer);
        response['capacityEx'] = this.toFixed(_data[0]);
        response['flowEx'] = this.toFixed(_data[1]);
        response['gainEx'] = this.toFixed(_data[2]);
        response['capacityIn'] = this.toFixed(_data[3]);
        response['flowIn'] = this.toFixed(_data[4]);
        response['gainIn'] = this.toFixed(_data[5]);
        response['temperature'] = this.toFixed(_bufferData.slice(24, 25)[0]);
        response['humidity'] = this.toFixed(_bufferData.slice(25, 26)[0]);
        let uInt8LEBuffer = _bufferData.slice(26, 30);
        let _data8LE = this._dataTransfer(uInt8LEBuffer);
        response['pressure'] = _data8LE[0];
        response['altitude'] = _data8LE[1];
        return this.triggerBuffer('CALIBRATE_RESULT3', response);
    }

    /**
     * 计算PEF保留位数
     * @param number {number} 需要计算的数字
     * @param offset {int} 需要保留的位数长度【选填，默认：2】
     * @return {Number}
     */
    toFixed(number = 0, offset) {
        return parseFloat(number.toFixed(offset || 2)) || 0;
    }
}

// let usbBuffer = window.usbBuffer = new USBBuffer()
// // 监听数据
// usbBuffer.onBuffer('FVC_RESULT', function(response){
//     usbBuffer._logger('FVC_RESULT Data:', response)
// })

export default USBBuffer
