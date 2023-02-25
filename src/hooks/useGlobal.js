import {getCurrentInstance, inject} from 'vue'

/**
 * 获取全局变量
 */
const useGetGlobalProperties = () => {
    const {emit, appContext: {app: {config: {globalProperties}}}} = getCurrentInstance()
    return {...globalProperties}
}

/**
 * 获取provide注入的数据
 */
const useGetInject = (key) => {
    return inject(key)
}


export {
    useGetGlobalProperties,
    useGetInject
}
