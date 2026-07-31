import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRedirect } from '@/hooks/useRedirectAfterDelay';
import { ArrowLeft, CalendarSearch, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { DELAY_MS } from '@/constants/delay';

const MeetingNotFound = () => {
  const navigate = useNavigate();

  useRedirect(DELAY_MS);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <CalendarSearch className="size-7" />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-gradient text-xs font-semibold tracking-[0.2em] uppercase">
              Error 404
            </span>
            <h1 className="text-xl font-semibold text-foreground">Meeting not found</h1>
            <p className="text-sm text-muted-foreground">
              This meeting doesn&apos;t exist or may have been removed. You&apos;ll be redirected to
              your meetings in a few seconds.
            </p>
          </div>

          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button render={<Link to="/meetings" />} className="gap-2">
              <Home size={16} />
              Back to meetings
            </Button>

            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft size={16} />
              Go back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingNotFound;
