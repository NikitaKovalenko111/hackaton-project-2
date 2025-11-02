export interface addTeamBodyDto {
  company_id: number
  team_desc: string | null
  team_name: string
  teamlead_id: number
}

export interface addEmployeeBodyDto {
  team_id: number
  employee_to_add_id: number
}
