import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconKey,
  IconLock,
  IconShieldLock,
  IconCheck,
  IconRotateClockwise2,
} from "@tabler/icons-react";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ kind: "error", message: "Passwords do not match" });
      return;
    }
    setStatus({ kind: "saving" });
    const result = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    if (result.error) {
      setStatus({
        kind: "error",
        message: result.error.message ?? "Failed to change password",
      });
      return;
    }
    setStatus({ kind: "success" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
          Security
        </h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground/50 max-w-[80%]">
          Update your password. Doing so will sign out all other active sessions
          for your protection.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-[120px_1fr] items-center gap-4 py-1 group transition-colors">
          <Label
            htmlFor="current-password"
            className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50"
          >
            <IconLock size={14} stroke={2} className="opacity-70" />
            Current
          </Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="h-8 max-w-sm text-[13px] bg-transparent border-border/20 group-hover:border-border/50 transition-colors shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-4 py-1 group transition-colors">
          <Label
            htmlFor="new-password"
            className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50"
          >
            <IconKey size={14} stroke={2} className="opacity-70" />
            New
          </Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            className="h-8 max-w-sm text-[13px] bg-transparent border-border/20 group-hover:border-border/50 transition-colors shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-4 py-1 group transition-colors">
          <Label
            htmlFor="confirm-password"
            className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50"
          >
            <IconShieldLock size={14} stroke={2} className="opacity-70" />
            Confirm
          </Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            className="h-8 max-w-sm text-[13px] bg-transparent border-border/20 group-hover:border-border/50 transition-colors shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-4 pt-4">
          <div /> {/* Spacer */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={status.kind === "saving"}
              className="inline-flex h-8 items-center justify-center rounded-md bg-secondary/50 px-4 text-[12px] font-medium text-secondary-foreground hover:bg-secondary/80 disabled:pointer-events-none disabled:opacity-50 transition-colors"
            >
              {status.kind === "saving" && (
                <IconRotateClockwise2 size={14} className="mr-2 animate-spin" />
              )}
              {status.kind === "saving" ? "Updating" : "Update Password"}
            </button>
            {status.kind === "success" && (
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-green-600/80">
                <IconCheck size={14} stroke={2.5} /> Updated
              </span>
            )}
            {status.kind === "error" && (
              <span className="text-[12px] font-medium text-destructive/80">
                {status.message}
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
