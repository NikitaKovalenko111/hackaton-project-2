import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Skill } from "@/modules/skills/domain/skills.types"
import { SkillLevelBadge } from "../../ui/skill-level-badge"

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
                            <div key={id} className="flex gap-2">
                                <p>{skill.skill_shape.skill_name}: </p>
                                {SkillLevelBadge(skill.skill_level)}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
            </Card>
        </TabsContent>
    )
}