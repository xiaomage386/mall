import BaseService from '@services/baseService'
import Utils from '@modules/Utils'
import HIDPlugin from '@plugins/hidPlugin'
import bufferData from '@plugins/bufferData'

// TODO：下次更新可考虑改用新Promise库 Q： https://github.com/kriskowal/q
const hidPlugin = new HIDPlugin();

class USBService extends BaseService {
    constructor() {
        super()
        this.usbPlugin = hidPlugin;

        // FVC计算偏移值
        this.FVC_OFFSET = 0;
    }

    /**
     * 记录日志Log
     * @return {*}
     * @private
     */
    _logger() {
        return this.usbPlugin._logger ? this.usbPlugin._logger.apply(null, arguments) : window.log.apply(null, arguments);
    }

      /**
     * FVC开始呼气【设备控制】
     * @return {Promise}
     */
    Blow() {
        return this.usbPlugin.Blow()
        // return this.triggerBuffer();
    }

    /**
     * SVC开始呼气【设备控制】
     * @return {Promise}
     */
    SVCBlow() {
        return this.usbPlugin.SVCBlow()
        // return this.triggerBuffer();
    }

    /**
     * MVV开始呼气【设备控制】
     * @return {Promise}
     */
    MVVBlow() {
        return this.usbPlugin.MVVBlow()
        // return this.triggerBuffer();
    }

    /**
     * 定标开始呼气【设备控制】
     * @param calibration {Number} 定标升数，单位：L(升)【2：2L, 3: 3L】
     * @param temperature {Number} 环境温度，单位：℃(摄氏度)
     * @param humidity {Number} 环境湿度，单位：%(百分比)
     * @param pressure {Number} 大气压力，单位：mmHg
     * @param altitude {Number} 海拔高度，单位：m(米)
     * @return {Promise}
     */
    calibrateBlow(calibration, temperature, humidity, pressure, altitude) {
        return this.usbPlugin.calibrateBlow(calibration, temperature, humidity, pressure, altitude)
        // return this.triggerBuffer();
    }

    /**
     * 3流量定标开始呼气【设备控制】
     * @param calibration {Number} 定标升数，单位：L(升)【2：2L, 3: 3L】
     * @param temperature {Number} 环境温度，单位：℃(摄氏度)
     * @param humidity {Number} 环境湿度，单位：%(百分比)
     * @param pressure {Number} 大气压力，单位：mmHg
     * @param altitude {Number} 海拔高度，单位：m(米)
     * @return {Promise}
     */
    calibrateBlow3(calibration, temperature, humidity, pressure, altitude) {
        return this.usbPlugin.calibrateBlow3(calibration, temperature, humidity, pressure, altitude)
        // return this.triggerBuffer();
    }

    /**
     * 声音开关控制【设备控制】
     * @return {Promise}
     */
    voiceSwitchBlow(config) {
        return this.usbPlugin.voiceSwitchBlow(config)
    }

    /**
     * 定标系数信息接口
     * @param calibration {Number} 定标结果
     * @param caliParaIn {Number} 吸气校准系数
     * @param caliParaEx {Number} 呼气校准系数
     * @return {Promise}
     */
    calibration(calibration, caliParaIn, caliParaEx) {
        return this.usbPlugin.calibration(calibration, caliParaIn, caliParaEx)
        // return this.triggerBuffer();
    }

     /**
    * 传输检测人信息接口
    * @param model {Strong} 预计值模式
    * @param gender {Number} 性别 0：男  1：女
    * @param age {Number} 年龄，单位 ：岁
    * @param height {Number} 身高，单位：cm
    * @param weight {Number} 体重，单位：kg
     * @return {Promise}
     */

    transferUserInfo(model, gender, age, height, weight) {
        return this.usbPlugin.transferUserInfo(model, gender, age, height, weight)
    }

    /**
     * 结束呼气【设备控制】
     * @return {Promise}
     */
    cancelBlow() {
        return this.usbPlugin.cancelBlow()
        // return Promise.resolve()
    }

    /**
     * 计算PEF保留位数
     * @param number {number} 需要计算的数字
     * @param offset {int} 需要保留的位数长度【选填，默认：6】
     * @return {Number}
     */
    toFixed(number, offset) {
        return parseFloat(number.toFixed(offset || 6))
    }

    /**
     * 计算PEF值正反类型
     * @param number {number} 需要计算的数字
     * @param type {int} 呼、吸气类型值
     * @return {Number}
     */
    inverse(number, type) {
        if (type == 1) {
            return number * -1
        }
        return number
    }

    /**
     * 获得数组=>对象的value字段最大值，返回当前对象
     */
    getMaxValue(items) {
        let _values = [];
        Utils.forEach(items, function (item) {
            _values.push(item.value || 0)
        });
        let maxVal = Math.max.apply(null, _values);
        let maxIndex = Utils.findIndex(_values, function (value) {
            return value == maxVal;
        });
        return items[maxIndex]
    }

    /**
     * 获得数组=>对象的FVC字段最大值，返回当前对象
     */
    getMaxFVC(items) {
        let _values = [];
        Utils.forEach(items, function (item) {
            _values.push(item.fvc || 0)
        });
        let maxVal = Math.max.apply(null, _values);
        let maxIndex = Utils.findIndex(_values, function (value) {
            return value == maxVal;
        });
        return items[maxIndex]
    }

