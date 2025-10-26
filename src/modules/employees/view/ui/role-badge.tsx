import { Badge } from "@/components/ui/badge";
import { ROLE, ROLE_TRANSLATION } from "@/libs/constants";

export const roleBadge = (role: ROLE) => {
    switch (role) {
        case "admin": return <Badge variant="destructive" className="bg-[green]">{ROLE_TRANSLATION[role]}</Badge>
        case 'developer': return <Badge variant="destructive" className="bg-[blue]">{ROLE_TRANSLATION[role]}</Badge>
        case 'hr': return <Badge variant="destructive" className="bg-[orange]">{ROLE_TRANSLATION[role]}</Badge>
        case 'moderator': return <Badge variant="destructive" className="bg-[red]">{ROLE_TRANSLATION[role]}</Badge>
        case 'teamlead': return <Badge variant="destructive" className="bg-[purple]">{ROLE_TRANSLATION[role]}</Badge>
        case 'techlead': return <Badge variant="destructive" className="bg-[yellow]">{ROLE_TRANSLATION[role]}</Badge>
    }
}