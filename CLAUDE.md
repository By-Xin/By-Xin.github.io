# By-Xin.github.io — project instructions

Astro 6 personal homepage on GitHub Pages. `README.md` is the full operating
manual (architecture, taxonomy, pipelines) — read it before structural work.
The notes site is a separate repo (`BYNotes`) with its own CLAUDE.md.

## Publishing an essay (the standard job)

1. Create `src/content/essays/<kebab-slug>.md`. Frontmatter: `title`,
   `date` (YYYY-MM-DD), `lang: zh | en` (default `zh`), optional
   `description` (shown in index + RSS), `draft: true` to hide.
2. When the user hands over a finished journal file: the body must stay
   **byte-identical** — `cp` the file, move a leading `# H1` into the
   frontmatter `title` (the layout renders titles), change nothing else,
   verify with `diff`. Never copyedit the user's prose, including
   unconventional English.
3. `npm run build` → confirm `dist/writing/<slug>/` → commit
   `Add essay: <title>` → push → verify the live URL returns 200.
   Index, homepage, RSS, and sitemap update automatically — do not
   hand-edit any index.

## Taxonomy (do not violate)

- The homepage never lists essay titles; section 03/writing stays a short
  intro pointing at `/writing/`.
- Essays → the content collection. Curated shelves → `collections` in
  `src/data/writing.ts`. Projects → `src/data/site.ts` with
  `group: "research" | "side"` (east-wind is `side`).
- Course/technical notes belong in the BYNotes repo instead.

## Hard invariants

- Zero third-party runtime requests: never add fonts.googleapis /
  fonts.gstatic / jsDelivr / cdnjs references. Fonts are self-hosted via
  `@fontsource`; Noto Serif SC is imported only on writing pages — keep it
  that way.
- npm scripts must remain PowerShell-safe (no `VAR=x` command prefixes).
- Moving a page's URL requires leaving a redirect stub at the old route
  (pattern: `src/pages/writing/east-wind.astro`).

## Deploy

Push to `main` auto-deploys. BYNotes sends `repository_dispatch:
bynotes-updated` after its own deploys (plus a weekly cron backstop), which
rebuilds this site's Recent Updates. If a Pages deploy fails with
"Deployment failed, try again later", rerun the failed job
(`gh run rerun <id> --failed`) — it is a transient GitHub-side error.