    /**
     * 开始呼气 并 取得设备返回数据
     * @param listener {Function} 监听设备返回数据
     * @param speedListener {Function} 监听设备返回：呼气、吸气流速监测
     * @param flowListener {Function} 监听设备返回：呼气时间、呼气末流量
     * @param config {Object} 是否对返回数据做调节处理【选填，默认：{isThrottle:false, expectDVT:Undefined}】
     * @returns {Promise<any>}
     */
    startFVC(listener, speedListener, flowListener, config) {
        let self = this;
        listener = Utils.isFunction(listener) ? listener : Utils.noop;
        speedListener = Utils.isFunction(speedListener) ? speedListener : Utils.noop;
        flowListener = Utils.isFunction(flowListener) ? flowListener : Utils.noop;
        let _config = Utils.extend({ isThrottle: false }, config);
        listener = _config.isThrottle ? Utils.throttle(listener) : listener;
        // dVT预计值
        let expectDVT = Utils.isNumber(_config.expectDVT) ? _config.expectDVT : 0;
        return (new Promise(function (resolve, reject) {
            // 传输检测人信息接口
            self.transferUserInfo(
                _config.model,
                _config.gender,
                _config.age,
                _config.height,
                _config.weight
            ).then(() => {}, reject)
            setTimeout(() => {
                self.Blow().then(function () {
                    let fvcIndex = 0,
                        countFvc = 0,
                        countTimeFvc = 0,
                        isTestOver = false,
                        FVC_TYPE = ['blow', 'inhale'],
                        results = {
                            graps: []
                        };
                    let getMaxValue = self.getMaxValue;
                    // 结束测试流程
                    let stopTestAction = function () {
                        cancelBuffer && cancelBuffer();
                        cancelFvcResult && cancelFvcResult();
                        watchBlowTimeout && watchBlowTimeout();
                        watchDeviceDetach && watchDeviceDetach();
                    }
                    // 拔出设备结束所有流程
                    let watchDeviceDetach = self.usbPlugin.detach(() => {
                        reject('break')
                        stopTestAction()
                    })
                    // 超时处理(设备处理超时)
                    let watchBlowTimeout = self.usbPlugin.onBuffer('BLOW_TIMEOUT', function (data) {
                        listener(data, 0)
                        console.log(data)
                        let word = ''
                        if (data['data'][0] == 255) {
                            word = '抱歉，测试流程超时，请重试！'
                        } else if (data['data'][0] == 2) {
                            word = '您当前的测试方式不正确，请重新测试！'
                        } else {
                            word = '测试方式结果错误，请重新测试！'
                        }
                        if (isTestOver) return;
                        stopTestAction();
                        reject(new Error(word));
                        self.cancelBlow();
                    })
                    // 超时处理：15秒
                    // let watchBuffer = Utils.debounce(function () {
                    //     if (isTestOver) return;
                    //     stopTestAction();
                    //     reject(new Error('抱歉，测试流程超时，请重试！'));
                    //     self.cancelBlow();
                    // }, 15000);

                    // 测试流程结束
                    let cancelFvcResult = self.usbPlugin.onBuffer('FVC_RESULT', function (response) {
                        stopTestAction();
                        // 处理接口所需数据
                        results['fvc'] = response['FVC'] || '';
                        results['fev1'] = response['FEV1'] || '';
                        results['fev6'] = response['FEV6'] || '';
                        results['pef'] = response['PEF'] || '';
                        results['fef2575'] = response['MMEF'] || '';
                        results['fef25'] = response['FEF25'] || '';
                        results['fef50'] = response['FEF50'] || '';
                        results['fef75'] = response['FEF75'] || '';
                        results['fvcin'] = response['FVC_IN'] || '';
                        results['fiv1'] = response['FIV1'] || '';
                        results['vex'] = response['VEX'] || '';
                        results['fif50'] = response['FIF50'] || '';
                        results['pif'] = response['PIF'] || '';
                        results['fef200_1200'] = response['FEF200-1200'] || '';
                        results['mep'] = response['MEP'] || '';
                        results['mip'] = response['MIP'] || '';
                        results['tex'] = response['TEX'] || '';
                        results['tin'] = response['TIN'] || '';
                        // 设备缺少字段
                        results['evol'] = response['EVOL'] || '';
                        results['fivc'] = response['FIVC'] || '';
                        results['mvv'] = response['MVV'] || '';

                        // 获得呼气末流量(L/s)
                        // let _maxSpeeds = [];
                        // Utils.forEach(blows, function (item) {
                        //     let maxValueItem = getMaxValue(item);
                        //     _maxSpeeds.push(maxValueItem && maxValueItem.pef || 0)
                        // })
                        // let _maxSpeed = Math.max.apply(null, _maxSpeeds);
                        // let realIndex = Utils.findIndex(_maxSpeeds, function (value) {
                        //     return value == _maxSpeed
                        // })
                        // let lastSpeed = null;
                        // Utils.forEachRight(blows[realIndex] || [], function (item) {
                        //     if (item.pef != 0){
                        //         lastSpeed = item.pef;
                        //         return false;
                        //     }
                        // });
                        // 呼气末流量(L/s)
                        results['_lastSpeed'] = _lastSpeed;

                        resolve(results);
                        isTestOver = true;
                        self.cancelBlow();
                    });
                    // 测试进行中数据监听
                    let lastType, blows = [], inhales = [], timeBlows = [], timeInhales = [], changeIndex = 0, countDVT = 0, isSpeedStop = false;
                    let tmpBlow = [], tmpInhale = [];
                    let texData = [], lastSpeedData = [], _lastSpeedData = []
                    let _tex = 0, _lastSpeed = 0, testIndex = 0
                    let isTypeChange = false
                    let indexData = {0: []}
                    let cancelBuffer = self.usbPlugin.onBuffer('FVC', function (data) {
                        let _type = data['type'];
                        let _count = data['count'];
                        let _data = data['data'] || [];
                        let _dataObj = [];
                        let _timeDataObj = [];
                        Utils.forEach(_data, function (value) {
                            // 计算PEF值
                            let pef = self.inverse(value, _type);
                            countFvc += pef;
                            pef = self.toFixed(pef / 60);
                            let fvc = self.toFixed(countFvc / 6000);
                            let _result = {
                                value: value,
                                order: fvcIndex++,
                                fvc: fvc,
                                pef: pef,
                                type: FVC_TYPE[_type] || 'NONE',
                                time: fvcIndex * 0.01
                            };
                            if (_result['type'] === 'NONE') {
                                console.log(_result)
                                self._logger('吹气类型格式错误！');
                            }
                            if (_result['type'] !== 'NONE') {
                                _dataObj.push(_result);
                                results.graps.push(_result);
                            }

                            // 计算通气测定法数据 (呼、吸气与上方刚好取反)
                            let timeType = _type == 0 ? 1 : 0;
                            let timePef = self.inverse(value, timeType);
                            countTimeFvc += timePef;
                            let _resultTime = {
                                time: fvcIndex * 0.01,
                                fvc: self.toFixed(countTimeFvc / 6000)
                            }

                            // 呼气的数据
                            if (isTypeChange != _type && _type == 0) {
                                testIndex += 1
                                indexData[testIndex] = []
                                lastSpeedData = _lastSpeedData.concat()
                                _lastSpeedData = []
                            }
                            isTypeChange = _type
                            if (_type == 0) {
                                _lastSpeedData.push(_result)
                                indexData[testIndex].push(_resultTime)
                            }
                            if (_result['type'] !== 'NONE') {
                                listener(_result, _resultTime);
                                _dataObj.push(_result);
                                _timeDataObj.push(_resultTime);
                            }
                        });

                        // 未传入预计值，中断计算流速监测数据
                        if (!expectDVT) return;
                        // 最后一组数据
                        let isModeChange = lastType != _type;

                        // 动态计算呼吸末流量和呼吸时间
                        if (isModeChange && isSpeedStop && _type == 0) {
                            texData = indexData[testIndex - 1]
                            Utils.forEachRight(lastSpeedData || [], function (item) {
                                if (item.pef != 0){
                                    _lastSpeed = item.pef > _lastSpeed ? item.pef : _lastSpeed;
                                    lastSpeedData = []
                                    return false;
                                }
                            });
                            if (Utils.size(texData)) {
                                let time = texData.length * 0.01
                                _tex = time > _tex ? time : _tex
                                texData = []
                            }
                            flowListener(_tex, _lastSpeed)
                        }
                        // 呼气时间和呼气流速监测
                        if (_type == 0) {
                            if (isModeChange) {
                            //    blows.push(tmpBlow);
                            //    tmpBlow = []
                                blows.push(_dataObj);
                                timeBlows.push(_timeDataObj);
                            }
                        //    tmpBlow.push.apply(tmpBlow, _dataObj);
                        } else if (_type == 1) {
                            if (isModeChange) {
                            //    inhales.push(tmpInhale);
                            //    tmpInhale = [];
                                inhales.push(_dataObj);
                                timeInhales.push(_timeDataObj);
                            }
                        //    tmpInhale.push.apply(tmpInhale, _dataObj);
                        }
                        // 开始计算DVT、BF值
                        if (isModeChange && changeIndex >= 2) {
                            let lastBlow = timeBlows[timeBlows.length - 1] || null;
                            let afterInhale = timeBlows[timeBlows.length - 2] || null;
                            let lastInhale = timeInhales[timeInhales.length - 1] || null;
                            if (!isSpeedStop) {
                                if (lastBlow && afterInhale) {
                                    let maxBlowItem = lastBlow[lastBlow.length - 1];
                                    let afterMaxBlowItem = afterInhale[afterInhale.length - 1];
                                    let maxInhaleItem = lastInhale[lastInhale.length - 1];
                                    let maxBlow = maxBlowItem.fvc;
                                    let maxInhale = maxInhaleItem.fvc;
                                    // 呼气、吸气波峰相减绝对值
                                    let apexABS = (Math.abs(maxBlow - maxInhale) * 1000) || 0;
                                    if (apexABS >= (expectDVT * 2)){
                                        isSpeedStop = true;
                                        speedListener(isSpeedStop);
                                        _lastSpeedData = []
                                    } else {
                                        countDVT += apexABS;
                                        // 由于触发时间为最后一次流程结束后，所以真实平均次数需要减1
                                        let realChangeIndex = changeIndex - 1;
                                        // DVT
                                        let _dVT = (countDVT / realChangeIndex) || null;
                                        // self._logger('dVT(%):', _dVT);
                                        // BF值
                                        let maxBlowTime = maxBlowItem.time;
                                        let maxInhaleTime = afterMaxBlowItem.time;
                                        let _BF = 60 / (Math.abs(maxBlowTime - maxInhaleTime));
                                        // self._logger('BF(L/min):', _dVT);
                                        speedListener(false, _dVT, _BF);
                                    }
                                }
                            }
                        }
                        lastType = _type;
                        isModeChange && changeIndex++;
                    });
                }, reject)
            }, 10);
        }))
    }

