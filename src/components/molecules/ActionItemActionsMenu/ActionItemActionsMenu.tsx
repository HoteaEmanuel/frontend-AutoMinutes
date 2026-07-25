import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type ActionItemActionsMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
};

const ActionItemActionsMenu = ({ onEdit, onDelete }: ActionItemActionsMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" />} aria-label="Action item actions">
      <MoreVertical className="size-3.5" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="min-w-32">
      <DropdownMenuItem onClick={onEdit}>
        <Pencil />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem variant="destructive" onClick={onDelete}>
        <Trash2 />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ActionItemActionsMenu;
