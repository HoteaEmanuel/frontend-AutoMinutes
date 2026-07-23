import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FormField from '@molecules/FormField/FormField';
import FilterCombobox from '@molecules/FilterCombobox/FilterCombobox';
import DatePicker from '@molecules/DatePicker/DatePicker';
import { useAttendees } from '@/features/attendees/hooks/useAttendees';
import { useCreateActionItem } from '@/features/action-items/hooks/useActionItemMutations';
import { createActionItemForm } from './createActionItemForm';

type MeetingOption = {
  value: string;
  label: string;
};

type CreateActionItemFormData = z.infer<typeof createActionItemForm>;

type CreateActionItemDialogProps = {
  meetings: MeetingOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateActionItemDialog = ({ meetings, open, onOpenChange }: CreateActionItemDialogProps) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateActionItemFormData>({
    resolver: zodResolver(createActionItemForm),
    defaultValues: {
      meetingId: '',
      title: '',
      description: '',
      deadline: '',
      assigneeId: '',
    },
  });

  const selectedMeetingId = watch('meetingId');
  const { data: attendees } = useAttendees(selectedMeetingId);
  const assigneeItems = (attendees ?? []).map((attendee) => ({
    label: attendee.name,
    value: attendee.id,
  }));

  const { mutate, isPending } = useCreateActionItem();

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    setValue('assigneeId', '');
  }, [selectedMeetingId, setValue]);

  const onSubmit = (values: CreateActionItemFormData) => {
    mutate(
      {
        meetingId: values.meetingId,
        title: values.title,
        description: values.description || undefined,
        deadline: values.deadline ? new Date(values.deadline).toISOString() : undefined,
        assigneeId: values.assigneeId || undefined,
        aiGenerated: false,
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Create action item</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label>Meeting *</Label>
            <Controller
              control={control}
              name="meetingId"
              render={({ field }) => (
                <FilterCombobox
                  options={meetings}
                  selectedValue={field.value || null}
                  onSelect={(value) => field.onChange(value ?? '')}
                  placeholder="Select a meeting"
                  emptyMessage="No meetings found."
                />
              )}
            />
            {errors.meetingId && (
              <p className="text-xs italic text-left text-destructive">
                {errors.meetingId.message}
              </p>
            )}
          </div>

          <FormField
            id="title"
            label="Title *"
            register={register}
            error={errors.title?.message}
            hasError={!!errors.title}
          />

          <FormField
            id="description"
            label="Description"
            as="textarea"
            register={register}
            error={errors.description?.message}
            hasError={!!errors.description}
          />

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <Controller
                control={control}
                name="deadline"
                render={({ field }) => (
                  <DatePicker
                    id="create-action-item-deadline"
                    label="Deadline"
                    date={field.value ? new Date(`${field.value}T00:00:00`) : undefined}
                    setDate={(selected) =>
                      field.onChange(selected ? format(selected, 'yyyy-MM-dd') : '')
                    }
                  />
                )}
              />
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <Label>Assignee</Label>
              <Controller
                control={control}
                name="assigneeId"
                render={({ field }) => (
                  <FilterCombobox
                    options={assigneeItems}
                    selectedValue={field.value || null}
                    onSelect={(value) => field.onChange(value ?? '')}
                    placeholder={selectedMeetingId ? 'Unassigned' : 'Select a meeting first'}
                    emptyMessage="No attendees found."
                    disabled={!selectedMeetingId}
                  />
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateActionItemDialog;
