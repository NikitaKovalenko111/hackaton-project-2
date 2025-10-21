import authConfig from '@/libs/configs/auth';

const Cookies = require('js-cookie')

export const saveTokenStorage = (accessToken: string) => {
    localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
    Cookies.set(`${authConfig.storageTokenKeyName}`, accessToken)
}

export const saveRefreshStorage = (refreshToken: string) => {
    localStorage.setItem(authConfig.onTokenExpiration, refreshToken)
    Cookies.set(`${authConfig.onTokenExpiration}`, refreshToken)
}