import { getCollection } from "astro:content";

export type WritingEntry = {
  title: string;
  href: string;
  date: Date;
  description: string;
};

// Interactive/custom pages that live outside the essays collection but belong
// in the Writing index.
export const specialPages: WritingEntry[] = [
  {
    title: "东风何处是人间 / Where Does the East Wind Find the Earth?",
    href: "/writing/east-wind/",
    date: new Date("2026-05-24"),
    description:
      "以《东风何处是人间》为灵感起点，整理《全宋词》的词频、词群与作品距离。",
  },
  {
    title: "STATDIY bookmarks",
    href: "/writing/statdiy/",
    date: new Date("2023-06-27"),
    description:
      "A living bookmark shelf for statistics, data science, mathematics, systems, and academic writing.",
  },
];

export async function getWritingEntries(): Promise<WritingEntry[]> {
  const essays = await getCollection("essays", ({ data }) => !data.draft);
  const entries: WritingEntry[] = [
    ...essays.map((essay) => ({
      title: essay.data.title,
      href: `/writing/${essay.id}/`,
      date: essay.data.date,
      description: essay.data.description ?? "",
    })),
    ...specialPages,
  ];
  return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
