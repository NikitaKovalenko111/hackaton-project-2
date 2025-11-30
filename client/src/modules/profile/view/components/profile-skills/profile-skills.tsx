'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Skill, SkillLevel, SkillShape } from "@/modules/skills/domain/skills.types"
import { useSocket } from "@/libs/hooks/useSocket"
import { SkillRow } from "../skill-row/skill-row"

export const ProfileSkillsTab = ({employeeId, skills, isCurrentEmployee}: {employeeId: number, skills: Skill[], isCurrentEmployee: boolean}) => {

    const {handleSendRequest} = useSocket()

    return (
        <TabsContent value="skills" className="space-y-6">
            <Card>
            <CardHeader>
                { 
                isCurrentEmployee ?
                <CardTitle>Ваши компетенции</CardTitle> :
                <CardTitle>Компетенции сотрудника</CardTitle>
                }
                {
                isCurrentEmployee &&
                <CardDescription>
                    Здесь вы можете узнать ваши компетенции и их уровень, а также отправить запрос на повышение уровня.
                </CardDescription>
                }
            </CardHeader>
            <CardContent className="space-y-6">
                
                    {skills.map((skill, id) => {
                        return (
                            <SkillRow isCurrentEmployee={isCurrentEmployee} employeeId={employeeId} handleSendRequest={handleSendRequest} skill={skill} key={id} />
                        )
                    })}
            </CardContent>
            </Card>
        </TabsContent>
    )
}