// Utilities for working with slide entry IDs produced by the "slides" content collection.
//
// What this is used for:
// - In getStaticPaths of:
//   - src/pages/lectures/[lecture]/slides/[slide].astro → to derive route params { lecture, slide }
//   - src/pages/lectures/[lecture]/slides/index.astro → to group slides by lecture and pick the first slide
// - When computing titles or building URLs from an entry.id elsewhere.
//
// Background:
// - With the "slides" collection (glob base: ./src/content/lectures, pattern: "**/slides/*.{md,mdx}"),
//   each entry.id is the content path without extension, e.g. "lecture-1/slides/slide-1".
//   This module parses that into { lecture: "lecture-1", slide: "slide-1" }.


// Parsed parts of a slide id like "lecture-1/slides/slide-1"
export type SlideIdParts = {
  lecture: string; // e.g., "lecture-1"
  slide: string;   // e.g., "slide-1"
};

// Precompiled matcher for ids shaped as "<lecture>/slides/<slide>"
const SLIDE_ID_RE = /^([^/]+)\/slides\/([^/]+)$/;

/**
 * Parse a slide entry.id into its components.
 *
 * Expected format (relative to slides collection base):
 *   "<lecture>/slides/<slide>"
 *
 * Examples:
 *   "lecture-1/slides/slide-1" -> { lecture: "lecture-1", slide: "slide-1" }
 *
 * Typical usage in getStaticPaths:
 *   const slides = await getCollection('slides');
 *   return slides.map((entry) => {
 *     const { lecture, slide } = parseSlideId(entry.id);
 *     return { params: { lecture, slide }, props: { entry } };
 *   });
 *
 * Throws:
 *   Error if id doesn’t match the expected pattern.
 */
export function parseSlideId(id: string): SlideIdParts {
  const match = SLIDE_ID_RE.exec(id);
  if (!match) {
    throw new Error(`Unexpected slide id: ${id}. Expected "<lecture>/slides/<slide>".`);
  }
  return { lecture: match[1], slide: match[2] };
}