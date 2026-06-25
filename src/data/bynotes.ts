import fallbackFeed from "./bynotes-recent-updates.json";
import { site } from "./site";

export type BYNotesUpdate = {
  date: string;
  displayDate?: string;
  title: string;
  href?: string;
  summary: string;
};

type BYNotesFeed = {
  updates: BYNotesUpdate[];
};

const updatesUrl =
  process.env.BYNOTES_UPDATES_URL ??
  "https://by-xin.github.io/BYNotes/recent-updates.json";
const homepageUrl =
  process.env.BYNOTES_HOMEPAGE_URL ??
  "https://by-xin.github.io/BYNotes/";

const fallbackUpdates = normalizeUpdates(fallbackFeed.updates);

export async function getBYNotesUpdates() {
  try {
    const feed = await fetchJson<BYNotesFeed>(updatesUrl);
    return normalizeUpdates(feed.updates);
  } catch {
    try {
      const homepage = await fetchText(homepageUrl);
      const updates = parseHomepageUpdates(homepage);
      return updates.length > 0 ? normalizeUpdates(updates) : fallbackUpdates;
    } catch {
      return fallbackUpdates;
    }
  }
}

async function fetchJson<T>(url: string) {
  const response = await fetchWithTimeout(url);
  return (await response.json()) as T;
}

async function fetchText(url: string) {
  const response = await fetchWithTimeout(url);
  return response.text();
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Unable to load ${url}: ${response.status}`);
    }

    return response;
  } finally {
    clearTimeout(timeout);
  }
}

function parseHomepageUpdates(html: string): BYNotesUpdate[] {
  const updatesSection = html.match(
    /<aside\b[^>]*class=["'][^"']*\bhome-updates\b[^"']*["'][^>]*>([\s\S]*?)<\/aside>/i,
  )?.[1];

  if (!updatesSection) {
    return [];
  }

  return Array.from(updatesSection.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi))
    .slice(0, 3)
    .flatMap((match) => {
      const item = match[1];
      const time = item.match(
        /<time\b[^>]*datetime=["']([^"']+)["'][^>]*>([\s\S]*?)<\/time>/i,
      );
      const heading = item.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i);
      const paragraph = item.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);

      if (!time || !heading || !paragraph) {
        return [];
      }

      const href = paragraph[1].match(/<a\b[^>]*href=["']([^"']+)["']/i)?.[1];

      return [
        {
          date: decodeHtml(time[1]),
          displayDate: htmlToText(time[2]),
          title: htmlToText(heading[1]),
          href: href ? decodeHtml(href) : undefined,
          summary: htmlToText(paragraph[1]),
        },
      ];
    });
}

function htmlToText(html: string) {
  return decodeHtml(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function decodeHtml(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(
      /&(amp|lt|gt|quot|apos);/g,
      (entity) =>
        ({
          "&amp;": "&",
          "&lt;": "<",
          "&gt;": ">",
          "&quot;": '"',
          "&apos;": "'",
        })[entity] ?? entity,
    );
}

function normalizeUpdates(updates: BYNotesUpdate[]) {
  return updates
    .filter((item) => item.date && item.title && item.summary)
    .slice(0, 3)
    .map((item) => ({
      ...item,
      href: item.href ? normalizeBYNotesHref(item.href) : site.notes,
    }));
}

function normalizeBYNotesHref(href: string) {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  if (href.startsWith("/")) {
    return href;
  }

  return `${site.notes}${href.replace(/^\.\//, "")}`;
}
