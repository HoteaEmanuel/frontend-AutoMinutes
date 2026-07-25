import { Button } from '@/components/ui/button';
import { useGetTranscript } from '@/features/meetings/hooks/useTranscript';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import { Check, Copy, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const TranscriptTab = ({ meetingId }: { meetingId: string }) => {
  const { data, isError, isPending, refetch, error } = useGetTranscript(meetingId);
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(copyTimeout.current), []);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      clearTimeout(copyTimeout.current);
      setCopied(true);
      copyTimeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy transcript');
    }
  };

  if (isPending) return <Loader2 className="animate-spin" />;
  if (isError) return <ErrorRefetch errorMessage={error.message} refetch={refetch} />;
  if (!data || data.content.trim().length === 0)
    return <p className="text-center font-semibold">No transcript available</p>;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-end">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Copy transcript"
          onClick={() => handleCopy(data.content)}
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </div>

      <div className="max-h-[45vh] space-y-2 overflow-y-auto rounded-lg border bg-muted/50 p-4 font-mono text-sm leading-relaxed text-foreground">
        {data.content
          .split(/\r?\n/)
          .filter((line) => line.trim().length > 0)
          .map((line, index) => (
            <p key={index}>{line}</p>
          ))}
      </div>
    </div>
  );
};

export default TranscriptTab;
