import { ActionItem, AiResults, Attendee, Meeting } from '@/gql/types';

export type MeetingExportData = {
  meeting: Meeting;
  transcript: string | null;
  aiResults: Pick<AiResults, 'summary' | 'decisions' | 'detailedNotes' | 'followUpNotes'> | null;
  attendees: Attendee[];
  actionItems: ActionItem[];
};
