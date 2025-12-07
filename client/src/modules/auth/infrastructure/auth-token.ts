import authConfig from '@/libs/configs/auth'
import { ROLE } from '@/libs/constants'

const Cookies = require('js-cookie')

export const saveTokenStorage = (accessToken: string) => {
    // localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
    Cookies.set(`${authConfig.storageTokenKeyName}`, accessToken, {
        expires: 1,
        domain: process.env.DOMAIN,
        // domain: "176.119.147.135"
    })
}

export const saveRefreshStorage = (refreshToken: string) => {
    localStorage.setItem(authConfig.onTokenExpiration, refreshToken, )
    Cookies.set(`${authConfig.onTokenExpiration}`, refreshToken, {
        expires: 30,
        domain: process.env.DOMAIN,
    })
}

export const saveRoleStorage = (role: ROLE) => {
    // localStorage.setItem('role', role)
    Cookies.set('role', role, {
        expires: 30,
        // domain: "localhost"
        domain: process.env.DOMAIN,
    })
}
