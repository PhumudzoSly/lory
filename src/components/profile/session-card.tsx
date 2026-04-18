import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { IconLogout, IconDevices } from "@tabler/icons-react";

export function SessionCard() {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
  };

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
          Session
        </h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground/50 max-w-[80%]">
          Manage your active device session. Signing out will require you to log
          back in the next time you use Lory.
        </p>
      </header>

      <div className="grid grid-cols-[120px_1fr] items-center gap-4 py-1">
        <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50">
          <IconDevices size={14} stroke={2} className="opacity-70" />
          Active Device
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={signingOut}
            className="inline-flex h-8 items-center justify-center gap-2 rounded-md bg-destructive/10 px-4 text-[12px] font-medium text-destructive/90 hover:bg-destructive/20 disabled:pointer-events-none disabled:opacity-50 transition-colors"
          >
            <IconLogout size={14} stroke={2} />
            {signingOut ? "Signing out..." : "Sign out of this device"}
          </button>
        </div>
      </div>
    </div>
  );
}
