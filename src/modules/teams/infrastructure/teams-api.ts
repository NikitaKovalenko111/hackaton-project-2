import http from "@/libs/http/http"
import { AddTeamDTO, Team } from "../domain/teams.type"

export const getTeams = async (companyId: number): Promise<Team[]> => {
    const res = await http.get(`/company/${companyId}/teams`, {})

    return res.data
}

export const getTeamInfo = async (): Promise<Team> => {
    const res = await http.get("team/info", {})

    return res.data
}

export const addTeam = async (data: AddTeamDTO): Promise<Team> => {
    
    const new_data = {
        company_id: data.company_id,
        team_desc: data.team_desc,
        team_name: data.team_name,
        teamlead_id: Number(data.teamlead_id)
    }

    const res = await http.post("team/add", new_data)

    return res.data
}

export const deleteTeam = async (id: number) => {
    const res = await http.remove(`team/remove/${id}`, {})

    return res.data
}