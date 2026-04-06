import { IconBell, IconBellRinging } from "@tabler/icons-react";

type Props = {
  icon?: string;
  className?: string;
};

export function ReminderIcon({ icon, className }: Props) {
  switch (icon) {
    case "notifications_active":
    case "bell-ringing":
      return <IconBellRinging className={className} />;
    case "notifications":
    case "bell":
    default:
      return <IconBell className={className} />;
  }
}
