import { STATUS_LABELS } from '@/constants/status';
import { Meeting } from '@/gql/types';
import { buildCsv } from '../csv';

export function buildMeetingsCsv(meetings: Meeting[]): string {
  return buildCsv(
    ['Title', 'Description', 'Status', 'Scheduled At', 'Created At', 'Updated At'],
    meetings.map((meeting) => [
      meeting.title,
      meeting.description ?? '',
      STATUS_LABELS[meeting.status],
      meeting.scheduledAt,
      meeting.createdAt,
      meeting.updatedAt,
    ]),
  );
}

export function buildMeetingsJson(meetings: Meeting[]): string {
  return JSON.stringify(
    meetings.map((meeting) => ({
      id: meeting.id,
      title: meeting.title,
      description: meeting.description ?? null,
      status: meeting.status,
      scheduledAt: meeting.scheduledAt,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    })),
    null,
    2,
  );
}
