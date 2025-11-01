'use client'

import { Skill, SkillLevel } from "@/modules/skills/domain/skills.types"
import { SkillLevelBadge } from "../../ui/skill-level-badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AiPlanData } from "@/modules/profile/domain/profile.types";
import { useRequestAiPlan } from "@/modules/profile/infrastructure/query/mutations";
import { Dialog } from "@/components/ui/dialog";
import { AiPlanDialog } from "../ai-plan-dialog/ai-plan-dialog";

export const SkillRow = ({
    skill,
    employeeId,
    handleSendRequest
}: {
    skill: Skill,
    employeeId: number,
    handleSendRequest: (requestType: "upgrade", employeeId: number, skill_id: number) => void
}) => {

    const [aiData, setAiData] = useState<AiPlanData | null>(null)
    const [openAiDataDialog, setOpenAiDataDialog] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSaveAiData = (data: AiPlanData) => {
        if (data) setAiData(data)
    }
    
    const {mutate, isPending, isSuccess} = useRequestAiPlan({saveToState: handleSaveAiData})

    useEffect(() => {
        if (isSuccess && aiData) setOpenAiDataDialog(true)
    }, [isPending])

    const handleRequestAiPlan = (skill_level: SkillLevel, skill_shape_id: number) => {
        mutate({skill_level, skill_shape_id})
    }

    const sendRequest = (id: number, skill_id: number) => {
        setIsLoading(true)
        handleSendRequest('upgrade', id, skill_id)
        setIsLoading(false)
    } 

    const handleCloseAiPlan = () => {
        setOpenAiDataDialog(false)
    }

    return (
        <div className="flex justify-between">
            <div className="flex gap-2 items-center">
                <p className="capitalize">{skill.skill_shape.skill_name}: </p>
                {SkillLevelBadge(skill.skill_level)}
            </div>
            <div className="flex gap-2">
            <Button
                variant="secondary"
                disabled={isPending}
                onClick={
                aiData
                    ? () => setOpenAiDataDialog(true)
                    : () => {
                        handleRequestAiPlan(
                            skill.skill_level,
                            skill.skill_shape.skill_shape_id
                        );
                    }
                }
            >
                AI-План
            </Button>
            <Button
                onClick={() => sendRequest(employeeId, skill.skill_connection_id)}
                disabled={isLoading}
            >
                Отправить запрос
            </Button>
            </div>
            <Dialog open={openAiDataDialog} onOpenChange={handleCloseAiPlan}>
                {openAiDataDialog && aiData && (
                    <AiPlanDialog 
                        message={aiData.message}
                        skill_level={aiData.skill_level}
                        skill_shape={aiData.skill_shape}
                    />
                )}
            </Dialog>
        </div>
    );
}