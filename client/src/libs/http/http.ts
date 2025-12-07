/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import authConfig from "@/libs/configs/auth";
import { logout } from '@/modules/profile/infrastructure/profile-api';
const Cookies = require("js-cookie")

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
    

    // baseURL: 'http://0.0.0.0:8000/'
})

const https = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_SECOND,

    // baseURL: 'http://0.0.0.0:8000/'
})

const refreshAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
    withCredentials: true
})

refreshAxios.interceptors.request.use(
    (config) => {
        if (typeof window != 'undefined') {
            // const token = localStorage.getItem(authConfig.storageTokenKeyName) || ''
            const token = Cookies.get('refreshToken') || ''
            if (token) {
                config.headers['refreshToken'] =  token
            }
        }
        

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

let isRefetching = false
// let failedQueue: any[] = []

// const refreshTokens = async () => {
//     const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/employee/refresh`, {}, {
//         withCredentials: true,
        
//     })
//     debugger
//     Cookies.set("accessToken", res.data.accessToken)

//     return {
//         accessToken: res.data.accessToken,
//         refreshToken: res.data.refreshToken
//     }
// }

let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

export const refreshTokens = async (): Promise<{accessToken: string, refreshToken: string}> => {
    if (isRefetching) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        });
    }

    isRefetching = true;

    try {
        // const res = await refreshAxios.post('/employee/refresh', {}, {
        //     withCredentials: true,
        // });

        // const { accessToken, refreshToken } = res.data;
        // Cookies.set("accessToken", accessToken);
        // if (refreshToken) Cookies.set("refreshToken", refreshToken);

        // failedQueue.forEach(p => p.resolve({ accessToken, refreshToken }));
        // failedQueue = [];

        // return { accessToken, refreshToken };
    } catch (err) {
        // failedQueue.forEach(p => p.reject(err));
        // failedQueue = [];
        // await logout()
    } finally {
        isRefetching = false;
        return {
            accessToken: '',
            refreshToken: '',
        }
    }
};

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
            // isRefetching = true
            try {
                const res = await refreshTokens()
                if (res.accessToken) {
                    config.headers.Authorization = `Bearer ${res.accessToken}`
                }
                if (!res.accessToken) return Promise.reject()
                return http(config)
            } catch (err) {
                return Promise.reject(err)
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
