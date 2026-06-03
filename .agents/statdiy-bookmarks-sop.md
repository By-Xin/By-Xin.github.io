# STATDIY Bookmarks SOP

This handoff is for future agents maintaining the `STATDIY bookmarks` page.
Use Chinese when talking with the user, but keep code, filenames, and commit
messages in English unless the user asks otherwise.

## Scope

The page lives at:

- Source: `src/pages/writing/statdiy.astro`
- Public URL: `https://by-xin.github.io/writing/statdiy/`

It is a living bookmark shelf, not an archive. The user adds useful books,
courses, articles, PDFs, websites, and videos over time. Keep changes focused on
this page unless the request explicitly asks for broader site changes.

## Current Page Model

`statdiy.astro` stores resources in a `sections: ResourceSection[]` array.

Each resource should use this shape:

```ts
{
  kind: "Course",
  title: "Readable resource title",
  href: "https://...",
  meta: "Author or institution, term/date if useful",
  note: "One concise sentence explaining what this is useful for.",
  rating: 3,
}
```

Required fields:

- `kind`
- `title`
- `note`

Optional fields:

- `href`: add this whenever a stable public link exists.
- `meta`: author, institution, publisher, platform, term, or edition.
- `rating`: only use `1 | 2 | 3`; the user has used `3` as the highest rating.

The page groups resources by `kind` automatically through `resourceTypeGroups`.
Do not manually reorder the rendered type groups unless the user asks.

Current type group behavior:

- `Book` -> `Books`
- `Paper`, `Article`, `PDF` -> `Papers, Articles & PDFs`
- `Course` -> `Courses`
- `Notes`, `Reference` -> `Notes & References`
- `Website` -> `Websites`
- `Video`, `Channel` -> `Videos & Channels`

Each type group is rendered as a native `<details>` / `<summary>` toggle and is
open by default.

## Section Placement Rules

Prefer the section that best matches the resource's main learning use, not just
the words in the title.

Current major sections:

- `Optimization & Numerical Computing`: optimization, numerical optimization,
  scientific computing, gradient methods, convex optimization, large-scale
  optimization, numerical/scientific computing courses.
- `Statistics & Probability`: probability, mathematical statistics,
  computational statistics when the course is primarily statistical computing.
- `Machine Learning & Data Mining`: statistical learning, data mining, learning
  theory, applied ML, signal-processing resources used for ML.
- `Deep Learning, NLP & RL`: deep learning, computer vision, NLP, LLMs,
  reinforcement learning, AI safety around LLMs.
- `Mathematics`: real analysis, mathematical analysis, numerical analysis as a
  mathematics text, measure theory.
- `Computer Science & Systems`: C, Linux, computing systems, low-level systems.
- `Academic Writing`: academic/scientific writing resources.
- `Readings`: long-form conceptual articles, especially statistics/data science
  essays from the Sufe wiki home page.

Recent placement decisions to preserve:

- MIT `Introduction to Computational Thinking` belongs in
  `Optimization & Numerical Computing`, because the user wanted the section to
  include numerical computing.
- Berkeley `Understanding Large Language Models: Foundations and Safety`
  belongs in `Deep Learning, NLP & RL`.
- BFGS, NAG, gradient convergence, UCLA ECE236C, Princeton ELE522, and CMU
  Convex Optimization belong in `Optimization & Numerical Computing`.

## Adding A New Resource

1. Open or search the URL.
   - Use browsing/web search whenever the user gives a URL or asks to register a
     resource. The resource details are current, and titles/course staff can
     change.
   - Prefer source pages over search snippets.
   - If the page is inaccessible, use the visible title and a conservative note.
2. Identify:
   - actual title
   - `kind`
   - best section
   - author/institution/platform for `meta`
   - one-sentence `note`
3. Insert the object into the section's `resources` array.
   - Put courses near other courses when editing the source, but the rendered
     page will group by type anyway.
   - Keep the note short and practical. Good style:
     `Statistical computing toolbox: numerical linear algebra, optimization, simulation, and sampling.`
4. Make sure every resource still has a `note`.
5. Run a build.
6. Commit and push if the user expects the live site/GitHub to update.

## Note Style

