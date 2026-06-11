# jvblog

Minimalist blog + worldbuilding wiki, built with [Astro](https://astro.build).
Posts and lore are plain markdown with Obsidian-style `[[wiki-links]]`.

## Commands

| Command           | Action                                   |
| ----------------- | ---------------------------------------- |
| `npm install`     | Install dependencies                     |
| `npm run dev`     | Dev server at `localhost:4321`           |
| `npm run build`   | Production build to `./dist/`            |
| `npm run preview` | Preview the production build locally     |

## Writing

The **`content/` folder is an Obsidian vault** — open it directly in Obsidian
and write there. Publishing = commit + push (Vercel/Netlify rebuilds the site).

```
content/
├── posts/                  ← blog posts
└── worlds/
    └── <world-name>/
        ├── index.md        ← world landing page (type: world)
        ├── characters/     ← any subfolders you like
        ├── locations/
        └── lore/
```

### Frontmatter cheatsheet

Post (`content/posts/My Post.md` → `/posts/my-post`):

```yaml
---
title: My Post          # should match the filename (wiki-link target)
description: Optional one-liner.
date: 2026-06-10
tags: [worldbuilding]
draft: false            # drafts are visible in dev, excluded from builds
---
```

World page (`content/worlds/eldoria/characters/Aria Voss.md`):

```yaml
---
title: Aria Voss
description: Optional one-liner (shown on the world index).
type: character         # world | character | location | lore | page
---
```

Each world folder needs an `index.md` with `type: world` — that's its landing
page, and its pages are grouped there by `type`.

### Wiki links

- `[[Aria Voss]]` links to that page from anywhere (post or world page).
- `[[Aria Voss|the Captain]]` renders custom link text.
- Broken links render muted with a dashed underline so they're easy to spot.

**Conventions & gotchas:**

1. `title` should equal the filename — the filename is what `[[links]]` target.
2. Page names must be unique site-wide for bare `[[Name]]` links. Same name in
   two worlds? Disambiguate: `[[eldoria/characters/Aria Voss]]`.
3. The link map is built when the dev server starts — **after creating a brand
   new page, restart `npm run dev`** for links *to* it to resolve.
4. Avoid two filenames differing only by letter case (Windows collision).

### Link check

After `npm run build`, unresolved wiki links carry `class="internal new"`:

```powershell
Get-ChildItem dist -Recurse -Filter *.html | Select-String 'class="internal new"'
```

Zero hits = no broken links.

## Deploying

1. Set `site` in `astro.config.ts` to your real domain.
2. Push the repo to GitHub and import it in [Vercel](https://vercel.com) or
   [Netlify](https://netlify.com) — both auto-detect Astro; no config needed.
