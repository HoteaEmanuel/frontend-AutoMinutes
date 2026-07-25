import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

export type FilterComboboxOption = {
  value: string;
  label: string;
};

type FilterComboboxProps = {
  options: FilterComboboxOption[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
  placeholder: string;
  emptyMessage: string;
  disabled?: boolean;
};

const FilterCombobox = ({
  options,
  selectedValue,
  onSelect,
  placeholder,
  emptyMessage,
  disabled = false,
}: FilterComboboxProps) => {
  const selectedItem = options.find((option) => option.value === selectedValue) ?? null;

  return (
    <Combobox
      items={options}
      value={selectedItem}
      onValueChange={(item) => onSelect(item?.value ?? null)}
      disabled={disabled}
    >
      <ComboboxInput
        placeholder={placeholder}
        showClear={selectedItem !== null}
        disabled={disabled}
      />
      <ComboboxContent>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(item: FilterComboboxOption) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default FilterCombobox;
