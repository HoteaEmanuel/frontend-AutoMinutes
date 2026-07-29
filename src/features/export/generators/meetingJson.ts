import { MeetingExportData } from '../types';

export function buildMeetingJson(data: MeetingExportData): string {
  const { meeting, transcript, aiResults, attendees, actionItems } = data;

  const payload = {
    meeting: {
      id: meeting.id,
      title: meeting.title,
      description: meeting.description ?? null,
      status: meeting.status,
      scheduledAt: meeting.scheduledAt,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    },
    transcript,
    aiResults: aiResults
      ? {
          summary: aiResults.summary,
          decisions: aiResults.decisions ?? null,
          detailedNotes: aiResults.detailedNotes ?? null,
          followUpNotes: aiResults.followUpNotes ?? null,
        }
      : null,
    attendees: attendees.map((attendee) => ({
      id: attendee.id,
      name: attendee.name,
      email: attendee.email ?? null,
      role: attendee.role,
      aiGenerated: attendee.aiGenerated,
    })),
    actionItems: actionItems.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description ?? null,
      status: item.status,
      deadline: item.deadline ?? null,
      aiGenerated: item.aiGenerated,
      assignee: item.assignee
        ? { id: item.assignee.id, name: item.assignee.name, email: item.assignee.email ?? null }
        : null,
    })),
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(payload, null, 2);
}
