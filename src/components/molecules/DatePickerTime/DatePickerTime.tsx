'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type DatePickerTimeProps = {
  date: Date | undefined;
  time: string | undefined;
  setDate: (date: Date | undefined) => void;
  setTime: (time: string | undefined) => void;
  id?: string;
  disabled?: React.ComponentProps<typeof Calendar>['disabled'];
};
export function DatePickerTime({
  date,
  time,
  setDate,
  setTime,
  id = 'date-picker',
  disabled,
}: DatePickerTimeProps) {
  const [open, setOpen] = React.useState(false);
  const dateFieldId = `${id}-date`;
  const timeFieldId = `${id}-time`;

  return (
    <FieldGroup className="flex-row">
      <Field>
        <FieldLabel htmlFor={dateFieldId}>Date</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id={dateFieldId}
                className="w-32 justify-between font-normal"
              >
                {date ? format(date, 'PPP') : 'Select date'}
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            }
          />
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date}
              disabled={disabled}
              onSelect={(selected) => {
                setDate(selected);
                if (!selected) setTime(undefined);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field className="w-32">
        <FieldLabel htmlFor={timeFieldId}>Time</FieldLabel>
        <Input
          type="time"
          id={timeFieldId}
          disabled={!date}
          value={time ?? ''}
          onChange={(e) => setTime(e.target.value || undefined)}
          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  );
}