    /**
     * 开始呼气 并 取得设备返回数据
     * @param listener {Function} 监听设备返回数据
     * @param speedListener {Function} 监听设备返回：呼气、吸气流速监测
     * @param flowListener {Function} 监听设备返回：呼气时间、呼气末流量
     * @param config {Object} 是否对返回数据做调节处理【选填，默认：{isThrottle:false, expectDVT:Undefined}】
     * @returns {Promise<any>}
     */
    startMVV(listener, speedListener, flowListener, config) {
        let self = this;
        listener = Utils.isFunction(listener) ? listener : Utils.noop;
        speedListener = Utils.isFunction(speedListener) ? speedListener : Utils.noop;
        flowListener = Utils.isFunction(flowListener) ? flowListener : Utils.noop;
        let _config = Utils.extend({ isThrottle: false }, config);
        listener = _config.isThrottle ? Utils.throttle(listener) : listener;
        window.listener = listener
        // dVT预计值
        let expectDVT = Utils.isNumber(_config.expectDVT) ? _config.expectDVT : 0;
        return (new Promise(function (resolve, reject) {
            // 传输检测人信息接口
            self.transferUserInfo(
                _config.model,
                _config.gender,
                _config.age,
                _config.height,
                _config.weight
            ).then(() => {}, reject)
            setTimeout(() => {
                self.MVVBlow().then(function () {
                    let fvcIndex = 0,
                        countFvc = 0,
                        APIcountFvc = 0,
                        countTimeFvc = 0,
                        isTestOver = false,
                        FVC_TYPE = ['blow', 'inhale'],
                        results = {
                            graps: []
                        };
                    let getMaxValue = self.getMaxValue;
                    // 结束测试流程
                    let stopTestAction = function () {
                        cancelBuffer && cancelBuffer();
                        cancelFvcResult && cancelFvcResult();
                        watchBlowTimeout && watchBlowTimeout();
                        watchDeviceDetach && watchDeviceDetach();
                    }
                    // 拔出设备结束所有流程
                    let watchDeviceDetach = self.usbPlugin.detach(() => {
                        reject('break')
                        stopTestAction()
                    })
                    // 超时处理(设备处理超时)
                    let watchBlowTimeout = self.usbPlugin.onBuffer('BLOW_TIMEOUT', function (data) {
                        console.log(data)
                        listener(data, 0)
                        let word = ''
                        if (data['data'][0] == 255) {
                            word = '抱歉，测试流程超时，请重试！'
                        } else if (data['data'][0] == 2) {
                            word = '您当前的测试方式不正确，请重新测试！'
                        } else {
                            word = '测试方式结果错误，请重新测试！'
                        }
                        if (isTestOver) return;
                        stopTestAction();
                        reject(new Error(word));
                        self.cancelBlow();
                    })
                    // 超时处理：15秒
                    // let watchBuffer = Utils.debounce(function () {
                    //     if (isTestOver) return;
                    //     stopTestAction();
                    //     reject(new Error('抱歉，测试流程超时，请重试！'));
                    //     self.cancelBlow();
                    // }, 15000);

                    // 测试流程结束
                    let cancelFvcResult = self.usbPlugin.onBuffer('MVV_RESULT', function (response) {
                        stopTestAction();
                        // 处理接口所需数据
                        results['mvv'] = response['MVV'] || '';
                        results['vtmvv'] = response['VTMVV'] || '';
                        results['bfmvv'] = response['BFMVV'] || '';
                        results['timemvv'] = response['TIMEMVV'] || '';

                        // 获得呼气末流量(L/s)
                        // let _maxSpeeds = [];
                        // Utils.forEach(blows, function (item) {
                        //     let maxValueItem = getMaxValue(item);
                        //     _maxSpeeds.push(maxValueItem && maxValueItem.pef || 0)
                        // })
                        // let _maxSpeed = Math.max.apply(null, _maxSpeeds);
                        // let realIndex = Utils.findIndex(_maxSpeeds, function (value) {
                        //     return value == _maxSpeed
                        // })
                        // let lastSpeed = null;
                        // Utils.forEachRight(blows[realIndex] || [], function (item) {
                        //     if (item.pef != 0){
                        //         lastSpeed = item.pef;
                        //         return false;
                        //     }
                        // });
                        // 呼气末流量(L/s)
                        results['_lastSpeed'] = _lastSpeed;
                        // 呼气时间(秒)
                        results['tex'] = _tex || 0

                        resolve(results);
                        isTestOver = true;
                        self.cancelBlow();
                    });
                    // 测试进行中数据监听
                    let lastType, blows = [], inhales = [], timeBlows = [], timeInhales = [], changeIndex = 0, countDVT = 0, isSpeedStop = false;
                    let tmpBlow = [], tmpInhale = [];
                    let texData = [], lastSpeedData = [], _lastSpeedData = []
                    let _tex = 0, _lastSpeed = 0, testIndex = 0
                    let isTypeChange = false
                    let indexData = {0: []}
                    let cancelBuffer = self.usbPlugin.onBuffer('MVV', function (data) {
                        let _type = data['type'];
                        let _count = data['count'];
                        let _data = data['data'] || [];
                        let _dataObj = [];
                        let _timeDataObj = [];
                        Utils.forEach(_data, function (value) {
                            // 计算PEF值
                            let pef = ''
                            let APIPef = ''
                            if (_type == 1) {
                                pef = self.inverse(0, _type)
                            } else {
                                pef = self.inverse(value, _type);
                            }
                            APIPef = self.inverse(value, _type);
                            countFvc += pef;
                            APIcountFvc += APIPef;
                            pef = self.toFixed(pef / 60);
                            APIPef = self.toFixed(APIPef / 60);
                            let fvc = self.toFixed(countFvc / 6000);
                            let APIfvc = self.toFixed(APIcountFvc / 6000);
                            let _result = {
                                value: value,
                                order: fvcIndex++,
                                fvc: fvc,
                                pef: pef,
                                type: FVC_TYPE[_type] || 'NONE',
                                time: fvcIndex * 0.01
                            };

                            let _ApiResult = {}
                            Utils.extend(_ApiResult, _result, {pef: APIPef, fvc: APIfvc})
                            if (_result['type'] === 'NONE') {
                                self._logger('吹气类型格式错误！');
                            }
                            if (_result['type'] !== 'NONE') {
                                results.graps.push(_ApiResult);
                            }

                            // 计算通气测定法数据 (呼、吸气与上方刚好取反)
                            let timeType = _type == 0 ? 1 : 0;
                            let timePef = self.inverse(value, timeType);
                            countTimeFvc += timePef;
                            let _resultTime = {
                                time: fvcIndex * 0.01,
                                fvc: self.toFixed(countTimeFvc / 6000)
                            }

                            // 呼气的数据
                            if (isTypeChange != _type && _type == 0) {
                                testIndex += 1
                                indexData[testIndex] = []
                                lastSpeedData = _lastSpeedData.concat()
                                _lastSpeedData = []
                            }
                            isTypeChange = _type
                            if (_type == 0) {
                                _lastSpeedData.push(_result)
                                indexData[testIndex].push(_resultTime)
                            }
                            if (_result['type'] !== 'NONE') {
                                listener(_result, _resultTime);
                                _dataObj.push(_result);
                                _timeDataObj.push(_resultTime);
                            }
                        });

                        // 未传入预计值，中断计算流速监测数据
                        if (!expectDVT) return;
                        // 最后一组数据
                        let isModeChange = lastType != _type;

                        // 动态计算呼吸末流量和呼吸时间
                        if (isModeChange && isSpeedStop && _type == 0) {
                            texData = indexData[testIndex - 1]
                            Utils.forEachRight(lastSpeedData || [], function (item) {
                                if (item.pef != 0){
                                    _lastSpeed = item.pef > _lastSpeed ? item.pef : _lastSpeed;
                                    lastSpeedData = []
                                    return false;
                                }
                            });
                            if (Utils.size(texData)) {
                                let time = texData.length * 0.01
                                _tex = time > _tex ? time : _tex
                                texData = []
                            }
                            flowListener(_tex, _lastSpeed)
                        }
                        // 呼气时间和呼气流速监测
                        if (_type == 0) {
                            if (isModeChange) {
                            //    blows.push(tmpBlow);
                            //    tmpBlow = []
                                blows.push(_dataObj);
                                timeBlows.push(_timeDataObj);
                            }
                        //    tmpBlow.push.apply(tmpBlow, _dataObj);
                        } else if (_type == 1) {
                            if (isModeChange) {
                            //    inhales.push(tmpInhale);
                            //    tmpInhale = [];
                                inhales.push(_dataObj);
                                timeInhales.push(_timeDataObj);
                            }
                        //    tmpInhale.push.apply(tmpInhale, _dataObj);
                        }
                        // 开始计算DVT、BF值
                        if (isModeChange && changeIndex >= 2) {
                            let lastBlow = timeBlows[timeBlows.length - 1] || null;
                            let afterInhale = timeBlows[timeBlows.length - 2] || null;
                            let lastInhale = timeInhales[timeInhales.length - 1] || null;
                            if (!isSpeedStop) {
                                if (lastBlow && afterInhale) {
                                    let maxBlowItem = lastBlow[lastBlow.length - 1];
                                    let afterMaxBlowItem = afterInhale[afterInhale.length - 1];
                                    let maxInhaleItem = lastInhale[lastInhale.length - 1];
                                    let maxBlow = maxBlowItem.fvc;
                                    let maxInhale = maxInhaleItem.fvc;
                                    // 呼气、吸气波峰相减绝对值
                                    let apexABS = (Math.abs(maxBlow - maxInhale) * 1000) || 0;
                                    if (apexABS >= (expectDVT * 2)){
                                        isSpeedStop = true;
                                        speedListener(isSpeedStop);
                                        _lastSpeedData = []
                                    } else {
                                        countDVT += apexABS;
                                        // 由于触发时间为最后一次流程结束后，所以真实平均次数需要减1
                                        let realChangeIndex = changeIndex - 1;
                                        // DVT
                                        let _dVT = (countDVT / realChangeIndex) || null;
                                        // self._logger('dVT(%):', _dVT);
                                        // BF值
                                        let maxBlowTime = maxBlowItem.time;
                                        let maxInhaleTime = afterMaxBlowItem.time;
                                        let _BF = 60 / (Math.abs(maxBlowTime - maxInhaleTime));
                                        // self._logger('BF(L/min):', _dVT);
                                        speedListener(false, _dVT, _BF);
                                    }
                                }
                            }
                        }
                        lastType = _type;
                        isModeChange && changeIndex++;
                    });
                }, reject)
            }, 10);
        }))
    }

