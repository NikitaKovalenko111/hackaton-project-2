'use client'

import { Skill, SkillLevel } from '@/modules/skills/domain/skills.types'
import { SkillLevelBadge } from '../../ui/skill-level-badge'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { AiPlanData } from '@/modules/profile/domain/profile.types'
import { useRequestAiPlan } from '@/modules/profile/infrastructure/query/mutations'
import { Dialog } from '@/components/ui/dialog'
import { AiPlanDialog } from '../ai-plan-dialog/ai-plan-dialog'
import ProtectedRoute from '@/libs/protected-route'

export const SkillRow = ({
    skill,
    employeeId,
    handleSendRequest,
    isCurrentEmployee,
}: {
    skill: Skill
    employeeId: number
    handleSendRequest: (
        requestType: 'upgrade',
        employeeId: number,
        skill_id: number
    ) => void
    isCurrentEmployee: boolean
}) => {
    const [aiData, setAiData] = useState<AiPlanData | null>(null)
    const [openAiDataDialog, setOpenAiDataDialog] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSaveAiData = (data: AiPlanData) => {
        if (data) setAiData(data)
    }

    const { mutate, isPending, isSuccess } = useRequestAiPlan({
        saveToState: handleSaveAiData,
    })

    useEffect(() => {
        if (isSuccess && aiData) setOpenAiDataDialog(true)
    }, [isPending])

    const handleRequestAiPlan = (
        skill_level: SkillLevel,
        skill_shape_id: number
    ) => {
        mutate({ skill_level, skill_shape_id })
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
        <div className="flex items-center justify-between gap-4 p-3 rounded-md bg-white/70 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
                <p className="truncate font-medium text-sm capitalize text-slate-700 dark:text-slate-200">
                    {skill.skill_shape.skill_name}:
                </p>
                <div className="flex-shrink-0">
                    {SkillLevelBadge(skill.skill_level)}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {isCurrentEmployee && (
                    <Button
                        variant="secondary"
                        disabled={isPending}
                        className="h-9 px-3 transition-colors duration-150"
                        onClick={
                            aiData
                                ? () => setOpenAiDataDialog(true)
                                : () =>
                                      handleRequestAiPlan(
                                          skill.skill_level,
                                          skill.skill_shape.skill_shape_id
                                      )
                        }>
                        AI-План
                    </Button>
                )}

                <ProtectedRoute allowedRoles={['developer', 'hr', 'moderator']}>
                    <Button
                        onClick={() =>
                            sendRequest(employeeId, skill.skill_connection_id)
                        }
                        disabled={isLoading}
                        className="h-9 px-3 transition-colors duration-150">
                        Отправить запрос
                    </Button>
                </ProtectedRoute>
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
    )
}
