import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { OnboardingFlow } from "./onboarding-flow";

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const meta = useQuery(api.userMeta.get);

  if (meta === undefined) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <span className="text-[13px] text-muted-foreground/50">
          Preparing...
        </span>
      </div>
    );
  }

  if (!meta?.onboardingCompletedAt) {
    return <OnboardingFlow />;
  }

  return <>{children}</>;
}
