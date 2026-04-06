import {
  IconBell,
  IconBellBolt,
  IconBellCheck,
  IconBellRinging,
} from "@tabler/icons-react";

type Props = {
  icon?: string;
  className?: string;
};

export function ReminderIcon({ icon, className }: Props) {
  switch (icon) {
    case "notifications_active":
      return <IconBellBolt className={className} />;
    case "bell-ringing":
      return <IconBellRinging className={className} />;
    case "notifications":
      return <IconBellCheck className={className} />;
    case "bell":
    default:
      return <IconBell className={className} />;
  }
}
