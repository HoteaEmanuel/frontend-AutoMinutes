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
import { useUpdateAttendee } from '@/features/attendees/hooks/useAttendeeMutations';
import { Attendee } from '@/gql/types';
import FormField from '@molecules/FormField/FormField';
import Selector from '@molecules/Selector/Selector';
import { attendeeForm, attendeeRoleItems } from './attendeeForm';

type AttendeeFormData = z.infer<typeof attendeeForm>;

type AttendeeEditDialogProps = {
  attendee: Attendee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AttendeeEditDialog = ({ attendee, open, onOpenChange }: AttendeeEditDialogProps) => {
  const { mutate, isPending } = useUpdateAttendee();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AttendeeFormData>({
    resolver: zodResolver(attendeeForm),
    values: {
      name: attendee.name,
      email: attendee.email ?? '',
      role: attendee.role === 'ORGANIZER' ? 'ORGANIZER' : 'PARTICIPANT',
    },
  });

  const onSubmit = (values: AttendeeFormData) => {
    mutate(
      {
        attendeeId: attendee.id,
        name: values.name,
        email: values.email || undefined,
        role: values.role,
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Edit attendee</DialogTitle>
          </DialogHeader>

          <FormField
            id="name"
            label="Name *"
            register={register}
            error={errors.name?.message}
            hasError={!!errors.name}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
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
              {isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AttendeeEditDialog;
