import raw from './seminar.json';

// Minimal inline validator without external deps to keep it simple
// If you prefer zod, we can switch, but this avoids adding packages.

export type SeminarItem = {
  explorable: string;
  topic: string;
  link?: string;
  student?: string;
  date?: string;
  presentation?: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function normalize(row: any): SeminarItem {
  if (!isRecord(row)) throw new Error('Invalid seminar row: not an object');
  const explorable = String(row.explorable ?? '');
  const topic = String(row.topic ?? '');
  if (!explorable || !topic) {
    throw new Error('Invalid seminar row: missing required fields explorable/topic');
  }
  const link = row.link ? String(row.link) : undefined;
  const student = row.student ? String(row.student) : undefined;
  const date = row.date ? String(row.date) : undefined;
  const presentation = row.presentation ? String(row.presentation) : undefined;
  return { explorable, topic, link, student, date, presentation };
}

if (!Array.isArray(raw)) {
  throw new Error('seminar.json must export an array');
}

export const seminar: SeminarItem[] = raw.map(normalize);