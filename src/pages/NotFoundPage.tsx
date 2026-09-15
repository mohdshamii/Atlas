import { Compass } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-3xl items-center px-4 py-24 sm:px-6">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you're looking for doesn't exist, or the URL was mistyped."
        actionLabel="Back to home"
        actionTo="/"
      />
    </div>
  );
}
