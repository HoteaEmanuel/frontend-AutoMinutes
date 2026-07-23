import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FormField from '@molecules/FormField/FormField';
import Selector from '@molecules/Selector/Selector';
import DatePicker from '@molecules/DatePicker/DatePicker';
import { useAttendees } from '@/features/attendees/hooks/useAttendees';
import { useUpdateActionItem } from '@/features/action-items/hooks/useActionItemMutations';
import { BoardActionItem, resolveColumnStatus } from '@/features/action-items/utils';
import { ACTION_ITEM_COLUMNS, ACTION_ITEM_COLUMN_LABELS } from '@/constants/actionItemStatus';
import { actionItemForm } from './actionItemForm';

const UNASSIGNED = 'unassigned';

const STATUS_ITEMS = ACTION_ITEM_COLUMNS.map((status) => ({
  label: ACTION_ITEM_COLUMN_LABELS[status],
  value: status,
}));

type ActionItemFormData = z.infer<typeof actionItemForm>;

type ActionItemEditDialogProps = {
  item: BoardActionItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ActionItemEditDialog = ({ item, open, onOpenChange }: ActionItemEditDialogProps) => {
  const { data: attendees } = useAttendees(item.meetingId);
  const { mutate, isPending } = useUpdateActionItem();
  const assigneeItems = (attendees ?? []).map((attendee) => ({
    label: attendee.name,
    value: attendee.id,
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ActionItemFormData>({
    resolver: zodResolver(actionItemForm),
    values: {
      title: item.title,
      description: item.description ?? '',
      deadline: item.deadline ? item.deadline.slice(0, 10) : '',
      status: resolveColumnStatus(item.status),
      assigneeId: item.assignee?.id ?? UNASSIGNED,
    },
  });

  const onSubmit = (values: ActionItemFormData) => {
    mutate(
      {
        meetingId: item.meetingId,
        actionItemId: item.id,
        title: values.title,
        description: values.description,
        deadline: values.deadline ? new Date(values.deadline).toISOString() : undefined,
        status: values.status,
        assigneeId: values.assigneeId === UNASSIGNED ? '' : values.assigneeId,
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Edit action item</DialogTitle>
          </DialogHeader>

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
                    id="action-item-deadline"
                    label="Deadline"
                    date={field.value ? new Date(`${field.value}T00:00:00`) : undefined}
                    setDate={(selected) => field.onChange(selected ? format(selected, 'yyyy-MM-dd') : '')}
                  />
                )}
              />
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Selector
                    label="Status"
                    value={field.value}
                    handleChange={(value) =>
                      field.onChange((value ?? 'OPEN') as ActionItemFormData['status'])
                    }
                    items={STATUS_ITEMS}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name="assigneeId"
              render={({ field }) => (
                <Selector
                  label="Assignee"
                  value={field.value ?? UNASSIGNED}
                  handleChange={(value) => field.onChange(value ?? UNASSIGNED)}
                  items={[{ label: 'Unassigned', value: UNASSIGNED }, ...assigneeItems]}
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

export default ActionItemEditDialog;
