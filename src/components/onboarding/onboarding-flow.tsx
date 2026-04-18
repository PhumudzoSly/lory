import { useState } from "react";
import { useMutation } from "convex/react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconRotateClockwise2,
} from "@tabler/icons-react";
import { api } from "../../../convex/_generated/api";
import { StepWelcome } from "./step-welcome";
import { StepAccount } from "./step-account";
import { StepWork } from "./step-work";
import { StepSchedule } from "./step-schedule";
import { StepFounder } from "./step-founder";

type StepDef = {
  key: string;
  label: string;
  render: () => React.ReactNode;
  canSkip: boolean;
};

const STEPS: StepDef[] = [
  {
    key: "welcome",
    label: "Welcome",
    render: () => <StepWelcome />,
    canSkip: false,
  },
  {
    key: "account",
    label: "Account",
    render: () => <StepAccount />,
    canSkip: true,
  },
  {
    key: "work",
    label: "Work",
    render: () => <StepWork />,
    canSkip: true,
  },
  {
    key: "schedule",
    label: "Schedule",
    render: () => <StepSchedule />,
    canSkip: true,
  },
  {
    key: "founder",
    label: "A note",
    render: () => <StepFounder />,
    canSkip: false,
  },
];

export function OnboardingFlow() {
  const [index, setIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const completeOnboarding = useMutation(api.userMeta.completeOnboarding);

  const step = STEPS[index];
  const isFirst = index === 0;
  const isLast = index === STEPS.length - 1;
  const progress = ((index + 1) / STEPS.length) * 100;

  const handleNext = async () => {
    if (isLast) {
      setFinishing(true);
      try {
        await completeOnboarding({});
      } finally {
        setFinishing(false);
      }
      return;
    }
    setIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const handleBack = () => setIndex((i) => Math.max(i - 1, 0));
  const handleSkip = () =>
    setIndex((i) => Math.min(i + 1, STEPS.length - 1));

  return (
    <div className="flex h-svh w-full flex-col bg-background">
      <header className="shrink-0 border-b border-border/40">
        <div className="mx-auto w-full max-w-2xl px-6 py-5 md:px-8">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50">
              Getting started
            </span>
            <span className="text-[11px] text-muted-foreground/50">
              Step {index + 1} of {STEPS.length}
            </span>
          </div>
          <div className="mt-3 h-px w-full bg-border/40">
            <div
              className="h-px bg-foreground/80 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-6 py-10 md:px-8 md:py-14">
          {step.render()}
        </div>
      </main>

      <footer className="shrink-0 border-t border-border/40 bg-background">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-4 md:px-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={isFirst}
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[12px] font-medium text-muted-foreground/70 hover:text-foreground hover:bg-foreground/5 disabled:pointer-events-none disabled:opacity-0 transition-colors"
          >
            <IconArrowLeft size={14} stroke={2} />
            Back
          </button>

          <div className="flex items-center gap-2">
            {step.canSkip && (
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex h-8 items-center rounded-md px-3 text-[12px] font-medium text-muted-foreground/60 hover:text-foreground/80 hover:bg-foreground/5 transition-colors"
              >
                Skip
              </button>
            )}
            <button
              type="button"
              onClick={() => void handleNext()}
              disabled={finishing}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-foreground px-4 text-[12px] font-medium text-background hover:bg-foreground/90 disabled:pointer-events-none disabled:opacity-60 transition-colors"
            >
              {finishing && (
                <IconRotateClockwise2 size={14} className="animate-spin" />
              )}
              {isLast ? (finishing ? "Finishing" : "Get started") : "Continue"}
              {!isLast && !finishing && <IconArrowRight size={14} stroke={2} />}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
