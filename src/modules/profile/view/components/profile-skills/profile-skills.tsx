'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Skill } from "@/modules/skills/domain/skills.types"
import { SkillLevelBadge } from "../../ui/skill-level-badge"
import { Button } from "@/components/ui/button"
import { useSocket } from "@/libs/hooks/useSocket"
import { useState } from "react"

export const ProfileSkillsTab = ({employeeId, skills}: {employeeId: number, skills: Skill[]}) => {

    const {handleSendRequest} = useSocket()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const sendRequest = (id: number, skill_id: number) => {
        setIsLoading(true)
        handleSendRequest('upgrade', id, skill_id)
        setIsLoading(false)
    } 

    return (
        <TabsContent value="skills" className="space-y-6">
            <Card>
            <CardHeader>
                <CardTitle>Ваши компетенции</CardTitle>
                <CardDescription>
                    Здесь вы можете узнать ваши компетенции и их уровень, а также отправить запрос на повышение уровня.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                
                    {skills.map((skill, id) => {
                        return (
                            <div key={id} className="flex justify-between">
                                <div className="flex gap-2 items-center">
                                    <p>{skill.skill_shape.skill_name}: </p>
                                    {SkillLevelBadge(skill.skill_level)}
                                </div>
                                <div>
                                    <Button 
                                        onClick={() => sendRequest(employeeId, skill.skill_connection_id)}
                                        disabled={isLoading}
                                    >
                                        Отправить запрос
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                
            </CardContent>
            </Card>
        </TabsContent>
    )
}