import { Profile } from "@/modules/profile/view/components/profile/profile";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
      <Profile isCurrentEmployee={false} id={parseInt(id)} />
  );
}