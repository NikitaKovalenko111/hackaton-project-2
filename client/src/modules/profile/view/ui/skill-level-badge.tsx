import { Badge } from '@/components/ui/badge'
import { SkillLevel } from '@/modules/skills/domain/skills.types'

export const SkillLevelBadge = (level: SkillLevel) => {
    switch (level) {
        case 'junior':
            return (
                <Badge variant="destructive" className="bg-[green] capitalize">
                    {level}
                </Badge>
            )
        case 'junior+':
            return (
                <Badge
                    variant="destructive"
                    className="bg-[#15753a] capitalize">
                    {level}
                </Badge>
            )
        case 'middle':
            return (
                <Badge variant="destructive" className="bg-[red] capitalize">
                    {level}
                </Badge>
            )
        case 'middle+':
            return (
                <Badge
                    variant="destructive"
                    className="bg-[#75151a] capitalize">
                    {level}
                </Badge>
            )
        case 'senior':
            return (
                <Badge variant="destructive" className="bg-[purple] capitalize">
                    {level}
                </Badge>
            )
    }
}
