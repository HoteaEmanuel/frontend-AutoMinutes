import ActionItemsColumn from '@organisms/action-items/ActionItemsColumn/ActionItemsColumn';
import { ACTION_ITEM_COLUMNS } from '@/constants/actionItemStatus';
import { BoardActionItem, resolveColumnStatus } from '@/features/action-items/utils';

type ActionItemsBoardProps = {
  items: BoardActionItem[];
};

const ActionItemsBoard = ({ items }: ActionItemsBoardProps) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {ACTION_ITEM_COLUMNS.map((status) => (
      <ActionItemsColumn
        key={status}
        status={status}
        items={items.filter((item) => resolveColumnStatus(item.status) === status)}
      />
    ))}
  </div>
);

export default ActionItemsBoard;
