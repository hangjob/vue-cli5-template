import axios from 'axios'
import PmUtils from 'pm-utils'


const http = axios.create({
    timeout: 1000 * 60,
    withCredentials: true, // 表示跨域请求时是否需要  使用凭证
    headers: {
        "Content-Type": "application/json",
    },
});


http.interceptors.request.use((config) => {
    // 这里可以放置请求头信息
    config.headers['token'] = 'xxxxx'
    return config;
}, (error) => {
    return Promise.reject(error)
})

http.interceptors.response.use((res) => {
    const {data} = res;
    // 这里可以做更多处理
    if (data.code === 1) {
        return res;
    } else {
        return Promise.reject(data)
    }
}, (error) => {
    const {config} = error.toJSON()
    config.reconnectCount = config.reconnectCount || 1;
    if (config.reconnectCount >= 3) { // 检查重试次数是否达到最大值
        return Promise.reject(error)
    }
    const backoff = new Promise(function (resolve) {  // 创建新的Promise来处理
        setTimeout(function () {
            resolve()
        }, 2000)
    })
    config.reconnectCount += 1  // 增加重试次数
    return backoff.then(function () {  // 返回promise，其中调用axios来重试请求
        return http(config)
    })
})


const post = (url, params, config = {}) => {
    return http.post(url, params, config)
}

const get = (url, params, config = {}) => {
    return http.get(url, {params: params, ...config})
}


const upload = (url, params = {}, config = {}) => {
    let formData = new FormData()
    for (const key in params) {
        formData.append(key, params[key])
    }
    return http.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        ...config
    })
}


const download = (url, params, config) => {
    return http({
        method: 'post',
        url: url,
        responseType: 'blob',
        data: params,
        ...config,
    }).then((res) => {
        PmUtils.file.fileDownload(res.data, data?.fileName)
    })
}

const httpAll = (params = []) => {
    return axios.all([...params])
}

export {
    post,
    get,
    http,
    upload,
    download,
    httpAll
}
