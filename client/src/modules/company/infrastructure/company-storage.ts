
const Cookies = require('js-cookie')

export const saveCompanyStorage = (companyId: number) => {
    // localStorage.setItem("companyId", String(companyId))
    Cookies.set("companyId", companyId, {
        expires: 30
    })
}