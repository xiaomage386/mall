import BaseService from '@services/baseService'
import usbService from '@services/usbService'
import Utils from '@modules/Utils'
import Config from '@modules/chartConfig'

let fvcSeries = {
    type: 'line',
    smooth: true,
    symbol: 'none',
    data: [],
    lineStyle: {
        width: 1
    }
}
class ChartService extends BaseService {
    lineConfig () {
        return Utils.extend({}, fvcSeries)
    }
    getConfig(name, isColor) {
        let _color = this.getColor()
        return Utils.extend({}, Config[name], {
            color: isColor ? Config[name].color : _color
        })
    }

    setFvcConfig(data, reference, acceptable = []) {
        let color = this.getQualityColor()
        let speed = []
        let duration = []
        for (let i in data) {
            let fvcSpeed = Utils.extend({}, fvcSeries)
            let fvcDuration = Utils.extend({}, fvcSeries)
            let _data = usbService.transformFVC(data[i] || [])
            fvcSpeed['id'] = i
            fvcDuration['id'] = i
            speed.push(Utils.extend(fvcSpeed, {
                data: _data.speed,
                color: !!Utils.size(acceptable) && color[acceptable[i].acceptable]
            }))
            duration.push(Utils.extend(fvcDuration, {
                data: _data.duration,
                color: !!Utils.size(acceptable) && color[acceptable[i].acceptable]
            }))
        }

        // 参考线
        if (Utils.size(reference) && Utils.isArray(reference)) {
            let referenceConfig = Utils.extend({}, fvcSeries, {
                color: '#000'
            })
            referenceConfig['data'] = reference
            referenceConfig['id'] = Utils.size(reference)
            speed.push(referenceConfig)
        }
        return {
            speed: speed,
            duration: duration
        }
    }

    // 容积时间图
    setFvcTime(data, reference, long = 10, acceptable = []) {
        let timeData = []
        let color = this.getQualityColor()
        for (let i in data) {
            let fvcTime = Utils.extend({}, fvcSeries)
            fvcTime['id'] = i
            timeData.push(Utils.extend(fvcTime, {
                data: data[i],
                color: !!Utils.size(acceptable) && color[acceptable[i].acceptable]
            }))
        }

        // 参考线
        if (reference) {
            let referenceConfig = Utils.extend({}, fvcSeries, {
                color: '#000'
            })
            referenceConfig['data'] = [
                [0, reference],
                [long, reference]
            ]
            referenceConfig['id'] = Utils.size(timeData) + 1
            timeData.push(referenceConfig)
        }

        return timeData
    }

    // svc容积时间图
    setSvcConfig(data, reference, acceptable = []) {
        let svcSeries = {
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [],
            lineStyle: {
                width: 1.5
            }
        }
        let duration = []
        let color = this.getQualityColor()
        let storage = []
        for (let i in data) {
            let fvcSpeed = Utils.extend({}, svcSeries)
            let _data = usbService.transformFVC(data[i] || [])
            // 获取第一一个数据
            storage.push(_data.duration[0])
            fvcSpeed['id'] = i
            duration.push(Utils.extend(fvcSpeed, {
                data: _data.duration,
                color: !!Utils.size(acceptable) && color[acceptable[i].acceptable]
            }))
        }
        // 链接线
        for (let i in duration) {
            let item = duration[i]
            let index = parseInt(i) + 1
            if (storage.length != index) {
                item.data.push(storage[index])
            }
        }
        reference.forEach((item, index) => {
            let referenceConfig = Utils.extend({}, svcSeries, {
                color: '#999999'
            })
            referenceConfig['data'] = [
                [item, -6],
                [item, 6]
            ]
            referenceConfig['id'] = Utils.size(duration) + 1
            let num = parseInt(index / 2) + 1
            referenceConfig['name'] = '实测' + num
            if (item != 0) {
                duration.push(referenceConfig)
            }
        })
        return duration
    }

    setSvcChart(data, acceptable = [], vtStart = [], vtEnd = []) {
        let chartConfig = {
            data: [0],
            barWidth: '30',
            type: 'bar',
            label: {
                normal: {
                    show: true,
                    color: '#323232',
                    position: 'top'
                }
            }
        }
        let duration = []
        let seriesData = []
        let color = this.getQualityColor()
        for (let i in data) {
            seriesData.push({
                value: data[i],
                itemStyle: {
                    color: !!Utils.size(acceptable) && color[acceptable[i].acceptable]
                }
            })
        }
        let svcSeries = Utils.extend({}, chartConfig)
        svcSeries.data = seriesData
        duration.push(svcSeries)

        // vt潮气开始与结束线条
        let vtTimeConfig = {
            type: 'custom',
            data: [],
            z: 10,
            renderItem: (_, api) => {
                const [x, y] = api.coord([api.value(0), api.value(1)]);
                return {
                    type: 'group',
                    children: [{
                        type: 'line',
                        shape: {
                            x1: x - 15,
                            x2: x + 15,
                            y1: y,
                            y2: y
                        },
                        style: {
                            stroke: '#999999',
                            lineWidth: 1
                        }
                    }]
                };
            }
        }

        let _vtStart = Utils.extend({}, vtTimeConfig)
        let _vtEnd = Utils.extend({}, vtTimeConfig)
        _vtStart.data = vtStart
        _vtEnd.data = vtEnd
        duration.push(_vtStart, _vtEnd)

        // 防止柱状图图表坐标丢失问题
        if (!Utils.size(svcSeries.data)) {
            svcSeries = chartConfig
            duration.push(svcSeries)
        }
        return duration
    }

    // 定标主页图(把每次更换方向换成单独一条线)
    setCalibrate(data) {
        let timeData = []
        let index = 0
        for (let i in data) {
            let _lineData = data[i]
            let isTypeChange = 'BLOW'
            let Blow = []
            let details = []
            _lineData.forEach(item => {
                if (isTypeChange != item.type) {
                    details.push(Blow)
                    Blow = []
                }
                isTypeChange = item.type
                Blow.push(item)
            })
            details.push(Blow)
            for (let k in details) {
                let fvcTime = Utils.extend({}, fvcSeries)
                fvcTime['id'] = index++
                let _data = usbService.transformFVC(details[k] || [])
                timeData.push(Utils.extend(fvcTime, {
                    data: _data.speed,
                    color: '#f59586'
                }))
            }
        }
        return timeData
    }

    getColor() {
        return ['#f59586', '#fbc38f', '#5adebb']
    }

    getQualityColor() {
        return {
            'POOR': '#f59586',
            'CENTRE': '#fbc38f',
            'EXCELLENT': '#5adebb'
        }
    }

    /**
     * config 数组 echart series data 的值
     */
    getSplitNumber(config) {
        let xMax = 0
        let yMax = 0
        let xMin = 0
        let yMin = 0
        for (let i = 0; i < config.length; i++) {
            let xArr = [];
            let yArr = [];
            for (let n = 0; n < config[i].data.length; n++) {
                xArr.push(config[i].data[n][0]);
                yArr.push(config[i].data[n][1]);
            }
            xMax = Math.max.apply(null, xArr) > xMax ? Math.max.apply(null, xArr) : xMax
            yMax = Math.max.apply(null, yArr) > yMax ? Math.max.apply(null, yArr) : yMax
            xMin = Math.min.apply(null, xArr) > xMin ? Math.min.apply(null, xArr) : xMin
            yMin = Math.min.apply(null, yArr) > yMin ? Math.min.apply(null, yArr) : yMin
        }
        return {
            'xSplit': xMax - xMin,
            'ySplit': yMax - yMin
        }
    }
}

export default new ChartService()
