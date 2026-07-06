import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site } from "../../data/site";

export async function GET(context) {
  const essays = (await getCollection("essays", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return rss({
    title: `${site.name} — Writing`,
    description: "Personal, non-academic writing.",
    site: context.site,
    items: essays.map((essay) => ({
      title: essay.data.title,
      pubDate: essay.data.date,
      description: essay.data.description,
      link: `/writing/${essay.id}/`,
    })),
  });
}
