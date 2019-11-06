/**
 * Created by terry.chen on 2019/03/14
 * Name : Electron Config
 * Version : v0.1
 * Copyright (c) 2019 Terry.Chen
 */
import PACKAGE from '../../package.json'

const CONFIG = {}

// 浏览器窗口参数
CONFIG['BrowserWindow'] = {
    title: '格创肺功能-桌面端' || PACKAGE['name'],
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    useContentSize: true,
    frame: false,
    titleBarStyle: 'hidden',
    show: false
    /* webPreferences: {
        devTools: false // 关闭调试工具
    } */
    // maximizable: false
}

export default CONFIG
