import { toast } from 'sonner';
import { ActionItem } from '@/gql/types';
import { BoardActionItem } from '@/features/action-items/utils';
import { downloadFile } from '@/lib/utils';
import { slugifyFilename, timestampSuffix } from './filename';
import { buildActionItemsCsv, buildBoardActionItemsCsv } from './generators/actionItemsCsv';

export function exportMeetingActionItemsCsv(items: ActionItem[], meetingTitle: string) {
  downloadFile(
    buildActionItemsCsv(items),
    `${slugifyFilename(meetingTitle)}-action-items.csv`,
    'text/csv;charset=utf-8',
  );
  toast.success('Action items exported successfully!');
}

export function exportBoardActionItemsCsv(items: BoardActionItem[], meetingTitle?: string) {
  downloadFile(
    buildBoardActionItemsCsv(items),
    `todos-${meetingTitle ? slugifyFilename(meetingTitle) : 'all-meetings'}-${timestampSuffix()}.csv`,
    'text/csv;charset=utf-8',
  );
  toast.success('Action items exported successfully!');
}
