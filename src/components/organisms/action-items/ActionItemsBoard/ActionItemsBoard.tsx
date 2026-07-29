import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActionItemsColumn from '@organisms/action-items/ActionItemsColumn/ActionItemsColumn';
import { ACTION_ITEM_COLUMNS, ACTION_ITEM_COLUMN_LABELS } from '@/constants/actionItemStatus';
import { BoardActionItem, resolveColumnStatus } from '@/features/action-items/utils';

type ActionItemsBoardProps = {
  items: BoardActionItem[];
};

const ActionItemsBoard = ({ items }: ActionItemsBoardProps) => {
  const itemsByStatus = (status: (typeof ACTION_ITEM_COLUMNS)[number]) =>
    items.filter((item) => resolveColumnStatus(item.status) === status);

  return (
    <>
      <div className="hidden gap-4 md:grid md:grid-cols-3">
        {ACTION_ITEM_COLUMNS.map((status) => (
          <ActionItemsColumn key={status} status={status} items={itemsByStatus(status)} />
        ))}
      </div>

      <Tabs defaultValue={ACTION_ITEM_COLUMNS[0]} className="md:hidden">
        <TabsList variant="line" className="w-full">
          {ACTION_ITEM_COLUMNS.map((status) => (
            <TabsTrigger key={status} value={status}>
              {ACTION_ITEM_COLUMN_LABELS[status]}
              <span className="text-xs text-muted-foreground">{itemsByStatus(status).length}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {ACTION_ITEM_COLUMNS.map((status) => (
          <TabsContent key={status} value={status}>
            <ActionItemsColumn status={status} items={itemsByStatus(status)} />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default ActionItemsBoard;
