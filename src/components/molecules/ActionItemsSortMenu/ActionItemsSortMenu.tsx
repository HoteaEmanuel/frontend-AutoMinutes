import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ACTION_ITEM_SORT_OPTIONS, ActionItemSortOption } from '@/constants/actionItemSort';

type ActionItemsSortMenuProps = {
  sort: ActionItemSortOption | null;
  onSortChange: (sort: ActionItemSortOption | null) => void;
};

const ActionItemsSortMenu = ({ sort, onSortChange }: ActionItemsSortMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      render={<Button variant="ghost" size="icon-xs" />}
      aria-label="Sort action items"
    >
      <ArrowUpDown className={sort ? 'size-3.5 text-foreground' : 'size-3.5'} />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="min-w-44">
      <DropdownMenuRadioGroup
        value={sort ?? ''}
        onValueChange={(value) => onSortChange((value as ActionItemSortOption) || null)}
      >
        <DropdownMenuRadioItem value="">Default order</DropdownMenuRadioItem>
        {ACTION_ITEM_SORT_OPTIONS.map((option) => (
          <DropdownMenuRadioItem key={option.value} value={option.value}>
            {option.label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ActionItemsSortMenu;
