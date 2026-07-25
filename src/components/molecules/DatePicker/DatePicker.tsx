import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type DatePickerProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  id?: string;
};

const DatePicker = ({ date, setDate, label = 'Date', id = 'date-picker' }: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button variant="outline" id={id} className="w-full justify-between font-normal">
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
            onSelect={(selected) => {
              setDate(selected);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
};

export default DatePicker;
