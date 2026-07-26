import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGenerateAIResults, useGetAIResults } from '@/features/ai-results/hooks/useAIResults';
import { useGetMeeting } from '@/features/meetings/hooks/useMeetings';
import { useGetTranscript } from '@/features/meetings/hooks/useTranscript';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import EmptyState from '@molecules/EmptyState/EmptyState';
import AiScanningLoader from '@atoms/AiScanningLoader/AiScanningLoader';
import { cn } from '@/lib/utils';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { useState } from 'react';
import RegenerateAIResultsAlert from './RegenerateAIResultsAlert';

const statusLabels: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
  UNKNOWN: 'Unknown',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
    {children}
  </div>
);

const AiResultsTab = ({ meetingId }: { meetingId: string }) => {
  const { data, isError, isPending, refetch, error } = useGetAIResults(meetingId);
  const { data: meeting } = useGetMeeting(meetingId);
  const { data: transcript } = useGetTranscript(meetingId);
  const { mutate, isPending: isGenerating } = useGenerateAIResults(meetingId);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isBusy = isGenerating || meeting?.status === 'PROCESSING';
  const hasTranscript = Boolean(transcript?.content.trim());
  const aiActionItems = data?.actionItems?.filter((item) => item.aiGenerated) ?? [];

  const handleGenerate = () => mutate();

  const handleRegenerate = () => {
    setConfirmOpen(false);
    mutate();
  };

  if (isPending) return <Loader2 className="animate-spin" />;
  if (isError) return <ErrorRefetch errorMessage={error.message} refetch={refetch} />;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {!hasTranscript && (
          <p className="mr-auto text-xs text-muted-foreground">
            Add a transcript to this meeting before generating results.
          </p>
        )}

        <Button
          size="sm"
          variant="default"
          disabled={isBusy || !hasTranscript}
          onClick={data ? () => setConfirmOpen(true) : handleGenerate}
          className={cn(
            'relative isolate overflow-hidden rounded-full border-2 border-[var(--primary-hover)] shadow-[0_4px_0_0_var(--primary-active)] transition-none!',
            'active:translate-y-1! active:border-[var(--primary-active)]! active:shadow-none!',
            isBusy && 'disabled:opacity-100!',
          )}
        >
          {isBusy && <span className="ai-btn-shine" aria-hidden="true" />}
          {isBusy ? (
            <Loader2 className="relative z-10 animate-spin" />
          ) : data ? (
            <RefreshCw className="relative z-10" />
          ) : (
            <Sparkles className="relative z-10" />
          )}
          <span className="relative z-10">
            {data ? 'Regenerate' : isBusy ? 'Analyzing...' : 'Generate results'}
          </span>
        </Button>
      </div>

      {isBusy && (
        <div className="flex flex-col items-center gap-2 py-8">
          <AiScanningLoader />
          <p className="text-center text-sm text-muted-foreground">
            Analyzing transcript… this can take a minute.
          </p>
        </div>
      )}

      {!isBusy && !data && (
        <EmptyState
          icon={Sparkles}
          title="No AI results found"
          description="Generate results to get a summary, decisions, and todos."
          accent="primary"
        />
      )}

      {!isBusy && data && (
        <>
          <Section title="Summary">
            <p className="text-sm">{data.summary}</p>
          </Section>

          {!!data.decisions?.length && (
            <Section title="Decisions">
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {data.decisions.map((decision) => (
                  <li key={decision}>{decision}</li>
                ))}
              </ul>
            </Section>
          )}

          {data.detailedNotes && (
            <Section title="Notes">
              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {data.detailedNotes}
              </p>
            </Section>
          )}

          {data.followUpNotes && (
            <Section title="Follow-ups">
              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {data.followUpNotes}
              </p>
            </Section>
          )}

          {!!aiActionItems.length && (
            <Section title="Action Items">
              <div className="flex flex-col gap-2">
                {aiActionItems.map((item) => (
                  <div key={item.id} className="flex flex-col gap-1 rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{item.title}</p>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant="secondary">AI</Badge>
                        <Badge variant="outline">{statusLabels[item.status] ?? item.status}</Badge>
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                    {(item.assignee || item.deadline) && (
                      <p className="text-xs text-muted-foreground">
                        {item.assignee?.name}
                        {item.assignee && item.deadline && ' · '}
                        {item.deadline && new Date(item.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </>
      )}

      <RegenerateAIResultsAlert
        open={confirmOpen}
        isPending={isBusy}
        onOpenChange={setConfirmOpen}
        onConfirm={handleRegenerate}
      />
    </div>
  );
};

export default AiResultsTab;
