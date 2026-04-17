import { defHttp } from '/@/utils/http/axios'
import { useUserStore } from '/@/store/modules/user'
import { getAuthCache } from '/@/utils/auth'
import { DB_DICT_DATA_KEY } from '/@/enums/cacheEnum'

/**
 * 从缓存中获取字典配置
 * @param code
 */
export const getDictItemsByCode = (code) => {
    // update-begin--author:liaozhiyang---date:20230908---for：【QQYUN-6417】生产环境字典慢的问题
    const userStore = useUserStore()
    const dictItems = userStore.getAllDictItems
    if (null != dictItems && typeof dictItems === 'object' && dictItems[code]) {
        return dictItems[code]
    }
    //update-begin-author:liusq---date:2023-10-13--for: 【issues/777】列表 分类字典不显示
    //兼容以前的旧写法
    if (getAuthCache(DB_DICT_DATA_KEY) && getAuthCache(DB_DICT_DATA_KEY)[code]) {
        return getAuthCache(DB_DICT_DATA_KEY)[code]
    }
    //update-end-author:liusq---date:2023-10-13--for:【issues/777】列表 分类字典不显示

    // update-end--author:liaozhiyang---date:20230908---for：【QQYUN-6417】生产环境字典慢的问题

}
/**
 * 从缓存中获取Pop字典配置
 * @param text
 * @param code
 */
export const getPopDictByCode = (text, codeStr) => {
    const [code, dictCode, dictText] = codeStr.split(',')
    if (!code || !dictCode || !dictText) {
        return []
    }
    return defHttp.get(
        { url: `/online/api/cgreportGetDataPackage`, params: { code, dictText, dictCode, dataList: text } },
        { isTransformResponse: false }
    )
}
/**
 * 获取字典数组
 * @param dictCode 字典Code
 * @return List<Map>
 */
export const initDictOptions = (code) => {
    //1.优先从缓存中读取字典配置
    if (getDictItemsByCode(code)) {
        return new Promise((resolve, reject) => {
            resolve(getDictItemsByCode(code))
        })
    }
    //2.获取字典数组
    //update-begin-author:taoyan date:2022-6-21 for: 字典数据请求前将参数编码处理，但是不能直接编码，因为可能之前已经编码过了
    if (code.indexOf(',') > 0 && code.indexOf(' ') > 0) {
        // 编码后类似sys_user%20where%20username%20like%20xxx' 是不包含空格的,这里判断如果有空格和逗号说明需要编码处理
        code = encodeURI(code)
    }
    //update-end-author:taoyan date:2022-6-21 for: 字典数据请求前将参数编码处理，但是不能直接编码，因为可能之前已经编码过了
    return defHttp.get({ url: `/sys/dict/getDictItems/${code}` })
}
/**
 * 获取字典数组
 * @param code 字典Code
 * @param params 查询参数
 * @param options 查询配置
 * @return List<Map>
 */
export const ajaxGetDictItems = (code, params, options?) => defHttp.get({ url: `/sys/dict/getDictItems/${code}`, params }, options)



// 字典值转文本
export const getDictTextByCode = (v, code) => {
    let text = ''
    let array = getDictItemsByCode(code) || []
    let vArr = v?.toString()?.split(',')
    if (vArr?.length > 1) {
        let obj = array.filter((item) => {
            return vArr.includes(item.value)
        })
        if (obj.length > 0) {
            text = obj.map((item) => item.text).join(',')
        }
        return text
    }
    let obj = array.filter((item) => {
        return item.value == v
    })

    if (obj.length > 0) {
        text = obj[0].text
    }
    return text
}
// 获取字典值的对象或整个字典
export const getDictObjectByCode = (v, code) => {
    let obj = getDictItemsByCode(code) || []
    if (v) {
        return obj.find((item) => item.value == v)
    }
    return obj
}

/**
 * 根据根据传入数组的value获取key的值，并返回key的值
 * @param v 值，可以为字符串或数字
 * @param optionsArr 选项数组
 * @returns 对应的label，没有匹配则返回空字符串
 */
export interface LabelValueOption {
    label: string
    value: string | number
    [key: string]: any
}

export function getLabelByValue(
    v: string | number,
    optionsArr: LabelValueOption[] = []
): string {
    if (!Array.isArray(optionsArr)) return ''
    // 因为数据内value可能是数字或字符串，做非类型严格比较
    const found = optionsArr.find(item => item.value == v)
    return found ? found.label : ''
}