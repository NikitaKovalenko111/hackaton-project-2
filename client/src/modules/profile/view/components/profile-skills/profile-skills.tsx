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
            <Card className="overflow-hidden shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6 pb-0">
                <div>
                <CardTitle className="text-lg sm:text-xl">
                    {isCurrentEmployee ? "Ваши компетенции" : "Компетенции сотрудника"}
                </CardTitle>
                {isCurrentEmployee && (
                    <CardDescription className="mt-1 text-sm text-muted-foreground max-w-prose">
                    Здесь вы можете узнать ваши компетенции и их уровень, а также отправить запрос на повышение уровня.
                    </CardDescription>
                )}
                </div>

                <div className="flex items-center gap-3 pt-1 sm:pt-0">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                    {skills.length} {skills.length === 1 ? "компетенция" : "компетенции"}
                </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {skills.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                    Компетенции не найдены
                </div>
                ) : (
                <div className="space-y-3">
                    {skills.map((skill, id) => (
                    <div
                        key={id}
                        className="p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                        <SkillRow
                        isCurrentEmployee={isCurrentEmployee}
                        employeeId={employeeId}
                        handleSendRequest={handleSendRequest}
                        skill={skill}
                        />
                    </div>
                    ))}
                </div>
                )}
            </CardContent>
            </Card>
        </TabsContent>
    )
}