import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconMail,
  IconUser,
  IconPhoto,
  IconCheck,
  IconRotateClockwise2,
} from "@tabler/icons-react";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function ProfileDetailsCard({
  initialName,
  initialImage,
  email,
}: {
  readonly initialName: string;
  readonly initialImage: string;
  readonly email: string;
}) {
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    setName(initialName);
    setImage(initialImage);
  }, [initialName, initialImage]);

  const dirty = name !== initialName || image !== initialImage;

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!dirty) return;
    setStatus({ kind: "saving" });
    const result = await authClient.updateUser({
      name: name.trim(),
      image: image.trim() || undefined,
    });
    if (result.error) {
      setStatus({
        kind: "error",
        message: result.error.message ?? "Failed to update profile",
      });
      return;
    }
    setStatus({ kind: "success" });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
          Account Details
        </h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground/50 max-w-[80%]">
          Manage your personal information and avatar settings. Changes reflect
          across your entire Lory workspace.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-[120px_1fr] items-center gap-4 py-1 group transition-colors">
          <Label
            htmlFor="email"
            className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50"
          >
            <IconMail size={14} stroke={2} className="opacity-70" />
            Email
          </Label>
          <div className="flex flex-col gap-1 items-start">
            <Input
              id="email"
              value={email}
              disabled
              className="h-8 max-w-sm text-[13px] bg-transparent border-border/20 group-hover:border-border/50 transition-colors shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
            />
            <p className="text-[10px] text-muted-foreground/40 pl-1">
              Email changes are locked for this session.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-4 py-1 group transition-colors">
          <Label
            htmlFor="name"
            className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50"
          >
            <IconUser size={14} stroke={2} className="opacity-70" />
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="h-8 max-w-sm text-[13px] bg-transparent border-border/20 group-hover:border-border/50 transition-colors shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-4 py-1 group transition-colors">
          <Label
            htmlFor="image"
            className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50"
          >
            <IconPhoto size={14} stroke={2} className="opacity-70" />
            Avatar URL
          </Label>
          <Input
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
            type="url"
            className="h-8 max-w-sm text-[13px] bg-transparent border-border/20 group-hover:border-border/50 transition-colors shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-4 pt-4">
          <div /> {/* Spacing spacer for labels column */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!dirty || status.kind === "saving"}
              className="inline-flex h-8 items-center justify-center rounded-md bg-secondary/50 px-4 text-[12px] font-medium text-secondary-foreground hover:bg-secondary/80 disabled:pointer-events-none disabled:opacity-50 transition-colors"
            >
              {status.kind === "saving" && (
                <IconRotateClockwise2 size={14} className="mr-2 animate-spin" />
              )}
              {status.kind === "saving" ? "Saving" : "Save Changes"}
            </button>
            {status.kind === "success" && (
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-green-600/80">
                <IconCheck size={14} stroke={2.5} /> Saved
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
