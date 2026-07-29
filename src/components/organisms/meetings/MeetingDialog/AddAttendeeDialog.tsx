import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAddAttendee } from '@/features/attendees/hooks/useAttendeeMutations';
import { NAME_MAX_LENGTH } from '@/constants/validation';
import FormField from '@molecules/FormField/FormField';
import Selector from '@molecules/Selector/Selector';
import { attendeeForm, attendeeRoleItems } from './attendeeForm';

type AttendeeFormData = z.infer<typeof attendeeForm>;

type AddAttendeeDialogProps = {
  meetingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AddAttendeeDialog = ({ meetingId, open, onOpenChange }: AddAttendeeDialogProps) => {
  const { mutate, isPending } = useAddAttendee();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AttendeeFormData>({
    resolver: zodResolver(attendeeForm),
    defaultValues: { name: '', email: '', role: 'PARTICIPANT' },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = (values: AttendeeFormData) => {
    mutate(
      {
        meetingId,
        name: values.name,
        email: values.email || undefined,
        role: values.role,
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
            <DialogTitle>Add attendee</DialogTitle>
          </DialogHeader>

          <FormField
            id="name"
            label="Name *"
            placeholder="Full name"
            register={register}
            error={errors.name?.message}
            hasError={!!errors.name}
            maxLength={NAME_MAX_LENGTH}
            value={watch('name')}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="participant@example.com"
            register={register}
            error={errors.email?.message}
            hasError={!!errors.email}
          />

          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Selector
                  label="Role"
                  value={field.value}
                  handleChange={(value) => field.onChange(value ?? 'PARTICIPANT')}
                  items={attendeeRoleItems}
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add attendee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAttendeeDialog;
