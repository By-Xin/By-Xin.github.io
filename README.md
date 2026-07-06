# By-Xin.github.io

Personal homepage for <https://by-xin.github.io>, built with Astro and
deployed to GitHub Pages. The separate BYNotes Quartz site (study notes)
lives in the [BYNotes repo](https://github.com/By-Xin/BYNotes) and publishes
to <https://by-xin.github.io/BYNotes/>.

This README is the operating manual for the site. Agent-facing rules live in
[CLAUDE.md](./CLAUDE.md); keep both in sync with reality.

## Architecture

- Astro 6 static site. Deployed by `.github/workflows/deploy.yml` on push to
  `main`, on a weekly cron, and on `repository_dispatch: bynotes-updated`
  (sent by the BYNotes repo at the end of each of its deploys).
- `src/data/site.ts` — identity, interests, and `projects` (each entry has
  `group: "research" | "side"`, which drives the grouped Projects page).
- `src/data/writing.ts` — `getEssayEntries()` (reads the essays collection)
  and `collections` (curated shelves such as STATDIY).
- `src/data/bynotes.ts` — homepage "Recent Updates": fetches
  `https://by-xin.github.io/BYNotes/recent-updates.json`, falls back to
  scraping the BYNotes homepage, then to the bundled
  `bynotes-recent-updates.json` snapshot.
- `src/content/essays/*.md` — the essays content collection
  (schema in `src/content.config.ts`).
- Layouts: `BaseLayout.astro` (site chrome; per-page `lang` prop),
  `EssayLayout.astro` (reading layout: CJK serif, 620px measure,
  line-height 2.05, justified for `lang: zh`).

## Content taxonomy

| Content | Lives in | Route |
| --- | --- | --- |
| Personal essays / journals | `src/content/essays/` collection | `/writing/<slug>/` |
| Curated shelves (e.g. STATDIY) | custom page + `collections` in `writing.ts` | `/writing/...` |
| Research projects & publications | `projects` in `site.ts`, `group: "research"` | `/projects/` |
| Non-academic side projects (e.g. east-wind) | `projects`, `group: "side"` | `/projects/...` |
| Technical / course notes | the BYNotes repo, not this one | `/BYNotes/...` |

Rules:

- The homepage never lists individual essay titles — section `03 / writing`
  is a short intro pointing at `/writing/`.
- `/writing/` shows essays year-grouped, then a "Collections · 收藏" section.

## Publishing an essay

1. Add `src/content/essays/<kebab-slug>.md` (the filename is the URL slug).
2. Frontmatter:

   ```yaml
   ---
   title: Essay Title        # required
   date: 2026-07-06          # required, YYYY-MM-DD
   lang: zh                  # zh (default) or en; drives typography + html lang
   description: One line.    # optional; shown in the index and RSS
   draft: true               # optional; hides the essay everywhere
   ---
   ```

3. If the piece arrives as a finished journal file, keep the body
   byte-identical: `cp` the file in, move a leading `# Title` into the
   frontmatter `title` (the layout renders the title), change nothing else,
   and verify with `diff`.
4. `npm run build`; check `dist/writing/<slug>/index.html` exists.
5. Commit (`Add essay: <title>`) and push. The `/writing/` index, homepage,
   RSS (`/writing/rss.xml`), and sitemap all update automatically — no
   hand-edited indexes.
6. Verify live: `https://by-xin.github.io/writing/<slug>/`.

## Fonts and external assets (hard policy)

Google Fonts is blocked in mainland China, so the published site makes
**zero third-party runtime requests**:

- Site fonts are self-hosted via `@fontsource` imports in
  `BaseLayout.astro` (Schibsted Grotesk 500/600/700, Source Sans 3
  400/500/600, IBM Plex Mono 400/500).
- Noto Serif SC 400/700 is imported per-page only where CJK serif is needed
  (`EssayLayout.astro`, the writing index, `/projects/east-wind/`), so CJK
  font slices never load site-wide.
- The `--sans` stack in `global.css` carries CJK fallbacks
  (PingFang SC / Hiragino Sans GB / Microsoft YaHei).
- Never reintroduce `fonts.googleapis.com`, `fonts.gstatic.com`, jsDelivr,
  or cdnjs references. `og.png` and the favicon are local files.

## Deploy and troubleshooting

- npm scripts must stay PowerShell-safe: no `VAR=value` command prefixes.
- GitHub Pages occasionally fails with "Deployment failed, try again later"
  (`error_count: N`). It is transient and on GitHub's side — rerun the
  failed job: `gh run rerun <run-id> --failed`.
- URL moves need a redirect stub; see `src/pages/writing/east-wind.astro`
  (its real page moved to `/projects/east-wind/`).
- The STATDIY bookmarks page has its own SOP:
  `.agents/statdiy-bookmarks-sop.md`.

## Development

```sh
npm install
npm run dev     # http://127.0.0.1:4321
npm run build   # outputs dist/
```
