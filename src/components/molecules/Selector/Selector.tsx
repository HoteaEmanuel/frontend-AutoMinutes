import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SelectorProps<T> = {
  value: T | null;
  handleChange: (value: T | null) => void;
  items: { label: string; value: T }[];
  label: string;
};

const Selector = ({ items, handleChange, value, label }: SelectorProps<string>) => {
  if (!items) return null;
  return (
    <>
      <Label>{label}</Label>
      <Select value={value} onValueChange={(value) => handleChange(value)} items={items}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((option) => (
              <SelectItem value={option.label} key={option.label}>
                {option.value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

export default Selector;
