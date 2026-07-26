import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateMeeting } from '@/features/meetings/hooks/useMeetings';
import { extractTextFromFile } from '@/lib/utils';
import { acceptedFileExtensions, meetingForm } from './meetingForm';

type NewMeetingFormData = z.infer<typeof meetingForm>;

type NewMeetingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Attendee = {
  firstName: string;
  lastName: string;
  email: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [minDate, setMinDate] = useState(currentDateAndTime.date);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [attendee, setAttendee] = useState<Attendee>({ firstName: '', lastName: '', email: '' });
  const [attendeeError, setAttendeeError] = useState('');
  const [meetingError, setMeetingError] = useState('');
  const createMeeting = useCreateMeeting();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<NewMeetingFormData>({
    resolver: zodResolver(meetingForm),
    defaultValues: {
      title: '',
      date: currentDateAndTime.date,
      time: currentDateAndTime.time,
      description: '',
      transcriptFile: undefined,
    },
  });

  const time = watch('time');
  const selectedFile = watch('transcriptFile');
  const selectedTime = getTimeParts(time);

  useEffect(() => {
    if (isOpen) {
      const currentDateAndTime = getCurrentDateAndTime();
      reset({
        title: '',
        date: currentDateAndTime.date,
        time: currentDateAndTime.time,
        description: '',
        transcriptFile: undefined,
      });
      setStep(1);
      setAttendees([]);
      setAttendee({ firstName: '', lastName: '', email: '' });
      setAttendeeError('');
      setMeetingError('');
      setMinDate(currentDateAndTime.date);
      setIsTimePickerOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [isOpen, reset]);

  const updateTime = (
    hour = selectedTime.hour,
    minute = selectedTime.minute,
    period = selectedTime.period,
    closePicker = false,
  ) => {
    setValue('time', getTimeValue(hour, minute, period), { shouldValidate: true });
    if (closePicker) setIsTimePickerOpen(false);
  };

  const goToTranscriptStep = async () => {
    const isValid = await trigger(['title', 'date', 'time', 'description']);
    if (isValid) setStep(2);
  };

  const goToAttendeesStep = async () => {
    const isValid = await trigger('transcriptFile');
    if (isValid) setStep(3);
  };

  const addAttendee = () => {
    if (!attendee.firstName.trim() || !attendee.lastName.trim() || !attendee.email.trim()) {
      setAttendeeError('First name, last name and email are required.');
      return;
    }

    if (!attendee.email.includes('@')) {
      setAttendeeError('Add a valid email address.');
      return;
    }

    setAttendees((currentAttendees) => [...currentAttendees, attendee]);
    setAttendee({ firstName: '', lastName: '', email: '' });
    setAttendeeError('');
  };

  const addAttendeeOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addAttendee();
    }
  };

  const removeAttendee = (email: string) => {
    setAttendees((currentAttendees) =>
      currentAttendees.filter((currentAttendee) => currentAttendee.email !== email),
    );
  };

  const onSubmit = async (data: NewMeetingFormData) => {
    setMeetingError('');

    try {
      const transcript = selectedFile ? await extractTextFromFile(selectedFile) : undefined;

      await createMeeting.mutateAsync({
        meeting: {
          title: data.title,
          description: data.description?.trim() || undefined,
          scheduledAt: new Date(`${data.date}T${data.time}`).toISOString(),
          transcript,
        },
        attendees,
      });

      onClose();
    } catch (error) {
      setMeetingError(error instanceof Error ? error.message : 'Something went wrong.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex max-h-[80vh] min-h-0 flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="sr-only">New meeting</DialogTitle>
            <div className="flex items-center justify-center gap-3">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center gap-3">
                  <span
                    className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold ${
                      step >= stepNumber
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {stepNumber}
                  </span>
                  {stepNumber < 3 && <span className="h-px w-10 bg-border" />}
                </div>
              ))}
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto py-5">
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Add the title, date and time</h3>
                  <p className="text-sm text-muted-foreground">
                    Add the meeting details before uploading the transcript.
                  </p>
                </div>

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
                    {errors.date && (
                      <p className="text-xs italic text-destructive">{errors.date.message}</p>
                    )}
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
                                onClick={() => updateTime(undefined, undefined, period, true)}
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
                    {errors.time && (
                      <p className="text-xs italic text-destructive">{errors.time.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="meeting-description">Description</Label>
                  <textarea
                    id="meeting-description"
                    placeholder="What is this meeting about?"
                    className="min-h-24 flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    {...register('description')}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Upload the transcript</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload the transcript as TXT, DOCX or PDF.
                  </p>
                </div>

                <Input
                  ref={fileInputRef}
                  id="meeting-file"
                  type="file"
                  accept={acceptedFileExtensions.join(',')}
                  className="hidden"
                  onChange={(event) =>
                    setValue('transcriptFile', event.target.files?.[0], { shouldValidate: true })
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full justify-start"
                >
                  <FileText />
                  Add a file
                </Button>
                {selectedFile && (
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <p className="text-sm font-medium">Uploaded file</p>
                    <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                  </div>
                )}
                {errors.transcriptFile && (
                  <p className="text-xs italic text-destructive">
                    {errors.transcriptFile.message}
                  </p>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Add the attendees</h3>
                  <p className="text-sm text-muted-foreground">
                    Add one attendee at a time for this meeting.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="attendee-first-name">First name *</Label>
                    <Input
                      id="attendee-first-name"
                      value={attendee.firstName}
                      onKeyDown={addAttendeeOnEnter}
                      onChange={(event) =>
                        setAttendee((currentAttendee) => ({
                          ...currentAttendee,
                          firstName: event.target.value,
                        }))
                      }
                      placeholder="First name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="attendee-last-name">Last name *</Label>
                    <Input
                      id="attendee-last-name"
                      value={attendee.lastName}
                      onKeyDown={addAttendeeOnEnter}
                      onChange={(event) =>
                        setAttendee((currentAttendee) => ({
                          ...currentAttendee,
                          lastName: event.target.value,
                        }))
                      }
                      placeholder="Last name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="attendee-email">Email *</Label>
                    <Input
                      id="attendee-email"
                      type="email"
                      value={attendee.email}
                      onKeyDown={addAttendeeOnEnter}
                      onChange={(event) =>
                        setAttendee((currentAttendee) => ({
                          ...currentAttendee,
                          email: event.target.value,
                        }))
                      }
                      placeholder="participant@example.com"
                    />
                  </div>
                </div>

                {attendeeError && <p className="text-xs italic text-destructive">{attendeeError}</p>}

                <Button type="button" variant="outline" onClick={addAttendee} className="w-fit">
                  <Plus />
                  Add attendee
                </Button>

                <div className="h-28 overflow-y-auto">
                  {attendees.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {attendees.map((currentAttendee) => (
                        <div
                          key={currentAttendee.email}
                          className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="grid flex-1 gap-2 text-sm sm:grid-cols-3">
                            <div>
                              <p className="text-xs text-muted-foreground">First name</p>
                              <p className="font-medium">{currentAttendee.firstName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Last name</p>
                              <p className="font-medium">{currentAttendee.lastName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Email</p>
                              <p className="font-medium">{currentAttendee.email}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Remove attendee"
                            onClick={() => removeAttendee(currentAttendee.email)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {meetingError && (
              <p className="mr-auto text-sm text-destructive">{meetingError}</p>
            )}

            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}

            {step === 1 && (
              <Button type="button" onClick={goToTranscriptStep}>
                Next
              </Button>
            )}

            {step === 2 && (
              <Button type="button" onClick={goToAttendeesStep}>
                Next
              </Button>
            )}

            {step === 3 && (
              <Button type="submit" disabled={createMeeting.isPending}>
                {createMeeting.isPending ? 'Finishing...' : 'Finish'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewMeetingModal;
