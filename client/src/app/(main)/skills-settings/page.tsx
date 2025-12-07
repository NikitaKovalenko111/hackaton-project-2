import ProtectedRoute from "@/libs/protected-route";
import { Skills } from "@/modules/skills/view/components/skills/skills";

export default function SkillPage() {
    return (
        <div className="w-full flex items-center justify-center">
            <Skills />
        </div>
    )
}