    /**
     * 开始呼气 并 取得设备返回数据
     * @param listener {Function} 监听设备返回数据
     * @param speedListener {Function} 监听设备返回：呼气、吸气流速监测
     * @param flowListener {Function} 监听设备返回：呼气时间、呼气末流量
     * @param config {Object} 是否对返回数据做调节处理【选填，默认：{isThrottle:false, expectDVT:Undefined}】
     * @returns {Promise<any>}
     */
    startSVC(listener, speedListener, flowListener, config) {
        let self = this;
        listener = Utils.isFunction(listener) ? listener : Utils.noop;
        speedListener = Utils.isFunction(speedListener) ? speedListener : Utils.noop;
        flowListener = Utils.isFunction(flowListener) ? flowListener : Utils.noop;
        let _config = Utils.extend({ isThrottle: false }, config);
        listener = _config.isThrottle ? Utils.throttle(listener) : listener;
        // dVT预计值
        let expectDVT = Utils.isNumber(_config.expectDVT) ? _config.expectDVT : 0;
        return (new Promise(function (resolve, reject) {
            // 传输检测人信息接口
            self.transferUserInfo(
                _config.model,
                _config.gender,
                _config.age,
                _config.height,
                _config.weight
            ).then(() => {}, reject)
            setTimeout(() => {
                self.SVCBlow().then(function () {
                    let fvcIndex = 0,
                        countFvc = 0,
                        countTimeFvc = 0,
                        isTestOver = false,
                        FVC_TYPE = ['blow', 'inhale'],
                        results = {
                            graps: []
                        };
                    let getMaxValue = self.getMaxValue;
                    let getMaxFVC = self.getMaxFVC;
                    // 结束测试流程
                    let stopTestAction = function () {
                        cancelBuffer && cancelBuffer();
                        cancelFvcResult && cancelFvcResult();
                        watchBlowTimeout && watchBlowTimeout();
                        watchDeviceDetach && watchDeviceDetach();
                    }
                    // 拔出设备结束所有流程
                    let watchDeviceDetach = self.usbPlugin.detach(() => {
                        reject('break')
                        stopTestAction()
                    })
                    // 超时处理(设备处理超时)
                    let watchBlowTimeout = self.usbPlugin.onBuffer('BLOW_TIMEOUT', function (data) {
                        console.log(data)
                        listener(data, 0)
                        let word = ''
                        if (data['data'][0] == 255) {
                            word = '抱歉，测试流程超时，请重试！'
                        } else if (data['data'][0] == 2) {
                            word = '您当前的测试方式不正确，请重新测试！'
                        } else {
                            word = '测试方式结果错误，请重新测试！'
                        }
                        if (isTestOver) return;
                        stopTestAction();
                        reject(new Error(word));
                        self.cancelBlow();
                    })
                    // 超时处理：15秒
                    // let watchBuffer = Utils.debounce(function () {
                    //     if (isTestOver) return;
                    //     stopTestAction();
                    //     reject(new Error('抱歉，测试流程超时，请重试！'));
                    //     self.cancelBlow();
                    // }, 15000);

                    // 测试流程结束
                    let cancelFvcResult = self.usbPlugin.onBuffer('SVC_RESULT', function (response) {
                        stopTestAction();
                        // 处理接口所需数据
                        results['vcin'] = response['VCIN'] || '';
                        results['vcex'] = response['VCEX'] || '';
                        results['vcmax'] = response['VCMAX'] || '';
                        results['ic'] = response['IC'] || '';
                        results['erv'] = response['ERV'] || '';
                        results['irv'] = response['IRV'] || '';
                        results['vt'] = response['VT'] || '';
                        results['mv'] = response['MV'] || '';
                        results['bf'] = response['BF'] || '';

                        // 获得呼气末流量(L/s)
                        // let _maxSpeeds = [];
                        // Utils.forEach(blows, function (item) {
                        //     let maxValueItem = getMaxValue(item);
                        //     _maxSpeeds.push(maxValueItem && maxValueItem.pef || 0)
                        // })
                        // let _maxSpeed = Math.max.apply(null, _maxSpeeds);
                        // let realIndex = Utils.findIndex(_maxSpeeds, function (value) {
                        //     return value == _maxSpeed
                        // })
                        // let lastSpeed = null;
                        // Utils.forEachRight(blows[realIndex] || [], function (item) {
                        //     if (item.pef != 0){
                        //         lastSpeed = item.pef;
                        //         return false;
                        //     }
                        // });
                        // 呼气末流量(L/s)
                        results['_lastSpeed'] = _lastSpeed;
                        // 呼气时间(秒)
                        results['tex'] = _tex || 0

                        resolve(results);
                        isTestOver = true;
                        self.cancelBlow();
                    });
                    // 测试进行中数据监听
                    let lastType, blows = [], inhales = [], timeBlows = [], timeInhales = [], changeIndex = 0, countDVT = 0, isSpeedStop = false;
                    let tmpBlow = [], tmpInhale = [];
                    let texData = [], lastSpeedData = [], _lastSpeedData = []
                    let _tex = 0, _lastSpeed = 0, testIndex = 0
                    let isTypeChange = false
                    let indexData = {0: []}
                    let cancelBuffer = self.usbPlugin.onBuffer('SVC', function (data) {
                        let _type = data['type'];
                        let _count = data['count'];
                        let _data = data['data'] || [];
                        let _dataObj = [];
                        let _timeDataObj = [];
                        Utils.forEach(_data, function (value) {
                            // 计算PEF值
                            let pef = self.inverse(value, _type);
                            countFvc += pef;
                            pef = self.toFixed(pef / 60);
                            let fvc = self.toFixed(countFvc / 6000);
                            let _result = {
                                value: value,
                                order: fvcIndex++,
                                fvc: fvc,
                                pef: pef,
                                type: FVC_TYPE[_type] || 'NONE',
                                time: fvcIndex * 0.01
                            };
                            if (_result['type'] === 'NONE') {
                                console.log(data)
                                console.log(_result)
                                self._logger('吹气类型格式错误！');
                            }
                            if (_result['type'] !== 'NONE') {
                                results.graps.push(_result);
                            }

                            // 计算通气测定法数据 (呼、吸气与上方刚好取反)
                            let timeType = _type == 0 ? 1 : 0;
                            let timePef = self.inverse(value, timeType);
                            countTimeFvc += timePef;
                            let _resultTime = {
                                time: fvcIndex * 0.01,
                                fvc: self.toFixed(countTimeFvc / 6000)
                            }
                            // 呼气的数据
                            if (isTypeChange != _type && _type == 0) {
                                testIndex += 1
                                indexData[testIndex] = []
                                lastSpeedData = _lastSpeedData.concat()
                                _lastSpeedData = []
                            }
                            isTypeChange = _type
                            if (_type == 0) {
                                _lastSpeedData.push(_result)
                                indexData[testIndex].push(_resultTime)
                            }
                            if (_result['type'] !== 'NONE') {
                                listener(_resultTime);
                                _dataObj.push(_result);
                                _timeDataObj.push(_resultTime);
                            }
                        });

                        // 未传入预计值，中断计算流速监测数据
                        if (!expectDVT) return;
                        // 最后一组数据
                        let isModeChange = lastType != _type;

                        // 动态计算呼吸末流量和呼吸时间
                        if (isModeChange && isSpeedStop && _type == 0) {
                            texData = indexData[testIndex - 1]
                            Utils.forEachRight(lastSpeedData || [], function (item) {
                                if (item.pef != 0){
                                    _lastSpeed = item.pef > _lastSpeed ? item.pef : _lastSpeed;
                                    lastSpeedData = []
                                    return false;
                                }
                            });
                            if (Utils.size(texData)) {
                                let time = texData.length * 0.01
                                _tex = time > _tex ? time : _tex
                                texData = []
                            }
                            flowListener(_tex, _lastSpeed)
                        }
                        // 呼气时间和呼气流速监测
                        if (_type == 0) {
                            if (isModeChange) {
                                //    blows.push(tmpBlow);
                                //    tmpBlow = []
                                    blows.push(_dataObj);
                                    timeBlows.push(_timeDataObj);
                            }
                            //    tmpBlow.push.apply(tmpBlow, _dataObj);
                        } else if (_type == 1) {
                            if (isModeChange) {
                                //    inhales.push(tmpInhale);
                                //    tmpInhale = [];
                                inhales.push(_dataObj);
                                timeInhales.push(_timeDataObj);
                            }
                            //    tmpInhale.push.apply(tmpInhale, _dataObj);
                        }
                        // 开始计算DVT、BF值
                        if (isModeChange && changeIndex >= 2) {
                            let lastBlow = timeBlows[timeBlows.length - 1] || null;
                            let afterInhale = timeBlows[timeBlows.length - 2] || null;
                            let lastInhale = timeInhales[timeInhales.length - 1] || null;
                            if (!isSpeedStop) {
                                if (lastBlow && afterInhale) {
                                    let maxBlowItem = lastBlow[lastBlow.length - 1];
                                    let afterMaxBlowItem = afterInhale[afterInhale.length - 1];
                                    let maxInhaleItem = lastInhale[lastInhale.length - 1];
                                    let maxBlow = maxBlowItem.fvc;
                                    let maxInhale = maxInhaleItem.fvc;
                                    // 呼气、吸气波峰相减绝对值
                                    let apexABS = (Math.abs(maxBlow - maxInhale) * 1000) || 0;
                                    if (apexABS >= (expectDVT * 2)){
                                        isSpeedStop = true;
                                        speedListener(isSpeedStop);
                                        _lastSpeedData = []
                                    } else {
                                        countDVT += apexABS;
                                        // 由于触发时间为最后一次流程结束后，所以真实平均次数需要减1
                                        let realChangeIndex = changeIndex - 1;
                                        // DVT
                                        let _dVT = (countDVT / realChangeIndex) || null;
                                        // self._logger('dVT(%):', _dVT);
                                        // BF值
                                        let maxBlowTime = maxBlowItem.time;
                                        let maxInhaleTime = afterMaxBlowItem.time;
                                        let _BF = 60 / (Math.abs(maxBlowTime - maxInhaleTime));
                                        // self._logger('BF(L/min):', _dVT);
                                        speedListener(false, _dVT, _BF);
                                    }
                                }
                            }
                        }

                    lastType = _type;
                    isModeChange && changeIndex++;
                    });
                }, reject)
            }, 10);
        }))
    }

