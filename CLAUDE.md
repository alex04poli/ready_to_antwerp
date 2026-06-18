# Ready to Antwerp? — project guide

A small static website for a student design project: a real Visit Antwerp client brief,
built by a CMD student team (Rotterdam UAS). It is split into **four hand-editable pages**,
one per project phase:

| Phase | File | Status |
|-------|------|--------|
| CONNECT | `index.html` (home) | complete |
| CONCEPT | `concept.html` | complete |
| CREATE | `create.html` | complete |
| BIBLIOGRAPHY | `bibliography.html` | complete |

This is **not** a build-tooling project. The pages are plain HTML that share one stylesheet
(`assets/style.css`) and one script (`assets/app.js`). No framework, no bundler, no npm — do
not introduce one unless explicitly asked.

## How to run / preview
- Open `index.html` in a browser (double-click), **or** serve the folder. The pages link to
  each other and to `assets/`, so keep the folder intact.
- Publish for free: drag the whole folder onto https://app.netlify.com/drop

## File structure
```
ready_to_antwerp/
├── index.html          ← CONNECT page (home): hero + every Connect section
├── concept.html        ← CONCEPT page  (process, gigamapping, principles, journey…)
├── create.html         ← CREATE page   (stub sections)
├── bibliography.html   ← BIBLIOGRAPHY page (grouped APA-7 list)
├── assets/
│   ├── style.css       ← all CSS for every page (design tokens live in :root here)
│   └── app.js          ← all JS for every page (sidebar, accordion, reveal, swiper)
├── CLAUDE.md           ← this guide
├── fonts/              ← the two project fonts (do not rename)
│   ├── Pixelated-Regular.otf
│   └── Decorative-serif-*.otf   (Ultralight / Regular / Ultrabold + italics)
└── img/                ← all artwork (most files have a transparent background)
    ├── logo.png                          "ready to Antwerp?" lockup (hero + sub-page headers)
    ├── illustrations/
    │   ├── group_color_1.png / _2.png    hero illustrations (left / right)
    │   ├── puzzle.png                     Stakeholders illustration
    │   ├── high_five.png                  Research illustration
    │   ├── click.png                      "click here" hint by the A1 accordion row
    │   └── mascotte/chocolate_color.png   peeks over the Briefing/Problem bubble join
    ├── pills_stakeholders_TA/             stakeholder + target-audience pills (PNGs)
    │   └── {City_of_Antwerp,Local_business,Friend_groups,Initiative_taker}.png
    ├── team/  +  team/bursts/             cut-out headshots + coloured pixel bursts behind them
    ├── themes/button_{culture,drinkneat,fashion,outdoors,nightlife,sports}.png
    ├── Research_2.0/                      artwork for the Research 2.0 section
    ├── Gamification/{kahoot,spotify_wrapped,Duolingo}.png   app shots for the Gamification cards
    └── chat/current_chat.png / desired_chat.png            the two "goal" phone screenshots
```

## Design tokens (CSS variables in `:root`, in `assets/style.css`)
- Palette: black `#000`, white `#fff`, orange `#FF7D3C`, blue `#5596FF`,
  pink `#FF82DC`, dark-green `#00D77D`, lime `#D2FF4B`, bone `#D2D2BE`.
- Page background: warm ivory `#FEFFF1`. Body text: `#141410`.
- Fonts: `'Pixel'` (display accents) and `'Deco'` (everything else; weight 200 / 400 / 800).

## Conventions (please keep these)
- **Copy lives inline in the page HTML**, in page order, under banner comments like
  `<!-- ==================== MEET TEAM ==================== -->`. Non-coders edit the text
  between the tags only. Don't move copy into the JS.
- **Shared CSS + JS.** Styling is all in `assets/style.css`; behaviour is all in
  `assets/app.js`. The same `<nav class="toc">` sidebar and mobile-menu button are copied into
  every page — if you change the nav, change it in all four pages.
- **Multi-page navigation.** Each page sets `<body data-page="connect|concept|create|biblio">`;
  `app.js` uses that to keep the matching sidebar group expanded. Sidebar **group** links point
  to the page files; **sub-links** are in-page `#anchors` (they only ever show for the current
  page, whose ids exist). Each phase page ends with a "go to …" transition link to the next.
- Section anchors use kebab-case ids (`#meet-team`, `#research-2`, …). Adding a section = add
  `<section id="…" data-section data-group="…">` plus a matching `<li><a href="#…">` in the
  `.toc` nav of every page.
- **Recreated in CSS (no image files):** background glows, the speech bubbles, the lime
  field-research cards, the orange insight cards, the assumptions accordion, the name pills,
  and all arrows (inline SVG). The stakeholder/target pills and the theme cards *are* image
  files — see `img/`.
- **Drop shadows:** most cards use the hard, no-blur `--shadow` / `--shadow-sm` variables. The
  Briefing/Problem pills and the chat phones layer a *coloured* hard shadow with a black outline
  (two stacked `box-shadow`s) — same flat style, just tinted.
- Accessibility floor: visible keyboard focus, `prefers-reduced-motion` respected, accordion
  headers are real `<button>`s. Keep it.

## Status / what's left
- [x] CONNECT (`index.html`) — complete.
- [x] CONCEPT (`concept.html`) — complete: merging concepts, HMW question, gigamapping,
      design principles, brainstorming, 5 W-questions, user journey (swipeable phase-card
      overlay), collaborations.
- [x] CREATE (`create.html`) — complete: visual style, prototype test, feedback & design
      improvements, social media campaign, tangibles, next steps.
- [x] BIBLIOGRAPHY (`bibliography.html`) — complete: grouped APA-7 reference list.

## Known rough edges to refine
- The chocolate mascot peeks over the join of the Briefing/Problem pills and overlaps the last
  line of Briefing text slightly (intentional) — nudge `.choco` offsets to taste.
- The stakeholder pill cluster is positioned by eye (`.sp-friend` / `.sp-initiative` /
  `.sp-local` / `.sp-city` — each a `top/left/right` + `rotate`); tweak to match the mockup.
- Body paragraphs are justified on desktop (left on mobile).
- Team headshots are low-resolution (~100–180px); they go soft if enlarged.
