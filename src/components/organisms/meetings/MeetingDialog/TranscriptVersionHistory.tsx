import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useSelectTranscriptVersion,
  useTranscriptVersions,
} from '@/features/meetings/hooks/useTranscript';
import { downloadFile } from '@/lib/utils';
import { Download, Loader2 } from 'lucide-react';

type TranscriptVersionHistoryProps = {
  meetingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const buildFileName = (createdAt: string) =>
  `transcript-${new Date(createdAt).toISOString().replace(/[:.]/g, '-')}.txt`;

const previewOf = (content: string) => content.replace(/\s+/g, ' ').trim().slice(0, 80);

const TranscriptVersionHistory = ({
  meetingId,
  open,
  onOpenChange,
}: TranscriptVersionHistoryProps) => {
  const { data: versions, isPending } = useTranscriptVersions(meetingId, open);
  const {
    mutate: selectVersion,
    isPending: isSelecting,
    variables: selectingId,
  } = useSelectTranscriptVersion(meetingId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transcript version history</DialogTitle>
          <DialogDescription>
            Every uploaded transcript is kept. Download an older version, or make it active to use
            it the next time you generate results.
          </DialogDescription>
        </DialogHeader>

        <div className="scrollbar-subtle flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
          {isPending && (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          )}

          {!isPending && versions?.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">No versions yet.</p>
          )}

          {versions?.map((version) => (
            <div
              key={version.id}
              className="flex min-w-0 items-center justify-between gap-2 rounded-lg border p-3"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">
                    {new Date(version.createdAt).toLocaleString()}
                  </p>
                  {version.isActive && <Badge variant="secondary">Active</Badge>}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {previewOf(version.content)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Download this version"
                  onClick={() =>
                    downloadFile(version.content, buildFileName(version.createdAt), 'text/plain')
                  }
                >
                  <Download />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={version.isActive || (isSelecting && selectingId === version.id)}
                  onClick={() => selectVersion(version.id)}
                >
                  {isSelecting && selectingId === version.id ? 'Activating...' : 'Use this version'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TranscriptVersionHistory;
