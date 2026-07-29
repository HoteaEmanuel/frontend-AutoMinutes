import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { fetchAllMeetingsForExport } from '@/features/meetings/api';
import { meetingKeys } from '@/features/meetings/hooks/useMeetings';
import { getErrorMessage } from '@/lib/errors';
import { downloadFile } from '@/lib/utils';
import { timestampSuffix } from '../filename';
import { buildMeetingsCsv, buildMeetingsJson } from '../generators/meetingsExport';

export type MeetingsExportFormat = 'csv' | 'json';

export const useExportMeetings = () => {
  const queryClient = useQueryClient();
  const [isExporting, setIsExporting] = useState(false);

  const exportMeetings = async (format: MeetingsExportFormat) => {
    setIsExporting(true);
    try {
      const meetings = await queryClient.ensureQueryData({
        queryKey: meetingKeys.exportAll,
        queryFn: fetchAllMeetingsForExport,
      });

      if (meetings.length === 0) {
        toast.error('No meetings to export yet.');
        return;
      }

      const filenameBase = `meetings-export-${timestampSuffix()}`;
      if (format === 'csv') {
        downloadFile(buildMeetingsCsv(meetings), `${filenameBase}.csv`, 'text/csv;charset=utf-8');
      } else {
        downloadFile(buildMeetingsJson(meetings), `${filenameBase}.json`, 'application/json;charset=utf-8');
      }

      toast.success('Meetings exported successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsExporting(false);
    }
  };

  return { exportMeetings, isExporting };
};
