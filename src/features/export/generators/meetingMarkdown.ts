import { STATUS_LABELS } from '@/constants/status';
import { ACTION_ITEM_COLUMN_LABELS } from '@/constants/actionItemStatus';
import { ActionItem, Attendee } from '@/gql/types';
import { MeetingExportData } from '../types';

const roleLabels: Record<string, string> = {
  ORGANIZER: 'Organizer',
  PARTICIPANT: 'Participant',
  UNKNOWN: 'Unknown',
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const statusLabel = (status: ActionItem['status']) =>
  (ACTION_ITEM_COLUMN_LABELS as Record<string, string>)[status] ?? status;

const attendeesTable = (attendees: Attendee[]) => {
  if (attendees.length === 0) return 'No attendees recorded.';
  const rows = attendees.map(
    (attendee) =>
      `| ${attendee.name} | ${attendee.email ?? ''} | ${roleLabels[attendee.role] ?? attendee.role} |`,
  );
  return ['| Name | Email | Role |', '| --- | --- | --- |', ...rows].join('\n');
};

const actionItemsTable = (actionItems: ActionItem[]) => {
  if (actionItems.length === 0) return 'No action items recorded.';
  const rows = actionItems.map(
    (item) =>
      `| ${item.title} | ${item.description ?? ''} | ${statusLabel(item.status)} | ${
        item.deadline ? new Date(item.deadline).toLocaleDateString() : ''
      } | ${item.assignee?.name ?? ''} |`,
  );
  return [
    '| Title | Description | Status | Deadline | Assignee |',
    '| --- | --- | --- | --- | --- |',
    ...rows,
  ].join('\n');
};

export function buildMeetingMarkdown(data: MeetingExportData): string {
  const { meeting, transcript, aiResults, attendees, actionItems } = data;
  const sections: string[] = [];

  sections.push(`# ${meeting.title}`);
  sections.push(
    `**Status:** ${STATUS_LABELS[meeting.status]}  \n**Scheduled:** ${dateFormatter.format(new Date(meeting.scheduledAt))}`,
  );

  if (meeting.description) {
    sections.push(`## Description\n\n${meeting.description}`);
  }

  sections.push(
    `## Summary\n\n${aiResults ? aiResults.summary : '_AI results have not been generated for this meeting yet._'}`,
  );

  if (aiResults?.decisions?.length) {
    sections.push(`## Decisions\n\n${aiResults.decisions.map((decision) => `- ${decision}`).join('\n')}`);
  }

  if (aiResults?.detailedNotes) {
    sections.push(`## Detailed Notes\n\n${aiResults.detailedNotes}`);
  }

  if (aiResults?.followUpNotes) {
    sections.push(`## Follow-ups\n\n${aiResults.followUpNotes}`);
  }

  sections.push(`## Attendees\n\n${attendeesTable(attendees)}`);
  sections.push(`## Action Items\n\n${actionItemsTable(actionItems)}`);

  if (transcript) {
    sections.push(
      `## Transcript\n\n${transcript
        .split(/\r?\n/)
        .map((line) => `> ${line}`)
        .join('\n')}`,
    );
  }

  sections.push(`---\n_Exported from AutoMinutes on ${dateFormatter.format(new Date())}._`);

  return sections.join('\n\n');
}
