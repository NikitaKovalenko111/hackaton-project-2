import { ROLE } from "@/libs/constants";
import { CompanyData } from "@/modules/company/domain/company.type";
import { Skill } from "@/modules/skills/domain/skills.types";
import { Team } from "@/modules/teams/domain/teams.type";

export interface Role {
    role_id: number
    role_name: ROLE
}

export interface Employee {
    employee_id: number;
    employee_name: string;
    employee_surname: string;
    employee_email: string;
    employee_status: string;
    employee_photo: string;
    employee_password: string;
    telegram_id: number
    role: Role
    company: CompanyData
    team: Team
    skills: Skill[]
}
