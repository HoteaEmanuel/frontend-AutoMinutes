import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAIResultsHistory } from '@/features/ai-results/hooks/useAIResults';
import { slugifyFilename } from '@/features/export/filename';
import { AiResults } from '@/gql/types';
import { downloadFile } from '@/lib/utils';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type AiResultsHistoryProps = {
  meetingId: string;
  meetingTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AiResultsRun = Pick<
  AiResults,
  | 'id'
  | 'createdAt'
  | 'summary'
  | 'decisions'
  | 'detailedNotes'
  | 'followUpNotes'
  | 'generatedActionItems'
  | 'generatedAttendees'
>;

const exportRun = (run: AiResultsRun, meetingTitle: string) => {
  const payload = {
    id: run.id,
    createdAt: run.createdAt,
    summary: run.summary,
    decisions: run.decisions ?? null,
    detailedNotes: run.detailedNotes ?? null,
    followUpNotes: run.followUpNotes ?? null,
    actionItems: run.generatedActionItems,
    attendees: run.generatedAttendees,
  };
  const fileTimestamp = new Date(run.createdAt).toISOString().replace(/[:.]/g, '-');
  downloadFile(
    JSON.stringify(payload, null, 2),
    `${slugifyFilename(meetingTitle)}-ai-results-${fileTimestamp}.json`,
    'application/json',
  );
  toast.success('AI results exported successfully!');
};

const statusLabels: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
  UNKNOWN: 'Unknown',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
    {children}
  </div>
);

const AiResultsHistory = ({
  meetingId,
  meetingTitle,
  open,
  onOpenChange,
}: AiResultsHistoryProps) => {
  const { data: history, isPending } = useAIResultsHistory(meetingId, open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>AI results history</DialogTitle>
          <DialogDescription>
            Every run is kept, even after regenerating. Expand a run to see everything it
            produced — the AI Results tab always shows the latest one.
          </DialogDescription>
        </DialogHeader>

        <div className="scrollbar-subtle max-h-[60vh] overflow-y-auto pr-3 pl-1">
          {isPending && (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          )}

          {!isPending && history?.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">No runs yet.</p>
          )}

          {!!history?.length && (
            <Accordion>
              {history.map((run, index) => (
                <AccordionItem key={run.id} value={run.id}>
                  <AccordionTrigger className="px-2">
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {new Date(run.createdAt).toLocaleString()}
                        </span>
                        {index === 0 && <Badge variant="secondary">Current</Badge>}
                      </div>
                      <p className="line-clamp-1 text-xs font-normal text-muted-foreground">
                        {run.summary}
                      </p>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-2">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportRun(run, meetingTitle)}
                        >
                          <Download />
                          Export JSON
                        </Button>
                      </div>

                      <Section title="Summary">
                        <p className="text-sm">{run.summary}</p>
                      </Section>

                      {!!run.decisions?.length && (
                        <Section title="Decisions">
                          <ul className="list-disc space-y-1 pl-5 text-sm">
                            {run.decisions.map((decision) => (
                              <li key={decision}>{decision}</li>
                            ))}
                          </ul>
                        </Section>
                      )}

                      {run.detailedNotes && (
                        <Section title="Notes">
                          <p className="whitespace-pre-line text-sm text-muted-foreground">
                            {run.detailedNotes}
                          </p>
                        </Section>
                      )}

                      {run.followUpNotes && (
                        <Section title="Follow-ups">
                          <p className="whitespace-pre-line text-sm text-muted-foreground">
                            {run.followUpNotes}
                          </p>
                        </Section>
                      )}

                      {!!run.generatedActionItems.length && (
                        <Section title="Action Items">
                          <div className="flex flex-col gap-2">
                            {run.generatedActionItems.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="flex flex-col gap-1 rounded-lg border p-3"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-medium">{item.description}</p>
                                  <Badge variant="outline">
                                    {statusLabels[item.status] ?? item.status}
                                  </Badge>
                                </div>
                                {(item.assignee || item.deadline) && (
                                  <p className="text-xs text-muted-foreground">
                                    {item.assignee}
                                    {item.assignee && item.deadline && ' · '}
                                    {item.deadline && new Date(item.deadline).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </Section>
                      )}

                      {!!run.generatedAttendees.length && (
                        <Section title="Attendees">
                          <div className="flex flex-wrap gap-1.5">
                            {run.generatedAttendees.map((attendee, attendeeIndex) => (
                              <Badge key={attendeeIndex} variant="outline">
                                {attendee.name}
                              </Badge>
                            ))}
                          </div>
                        </Section>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiResultsHistory;
