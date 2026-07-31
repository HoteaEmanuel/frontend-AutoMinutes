import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useGetTranscript, useUploadTranscript } from '@/features/meetings/hooks/useTranscript';
import { acceptedFileExtensions } from '@organisms/meetings/NewMeetingModal/meetingForm';
import { downloadFile, extractTextFromFile } from '@/lib/utils';
import { getErrorMessage } from '@/lib/errors';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import EmptyState from '@molecules/EmptyState/EmptyState';
import ConfirmAlertDialog from '@molecules/ConfirmAlertDialog/ConfirmAlertDialog';
import { Check, Copy, Download, FileText, History, Loader2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import TranscriptTabSkeleton from './TranscriptTabSkeleton';
import TranscriptVersionHistory from './TranscriptVersionHistory';

const TranscriptTab = ({ meetingId }: { meetingId: string }) => {
  const { data, isError, isPending, refetch, error } = useGetTranscript(meetingId);
  const { mutate: upload, isPending: isUploading } = useUploadTranscript(meetingId);
  const [copied, setCopied] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<{ name: string; content: string } | null>(
    null,
  );
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Permite re-selectarea aceluiasi fisier
    event.target.value = '';
    if (!file) return;

    const hasAcceptedExtension = acceptedFileExtensions.some((extension) =>
      file.name.toLowerCase().endsWith(extension),
    );
    if (!hasAcceptedExtension) {
      toast.error('Upload a TXT, DOCX or PDF file.');
      return;
    }

    try {
      const content = await extractTextFromFile(file);
      if (!content.trim()) {
        toast.error('That file has no readable text.');
        return;
      }

      if (data?.content.trim()) setPendingUpload({ name: file.name, content });
      else upload(content);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleConfirmReplace = () => {
    if (!pendingUpload) return;
    upload(pendingUpload.content);
    setPendingUpload(null);
  };

  if (isPending) return <TranscriptTabSkeleton />;
  if (isError) return <ErrorRefetch errorMessage={error.message} refetch={refetch} />;

  const content = data?.content.trim() ? data.content : null;

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileExtensions.join(',')}
        className="hidden"
        id="transcript-file"
        onChange={handleFileChange}
      />

      <div className="flex flex-wrap items-center justify-between gap-1">
        {content && (
          <Button variant="outline" size="sm" onClick={() => setHistoryOpen(true)}>
            <History />
            History
          </Button>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
            {content ? 'Replace transcript' : 'Upload transcript'}
          </Button>

          {content && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Download transcript"
                    onClick={() => downloadFile(content, 'transcript.txt', 'text/plain')}
                  />
                }
              >
                <Download />
              </TooltipTrigger>
              <TooltipContent>Download current transcript</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {content ? (
        <div className="relative min-w-0 rounded-lg border bg-muted/50">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Copy transcript"
            className="absolute top-2 right-2"
            onClick={() => handleCopy(content)}
          >
            {copied ? <Check /> : <Copy />}
          </Button>

          <div className="scrollbar-subtle max-h-[calc(55vh-6rem)] min-w-0 space-y-2 overflow-y-auto p-4 pr-8 font-mono text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-foreground">
            {content
              .split(/\r?\n/)
              .filter((line) => line.trim().length > 0)
              .map((line, index) => (
                <p key={index}>{line}</p>
              ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No transcript available"
          description="Upload a transcript to get started."
          accent="emerald"
        />
      )}

      <ConfirmAlertDialog
        open={Boolean(pendingUpload)}
        onOpenChange={(open) => !open && setPendingUpload(null)}
        title="Replace transcript?"
        description={`"${pendingUpload?.name ?? ''}" will become the active transcript used for AI generation. The current one isn't deleted — find it anytime in the version history. Regenerate the AI results afterwards to reflect the new transcript.`}
        confirmLabel="Replace"
        pendingLabel="Replacing..."
        isPending={isUploading}
        onConfirm={handleConfirmReplace}
      />

      <TranscriptVersionHistory
        meetingId={meetingId}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />
    </div>
  );
};

export default TranscriptTab;
