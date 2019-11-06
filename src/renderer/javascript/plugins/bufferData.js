import Utils from '@modules/Utils'
import bufferArray from './bufferArray3.json'

const bufferData = []
Utils.forEach(bufferArray, function (item) {
    bufferData.push(Buffer.from(item))
})

export default bufferData
