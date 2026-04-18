import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/wellbeing')({
  component: () => <div className="flex items-center justify-center h-full text-muted-foreground">wellbeing content coming soon</div>,
});
