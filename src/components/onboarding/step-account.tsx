import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ProfileDetailsCard } from "../profile/profile-details-card";

export function StepAccount() {
  const user = useQuery(api.auth.getCurrentUser);

  if (!user) {
    return (
      <div className="text-[13px] text-muted-foreground/50">Loading...</div>
    );
  }

  return (
    <ProfileDetailsCard
      key={`${user.name ?? ""}|${user.image ?? ""}`}
      initialName={user.name ?? ""}
      initialImage={user.image ?? ""}
      email={user.email}
    />
  );
}
