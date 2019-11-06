import Utils from '@modules/Utils'
import disk from 'diskusage'
import os from 'os'

// 根目录地址
// const rootPath = os.platform() === 'win32' ? 'C:' : '/'
let rootPath = '/';
if (os.platform() === 'win32') {
    let runPath = process.argv0 || '';
    if (runPath.indexOf(':') >= 0) {
        // 默认为客户端安装盘符
        rootPath = runPath.slice(0, runPath.indexOf(':') + 1)
    } else {
        rootPath = 'C:'
    }
}

// 磁盘空间计算
const BYTES_UNIT = 1024;
const BYTES_TO_KB = Math.pow(BYTES_UNIT, 1);
const BYTES_TO_MB = Math.pow(BYTES_UNIT, 2);
const BYTES_TO_GB = Math.pow(BYTES_UNIT, 3);
const BYTES_TO_TB = Math.pow(BYTES_UNIT, 4);

class DiskPlugin {
    constructor() {
        this.rootPath = rootPath;
    }

    /**
     * 计算PEF保留位数
     * @param number {number} 需要计算的数字
     * @param offset {int} 需要保留的位数长度【选填，默认：2】
     * @return {Number}
     */
    toFixed(number, offset) {
        return parseFloat(number.toFixed(offset || 2)) || 0
    }

    /**
     * 检查磁盘空间
     * @param path {String} 磁盘路径【选填，默认：rootPath】
     * @param limit {Number} 字节计算限额【选填，默认：1】
     * @param toFixed {Int} 保留小数点后面几位【选填，默认：2】
     * @return {Promise}
     */
    check(path, limit = 1, toFixed = 2) {
        return Utils.$q((resolve, reject) => {
            disk.check(path || this.rootPath).then((info) => {
                info['available'] = this.toFixed(info['available'] / limit)
                info['free'] = this.toFixed(info['free'] / limit)
                info['total'] = this.toFixed(info['total'] / limit)
                resolve(info)
            }, reject)
        })
    }

    /**
     * 检查磁盘空间【单位KB】
     * @param path {String} 磁盘路径【选填，默认：rootPath】
     * @param toFixed {Int} 保留小数点后面几位【选填，默认：2】
     * @return {Promise}
     */
    checkForKB(path, toFixed) {
        return this.check(path, BYTES_TO_KB, toFixed)
    }

    /**
     * 检查磁盘空间【单位MB】
     * @param path {String} 磁盘路径【选填，默认：rootPath】
     * @param toFixed {Int} 保留小数点后面几位【选填，默认：2】
     * @return {Promise}
     */
    checkForMB(path, toFixed) {
        return this.check(path, BYTES_TO_MB, toFixed)
    }

    /**
     * 检查磁盘空间【单位GB】
     * @param path {String} 磁盘路径【选填，默认：rootPath】
     * @param toFixed {Int} 保留小数点后面几位【选填，默认：2】
     * @return {Promise}
     */
    checkForGB(path, toFixed) {
        return this.check(path, BYTES_TO_GB, toFixed)
    }

    /**
     * 检查磁盘空间【单位TB】
     * @param path {String} 磁盘路径【选填，默认：rootPath】
     * @param toFixed {Int} 保留小数点后面几位【选填，默认：2】
     * @return {Promise}
     */
    checkForTB(path, toFixed) {
        return this.check(path, BYTES_TO_TB, toFixed)
    }
}

export default new DiskPlugin()
