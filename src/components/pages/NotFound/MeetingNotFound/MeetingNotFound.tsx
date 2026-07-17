import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

const MeetingNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center">
        {/* Monitor */}
        <div className="rounded-2xl border border-border bg-muted p-3 shadow-[var(--shadow)]">
          <div className="flex h-[430px] w-[700px] max-w-[85vw] flex-col overflow-hidden rounded-xl border border-border bg-[radial-gradient(600px_300px_at_80%_-10%,rgba(45,196,176,0.35),transparent),linear-gradient(160deg,#084a44,#063733_70%)]">
            {/* Window chrome */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <div className="flex gap-2">
                <div className="size-3 rounded-full bg-status-failed" />
                <div className="size-3 rounded-full bg-status-pending" />
                <div className="size-3 rounded-full bg-status-completed" />
              </div>
              <code className="truncate bg-white/10 text-xs text-white/60">
                autominutes.app/meetings/:id
              </code>
            </div>

            {/* Screen */}
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="text-gradient font-heading text-7xl font-semibold tracking-tight">
                404
              </span>

              <h2 className="text-2xl font-medium text-white">Meeting Not Found</h2>

              <p className="max-w-md text-sm text-white/60">
                The meeting you&apos;re looking for doesn&apos;t exist or may have been removed.
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Button size="lg" className="px-4">
                  <Link to="/meetings" className="flex items-center gap-2">
                    <Home size={16} />
                    Back to meetings
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="gap-2 border-white/20 bg-white/5 px-4 text-white hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft size={16} />
                  Go back
                </Button>
              </div>
            </div>
          </div>

          {/* Brand */}
          <div className="pt-3 pb-1 text-center text-xxs tracking-[0.3em] text-muted-foreground">
            AUTOMINUTES
          </div>
        </div>

        {/* Stand */}
        <div className="h-12 w-24 bg-muted" />
        <div className="h-3 w-52 rounded-full border border-border bg-muted" />
      </div>
    </div>
  );
};

export default MeetingNotFound;
