import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { fetchMeeting, findTranscript } from '@/features/meetings/api';
import { meetingKeys } from '@/features/meetings/hooks/useMeetings';
import { transcriptKeys } from '@/features/meetings/hooks/useTranscript';
import { findAIMeetingResults } from '@/features/ai-results/api';
import { aiResultsKeys } from '@/features/ai-results/hooks/useAIResults';
import { fetchAttendees } from '@/features/attendees/api';
import { attendeesKeys } from '@/features/attendees/hooks/useAttendees';
import { fetchUserActionItems } from '@/features/action-items/api';
import { actionItemsKeys } from '@/features/action-items/hooks/useActionItems';
import { getErrorMessage } from '@/lib/errors';
import { downloadFile } from '@/lib/utils';
import { MeetingExportData } from '../types';
import { slugifyFilename } from '../filename';
import { buildMeetingPdf } from '../generators/meetingPdf';
import { buildMeetingMarkdown } from '../generators/meetingMarkdown';
import { buildMeetingJson } from '../generators/meetingJson';

export type MeetingExportFormat = 'pdf' | 'markdown' | 'json';

export const useExportMeeting = (meetingId: string) => {
  const queryClient = useQueryClient();
  const [isExporting, setIsExporting] = useState(false);

  const exportMeeting = async (format: MeetingExportFormat) => {
    setIsExporting(true);
    try {
      const [meeting, transcript, aiResults, attendees, actionItems] = await Promise.all([
        queryClient.ensureQueryData({
          queryKey: meetingKeys.detail(meetingId),
          queryFn: () => fetchMeeting(meetingId),
        }),
        queryClient.ensureQueryData({
          queryKey: transcriptKeys.detail(meetingId),
          queryFn: () => findTranscript(meetingId),
        }),
        queryClient.ensureQueryData({
          queryKey: aiResultsKeys.detail(meetingId),
          queryFn: () => findAIMeetingResults(meetingId),
        }),
        queryClient.ensureQueryData({
          queryKey: attendeesKeys.list(meetingId),
          queryFn: () => fetchAttendees(meetingId),
        }),
        queryClient.ensureQueryData({
          queryKey: actionItemsKeys.list({ meetingId }),
          queryFn: () => fetchUserActionItems({ meetingId }),
        }),
      ]);

      const data: MeetingExportData = {
        meeting,
        transcript: transcript?.content ?? null,
        aiResults: aiResults ?? null,
        attendees,
        actionItems,
      };

      const filenameBase = slugifyFilename(meeting.title);

      if (format === 'pdf') {
        buildMeetingPdf(data).save(`${filenameBase}.pdf`);
      } else if (format === 'markdown') {
        downloadFile(buildMeetingMarkdown(data), `${filenameBase}.md`, 'text/markdown;charset=utf-8');
      } else {
        downloadFile(buildMeetingJson(data), `${filenameBase}.json`, 'application/json;charset=utf-8');
      }

      toast.success('Meeting exported successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsExporting(false);
    }
  };

  return { exportMeeting, isExporting };
};
