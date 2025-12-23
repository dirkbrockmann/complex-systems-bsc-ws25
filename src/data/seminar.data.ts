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
  // "normalize" = validate + coerce types + clean a single JSON row into a SeminarItem
  // - ensures required fields exist
  // - converts values to strings
  // - trims and turns missing/empty values into undefined
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
console.log("Loaded seminar data:", raw.map(normalize));
// raw.map(normalize) = take the raw JSON array and run normalize(row) for each element,
// producing a new array of SeminarItem objects (same length, cleaned/validated).
export const seminar: SeminarItem[] = raw.map(normalize);