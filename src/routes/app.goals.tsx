import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/goals')({
  component: () => <div className="flex items-center justify-center h-full text-muted-foreground">goals content coming soon</div>,
});
