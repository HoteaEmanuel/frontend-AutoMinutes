import { useRef, useState } from 'react';
import { FileText, X } from 'lucide-react';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { acceptedFileExtensions, meetingForm } from './meetingForm';
import { DatePickerTime } from '@molecules/DatePickerTime/DatePickerTime';
import FormField from '@molecules/FormField/FormField';
import { useAddMeeting } from '@/features/meetings/hooks/useMeetings';
import ErrorDisplay from '@molecules/Error/ErrorDisplay';
import { extractTextFromFile } from '@/lib/utils';
import { toast } from 'sonner';

type NewMeetingFormData = z.infer<typeof meetingForm>;

type NewMeetingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const getCurrentDateAndTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const currentDateTime = now.toISOString();

  return {
    date: currentDateTime.slice(0, 10),
    time: currentDateTime.slice(11, 16),
  };
};

const NewMeetingModal = ({ isOpen, onClose }: NewMeetingModalProps) => {
  const currentDateAndTime = getCurrentDateAndTime();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<NewMeetingFormData>({
    resolver: zodResolver(meetingForm),
    defaultValues: {
      title: '',
      date: currentDateAndTime.date,
      time: currentDateAndTime.time,
      description: '',
    },
  });

  const date = watch('date');
  const time = watch('time');
  const transcriptFile = watch('transcriptFile');

  const [transcriptContent, setTranscriptContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const transcriptWordCount = transcriptContent.trim()
    ? transcriptContent.trim().split(/\s+/).length
    : 0;

  const handleClearFile = () => {
    setTranscriptContent('');
    setValue('transcriptFile', undefined, { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDateChange = (selected: Date | undefined) => {
    setValue('date', selected ? format(selected, 'yyyy-MM-dd') : '', { shouldValidate: true });
    if (!selected) setValue('time', '', { shouldValidate: true });
  };

  const handleTimeChange = (value: string | undefined) => {
    setValue('time', value ?? '', { shouldValidate: true });
  };
  const { mutateAsync: addMeeting, error, isError, isPending } = useAddMeeting();

  const onSubmit = async () => {
    try {
      const formData = getValues();
      const input = {
        title: formData.title,
        description: formData.description,
        scheduledAt: new Date(`${formData.date}T${formData.time}`).toISOString(),
        transcript: transcriptContent || undefined,
      };
      await addMeeting(input);
      reset();
      setTranscriptContent('');
      onClose();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-w-0 max-h-[95vh] flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>New meeting</DialogTitle>
          </DialogHeader>
          {isError && <ErrorDisplay error={error?.message} />}

          <div className="flex flex-col gap-2">
            <Label htmlFor="meeting-title">Title *</Label>
            <Input
              id="meeting-title"
              placeholder="e.g. Q3 Product Roadmap Review"
              aria-invalid={!!errors.title}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs italic text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <DatePickerTime
              date={date ? new Date(`${date}T00:00:00`) : undefined}
              time={time || undefined}
              setDate={handleDateChange}
              setTime={handleTimeChange}
            />
            {errors.date && (
              <p className="text-xs italic text-destructive">{errors.date.message}</p>
            )}
            {errors.time && (
              <p className="text-xs italic text-destructive">{errors.time.message}</p>
            )}
          </div>
          <FormField
            hasError={!!errors?.description}
            id="meeting-description"
            label="Description"
            register={register}
            error={errors.description?.message}
            as="textarea"
          />

          <Input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileExtensions.join(',')}
            className="hidden"
            id="meeting-file"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const transcriptText = await extractTextFromFile(file);
              setTranscriptContent(transcriptText);
              setValue('transcriptFile', file, { shouldValidate: true });
            }}
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full justify-start"
            >
              <FileText />
              {transcriptFile?.name ?? 'Upload transcript'}
            </Button>
            {transcriptFile && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove file"
                onClick={handleClearFile}
              >
                <X />
              </Button>
            )}
          </div>

          {transcriptContent && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <p>Transcript content</p>
                <span>{transcriptWordCount} words</span>
              </div>
              <div className="font-mono text-xs bg-muted whitespace-pre-wrap wrap-break-word p-2 border rounded-md max-h-40 overflow-y-auto">
                {transcriptContent}
              </div>
            </div>
          )}
          {errors.transcriptFile && (
            <p className="text-xs italic text-destructive">{errors.transcriptFile.message}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create meeting'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewMeetingModal;
