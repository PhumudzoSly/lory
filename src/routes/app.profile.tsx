import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/profile')({
  component: () => <div className="flex items-center justify-center h-full text-muted-foreground">profile content coming soon</div>,
});
