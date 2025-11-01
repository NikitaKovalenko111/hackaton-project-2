'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Skill, SkillLevel, SkillShape } from "@/modules/skills/domain/skills.types"
import { SkillLevelBadge } from "../../ui/skill-level-badge"
import { Button } from "@/components/ui/button"
import { useSocket } from "@/libs/hooks/useSocket"
import { useEffect, useState } from "react"
import { useRequestAiPlan } from "@/modules/profile/infrastructure/query/mutations"
import { AiPlanData } from "@/modules/profile/domain/profile.types"
import { Dialog } from "@/components/ui/dialog"
import { AiPlanDialog } from "../ai-plan-dialog/ai-plan-dialog"
import { SkillRow } from "../skill-row/skill-row"

export const ProfileSkillsTab = ({employeeId, skills}: {employeeId: number, skills: Skill[]}) => {

    const {handleSendRequest} = useSocket()

    // const [aiData, setAiData] = useState<AiPlanData | null>(null)
    // const [openAiDataDialog, setOpenAiDataDialog] = useState<boolean>(false)

    // const handleSaveAiData = (data: AiPlanData) => {
    //     if (data) setAiData(data)
    // }
    
    // const {mutate, isPending, isSuccess} = useRequestAiPlan({saveToState: handleSaveAiData})

    // useEffect(() => {
    //     if (isSuccess && aiData) setOpenAiDataDialog(true)
    // }, [isPending])

    // const [isLoading, setIsLoading] = useState<boolean>(false)

    // const sendRequest = (id: number, skill_id: number) => {
    //     setIsLoading(true)
    //     handleSendRequest('upgrade', id, skill_id)
    //     setIsLoading(false)
    // } 

    // const handleRequestAiPlan = (skill_level: SkillLevel, skill_shape_id: number) => {
    //     mutate({skill_level, skill_shape_id})
    // }

    // const handleCloseAiPlan = () => {
    //     setOpenAiDataDialog(false)
    // }

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
                            <SkillRow employeeId={employeeId} handleSendRequest={handleSendRequest} skill={skill} key={id} />
                            // <div key={id} className="flex justify-between">
                            //     <div className="flex gap-2 items-center">
                            //         <p className="capitalize">{skill.skill_shape.skill_name}: </p>
                            //         {SkillLevelBadge(skill.skill_level)}
                            //     </div>
                            //     <div className="flex gap-2">
                            //         <Button 
                            //             variant="secondary"
                            //             disabled={isPending}
                            //             onClick={aiData ? 
                            //                 () => setOpenAiDataDialog(true) : 
                            //                 () => {
                            //                     handleRequestAiPlan(skill.skill_level, skill.skill_shape.skill_shape_id)
                            //                 }
                            //             }
                            //         >
                            //             AI-План
                            //         </Button>
                            //         <Button 
                            //             onClick={() => sendRequest(employeeId, skill.skill_connection_id)}
                            //             disabled={isLoading}
                            //         >
                            //             Отправить запрос
                            //         </Button>
                            //     </div>
                            // </div>
                        )
                    })}
            </CardContent>
            </Card>
        </TabsContent>
    )
}