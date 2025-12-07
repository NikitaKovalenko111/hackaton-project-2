import http from '@/libs/http/http'
import { CreateCompanyDTO } from '../domain/company.type'
import { saveCompanyStorage } from './company-storage'

export const createCompany = async (data: CreateCompanyDTO) => {
    const res = await http.post('company/create', data)

    if (res.data.company_id) saveCompanyStorage(res.data.company_id)

    return res.data
}