    /**
     * 开始呼气 并 取得设备返回数据
     * @param listener {Function} 监听设备返回数据
     * @param config {Object} 是否对返回数据做调节处理【选填，默认：{isThrottle:false, expectDVT:Undefined}】
     * @returns {Promise<any>}
     */
    startCalibrate(listener, config) {
        let self = this;
        listener = Utils.isFunction(listener) ? listener : Utils.noop;
        let _config = Utils.extend({ isThrottle: false }, config);
        listener = _config.isThrottle ? Utils.throttle(listener) : listener;
        // dVT预计值
        let expectDVT = Utils.isNumber(_config.expectDVT) ? _config.expectDVT : 0;
        return (new Promise(function (resolve, reject) {
            self.calibrateBlow(_config.type, _config.temperature, _config.humidity, _config.pressure, _config.altitude).then(function () {
                let fvcIndex = 0,
                    countFvc = 0,
                    countTimeFvc = 0,
                    isTestOver = false,
                    FVC_TYPE = ['blow', 'inhale'],
                    results = {
                        graps: []
                    };
                let getMaxValue = self.getMaxValue;
                // 结束测试流程
                let stopTestAction = function () {
                    cancelBuffer && cancelBuffer();
                    cancelFvcResult && cancelFvcResult();
                    watchBlowTimeout && watchBlowTimeout();
                    watchDeviceDetach && watchDeviceDetach();
                }
                // 拔出设备结束所有流程
                let watchDeviceDetach = self.usbPlugin.detach(() => {
                    reject('break')
                    stopTestAction()
                })
                // 超时处理(设备处理超时)
                let watchBlowTimeout = self.usbPlugin.onBuffer('BLOW_TIMEOUT', function (data) {
                    console.log(data)
                    let word = ''
                    if (data['data'][0] == 255) {
                        word = '抱歉，测试流程超时，请重试！'
                    } else if (data['data'][0] == 2) {
                        word = '您当前的测试方式不正确，请重新测试！'
                    } else {
                        word = '测试方式结果错误，请重新测试！'
                    }
                    if (isTestOver) return;
                    stopTestAction();
                    reject(new Error(word));
                    self.cancelBlow();
                })
                // 超时处理：15秒
                // let watchBuffer = Utils.debounce(function () {
                //     if (isTestOver) return;
                //     stopTestAction();
                //     reject(new Error('抱歉，测试流程超时，请重试！'));
                //     self.cancelBlow();
                // }, 15000);

                // 测试流程结束
                let cancelFvcResult = self.usbPlugin.onBuffer('CALIBRATE_RESULT', function (response) {
                    Utils.extend(results, response)
                    stopTestAction();
                    resolve(results);
                    isTestOver = true;
                    self.cancelBlow();
                });
                // 测试进行中数据监听
                let blows = [];
                let flagType = false
                let isTypeChange = 1
                let maxFvc = 0
                let minFvc = 0
                let cancelBuffer = self.usbPlugin.onBuffer('CALIBRATE', function (data) {
                    let _type = data['type'];
                    let _count = data['count'];
                    let _data = data['data'] || [];
                    let _dataObj = [];

                    // 第一次是吸气数据不要
                    if (!flagType && FVC_TYPE[_type] == 'inhale') {
                        flagType = false
                    } else {
                        flagType = true
                    }
                    if (!flagType) return

                    Utils.forEach(_data, function (value) {
                        // 计算PEF值
                        let pef = self.inverse(value, _type);
                        countFvc += pef;
                        pef = self.toFixed(pef / 60);
                        let fvc = self.toFixed(countFvc / 6000);
                        let _result = {
                            value: value,
                            order: fvcIndex++,
                            fvc: fvc,
                            pef: pef,
                            type: FVC_TYPE[_type] || 'NONE',
                            time: fvcIndex * 0.01
                        };
                        if (_result['type'] === 'NONE') {
                            console.log(data)
                            console.log(_result)
                            self._logger('吹气类型格式错误！');
                        }

                        // 获取方向的第一个值
                        if (isTypeChange != _type && _type == 1) {
                            maxFvc = _result.fvc
                        } else if (isTypeChange != _type && _type == 0) {
                            minFvc = _result.fvc
                        }
                        isTypeChange = _type
                        let turnData = {}
                        // 进行镜像取反
                        if (_type == 1) {
                            Utils.extend(turnData, _result, {
                                fvc: (Math.abs(maxFvc) - _result.fvc)
                            })
                        } else if (_type == 0) {
                            let fvc = {}
                            if (_result.fvc < 0) {
                                fvc = {
                                    fvc: Math.abs(Math.abs(minFvc) + _result.fvc)
                                }
                            } else {
                                fvc = {
                                    fvc: Math.abs(minFvc - _result.fvc)
                                }
                            }
                            Utils.extend(turnData, _result, fvc)
                        }
                        if (_result['type'] !== 'NONE') {
                            listener(turnData);
                            results.graps.push(turnData);
                        }
                    });
                });
            }, reject)
        }))
    }

