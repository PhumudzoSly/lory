import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  IconBriefcase,
  IconBuildingSkyscraper,
  IconId,
  IconBuilding,
  IconNotes,
  IconClock,
  IconCheck,
  IconRotateClockwise2,
} from "@tabler/icons-react";
import { api } from "../../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const inputClass =
  "h-8 max-w-sm text-[13px] bg-transparent border-border/20 group-hover:border-border/50 transition-colors shadow-none focus-visible:ring-1 focus-visible:ring-primary/30";

const labelClass =
  "flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50";

const rowClass = "grid grid-cols-[120px_1fr] items-center gap-4 py-1 group";

export function WorkProfileCard() {
  const profile = useQuery(api.work.getWorkProfile);
  const upsert = useMutation(api.work.upsertWorkProfile);

  const [occupation, setOccupation] = useState("");
  const [industry, setIndustry] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [timezone, setTimezone] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    if (profile === undefined) return;
    setOccupation(profile?.occupation ?? "");
    setIndustry(profile?.industry ?? "");
    setCompany(profile?.company ?? "");
    setRole(profile?.role ?? "");
    setTimezone(
      profile?.timezone ??
        Intl.DateTimeFormat().resolvedOptions().timeZone ??
        "",
    );
    setBio(profile?.bio ?? "");
  }, [profile]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!occupation.trim()) {
      setStatus({ kind: "error", message: "Occupation is required" });
      return;
    }
    setStatus({ kind: "saving" });
    try {
      await upsert({
        occupation: occupation.trim(),
        industry: industry.trim() || undefined,
        company: company.trim() || undefined,
        role: role.trim() || undefined,
        bio: bio.trim() || undefined,
        timezone: timezone.trim() || undefined,
      });
      setStatus({ kind: "success" });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Failed to save",
      });
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/60">
          Work Profile
        </h2>
        <p className="text-[13px] leading-relaxed text-muted-foreground/50 max-w-[80%]">
          Tell Lory about what you do. This helps tailor nudges and break
          suggestions to your work rhythm.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={rowClass}>
          <Label htmlFor="occupation" className={labelClass}>
            <IconBriefcase size={14} stroke={2} className="opacity-70" />
            Occupation
          </Label>
          <Input
            id="occupation"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="Software engineer"
            className={inputClass}
          />
        </div>

        <div className={rowClass}>
          <Label htmlFor="industry" className={labelClass}>
            <IconBuildingSkyscraper size={14} stroke={2} className="opacity-70" />
            Industry
          </Label>
          <Input
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Technology"
            className={inputClass}
          />
        </div>

        <div className={rowClass}>
          <Label htmlFor="company" className={labelClass}>
            <IconBuilding size={14} stroke={2} className="opacity-70" />
            Company
          </Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Inc."
            className={inputClass}
          />
        </div>

        <div className={rowClass}>
          <Label htmlFor="role" className={labelClass}>
            <IconId size={14} stroke={2} className="opacity-70" />
            Role
          </Label>
          <Input
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Senior Engineer"
            className={inputClass}
          />
        </div>

        <div className={rowClass}>
          <Label htmlFor="timezone" className={labelClass}>
            <IconClock size={14} stroke={2} className="opacity-70" />
            Timezone
          </Label>
          <Input
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="Africa/Johannesburg"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-[120px_1fr] gap-4 py-1 group">
          <Label htmlFor="bio" className={`${labelClass} items-start pt-2`}>
            <IconNotes size={14} stroke={2} className="opacity-70" />
            Bio
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="A short description of your work..."
            className="max-w-sm text-[13px] bg-transparent border-border/20 group-hover:border-border/50 transition-colors shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-4 pt-4">
          <div />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={status.kind === "saving"}
              className="inline-flex h-8 items-center justify-center rounded-md bg-secondary/50 px-4 text-[12px] font-medium text-secondary-foreground hover:bg-secondary/80 disabled:pointer-events-none disabled:opacity-50 transition-colors"
            >
              {status.kind === "saving" && (
                <IconRotateClockwise2
                  size={14}
                  className="mr-2 animate-spin"
                />
              )}
              {status.kind === "saving" ? "Saving" : "Save Profile"}
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
