# CLAUDE.md — gilbert-lee-tech/profile

This file provides context for AI coding tools (Claude Code, Cursor, Copilot, etc.) working in this repository.

---

## Project Overview

A personal professional profile/résumé site built on **Adobe Edge Delivery Services (EDS)**, based on the [AEM boilerplate](https://github.com/adobe/aem-boilerplate/).

**Goals:**
- Professional web presence with SEO-friendly structured data
- Demonstrate practical EDS implementation skills
- Apply semantic HTML, CSS, and vanilla JavaScript within the EDS performance model

**Live URLs:**
| Environment | URL |
|---|---|
| Preview | https://main--profile--gilbert-lee-tech.aem.page/ |
| Production | https://main--profile--gilbert-lee-tech.aem.live/ |

---

## Tech Stack

- **Platform:** Adobe Edge Delivery Services (EDS / AEM Franklin)
- **Languages:** Vanilla JavaScript (ES modules), CSS, HTML
- **Linting:** ESLint (`.eslintrc.js`), Stylelint (`.stylelintrc.json`)
- **Local dev server:** AEM CLI (`aem up` → http://localhost:3000)
- **No build step** — EDS serves files directly; no bundler (webpack/vite/etc.)

---

## Repository Structure

```
/
├── blocks/                  # EDS blocks (one folder per block)
│   ├── cards/               # Default boilerplate cards block
│   ├── google-rich-results/ # Custom: emits ld+json structured data
│   ├── company-position-period/ # Custom: single-line work history layout
│   ├── three-cards/         # Custom: 3-column responsive card grid
│   └── left-right-card/     # Custom: horizontal 30/70 media+content card
├── drafts/                  # Local-only static HTML test pages (gitignored)
├── fonts/                   # Web fonts
├── icons/                   # SVG icons
├── scripts/
│   ├── aem.js               # Core EDS library — NEVER MODIFY THIS FILE
│   ├── scripts.js           # Global JS utilities, main page decoration entry point
│   └── delayed.js           # Delayed functionality (martech, etc.)
├── styles/                  # Global CSS (styles.css, lazy-styles.css, fonts.css)
├── head.html                # <head> additions injected on every page
├── 404.html                 # Custom 404 page
├── CLAUDE.md                # This file
└── AGENTS.md                # Agent-specific instructions
```

---

## Block Conventions

Every block lives in `/blocks/<block-name>/` and contains exactly two files:

```
blocks/
└── block-name/
    ├── block-name.js    # ES module with default export: decorate(block)
    └── block-name.css   # Scoped styles using .block-name as root selector
```

### Block JS pattern

```js
export default function decorate(block) {
  // block is the DOM element with class matching the block name
  // [...block.children] gives you the rows
  // [...row.children] gives you the columns within each row
}
```

### Block CSS pattern

- Always scope rules under `.block-name { ... }` — never use global selectors
- Use CSS custom properties from the global theme where possible:
  - `var(--background-color)` — page background
  - `var(--text-color)` — body text
  - `var(--link-color)` — anchor colour
  - `var(--font-family-body)` — body font
  - `var(--font-family-heading)` — heading font
- Include a `@media (max-width: 768px)` breakpoint for mobile stacking

### Image handling

Always use `createOptimizedPicture` from `scripts/aem.js` for images:

```js
import { createOptimizedPicture } from '../../scripts/aem.js';
```

### Graceful field handling

Authors may omit or add optional fields to a block. Code must never assume all fields are present — always check before accessing child elements.

### Testing without authored content

If no CMS page exists yet, create a static file under `drafts/` and start the dev server with:

```bash
aem up --html-folder drafts
```

Save files as `drafts/my-page.html` or `drafts/my-page.plain.html` following AEM markup conventions.

### Inspecting delivered HTML

Use `curl` to see what the backend returns before writing decoration code:

```bash
curl http://localhost:3000/path/to/page
curl http://localhost:3000/path/to/page.plain.html
```

---

## Key Concepts

### Auto-Blocking

Auto-blocking creates blocks that aren't explicitly authored, based on content patterns. See `buildAutoBlocks` in `scripts/scripts.js`.

### Three-Phase Page Loading

Pages load progressively to maximise performance:

| Phase | What happens |
|---|---|
| **Eager** | Decorate page structure, load first section (targets LCP) |
| **Lazy** | Load remaining sections, header, footer |
| **Delayed** | Load martech and anything safe to defer (in `delayed.js`) |

Avoid adding blocking work to Eager; prefer Lazy or Delayed where possible.

---

## Existing Custom Blocks

| Block | Folder | Description |
|---|---|---|
| `google-rich-results` | `blocks/google-rich-results/` | Reads key–value rows and emits `<script type="application/ld+json">` for Schema.org Person. Repeated keys become arrays. Boolean/number coercion applied. |
| `company-position-period` | `blocks/company-position-period/` | Three rows (company, position, period) rendered inline. Company links open in `_blank` with `rel="noopener noreferrer"`. Period gets a slug-based fragment `id` for deep linking. |
| `three-cards` | `blocks/three-cards/` | Cards content model (image + body per row), max 3 per row on wide viewports, centred short last rows. Uses `createOptimizedPicture`, IntersectionObserver animation, `prefers-reduced-motion` support. |
| `left-right-card` | `blocks/left-right-card/` | Single card, horizontal layout. Media col = 30%, content col = 70%. Rounded corners, box shadow. Add `right` class to flip image side. Stacks vertically on mobile. |

---

## Development Commands

```bash
# Install dependencies
npm install

# Start local dev server (proxies to AEM preview)
aem up
# → http://localhost:3000

# Lint JS and CSS
npm run lint

# Auto-fix lint issues
npm run lint:fix
```

---

## Coding Standards

- **ES modules only** — always use `import`/`export`, never CommonJS `require()`
- **No frameworks** — vanilla JS only; no React, Vue, jQuery etc.
- **No bundler** — do not introduce webpack, vite, rollup, or similar tools
- **Semantic HTML** — use correct heading hierarchy, landmark elements, `<ul>/<li>` for lists
- **Accessibility** — add `aria-label` where link/button text is ambiguous; respect `prefers-reduced-motion`
- **Performance** — avoid render-blocking resources; prefer `IntersectionObserver` for lazy effects
- **CSS** — scoped to block root class; use CSS custom properties; mobile-first or explicit breakpoints

---

## Adding a New Block

1. Create `/blocks/<block-name>/` folder
2. Add `<block-name>.js` with `export default function decorate(block) { ... }`
3. Add `<block-name>.css` scoped to `.block-name { ... }`
4. Author the block in the Google Doc/SharePoint table using the block name as the table header
5. Push to `main` — AEM Code Sync deploys automatically via the GitHub app

### Block naming rules
- Lowercase, hyphen-separated (kebab-case): `my-block`, not `MyBlock` or `my_block`
- Match folder name, file names, and CSS root class exactly

---

## Git Workflow

Always follow this branching workflow when working on a GitHub issue:

1. **Fetch the issue details** to understand the scope of work
2. **Create a branch** named after the issue — format: `issue-{number}-{short-description-in-kebab-case}`
   - Example: issue #12 titled "Add testimonial block" → `issue-12-add-testimonial-block`
   - Keep the description concise (3–5 words max), lowercase, hyphens only
3. **Push the branch to remote** immediately so it exists on origin before any work begins
4. **Do all work on that branch** — never modify files on `main`
5. **Run `npm run lint`** before committing — if it fails, fix all errors before proceeding; do NOT commit with lint errors
6. **Stop after completing the work** — do NOT commit or push; leave that to the developer
7. **Create a PR** using `gh pr create` with the following description format:

```
Fix #{issue-number}

Test URLs:
- Before: https://main--{repo}--{owner}.aem.live/
- After: https://{branch}--{repo}--{owner}.aem.live/
```

```bash
# Example for issue #12 "Add testimonial block"
git fetch origin
git checkout -b issue-12-add-testimonial-block
git push -u origin issue-12-add-testimonial-block
# ... do the work ...
npm run lint          # must pass before committing
gh pr create --title "Add testimonial block" --body "Fix #12

Test URLs:
- Before: https://main--profile--gilbert-lee-tech.aem.live/
- After: https://issue-12-add-testimonial-block--profile--gilbert-lee-tech.aem.live/"
```

### Branch naming rules
- Always prefix with `issue-{number}-`
- Description in kebab-case, derived from the issue title
- Lowercase letters and hyphens only — no uppercase, no spaces, no underscores, no slashes

---

## Linting Rules (key highlights)

- ESLint: AirBnb-style, no unused vars, prefer `const`, no `var`
- Stylelint: standard config, no duplicate selectors, consistent property order
- Run `npm run lint` before committing — CI checks will fail on lint errors

---

## Deployment

### Environment URLs

| Environment | URL pattern |
|---|---|
| Production preview | `https://main--profile--gilbert-lee-tech.aem.page/` |
| Production live | `https://main--profile--gilbert-lee-tech.aem.live/` |
| Feature branch preview | `https://{branch}--profile--gilbert-lee-tech.aem.page/` |

### Publishing Process

1. Push changes to a feature branch — AEM Code Sync makes them available on the feature preview URL immediately
2. Run a [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) check against the feature preview URL. **Target score: 100**. Fix any issues before opening a PR
3. Open a pull request to `main`
   - **The PR description must include a link** to `https://{branch}--profile--gilbert-lee-tech.aem.page/{path}` demonstrating the change — **PRs without this link will be rejected**
   - If no suitable page exists, create a draft HTML file and ask the user to copy it to a CMS page
4. Run `gh pr checks` to verify code sync, linting, and performance CI checks pass
5. A human reviewer inspects the URL and merges the PR
6. AEM Code Sync deploys `main` to production automatically

---

## Security Considerations

- Never commit sensitive information (API keys, passwords, tokens)
- All code is client-side and publicly served — treat it accordingly
- Use `.hlxignore` to prevent files from being served (same format as `.gitignore`)
- Regularly update dependencies

---

## Troubleshooting

### Documentation search

```bash
# Full-text search across AEM EDS docs
curl -s https://www.aem.live/docpages-index.json \
  | jq -r '.data[] | select(.content | test("KEYWORD"; "i")) | "\(.path): \(.title)"'
```

### Useful references

- [AEM EDS docs](https://www.aem.live/docs/) — search with `site:www.aem.live`
- [David's Model](https://www.aem.live/docs/davidsmodel) — content/code separation principles
- [Keeping it 100](https://www.aem.live/developer/keeping-it-100) — performance best practices
- [AI coding agents tips](https://www.aem.live/developer/ai-coding-agents)

---

## Key References

- [AEM EDS Developer Tutorial](https://www.aem.live/developer/tutorial)
- [Anatomy of an EDS Project](https://www.aem.live/developer/anatomy-of-a-project)
- [Markup, Sections, Blocks & Auto-blocking](https://www.aem.live/developer/markup-sections-blocks)
- [Web Performance Guide](https://www.aem.live/developer/keeping-it-100)