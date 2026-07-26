import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetTranscript, useUploadTranscript } from '@/features/meetings/hooks/useTranscript';
import { acceptedFileExtensions } from '@organisms/meetings/NewMeetingModal/meetingForm';
import { extractTextFromFile } from '@/lib/utils';
import { getErrorMessage } from '@/lib/errors';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import EmptyState from '@molecules/EmptyState/EmptyState';
import { Check, Copy, FileText, Loader2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import ReplaceTranscriptAlert from './ReplaceTranscriptAlert';
import TranscriptTabSkeleton from './TranscriptTabSkeleton';

const TranscriptTab = ({ meetingId }: { meetingId: string }) => {
  const { data, isError, isPending, refetch, error } = useGetTranscript(meetingId);
  const { mutate: upload, isPending: isUploading } = useUploadTranscript(meetingId);
  const [copied, setCopied] = useState(false);
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

      <div className="flex flex-wrap items-center justify-end gap-1">
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
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Copy transcript"
            onClick={() => handleCopy(content)}
          >
            {copied ? <Check /> : <Copy />}
          </Button>
        )}
      </div>

      {content ? (
        <div className="scrollbar-subtle max-h-[45vh] min-w-0 space-y-2 overflow-y-auto rounded-lg border bg-muted/50 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-foreground">
          {content
            .split(/\r?\n/)
            .filter((line) => line.trim().length > 0)
            .map((line, index) => (
              <p key={index}>{line}</p>
            ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No transcript available"
          description="Upload a transcript to get started."
          accent="emerald"
        />
      )}

      <ReplaceTranscriptAlert
        fileName={pendingUpload?.name ?? ''}
        open={Boolean(pendingUpload)}
        isPending={isUploading}
        onOpenChange={(open) => !open && setPendingUpload(null)}
        onConfirm={handleConfirmReplace}
      />
    </div>
  );
};

export default TranscriptTab;
