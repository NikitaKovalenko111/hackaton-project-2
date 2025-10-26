/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { createTokenRefreshMiddleware } from 'axios-jwt-refresh-token';
import authConfig from "@/libs/configs/auth";
import { refreshToken } from '@/modules/auth/infrastructure/auth-api';
import { saveRefreshStorage, saveRoleStorage, saveTokenStorage } from '@/modules/auth/infrastructure/auth-token';
import { saveCompanyStorage } from '@/modules/company/infrastructure/company-storage';

const Cookies = require("js-cookie")

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
    

    // baseURL: 'http://0.0.0.0:8000/'
})

const https = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_SECOND,

    // baseURL: 'http://0.0.0.0:8000/'
})

let isRefetching = false
let failedQueue: any[] = []

const processQueue = (error: any, token: any = null) => {
    failedQueue.forEach(prom => {
        if (error) {
        prom.reject(error);
        } else {
        prom.resolve(token);
        }
    });
    failedQueue = [];
};

const refreshTokens = async () => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/employee/refresh`, {}, {
        withCredentials: true,
        
    })
    debugger
    Cookies.set("accessToken", res.data.accessToken)

    return {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken
    }
}

const requestAccessMiddleware = createTokenRefreshMiddleware({
    requestTokens: refreshTokens,
    onRefreshAndAccessExpire: () => {
        window.location.href = '/auth'
    },
    accessTokenKey: 'accessToken',
    refreshTokenKey: 'refreshToken',
    cookiesOptions: { secure: true, sameSite: 'strict' }
})

http.interceptors.request.use(
    (config) => {
        if (typeof window != 'undefined') {
            // const token = localStorage.getItem(authConfig.storageTokenKeyName) || ''
            const token = Cookies.get(authConfig.storageTokenKeyName) || ''
            if (token) {
                config.headers['Authorization'] = 'Bearer ' + token
            }
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
    async (err) => {
        
        const accessToken = Cookies.get("accessToken")
        const refreshToken = Cookies.get("refreshToken")

        const config = err.config
        
        if (err.response.status === 401 && !config._retry) {
            config._retry = true
            isRefetching = true
            const res = await refreshTokens()
            debugger

            if (res.accessToken) {
                config.headers.Authorization = `Bearer ${res.accessToken}`
            }

            return http(config)
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