    /**
     * 3流量 开始呼气 并 取得设备返回数据
     * @param listener {Function} 监听设备返回数据
     * @param config {Object} 是否对返回数据做调节处理【选填，默认：{isThrottle:false, expectDVT:Undefined}】
     * @returns {Promise<any>}
     */
    startCalibrate3(listener, config) {
        let self = this;
        listener = Utils.isFunction(listener) ? listener : Utils.noop;
        let _config = Utils.extend({ isThrottle: false }, config);
        listener = _config.isThrottle ? Utils.throttle(listener) : listener;
        // dVT预计值
        let expectDVT = Utils.isNumber(_config.expectDVT) ? _config.expectDVT : 0;
        return (new Promise(function (resolve, reject) {
            self.calibrateBlow3(_config.type, _config.temperature, _config.humidity, _config.pressure, _config.altitude).then(function () {
                let fvcIndex = 0,
                    countFvc = 0,
                    countTimeFvc = 0,
                    isTestOver = false,
                    FVC_TYPE = ['blow', 'inhale'],
                    results = {
                        graps: []
                    };
                let getMaxValue = self.getMaxValue;
                // 结束测试流程
                let stopTestAction = function () {
                    cancelBuffer && cancelBuffer();
                    cancelFvcResult && cancelFvcResult();
                    watchBlowTimeout && watchBlowTimeout();
                    watchDeviceDetach && watchDeviceDetach();
                }
                // 拔出设备结束所有流程
                let watchDeviceDetach = self.usbPlugin.detach(() => {
                    reject('break')
                    stopTestAction()
                })
                // 超时处理(设备处理超时)
                let watchBlowTimeout = self.usbPlugin.onBuffer('BLOW_TIMEOUT', function (data) {
                    console.log(data)
                    let word = ''
                    if (data['data'][0] == 255) {
                        word = '抱歉，测试流程超时，请重试！'
                    } else if (data['data'][0] == 2) {
                        word = '您当前的测试方式不正确，请重新测试！'
                    } else {
                        word = '测试方式结果错误，请重新测试！'
                    }
                    if (isTestOver) return;
                    stopTestAction();
                    reject(new Error(word));
                    self.cancelBlow();
                })
                // 超时处理：15秒
                // let watchBuffer = Utils.debounce(function () {
                //     if (isTestOver) return;
                //     stopTestAction();
                //     reject(new Error('抱歉，测试流程超时，请重试！'));
                //     self.cancelBlow();
                // }, 15000);

                // 测试流程结束
                let cancelFvcResult = self.usbPlugin.onBuffer('CALIBRATE_RESULT3', function (response) {
                    Utils.extend(results, response)
                    stopTestAction();
                    resolve(results);
                    isTestOver = true;
                    self.cancelBlow();
                });
                // 测试进行中数据监听
                let blows = [];
                let flagType = false
                let isTypeChange = 1
                let maxFvc = 0
                let minFvc = 0
                let cancelBuffer = self.usbPlugin.onBuffer('CALIBRATE3', function (data) {
                    let _type = data['type'];
                    let _count = data['count'];
                    let _data = data['data'] || [];
                    let _dataObj = [];

                    // 第一次是吸气数据不要
                    if (!flagType && FVC_TYPE[_type] == 'inhale') {
                        flagType = false
                    } else {
                        flagType = true
                    }
                    if (!flagType) return

                    Utils.forEach(_data, function (value) {
                        // 计算PEF值
                        let pef = self.inverse(value, _type);
                        countFvc += pef;
                        pef = self.toFixed(pef / 60);
                        let fvc = self.toFixed(countFvc / 6000);
                        let _result = {
                            value: value,
                            order: fvcIndex++,
                            fvc: fvc,
                            pef: pef,
                            type: FVC_TYPE[_type] || 'NONE',
                            time: fvcIndex * 0.01
                        };
                        if (_result['type'] === 'NONE') {
                            self._logger('吹气类型格式错误！');
                        }

                        // 获取方向的第一个值
                        if (isTypeChange != _type && _type == 1) {
                            maxFvc = _result.fvc
                        } else if (isTypeChange != _type && _type == 0) {
                            minFvc = _result.fvc
                        }
                        isTypeChange = _type
                        let turnData = {}
                        // 进行镜像取反
                        if (_type == 1) {
                            Utils.extend(turnData, _result, {
                                fvc: (Math.abs(maxFvc) - _result.fvc)
                            })
                        } else if (_type == 0) {
                            let fvc = {}
                            if (_result.fvc < 0) {
                                fvc = {
                                    fvc: Math.abs(Math.abs(minFvc) + _result.fvc)
                                }
                            } else {
                                fvc = {
                                    fvc: Math.abs(minFvc - _result.fvc)
                                }
                            }
                            Utils.extend(turnData, _result, fvc)
                        }
                        if (_result['type'] !== 'NONE') {
                            listener(turnData);
                            results.graps.push(turnData);
                        }
                    });
                });
            }, reject)
        }))
    }

