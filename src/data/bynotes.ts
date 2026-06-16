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

const fallbackUpdates = normalizeUpdates(fallbackFeed.updates);

export async function getBYNotesUpdates() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(updatesUrl, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Unable to load BYNotes updates: ${response.status}`);
    }

    const feed = (await response.json()) as BYNotesFeed;
    return normalizeUpdates(feed.updates);
  } catch {
    return fallbackUpdates;
  } finally {
    clearTimeout(timeout);
  }
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
