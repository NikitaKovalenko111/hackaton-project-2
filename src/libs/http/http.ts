/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import authConfig from "@/libs/configs/auth";

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API,

    // baseURL: 'http://0.0.0.0:8000/'
})

const https = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_SECOND,

    // baseURL: 'http://0.0.0.0:8000/'
})

http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(authConfig.storageTokenKeyName) || ''
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Intercept response to handle 401 errors
http.interceptors.response.use(
    (res) => {
        return res
    },
    (err) => {
        
        const originalConfig = err.config

        if (originalConfig.url !== '/login') {
            if (err.response.status === 401) {
                localStorage.removeItem('access_token')
                localStorage.removeItem(authConfig.storageTokenKeyName)
                localStorage.removeItem('crmType')
                localStorage.removeItem('isCrmConnected')
                localStorage.removeItem('userData')
                localStorage.removeItem('accessToken')
                if (window.location.pathname !== '/login') {
                    window.location.assign('/login')
                }
            }
        }

        return Promise.reject(err)
    },
)

const get = (url: string, headers: any, params = {}) => {
    return http.get(url, {
        params: {...params},
        headers: {
            ...headers,
        },
    })
}

const getSec = (url: string, headers: any, params = {}) => {
    return https.get(url, {
        params: {...params},
        headers: {
            ...headers,
        },
    });
};

const post = (url: string, data: any, headers = {}, params = {}) => {
    return http.post(url, data, {
        ...params,
        headers: {
            ...headers,
        },
    })
}

const put = (url: string, data: any, headers = {}) => {
    return http.put(url, data, {
        headers: {
            ...headers,
        },
    })
}

const remove = (url: string, data: any, headers = {}, params = {}) => {
    return http.delete(url, {
        params: {...params},
        headers: {
            ...headers,
        },
        data,
    })
}

const patch = (url: string, data: any, headers = {}) => {
    return http.patch(url, data, {
        headers: {
            ...headers,
        },
    })
}
/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
    http,
    https,
    get,
    getSec,
    post,
    put,
    remove,
    patch,
}