The user likes concise, descriptive notes. Use one sentence, usually in English.

Good examples:

- `Graduate optimization course for data science covering proximal, mirror, accelerated, ADMM, quasi-Newton, stochastic, distributed, and nonconvex methods.`
- `LLM foundations and safety course covering interpretability, scaling laws, adversarial robustness, alignment, governance, privacy, watermarking, and evaluation.`
- `Interactive Julia and Pluto course linking programming abstractions, mathematics, data science, stochastic simulation, optimization, climate modeling, and open-source workflows.`

Avoid:

- marketing language
- long summaries
- vague notes like `Good resource for machine learning`
- claims not visible from the source

## Book Links

If a `Book` remains on the page, try to give it a stable link.

Preference order:

1. official online book or author page
2. publisher page
3. stable institutional/bookstore page
4. Google Books or a stable catalog page when no better public page exists

Do not link to questionable pirated PDFs. One legacy GitHub bookshelf PDF exists
for `Advanced Probability Theory`; leave it alone unless the user asks.

## Known User Preferences

- The page should be useful as a bookmark shelf, not a dead archive.
- Remove low-value items when the user asks; do not defend the old list.
- Keep major subject sections, but resources inside each section should be
  grouped by type.
- Type group headings should be toggles and slightly larger than ordinary list
  text.
- The user may ask in Chinese; respond in Chinese.
- When changing the site, build, commit, and push unless the user says not to.
- Do not touch the untracked `spaces/` directory.

## Commands

Because this workspace is on a WSL UNC path, PowerShell and `cmd` can mishandle
the project path and POSIX-style npm scripts. Prefer running the build through
WSL:

```powershell
C:\Windows\System32\wsl.exe -d Ubuntu-24.04 --cd /home/byxin/File/By-Xin.github.io -- bash -lc "npm run build"
```

Useful checks:

```powershell
git status -sb
Select-String -LiteralPath 'src\pages\writing\statdiy.astro' -Pattern 'Some Title'
```

Check resource/note counts:

```powershell
$kindCount = (Select-String -LiteralPath 'src\pages\writing\statdiy.astro' -Pattern 'kind: "').Count
$noteCount = (Select-String -LiteralPath 'src\pages\writing\statdiy.astro' -Pattern 'note: "').Count
"kind_count=$kindCount note_count=$noteCount"
```

Check remaining `Book` entries have links:

```powershell
$content = Get-Content -LiteralPath 'src\pages\writing\statdiy.astro' -Raw
$books = [regex]::Matches($content, '(?s)\{\s*kind:\s*"Book",.*?\n\s*\}')
$missing = @()
foreach ($book in $books) {
  $block = $book.Value
  $title = [regex]::Match($block, 'title:\s*"([^"]+)"').Groups[1].Value
  if ($block -notmatch 'href:\s*"') { $missing += $title }
}
"book_count=$($books.Count) missing_book_links=$($missing.Count)"
$missing
```

Commit flow:

```powershell
git add src/pages/writing/statdiy.astro
git commit -m "Add concise English commit message"
git push origin main
```

For this SOP file:

```powershell
git add .agents/statdiy-bookmarks-sop.md
git commit -m "Add STATDIY bookmarks maintenance SOP"
git push origin main
```

## Browser And Search Notes

The Browser plugin was authorized by the user in this conversation, but browser
startup failed in this environment with a Windows sandbox error. If it works in
a future session, use it for visible page inspection. If it fails, ordinary web
search/open is acceptable.

When using sources:

- Prefer the resource's own page.
- For courses, read the course title, instructor, term, and syllabus/topic list.
- For articles, confirm the title and core topic.
- For books, prefer official/publisher/author links and verify with a quick
  request when practical.

## Verification Checklist

Before final response:

- `git diff -- src/pages/writing/statdiy.astro` or relevant file checked.
- Every resource has `note`.
- Any remaining `Book` has `href`, unless intentionally left unlinked.
- `npm run build` passes through WSL.
- `git status -sb` shows only expected tracked changes before commit, and after
  push only the pre-existing untracked `spaces/` remains.
- Final answer in Chinese says what changed, what verification ran, commit hash,
  and whether `spaces/` was untouched.

