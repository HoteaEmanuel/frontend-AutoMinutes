import { FormEvent, useEffect, useState } from 'react';
import { X } from 'lucide-react';
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
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(currentDateAndTime.date);
  const [time, setTime] = useState(currentDateAndTime.time);
  const [minDate, setMinDate] = useState(currentDateAndTime.date);
  const [minTime, setMinTime] = useState(currentDateAndTime.time);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const selectedTime = getTimeParts(time);

  useEffect(() => {
    if (isOpen) {
      const currentDateAndTime = getCurrentDateAndTime();
      setDate(currentDateAndTime.date);
      setTime(currentDateAndTime.time);
      setMinDate(currentDateAndTime.date);
      setMinTime(currentDateAndTime.time);
      setIsTimePickerOpen(false);
    }
  }, [isOpen]);

  const updateTime = (
    hour = selectedTime.hour,
    minute = selectedTime.minute,
    period = selectedTime.period,
  ) => {
    setTime(getTimeValue(hour, minute, period));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !date || !time) {
      setError('Title, date and time are required.');
      return;
    }

    if (date < minDate || (date === minDate && time < minTime)) {
      setError('Meeting date and time cannot be in the past.');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>New meeting</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="meeting-title">Title *</Label>
            <Input
              id="meeting-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Q3 Product Roadmap Review"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="meeting-date">Date *</Label>
              <Input
                id="meeting-date"
                type="date"
                value={date}
                min={minDate}
                onChange={(event) => setDate(event.target.value)}
              />
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
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is this meeting about?"
              className="min-h-24 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

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