    /**
     * 控制声音开关
     * @param config
     * @returns {Promise<any>}
     */
    voiceSwitch(listener, config) {
        let self = this;
        let _config = Utils.extend({ isThrottle: false }, config);
        return (new Promise(function (resolve, reject) {
            self.voiceSwitchBlow(_config.switch)
        }))
    }

    /**
     * 获得声音开关状态
     * @return {Promise}
     */
    getVoice () {
        let self = this;
        return (new Promise(function (resolve, reject) {
            self.usbPlugin.onBuffer('VOICE_ON', function (data) {
                resolve(data['type'].toString());
            })
            self.usbPlugin.voiceOn().catch(reject)
        }))
    }

    /**
     * 获得设备编号[IMEI]
     * @return {Promise}
     */
    deviceIMEI () {
        let self = this;
        return (new Promise(function (resolve, reject) {
            let watchDeviceInfo = self.usbPlugin.onBuffer('DEVICE_IMEI', function (data) {
                watchDeviceInfo();
                resolve(data['imei'] || '');
            })
            self.usbPlugin.deviceInfo().catch(reject)
        }))
    }

    /**
     * 转换成通气测定法数据
     */
    transformDuration(fvcArr, ms = 10) {
        let _data = [];
        return _data;
    }

    /**
     * 根据 <API返回数据处理> 成所需FVC数据
     * @param results {array} 接口API返回的数据，格式如：[{order:1, pef:1, fvc:1, type:'blow'}]
     * @return {{speed: Array, duration: Array}}
     */
    transformFVC(results) {
        results = Utils.isArray(results) ? results : [];
        let _data = {
            // 流速容积 图表数据
            speed: [],
            // 通气测定法 图表数据
            duration: []
        };
        let FVC_OFFSET = this.FVC_OFFSET;
        let dataThrottle = Utils.throttle(function(item){
            _data.speed.push([parseFloat(item['fvc']) + FVC_OFFSET, item['pef']]);
            _data.duration.push([item['order'] * 0.01, item['fvc']]);
        });
        Utils.forEach(results, dataThrottle);
        return _data;
    }

    /**
     * 模拟执行吸气操作
     * @return {Promise.<T>}
     */
    triggerBuffer() {
        let _bufferData = bufferData;
        let length = _bufferData.length,
            self = this,
            index = 0,
            intervalNumber
        intervalNumber = setInterval(function () {
            if (length <= index) {
                clearInterval(intervalNumber)
            }
            _bufferData[index] && self.usbPlugin.autoTransfer(_bufferData[index])
            index++
        })
        return Promise.resolve(_bufferData)
    }
}

export default new USBService()
