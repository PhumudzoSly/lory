import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ProfileTabs } from "./profile-tabs";
import { IconUserCircle } from "@tabler/icons-react";

export function ProfilePage() {
  const user = useQuery(api.auth.getCurrentUser);

  return (
    <div className="mx-auto max-w-3xl space-y-10 p-6 md:p-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-muted-foreground/50">
          <IconUserCircle size={18} stroke={2} />
          <h1 className="text-[11px] font-bold uppercase tracking-[0.25em]">
            My Profile
          </h1>
        </div>
        <div className="w-full h-px bg-border/40" />
      </div>

      {user === undefined && (
        <div className="text-[13px] text-muted-foreground/50">
          Loading profile...
        </div>
      )}
      {user === null && (
        <div className="text-[13px] text-destructive/80">
          Could not load your profile. Try signing out and back in.
        </div>
      )}
      {user && <ProfileTabs user={user} />}
    </div>
  );
}
