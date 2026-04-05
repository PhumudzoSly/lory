import { Button } from "./ui/button";

type BreakType = "eye" | "hydrate" | "stretch" | "full" | "posture" | "mindfulness" | "wrist" | "work";

type BreakToastProps = {
  label: string;
  action: string;
  message: string;
  breakType: BreakType;
  onDone: () => void;
  onDismiss: () => void;
};

export function BreakToast({
  label,
  action,
  message,
  breakType,
  onDone,
  onDismiss,
}: BreakToastProps) {
  return (
    <section
      className="w-57.5 rounded-xl border border-slate-600/70 bg-slate-900/95 p-3 text-slate-100 shadow-2xl backdrop-blur relative z-10"
      role="status"
      data-break-type={breakType}
    >
      <header className="mb-2 flex items-center justify-between">
        <strong className="text-sm font-semibold tracking-wide">{label}</strong>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer border-none bg-transparent text-sm text-slate-300 hover:bg-slate-800/60"
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          x
        </Button>
      </header>
      <p className="text-sm text-slate-100">{message}</p>
      <small className="mt-1 block text-xs text-slate-300">{action}</small>
      <div className="mt-3 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="cursor-pointer rounded-md border border-slate-500 bg-slate-700 px-2 py-1 text-xs text-slate-100"
          type="button"
          onClick={onDone}
        >
          Done
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer rounded-md border border-slate-500 bg-slate-800 px-2 py-1 text-xs text-slate-100"
          type="button"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      </div>
    </section>
  );
}
