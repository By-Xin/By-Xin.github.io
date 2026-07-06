import { getCollection } from "astro:content";

export type WritingEntry = {
  title: string;
  href: string;
  date: Date;
  description: string;
};

// Curated shelves that are not essays; shown in the Collections section of
// the Writing index.
export const collections: WritingEntry[] = [
  {
    title: "STATDIY bookmarks",
    href: "/writing/statdiy/",
    date: new Date("2023-06-27"),
    description:
      "A living bookmark shelf for statistics, data science, mathematics, systems, and academic writing.",
  },
];

export async function getEssayEntries(): Promise<WritingEntry[]> {
  const essays = await getCollection("essays", ({ data }) => !data.draft);
  return essays
    .map((essay) => ({
      title: essay.data.title,
      href: `/writing/${essay.id}/`,
      date: essay.data.date,
      description: essay.data.description ?? "",
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
