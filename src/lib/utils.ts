import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const getFileExtension = (file: File) => file.name.split('.').pop()?.toLowerCase();

const getPdfText = async (file: File) => {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');

    pages.push(text);
  }

  return pages.join('\n').trim();
};

const getDocxText = async (file: File) => {
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value.trim();
};

export const getTranscriptText = async (file?: File) => {
  if (!file) return undefined;

  const extension = getFileExtension(file);

  if (extension === 'txt') return file.text();
  if (extension === 'pdf') return getPdfText(file);
  if (extension === 'docx') return getDocxText(file);

  return undefined;
};
