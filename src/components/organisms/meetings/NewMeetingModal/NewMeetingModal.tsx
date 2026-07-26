import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { FileText, Plus, Trash2, Users } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format, startOfDay } from 'date-fns';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateMeeting } from '@/features/meetings/hooks/useMeetings';
import { extractTextFromFile } from '@/lib/utils';
import { getErrorMessage } from '@/lib/errors';
import AssigneeAvatar from '@molecules/AssigneeAvatar/AssigneeAvatar';
import { DatePickerTime } from '@molecules/DatePickerTime/DatePickerTime';
import EmptyState from '@molecules/EmptyState/EmptyState';
import FormField from '@molecules/FormField/FormField';
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

const attendeeFields: Array<{
  key: keyof Attendee;
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}> = [
  { key: 'firstName', id: 'attendee-first-name', label: 'First name *', placeholder: 'First name' },
  { key: 'lastName', id: 'attendee-last-name', label: 'Last name *', placeholder: 'Last name' },
  {
    key: 'email',
    id: 'attendee-email',
    label: 'Email *',
    placeholder: 'participant@example.com',
    type: 'email',
  },
];

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
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

  const date = watch('date');
  const time = watch('time');
  const selectedFile = watch('transcriptFile');

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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [isOpen, reset]);

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
      setMeetingError(getErrorMessage(error));
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

                <FieldGroup>
                  <FormField
                    id="title"
                    label="Title *"
                    placeholder="e.g. Q3 Product Roadmap Review"
                    register={register}
                    error={errors.title?.message}
                    hasError={!!errors.title}
                  />

                  <Field data-invalid={!!(errors.date || errors.time)}>
                    <DatePickerTime
                      id="meeting-date-time"
                      date={date ? new Date(`${date}T00:00:00`) : undefined}
                      time={time}
                      disabled={{ before: startOfDay(new Date()) }}
                      setDate={(selected) =>
                        setValue('date', selected ? format(selected, 'yyyy-MM-dd') : '', {
                          shouldValidate: true,
                        })
                      }
                      setTime={(value) => setValue('time', value ?? '', { shouldValidate: true })}
                    />
                    <FieldError
                      className="text-xs italic"
                      errors={[errors.date, errors.time].filter(Boolean)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="meeting-description">Description</FieldLabel>
                    <Textarea
                      id="meeting-description"
                      placeholder="What is this meeting about?"
                      className="min-h-24 flex-1 resize-none"
                      {...register('description')}
                    />
                  </Field>
                </FieldGroup>
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
                  <Card className="flex-row items-center gap-3 bg-muted/50 px-4 py-3 ring-0">
                    <FileText className="size-5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">Ready to upload</p>
                    </div>
                  </Card>
                )}
                <FieldError className="text-xs italic" errors={[errors.transcriptFile]} />
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

                <FieldGroup className="grid gap-3 sm:grid-cols-3">
                  {attendeeFields.map(({ key, id, label, placeholder, type }) => (
                    <Field key={key}>
                      <FieldLabel htmlFor={id}>{label}</FieldLabel>
                      <Input
                        id={id}
                        type={type ?? 'text'}
                        value={attendee[key]}
                        onKeyDown={addAttendeeOnEnter}
                        onChange={(event) =>
                          setAttendee((currentAttendee) => ({
                            ...currentAttendee,
                            [key]: event.target.value,
                          }))
                        }
                        placeholder={placeholder}
                      />
                    </Field>
                  ))}
                </FieldGroup>

                <FieldError className="text-xs italic">{attendeeError}</FieldError>

                <Button type="button" variant="outline" onClick={addAttendee} className="w-fit">
                  <Plus />
                  Add attendee
                </Button>

                {attendees.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No attendees added yet"
                    description="Add attendees above to include them in this meeting."
                    accent="blue"
                    className="py-4"
                  />
                ) : (
                  <div className="scrollbar-subtle max-h-52 space-y-1.5 overflow-y-auto">
                    {attendees.map((currentAttendee) => (
                      <Card
                        key={currentAttendee.email}
                        className="flex-row items-center gap-3 bg-muted/50 px-4 py-3 ring-0"
                      >
                        <AssigneeAvatar
                          name={`${currentAttendee.firstName} ${currentAttendee.lastName}`}
                          className="data-[size=sm]:size-8"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">
                            {currentAttendee.firstName} {currentAttendee.lastName}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">
                            {currentAttendee.email}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          aria-label="Remove attendee"
                          onClick={() => removeAttendee(currentAttendee.email)}
                        >
                          <Trash2 />
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            {meetingError && <p className="mr-auto text-sm text-destructive">{meetingError}</p>}

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
