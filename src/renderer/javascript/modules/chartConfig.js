/**
 * Created by peak on 2019/03/12
 * Name : Config
 * Version : v0.1
 * Copyright (c) 2019 peak
 */

const Config = {
    previewFVCTest: {
        grid: {
            left: 20,
            right: 50,
            bottom: 20,
            top: 60,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 9 ? Math.ceil(value.max) + 1 : 9
            },
            interval: 1,
            name: 'V(L)',
            type: 'value',
            offset: -117,
            axisLine: {
                onZero: true
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: function (value) {
                return value.min < -8 ? Math.ceil(value.min) - 2 : -8
            },
            max: function (value) {
                return value.max > 12 ? Math.ceil(value.max) + 2 : 12
            },
            interval: 3,
            name: 'F(L/s)',
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        legend: {
            show: false,
            data: []
        },
        animationDuration: 2000,
        animationEasing: 'linear',
        series: [{
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [],
            lineStyle: {
                width: 1
            }
        }]
    },
    previewTest: {
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 9 ? Math.ceil(value.max) + 1 : 9
            },
            interval: 1,
            name: 'V(L)',
            type: 'value',
            offset: -163,
            axisLine: {
                onZero: true
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: function (value) {
                return value.min < -9 ? Math.ceil(value.min) - 3 : -9
            },
            max: function (value) {
                return value.max > 12 ? Math.ceil(value.max) + 3 : 12
            },
            interval: 3,
            name: 'F(L/s)',
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        legend: {
            show: false,
            data: []
        },
        animationDuration: 2000,
        animationEasing: 'linear',
        series: [{
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [],
            lineStyle: {
                width: 1
            }
        }]
    },
    bronchusChart: {
        grid: {
            left: 20,
            right: 50,
            bottom: 50,
            top: 40,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 9 ? value.max + 1 : 9
            },
            interval: 0.5,
            name: 'V(L)',
            type: 'value',
            offset: -200,
            axisLine: {
                onZero: true
            },
            axisLabel: {
                formatter: function (value, index) {
                    return index % 2 == 0 ? value : ''
                },
                showMinLabel: false
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: function (value) {
                let result = Math.abs(value.max) - Math.abs(value.min) > 0 ? Math.ceil(value.max) : Math.ceil(value.min)
                result = -Math.abs(result)
                return result < -10 ? result - 1 : -10
                },
            max: function (value) {
                let result = Math.abs(value.max) - Math.abs(value.min) > 0 ? Math.ceil(value.max) : Math.ceil(value.min)
                result = Math.abs(result)
                return result > 10 ? result + 1 : 10
            },
            interval: 1,
            name: 'F(L/s)',
            type: 'value',
            axisLine: {
                onZero: true
            },
            axisLabel: {
                formatter: function (value, index) {
                    return index % 2 == 0 ? value : ''
                }
            }
        },
        legend: {
            show: false,
            data: []
        },
        animationDuration: 2000,
        animationEasing: 'linear',
        series: [{
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [],
            lineStyle: {
                width: 1
            }
        }]
    },
    bronchusTime: {
        grid: {
            left: 20,
            right: 50,
            bottom: 40,
            top: 50,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 10 ? value.max + 1 : 10
            },
            interval: 0.5,
            name: 'T(s)',
            type: 'value',
            axisLine: {
                onZero: true
            },
            axisLabel: {
                formatter: function (value, index) {
                    return index % 2 == 0 ? value : ''
                }
            }
        },
        legend: {
            show: false,
            data: []
        },
        animationDuration: 2000,
        animationEasing: 'linear',
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 6 ? value.max + 1 : 6
            },
            interval: 0.5,
            name: 'V(L)',
            type: 'value',
            axisLine: {
                onZero: true
            },
            axisLabel: {
                formatter: function (value, index) {
                    return index % 2 == 0 ? value : ''
                }
            }
        },
        series: [{
            type: 'line',
            smooth: true,
            data: [],
            lineStyle: {
                width: 1
            }
        }]
    },
    routineChart: {
        grid: {
            left: 20,
            right: 50,
            bottom: 50,
            top: 40,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 9 ? value.max + 1 : 9
            },
            interval: 0.5,
            name: 'V(L)',
            type: 'value',
            offset: -200,
            axisLine: {
                onZero: true
            },
            axisLabel: {
                formatter: function (value, index) {
                    return index % 2 == 0 ? value : ''
                },
                showMinLabel: false
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: function (value) {
                let result = Math.abs(value.max) - Math.abs(value.min) > 0 ? Math.ceil(value.max) : Math.ceil(value.min)
                result = -Math.abs(result)
                return result < -10 ? result - 1 : -10
            },
            max: function (value) {
                let result = Math.abs(value.max) - Math.abs(value.min) > 0 ? Math.ceil(value.max) : Math.ceil(value.min)
                result = Math.abs(result)
                return result > 10 ? result + 1 : 10
            },
            interval: 1,
            name: 'F(L/s)',
            type: 'value',
            axisLine: {
                onZero: true
            },
            axisLabel: {
                formatter: function (value, index) {
                    return index % 2 == 0 ? value : ''
                }
            }
        },
        legend: {
            show: false,
            data: []
        },
        animationDuration: 2000,
        animationEasing: 'linear',
        series: [{
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [],
            lineStyle: {
                width: 1
            }
        }]
    },
    routineTime: {
        grid: {
            left: 20,
            right: 50,
            bottom: 40,
            top: 50,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 10 ? value.max + 1 : 10
            },
            interval: 0.5,
            name: 'T(s)',
            type: 'value',
            axisLine: {
                onZero: true
            },
            axisLabel: {
                formatter: function (value, index) {
                    return index % 2 == 0 ? value : ''
                }
            }
        },
        legend: {
            show: false,
            data: []
        },
        animationDuration: 2000,
        animationEasing: 'linear',
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 6 ? Math.ceil(value.max) + 1 : 6
            },
            interval: 0.5,
            name: 'V(L)',
            type: 'value',
            axisLine: {
                onZero: true
            },
            axisLabel: {
                formatter: function (value, index) {
                    return index % 2 == 0 ? value : ''
                }
            }
        },
        series: [{
            type: 'line',
            smooth: true,
            data: [],
            lineStyle: {
                width: 1
            }
        }]
    },
    routineSvc: {
        grid: {
            left: 20,
            right: 50,
            bottom: 40,
            top: 50,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 10 ? Math.ceil(value.max) + 1 : 10
            },
            interval: 1,
            name: 'T(s)',
            type: 'value',
            axisLine: {
                onZero: false
            },
            axisLabel: {
                formatter: function (value, index) {
                    return index % 2 == 0 ? value : ''
                }
            }
        },
        legend: {
            show: false,
            data: []
        },
        animationDuration: 2000,
        animationEasing: 'linear',
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: function (value) {
                return value.min < -6 ? Math.ceil(value.min) - 1 : -6
            },
            max: function (value) {
                return value.max > 6 ? Math.ceil(value.max) + 1 : 6
            },
            interval: 1,
            name: 'V(L)',
            type: 'value',
            axisLine: {
                onZero: true
            },
            axisLabel: {
                formatter: function (value, index) {
                    return index % 2 == 0 ? value : ''
                }
            }
        },
        series: [{
            id: 'a',
            type: 'line',
            symbol: 'none',
            smooth: true,
            data: [],
            lineStyle: {
                width: 2
            },
            markLine: {
                silent: true,
                precision: 1,
                animation: false,
                symbol: 'none',
                label: {
                    show: false
                },
                data: [{
                    yAxis: 0,
                    lineStyle: {
                        width: 1,
                        type: 'solid',
                        color: '#000'
                    }
                }]
            }
        }]
    },
    previewFVCTime: {
        grid: {
            left: 20,
            right: 50,
            bottom: 20,
            top: 70,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 9 ? Math.ceil(value.max) + 1 : 9
            },
            interval: 1,
            name: 'T(s)',
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        legend: {
            show: false,
            data: []
        },
        animationDuration: 2000,
        animationEasing: 'linear',
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 8 ? Math.ceil(value.max) + 1 : 8
            },
            interval: 1,
            name: 'V(L)',
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        series: [{
            type: 'line',
            smooth: true,
            data: [],
            lineStyle: {
                width: 1
            }
        }]
    },
    previewTime: {
        grid: {
            left: 20,
            right: 50,
            bottom: 20,
            top: 70,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 10 ? Math.ceil(value.max) + 1 : 10
            },
            interval: 1,
            name: 'T(s)',
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        legend: {
            show: false,
            data: []
        },
        animationDuration: 2000,
        animationEasing: 'linear',
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 6 ? Math.ceil(value.max) + 1 : 6
            },
            interval: 1,
            name: 'V(L)',
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        series: [{
            type: 'line',
            smooth: true,
            data: [],
            lineStyle: {
                width: 1
            }
        }]
    },
    showSvcTest: {
        grid: {
            left: 20,
            right: 50,
            bottom: 20,
            top: 70,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 16 ? Math.ceil(value.max) + 1 : 16
            },
            minInterval: 1,
            name: 'T(s)',
            type: 'value',
            axisLine: {
                onZero: false
            }
        },
        legend: {
            show: false,
            data: []
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            },
            min: function (value) {
                return value.min < -6 ? Math.ceil(value.min) - 2 : -6
            },
            max: function (value) {
                return value.max > 6 ? Math.ceil(value.max) + 2 : 6
            },
            interval: 2,
            name: 'V(L)',
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        animationDuration: 0,
        animationEasing: 'linear',
        series: [{
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [],
            lineStyle: {
                width: 1
            }
        }]
    },
    showSvcTime: {
        grid: {
            left: 20,
            right: 50,
            bottom: 30,
            top: 50,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        color: ['#ffc7ce', '#ffeb9c', '#c6efce'],
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            },
            name: '次数',
            boundaryGap: true,
            axisTick: {
                alignWithLabel: true
            },
            type: 'category',
            data: []
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            },
            max: function (value) {
                return value.max > 12 ? Math.ceil(value.max) + 2 : 12
            },
            interval: 2,
            name: 'V(L)',
            type: 'value'
        },
        legend: {
            show: false,
            data: []
        },
        series: [{
            data: [0],
            barWidth: '30',
            type: 'bar'
        }]
    },
    SvcTest: {
        grid: {
            left: 20,
            right: 50,
            bottom: 50,
            top: 50,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 13 ? Math.ceil(value.max) + 1 : 13
            },
            name: 'T(s)',
            interval: 1,
            type: 'value',
            axisLine: {
                onZero: false
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dotted'
                }
            },
            min: function (value) {
                return value.min < -6 ? Math.ceil(value.min) - 2 : -6
            },
            max: function (value) {
                return value.max > 6 ? Math.ceil(value.max) + 2 : 6
            },
            interval: 2,
            name: 'V(L)',
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        color: ['#3393f7'],
        series: [{
            id: 1,
            type: 'line',
            symbol: 'none',
            smooth: true,
            data: [],
            lineStyle: {
                width: 2
            },
            animationEasing: 'linear'
        }],
        animation: false
    },
    SvcTimeTest: {
        grid: {
            left: 20,
            right: 50,
            bottom: 10,
            top: 35,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 30 ? Math.ceil(value.max) + 2 : 30
            },
            interval: 2,
            name: 'T(s)',
            type: 'value',
            axisLine: {
                onZero: false
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            },
            min: function (value) {
                return value.min < -6 ? Math.ceil(value.min) - 2 : -6
            },
            max: function (value) {
                return value.max > 6 ? Math.ceil(value.max) + 2 : 6
            },
            interval: 2,
            name: 'V(L)',
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        color: ['#3393f7'],
        animationDuration: 2000,
        animationEasing: 'linear',
        series: [{
            id: 'a',
            type: 'line',
            symbol: 'none',
            smooth: true,
            data: [],
            lineStyle: {
                width: 2
            },
            markLine: {
                silent: true,
                precision: 1,
                animation: false,
                symbol: 'none',
                label: {
                    show: false
                },
                data: [{
                    yAxis: 0,
                    lineStyle: {
                        width: 1,
                        type: 'dashed',
                        color: '#000'
                    }
                }]
            }
        }]
    },
    MvvTest: {
        grid: {
            left: 20,
            right: 50,
            bottom: 50,
            top: 50,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 13 ? Math.ceil(value.max) + 1 : 13
            },
            name: 'T(s)',
            interval: 1,
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dotted'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 14 ? Math.ceil(value.max) + 2 : 14
            },
            interval: 2,
            name: 'V(L)',
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        color: ['#3393f7'],
        series: [{
            id: 1,
            type: 'line',
            symbol: 'none',
            smooth: true,
            data: [],
            lineStyle: {
                width: 2
            },
            animationEasing: 'linear'
        }],
        animationDuration: 2000,
        animationEasing: 'linear'
    },
    MvvTimeTest: {
        grid: {
            left: 20,
            right: 50,
            bottom: 10,
            top: 35,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 30 ? Math.ceil(value.max) + 1 : 30
            },
            interval: 1,
            name: 'T(s)',
            type: 'value',
            axisLine: {
                onZero: false
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            },
            min: function (value) {
                return value.min < -4 ? Math.ceil(value.min) - 1 : -4
            },
            max: function (value) {
                return value.max > 6 ? Math.ceil(value.max) + 1 : 6
            },
            // interval: 2,
            name: 'V(L)',
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        color: ['#3393f7'],
        animationDuration: 2000,
        animationEasing: 'linear',
        series: [{
            id: 'a',
            type: 'line',
            symbol: 'none',
            smooth: true,
            data: [],
            lineStyle: {
                width: 2
            },
            markLine: {
                silent: true,
                precision: 1,
                animation: false,
                symbol: 'none',
                label: {
                    show: false
                },
                data: [{
                    yAxis: 0,
                    lineStyle: {
                        width: 1,
                        type: 'dashed',
                        color: '#000'
                    }
                }]
            }
        }]
    },
    showMvvTest: {
        grid: {
            left: 20,
            right: 50,
            bottom: 20,
            top: 70,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 13 ? Math.ceil(value.max) + 1 : 13
            },
            interval: 1,
            name: 'T(s)',
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        legend: {
            show: false,
            data: []
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function (value) {
                return value.max > 12 ? Math.ceil(value.max) + 1 : 12
            },
            // interval: 2,
            name: 'V(L)',
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        color: ['#3393f7'],
        animationDuration: 2000,
        animationEasing: 'linear',
        series: [{
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [],
            lineStyle: {
                width: 2
            }
        }]
    },
    showMvvTime: {
        grid: {
            left: 20,
            right: 50,
            bottom: 20,
            top: 70,
            containLabel: true,
            shadowColor: 'rgba(0, 0, 0, 1)'
        },
        legend: {
            show: false,
            data: []
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            },
            min: 0,
            max: function(value){
                return value.max > 16 ? Math.ceil(value.max) + 1 : 16
            },
            interval: 2,
            name: 'T(s)',
            type: 'value',
            axisLine: {
                onZero: false
            }
        },
        color: ['#3393f7'],
        animationDuration: 2000,
        animationEasing: 'linear',
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            },
            min: function (value) {
                return value.min < -6 ? Math.ceil(value.min) - 2 : -6
            },
            max: function (value) {
                return value.max > 6 ? Math.ceil(value.max) + 2 : 6
            },
            interval: 2,
            name: 'V(L)',
            type: 'value',
            axisLine: {
                onZero: true
            }
        },
        series: [{
            id: 'a',
            type: 'line',
            symbol: 'none',
            smooth: true,
            data: [],
            lineStyle: {
                width: 1
            },
            markLine: {
                silent: true,
                precision: 1,
                animation: false,
                symbol: 'none',
                label: {
                    show: false
                },
                data: [{
                    yAxis: 0,
                    lineStyle: {
                        width: 1,
                        type: 'solid',
                        color: '#000'
                    }
                }]
            }
        }]
    }
}

export default Config
