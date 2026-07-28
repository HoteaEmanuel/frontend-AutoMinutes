import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { useUpdateMeeting } from '@/features/meetings/hooks/useMeetings';
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/constants/validation';
import { Meeting } from '@/gql/types';
import { DatePickerTime } from '@molecules/DatePickerTime/DatePickerTime';
import FormField from '@molecules/FormField/FormField';
import { editMeetingForm } from './editMeetingForm';

type EditMeetingFormData = z.infer<typeof editMeetingForm>;

type EditMeetingDialogProps = {
  meeting: Pick<Meeting, 'id' | 'title' | 'description' | 'scheduledAt'>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const toLocalDateAndTime = (isoDate: string) => {
  const localDate = new Date(isoDate);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  const localIso = localDate.toISOString();
  return { date: localIso.slice(0, 10), time: localIso.slice(11, 16) };
};

const EditMeetingDialog = ({ meeting, open, onOpenChange }: EditMeetingDialogProps) => {
  const { mutate, isPending } = useUpdateMeeting();
  const { date: initialDate, time: initialTime } = toLocalDateAndTime(meeting.scheduledAt);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditMeetingFormData>({
    resolver: zodResolver(editMeetingForm),
    values: {
      title: meeting.title,
      description: meeting.description ?? '',
      date: initialDate,
      time: initialTime,
    },
  });

  const date = watch('date');
  const time = watch('time');

  const onSubmit = (values: EditMeetingFormData) => {
    mutate(
      {
        meetingId: meeting.id,
        title: values.title,
        description: values.description?.trim() || undefined,
        scheduledAt: new Date(`${values.date}T${values.time}`).toISOString(),
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[90vh] min-h-0 flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>Edit meeting</DialogTitle>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto scrollbar-subtle py-1">
            <FieldGroup>
              <FormField
                id="title"
                label="Title *"
                register={register}
                error={errors.title?.message}
                hasError={!!errors.title}
                maxLength={TITLE_MAX_LENGTH}
                value={watch('title')}
              />

              <Field data-invalid={!!(errors.date || errors.time)}>
                <DatePickerTime
                  id="edit-meeting-date-time"
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

              <FormField
                id="description"
                label="Description"
                as="textarea"
                placeholder="What is this meeting about?"
                register={register}
                error={errors.description?.message}
                hasError={!!errors.description}
                maxLength={DESCRIPTION_MAX_LENGTH}
                value={watch('description')}
              />
            </FieldGroup>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMeetingDialog;
