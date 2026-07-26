import { z } from 'zod';

const acceptedFileTypes = [
  'text/plain',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const acceptedFileExtensions = ['.txt', '.pdf', '.docx'];

export const meetingForm = z
  .object({
    title: z.string().trim().min(1, 'Title is required.'),
    date: z.string().min(1, 'Date is required.'),
    time: z.string().min(1, 'Time is required.'),
    description: z.string().optional(),
    transcriptFile: z
      .custom<File>()
      .optional()
      .refine(
        (file) => {
          if (!file) return true;

          const hasAcceptedType = acceptedFileTypes.includes(file.type);
          const hasAcceptedExtension = acceptedFileExtensions.some((extension) =>
            file.name.toLowerCase().endsWith(extension),
          );

          return hasAcceptedType || hasAcceptedExtension;
        },
        { message: 'Upload a TXT, DOCX or PDF file.' },
      ),
  })
  .refine(
    ({ date, time }) => {
      const selectedDate = new Date(`${date}T${time}`);
      return selectedDate >= new Date();
    },
    {
      message: 'Meeting date and time cannot be in the past.',
      path: ['date'],
    },
  );
