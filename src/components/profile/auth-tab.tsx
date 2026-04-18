import { ProfileDetailsCard } from "./profile-details-card";
import { ChangePasswordCard } from "./change-password-card";
import { SessionCard } from "./session-card";

type Props = {
  name: string;
  image: string;
  email: string;
};

const divider = (
  <div className="h-px w-full bg-border/40" aria-hidden="true" />
);

export function AuthTab({ name, image, email }: Props) {
  return (
    <div className="space-y-10">
      <ProfileDetailsCard
        key={`${name}|${image}`}
        initialName={name}
        initialImage={image}
        email={email}
      />
      {divider}
      <ChangePasswordCard />
      {divider}
      <SessionCard />
    </div>
  );
}
