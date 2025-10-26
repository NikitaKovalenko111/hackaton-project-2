import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Skill } from "@/modules/skills/domain/skills.types"

export const ProfileSkillsTab = ({skills}: {skills: Skill[]}) => {

    return (
        <TabsContent value="account" className="space-y-6">
            <Card>
            <CardHeader>
                <CardTitle>Ваши компетенции</CardTitle>
                <CardDescription>
                    Здесь вы можете узнать ваши компетенции и их уровень
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    {skills.map((skill, id) => {
                        return (
                            <div className="space-y-1">
                                <p>{skill.skill_shape.skill_name}: </p>
                                <p>{skill.skill_level}</p>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
            </Card>
        </TabsContent>
    )
}