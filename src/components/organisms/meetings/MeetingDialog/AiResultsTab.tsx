import { Badge } from '@/components/ui/badge';
import { useGetAIResults } from '@/features/ai-results/hooks/useAIResults';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import { Loader2 } from 'lucide-react';

const statusLabels: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
  UNKNOWN: 'Unknown',
};

const AiResultsTab = ({ meetingId }: { meetingId: string }) => {
  const { data, isError, isPending, refetch, error } = useGetAIResults(meetingId);
  if (isPending) return <Loader2 className="animate-spin" />;
  if (isError) return <ErrorRefetch errorMessage={error.message} refetch={refetch} />;
  if (!data) return <p className="text-center font-semibold">No AI Results found</p>;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Summary</p>
        <p className="text-sm">{data.summary}</p>
      </div>

      {!!data.decisions?.length && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Decisions</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {data.decisions.map((decision) => (
              <li key={decision}>{decision}</li>
            ))}
          </ul>
        </div>
      )}

      {data.detailedNotes && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Notes</p>
          <p className="whitespace-pre-line text-sm text-muted-foreground">{data.detailedNotes}</p>
        </div>
      )}

      {!!data.actionItems?.length && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Action Items</p>
          <div className="flex flex-col gap-2">
            {data.actionItems.map((item) => (
              <div key={item.title} className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{item.title}</p>
                  <Badge variant="outline">{statusLabels[item.status] ?? item.status}</Badge>
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
        </div>
      )}
    </div>
  );
};

export default AiResultsTab;
