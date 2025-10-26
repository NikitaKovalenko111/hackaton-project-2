'use client'

import { useEffect, useState } from "react"
import { EmployeesTable } from "../employees-table/employees-table"
import { useGetCompanyEmployees } from "@/modules/employees/infrastructure/query/queries"
import { EmployeeTable } from "@/modules/employees/domain/employees.type"
import ProtectedRoute from "@/libs/protected-route"

export const Employees = () => {

    const [employees, setEmployees] = useState<EmployeeTable[]>([])

    const {data} = useGetCompanyEmployees()

    useEffect(() => {
        
        if (data) {
            const items: EmployeeTable[] = data.map((item) => ({
                employee_id: item.employee_id,
                employee_name: item.employee_name,
                employee_surname: item.employee_surname,
                role: item.role.role_name,
                team: item.team
            }))
            debugger
            setEmployees(items)
        }
    }, [data])

    return (
        <div className="mx-auto animate-appear max-w-6xl space-y-6 px-4 py-10">
            <ProtectedRoute allowedRoles={['admin']}>
                <EmployeesTable data={employees} />
            </ProtectedRoute>
        </div>
    )
}