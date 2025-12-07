/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
    meEndpoint: '/auth/me',
    loginEndpoint: '/jwt/login',
    registerEndpoint: '/jwt/register',
    storageTokenKeyName: 'accessToken',
    onTokenExpiration: 'refreshToken', // logout | refreshToken
}
