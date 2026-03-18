import { createClient } from "@/lib/supabase/server";
import { ProfileDetailsClient } from "@/components/profile/profile-details-client";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, credentials, designation")
    .eq("id", user.id)
    .maybeSingle();

  const fallbackName =
    typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null;
  const displayName = profile?.full_name || fallbackName || "Clinician";
  const initialAvatarUrl =
    typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null;

  return (
    <ProfileDetailsClient
      userId={user.id}
      email={user.email ?? null}
      createdAt={user.created_at ?? null}
      lastSignInAt={user.last_sign_in_at ?? null}
      initialName={displayName}
      initialAvatarUrl={initialAvatarUrl}
      initialCredentials={profile?.credentials ?? null}
      initialDesignation={profile?.designation ?? null}
    />
  );
}
