import { SkillUsers } from "@/modules/skills/view/components/skill-users/skill-users";


export default async function SkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="animate-appear w-full">
      <SkillUsers id={Number(id)} />
    </div>
  );
}