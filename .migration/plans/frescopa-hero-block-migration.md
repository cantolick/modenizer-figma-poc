I'll start by understanding both the Figma design and the existing blocks available in this project. Let me gather that information.Let me explore the project structure and understand what blocks exist. The working directory referenced is `/workspace/current`.Now let me inspect the Figma design and the existing blocks in parallel.This is a **Hero** block — background image, eyebrow text, large headline, description paragraph, and two CTA buttons. The project already has a `hero` block, so I should aim to reuse it. Let me inspect the existing hero block and get the detailed design context.The existing `hero` block is minimal (empty JS, CSS supports image + h1 only). The Figma design is richer: eyebrow, large headline, description, and two buttons. Let me get the detailed design context and check global styles/content.The existing hero block is minimal. The Figma design needs eyebrow + headline + description + two buttons over a background image, using new fonts (Baskervville, Roboto) and Frescopa brand colors. Let me check fonts and content setup.Let me examine the current content page and check how blocks render, plus look at an existing block with JS for the decoration pattern.I have a clear picture now. This Figma frame is a **Hero** — a background image with an eyebrow label, a large serif headline, a description, and two CTA buttons (a filled "primary" and an outlined "secondary"). The project already has a `hero` block, so I'll reuse and extend it rather than build a new one.

Two decisions genuinely affect the plan, so let me confirm them before finalizing.# Hero Block Migration Plan (Frescopa 2026 Summit → EDS)

Migrate the Figma **Hero** frame (`node 17:10243`) into the project's existing `hero` block, reusing it rather than creating a new block. Both clarifying decisions are confirmed: **self-host Baskervville** for the headline, and **rich text + auto-styled buttons** for the content model (no structural model change needed).

> Execution requires **Execute mode** — this artifact is the plan only. Nothing below has been written yet.

## Design Summary (from Figma)

A full-bleed hero with a background photo (kitchen + espresso machine) and left-aligned content overlay:

| Element | Content | Type / Style |
|---|---|---|
| Eyebrow | "INTRODUCING THE ATELIER" | Roboto 20px, uppercase, letter-spacing ~0.6px, white |
| Headline | "Every Morning, Perfected. Learn Your Palette." | Baskervville (serif) 64px / 68px line-height, white, wrapped in quotes |
| Description | "The first agentic coffee system…" | Roboto 22px / 26px, white, ~548px max-width |
| CTA 1 (primary) | "Meet Your Coffee Agent" | Filled cream `#f4e9dc` bg, dark text `#58181d`, radius 24px |
| CTA 2 (secondary) | "Explore Taste Profiles" | Transparent bg, cream `#f4e9dc` border + cream text, radius 24px |

**Design tokens:** Baskervville (headings) + Roboto (body). Colors — cream `#f4e9dc`, text/dark maroon `#58181d`, brand `#a33532`, primary blue `#00647d`, secondary `#dc6e52`, white `#ffffff`.

## Approach — Reuse the Existing `hero` Block

The current `blocks/hero/` already has an `image` + `imageAlt` + `text` (richtext) model. That richtext area can hold the eyebrow paragraph, the H1 headline, the description paragraph, and two link buttons — **so no content-model change is required.** The work is: add the missing font, add decoration JS (currently empty), and rewrite the CSS to match the design.

**Authoring contract** (initial block structure the code decorates):
- Row 1 → background `<picture>` (image field)
- Row 2 → richtext: `<p>` eyebrow → `<h1>` headline → `<p>` description → link(s). A link wrapped in **bold** becomes the primary button; a link in *italic* becomes the secondary button (standard aem.js `decorateButtons` behavior).

## Checklist

### 1. Fonts
- [ ] Obtain an optimized, latin-subset **Baskervville Regular** `.woff2` (OFL-licensed) and place it in `fonts/baskervville-regular.woff2`; verify file size is small/optimized. If network fetch is unavailable, fall back to a `serif` stack and flag it to the user.
- [ ] Add an `@font-face` for `baskervville` (weight 400, `font-display: swap`, latin `unicode-range`) to `styles/fonts.css`, matching the existing Roboto entries' format.

### 2. Design tokens
- [ ] Add the Frescopa palette as scoped CSS custom properties (cream, dark/text, brand, primary, secondary) — scoped to the `hero` block to avoid polluting globals, unless reuse across future blocks argues for `:root`.
- [ ] Add a `--heading-font-family-serif` (or block-local var) referencing `baskervville, serif`.

### 3. `blocks/hero/hero.js` (currently empty)
- [ ] Implement `decorate(block)`: locate the text content container, mark the paragraph that precedes the `<h1>` as `hero-eyebrow` (uppercase eyebrow styling), and ensure the background `<picture>`/`<img>` is positioned as the full-bleed layer.
- [ ] Rely on aem.js auto button decoration (bold→primary, italic→secondary); only add a `hero-content` wrapper class if needed for layout. Handle gracefully when eyebrow, description, or a button is omitted by the author.

### 4. `blocks/hero/hero.css`
- [ ] Full-bleed background image (absolute `inset:0`, `object-fit:cover`, `z-index:-1`), min-height matching the design's proportions, responsive padding.
- [ ] Left-aligned content column with max-width (~600px), gap/spacing per design.
- [ ] Typography: eyebrow (Roboto, uppercase, letter-spacing), headline (Baskervville 64/68, white — override the global `h1` size within `.hero`), description (Roboto 22/26, white).
- [ ] Button styling scoped to `.hero`: primary = cream fill + dark text; secondary = transparent + cream border/text; both radius 24px, with hover/focus-visible states.
- [ ] Mobile-first with `min-width` breakpoints at 600/900/1200px; scale down the headline on small screens. Keep all selectors scoped to `.hero`.

### 5. Local test content (do NOT edit `content/`)
- [ ] Create `drafts/hero.html` (EDS block table markup) reproducing the Figma content, referencing an available background image (e.g. the existing `hero.png` in the content DAM, or a placeholder).
- [ ] Start the dev server with `npx -y @adobe/aem-cli up --no-open --forward-browser-logs --html-folder drafts` (background).

### 6. Verify (token-efficient Playwright workflow)
- [ ] Navigate to the rendered draft; use `browser_snapshot` to confirm DOM structure (eyebrow, h1, description, two buttons, background picture).
- [ ] Use `browser_evaluate` to check computed styles (font-family on headline = Baskervville, button colors, positioning).
- [ ] Compare against the Figma screenshot; iterate CSS as needed. Take **one** screenshot only for final pixel-level confirmation.

### 7. Model regen & lint
- [ ] If any `_hero.json` change was made, run `npm run build:json` to regenerate `component-definition.json` / `component-models.json` / `component-filters.json`.
- [ ] Run `npm run lint` (and `npm run lint:fix` for autofixes); resolve JS/CSS/model warnings.

### 8. Wrap up
- [ ] Summarize what changed (font added, hero decoration + styling) and confirm the preview matches the design.
- [ ] Note that promoting this into real page content (vs. the `drafts/` test file) should go through the project's bundled import script, and offer to do so.

## Risks / Notes
- **Font availability:** self-hosting requires fetching the Baskervville woff2; if the environment is offline the plan falls back to a `serif` stack (flagged, not silent).
- **Button distinction:** relies on authors using bold (primary) / italic (secondary) around links — the standard EDS convention; the CSS restyles them for this hero's cream-on-photo look.
- **No new block created** — maximal reuse of the existing `hero` block keeps the model stable for any pages already using it; the CSS/JS additions are backward-compatible with an image + heading-only hero.
