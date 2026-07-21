import { useEffect, useState } from 'react';
import { FileText, X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { meetingForm } from './meetingForm';

type NewMeetingFormData = z.infer<typeof meetingForm>;

type NewMeetingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const hours = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));

const getCurrentDateAndTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const currentDateTime = now.toISOString();

  return {
    date: currentDateTime.slice(0, 10),
    time: currentDateTime.slice(11, 16),
  };
};

const getTimeParts = (time: string) => {
  const [hourValue, minute] = time.split(':');
  const hour = Number(hourValue);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;

  return {
    hour: String(displayHour).padStart(2, '0'),
    minute,
    period,
  };
};

const getTimeValue = (hour: string, minute: string, period: string) => {
  let hourValue = Number(hour);

  if (period === 'PM' && hourValue !== 12) {
    hourValue += 12;
  }

  if (period === 'AM' && hourValue === 12) {
    hourValue = 0;
  }

  return `${String(hourValue).padStart(2, '0')}:${minute}`;
};

const NewMeetingModal = ({ isOpen, onClose }: NewMeetingModalProps) => {
  const currentDateAndTime = getCurrentDateAndTime();
  const [minDate, setMinDate] = useState(currentDateAndTime.date);
  const [isLoading, setIsLoading] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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

  const time = watch('time');
  const transcriptFile = watch('transcriptFile');
  const selectedFile = transcriptFile?.[0];
  const selectedTime = getTimeParts(time);

  useEffect(() => {
    if (isOpen) {
      const currentDateAndTime = getCurrentDateAndTime();
      reset({
        title: '',
        date: currentDateAndTime.date,
        time: currentDateAndTime.time,
        description: '',
      });
      setMinDate(currentDateAndTime.date);
      setIsTimePickerOpen(false);
    }
  }, [isOpen, reset]);

  const updateTime = (
    hour = selectedTime.hour,
    minute = selectedTime.minute,
    period = selectedTime.period,
  ) => {
    setValue('time', getTimeValue(hour, minute, period), { shouldValidate: true });
  };

  const onSubmit = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex max-h-[85vh] flex-col gap-4 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New meeting</DialogTitle>

            <DialogClose
              type="button"
              aria-label="Close"
              className="flex size-8 items-center justify-center rounded-lg hover:bg-muted"
            >
              <X className="size-4" />
            </DialogClose>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="meeting-title">Title *</Label>
            <Input
              id="meeting-title"
              placeholder="e.g. Q3 Product Roadmap Review"
              aria-invalid={!!errors.title}
              {...register('title')}
            />
            {errors.title && <p className="text-xs italic text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="meeting-date">Date *</Label>
              <Input
                id="meeting-date"
                type="date"
                min={minDate}
                aria-invalid={!!errors.date}
                {...register('date')}
              />
              {errors.date && <p className="text-xs italic text-destructive">{errors.date.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="meeting-time">Time *</Label>
              <div className="relative">
                <Button
                  id="meeting-time"
                  type="button"
                  variant="outline"
                  onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                  className="h-8 w-full justify-start gap-1 px-2.5 font-normal"
                >
                  <span>{selectedTime.hour}</span>
                  <span>:</span>
                  <span>{selectedTime.minute}</span>
                  <span className="ml-1">{selectedTime.period}</span>
                </Button>

                {isTimePickerOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 grid w-full grid-cols-[1fr_1fr_auto] gap-2 rounded-lg border border-border bg-background p-3 shadow-lg">
                    <div className="max-h-40 overflow-y-auto">
                      {hours.map((hour) => (
                        <button
                          key={hour}
                          type="button"
                          onClick={() => updateTime(hour)}
                          className={`mb-1 h-8 w-full rounded-md text-sm ${
                            selectedTime.hour === hour
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          {hour}
                        </button>
                      ))}
                    </div>

                    <div className="max-h-40 overflow-y-auto">
                      {minutes.map((minute) => (
                        <button
                          key={minute}
                          type="button"
                          onClick={() => updateTime(undefined, minute)}
                          className={`mb-1 h-8 w-full rounded-md text-sm ${
                            selectedTime.minute === minute
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          {minute}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col gap-1">
                      {['AM', 'PM'].map((period) => (
                        <button
                          key={period}
                          type="button"
                          onClick={() => updateTime(undefined, undefined, period)}
                          className={`h-8 rounded-md px-3 text-sm ${
                            selectedTime.period === period
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="meeting-description">Description</Label>
            <textarea
              id="meeting-description"
              placeholder="What is this meeting about?"
              className="min-h-24 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register('description')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="meeting-file">Transcript file</Label>
            <Input
              id="meeting-file"
              type="file"
              accept=".txt,.docx,.pdf"
              className="hidden"
              {...register('transcriptFile')}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('meeting-file')?.click()}
              className="w-full justify-start"
            >
              <FileText />
              {selectedFile ? selectedFile.name : 'Upload a file'}
            </Button>
            {errors.transcriptFile && (
              <p className="text-xs italic text-destructive">{errors.transcriptFile.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create meeting'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewMeetingModal;
