import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export const CheckInLoading = () => (
  <main className="min-h-screen bg-background px-4 py-6">
    <div className="mx-auto grid w-full max-w-5xl gap-4">
      <Skeleton aria-label="Loading check-in" className="h-10 w-64" role="status" />
      <Card className="grid gap-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-11 w-full" />
      </Card>
    </div>
  </main>
);
