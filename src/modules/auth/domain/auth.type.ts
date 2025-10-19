
export interface AuthData {
    employee_name: string 
    employee_surname: string 
    employee_email: string 
    employee_password: string 
}

export interface Payload {
    employee_id: number 
    employee_name: string 
    employee_surname: string 
    employee_email: string 
    employee_status: string 
    employee_photo: string 
}

export interface AuthDTO {
    accessToken: string 
    refreshToken: string 
    payload: Payload
}


export type AuthMode = "login" | "signup"

export interface LoginFormProps {
    handleChangeMode: (value: AuthMode) => void
}