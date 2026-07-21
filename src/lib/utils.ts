import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as pdfjsLib from "pdfjs-dist"
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url"
import mammoth from "mammoth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

async function extractTextFromPdf(file: File) {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise

  const pageTexts: string[] = []
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
    pageTexts.push(pageText)
  }

  return pageTexts.join("\n\n").trim()
}

async function extractTextFromDocx(file: File){
  const buffer = await file.arrayBuffer()
  const { value } = await mammoth.extractRawText({ arrayBuffer: buffer })
  return value.trim()
}

async function extractTextFromTxt(file: File) {
  return (await file.text()).trim()
}

export async function extractTextFromFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "txt":
      return extractTextFromTxt(file)
    case "pdf":
      return extractTextFromPdf(file)
    case "docx":
      return extractTextFromDocx(file)
    default:
      throw new Error(`Unsupported file type: .${extension ?? "unknown"}`)
  }
}