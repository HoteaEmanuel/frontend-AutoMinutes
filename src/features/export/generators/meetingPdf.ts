import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { STATUS_LABELS } from '@/constants/status';
import { ACTION_ITEM_COLUMN_LABELS } from '@/constants/actionItemStatus';
import { ActionItem } from '@/gql/types';
import { MeetingExportData } from '../types';

type DocWithAutoTable = jsPDF & { lastAutoTable?: { finalY: number } };

const MARGIN = 14;
const LINE_HEIGHT = 5;

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const statusLabel = (status: ActionItem['status']) =>
  (ACTION_ITEM_COLUMN_LABELS as Record<string, string>)[status] ?? status;

const roleLabels: Record<string, string> = {
  ORGANIZER: 'Organizer',
  PARTICIPANT: 'Participant',
  UNKNOWN: 'Unknown',
};

function pageHeight(doc: jsPDF) {
  return doc.internal.pageSize.getHeight();
}

function pageWidth(doc: jsPDF) {
  return doc.internal.pageSize.getWidth();
}

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > pageHeight(doc) - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function addHeading(doc: jsPDF, text: string, y: number): number {
  y = ensureSpace(doc, y, LINE_HEIGHT * 2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(text, MARGIN, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  return y + LINE_HEIGHT + 2;
}

function addWrappedText(doc: jsPDF, text: string, y: number): number {
  const lines = doc.splitTextToSize(text, pageWidth(doc) - MARGIN * 2) as string[];
  for (const line of lines) {
    y = ensureSpace(doc, y, LINE_HEIGHT);
    doc.text(line, MARGIN, y);
    y += LINE_HEIGHT;
  }
  return y;
}

function addBulletList(doc: jsPDF, items: string[], y: number): number {
  for (const item of items) {
    const lines = doc.splitTextToSize(`•  ${item}`, pageWidth(doc) - MARGIN * 2) as string[];
    for (const line of lines) {
      y = ensureSpace(doc, y, LINE_HEIGHT);
      doc.text(line, MARGIN, y);
      y += LINE_HEIGHT;
    }
  }
  return y;
}

function addFooters(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  const exportedOn = `Exported from AutoMinutes on ${dateFormatter.format(new Date())}`;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120);
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);
    const footerY = pageHeight(doc) - 8;
    doc.text(exportedOn, MARGIN, footerY);
    doc.text(`Page ${page} of ${pageCount}`, pageWidth(doc) - MARGIN, footerY, { align: 'right' });
  }
}

export function buildMeetingPdf(data: MeetingExportData): jsPDF {
  const { meeting, transcript, aiResults, attendees, actionItems } = data;
  const doc = new jsPDF();
  let y = MARGIN;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  y = ensureSpace(doc, y, LINE_HEIGHT * 2);
  doc.text(meeting.title, MARGIN, y);
  y += LINE_HEIGHT + 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `${STATUS_LABELS[meeting.status]} · ${dateFormatter.format(new Date(meeting.scheduledAt))}`,
    MARGIN,
    y,
  );
  doc.setTextColor(0);
  y += LINE_HEIGHT + 4;

  if (meeting.description) {
    y = addHeading(doc, 'Description', y);
    y = addWrappedText(doc, meeting.description, y);
    y += 4;
  }

  y = addHeading(doc, 'Summary', y);
  y = addWrappedText(
    doc,
    aiResults ? aiResults.summary : 'AI results have not been generated for this meeting yet.',
    y,
  );
  y += 4;

  if (aiResults?.decisions?.length) {
    y = addHeading(doc, 'Decisions', y);
    y = addBulletList(doc, aiResults.decisions, y);
    y += 4;
  }

  if (aiResults?.detailedNotes) {
    y = addHeading(doc, 'Detailed Notes', y);
    y = addWrappedText(doc, aiResults.detailedNotes, y);
    y += 4;
  }

  if (aiResults?.followUpNotes) {
    y = addHeading(doc, 'Follow-ups', y);
    y = addWrappedText(doc, aiResults.followUpNotes, y);
    y += 4;
  }

  y = addHeading(doc, 'Attendees', y);
  if (attendees.length === 0) {
    y = addWrappedText(doc, 'No attendees recorded.', y);
  } else {
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: pageWidth(doc) - MARGIN * 2,
      head: [['Name', 'Email', 'Role']],
      body: attendees.map((attendee) => [
        attendee.name,
        attendee.email ?? '',
        roleLabels[attendee.role] ?? attendee.role,
      ]),
      styles: { fontSize: 9, overflow: 'linebreak' },
      headStyles: { fillColor: [43, 196, 176] },
      columnStyles: {
        0: { cellWidth: 55 },
        1: { cellWidth: 87 },
        2: { cellWidth: 40 },
      },
    });
    y = (doc as DocWithAutoTable).lastAutoTable!.finalY + 8;
  }

  y = addHeading(doc, 'Action Items', y);
  if (actionItems.length === 0) {
    y = addWrappedText(doc, 'No action items recorded.', y);
  } else {
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: pageWidth(doc) - MARGIN * 2,
      head: [['Title', 'Description', 'Status', 'Deadline', 'Assignee']],
      body: actionItems.map((item) => [
        item.title,
        item.description ?? '',
        statusLabel(item.status),
        item.deadline ? new Date(item.deadline).toLocaleDateString() : '',
        item.assignee?.name ?? '',
      ]),
      styles: { fontSize: 9, overflow: 'linebreak' },
      headStyles: { fillColor: [43, 196, 176] },
      columnStyles: {
        0: { cellWidth: 42 },
        1: { cellWidth: 62 },
        2: { cellWidth: 24 },
        3: { cellWidth: 24 },
        4: { cellWidth: 30 },
      },
    });
    y = (doc as DocWithAutoTable).lastAutoTable!.finalY + 8;
  }

  if (transcript) {
    doc.addPage();
    y = MARGIN;
    y = addHeading(doc, 'Transcript', y);
    y = addWrappedText(doc, transcript, y);
  }

  addFooters(doc);

  return doc;
}
