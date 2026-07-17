import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STATUS, STATUSES } from '@/constants/status';
import { MeetingStatus } from '@/gql/types';
type StatusSelectProps = {
  status: MeetingStatus;
  setStatus: (status: MeetingStatus) => void;
};
const StatusSelect = ({ status, setStatus }: StatusSelectProps) => {
  return (
    <Select
      items={STATUS}
      value={status}
      onValueChange={(value) => setStatus(value as MeetingStatus)}
    >
      <SelectTrigger className="max-w-md">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {STATUSES.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
