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
      .map((item: unknown) => {
        if (typeof item === "object" && item !== null && "str" in item) {
          return String((item as { str: unknown }).str)
        }

        return ""
      })
      .join(" ")
    pageTexts.push(pageText)
  }

  return pageTexts.join("\n\n").trim()
}

async function extractTextFromDocx(file: File) {
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

type GuessedAttendee = { firstName: string; lastName: string; email: string }

function namesFromAttendeesSection(lines: string[]): string[] {
  const headingIndex = lines.findIndex((line) => line.trim().toLowerCase() === "attendees")
  if (headingIndex === -1) return []

  const names: string[] = []
  for (let i = headingIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line === "") {
      if (names.length > 0) break
      continue
    }
    if (/^transcript$/i.test(line)) break
    const cleaned = line.replace(/^[•\-*]\s*/, "").trim()
    if (cleaned) names.push(cleaned)
    if (names.length >= 50) break
  }
  return names
}

function namesFromSpeakerLabels(lines: string[]): string[] {
  const speakerLine =
    /^([A-Z][\p{L}'.-]*(?:\s+[A-Z][\p{L}'.-]*){0,3})\s*\(\d{1,2}:\d{2}(?::\d{2})?\)$/u
  const seen = new Set<string>()
  const names: string[] = []

  for (const rawLine of lines) {
    const match = speakerLine.exec(rawLine.trim())
    if (!match) continue
    const name = match[1].trim()
    if (!seen.has(name)) {
      seen.add(name)
      names.push(name)
    }
  }

  // Bail if fewer than 2 distinct matches - not confident enough this is a Meet-style transcript.
  return names.length >= 2 ? names : []
}

export function guessAttendeesFromTranscript(text: string): GuessedAttendee[] {
  const lines = text.split(/\r?\n/)
  const fromAttendeesSection = namesFromAttendeesSection(lines)
  const names = fromAttendeesSection.length > 0 ? fromAttendeesSection : namesFromSpeakerLabels(lines)

  return names.slice(0, 30).map((name) => {
    const parts = name.split(/\s+/)
    const lastName = parts.length > 1 ? parts.pop()! : ""
    return { firstName: parts.join(" "), lastName, email: "" }
  })
}

export function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
