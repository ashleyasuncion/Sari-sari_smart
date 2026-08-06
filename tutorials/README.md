# Sari-Sari Smart — Tutorial Documentation (Web App)

This directory documents every tutorial in the web application (`git/Sari-sari_smart/`),
step by step. It serves as:

- A reference of the **current implementation** (single source of truth: `app.js` config)
- A **QA testing checklist** for verifying tutorial behavior
- A guide for **future development / redesign**
- The **expected cross-platform behavior** (the Android app should match these)

## Tutorial List

| File | Tutorial ID | Page | Steps |
|---|---|---|---|
| [main_tutorial.txt](main_tutorial.txt) | `main` | Multi-page | 14 |
| [morning_tutorial.txt](morning_tutorial.txt) | `morning` | morning | 5 |
| [day_tutorial.txt](day_tutorial.txt) | `day` | day | 6 |
| [closing_tutorial.txt](closing_tutorial.txt) | `closing` | closing | 8 |
| [inventory_tutorial.txt](inventory_tutorial.txt) | `inventory` | inventory | 5 |
| [debts_tutorial.txt](debts_tutorial.txt) | `debts` | debts | 5 |
| [setting_tutorial.txt](setting_tutorial.txt) | `setting` | setting | 5 |
| [add_product_tutorial.txt](add_product_tutorial.txt) | `add_product` | add_product | 5 |
| [restock_tutorial.txt](restock_tutorial.txt) | `restock` | restock | 8 |

## How to Read a Step Entry

Each step documents:

- **Step number** — 1-based position in the tutorial
- **Tutorial text** — the i18n key + English & Filipino copy (exception: the
  restock tutorial has no Filipino translation — it falls back to English)
- **Target page** — which HTML page the step renders on
- **Target UI element** — the CSS selector that is highlighted
- **Highlighted component** — what the selector points to
- **Tutorial box position** — computed at runtime (see rule below)
- **Highlight appearance** — white + green ring frame around the element
- **Expected page transition** — whether Next navigates to another page
- **Expected user interaction** — what the user does at this step
- **Navigation behavior** — Next / Previous / Skip / Finish
- **Animations / special behavior** — auto-scroll, RAF tracking, etc.

## Where the Config Lives

- **Tutorial definitions:** `app.js` → `var tutorials = { ... }` (each tutorial has
  `label` + `steps[]` with `{ textKey, highlight, page }`)
- **Tutorial text (EN + FIL):** `app.js` → the `en:` and `fil:` i18n dictionaries
  (e.g. `mainTutorial1`, `morningTutorial2`, ...)
- **Overlay/highlight rendering:** `app.js` → `startTutorial()`, `renderTutorialStep()`,
  `advanceTutorial()`, `endTutorial()`, `startHighlightTracking()`,
  `getTutorialBoxAlignment()`, `checkTutorialResume()`
- **Overlay markup:** duplicated in each `.html` file (`#tutorialOverlay`,
  `#tutorialHighlight`, `#tutorialBox`, `#tutorialSkip`, `#tutorialNext`)
- **Overlay styling:** `style.css` → `.tutorial-overlay`, `.tutorial-backdrop`,
  `.tutorial-highlight`, `.tutorial-box`

## Shared Runtime Rules (apply to every tutorial)

1. **Launch:** auto-starts on `morning.html` on first visit per tab session
   (`sessionStorage 'sss_v3_tutorialShown'`); re-launchable from the header
   tutorial button (`startTutorial('id', true)`) and from Settings →
   Tutorial selector (`launchTutorial()`).
2. **Replay flag (`isReplay`):** first-ever launch → no Skip button; any replay
   → Skip button visible.
3. **Box positioning rule** (`getTutorialBoxAlignment`):
   - No highlight → box **centered**
   - Highlight target center in top 40% of viewport → box at **bottom** (`flex-end`)
   - Otherwise → box at **top** (`flex-start`)
4. **Highlight frame:** fixed, `z-index: 151`, white ring 2px + green ring 4px
   (`box-shadow: 0 0 0 2px white, 0 0 0 4px var(--primary)`), `pointer-events: none`,
   auto-repositioned every frame via `requestAnimationFrame` while active, sized
   to target + 8px with 4px offset.
5. **Auto-scroll:** before showing a step with a highlight, the page content
   scrolls so the target is visible (60px buffer for the tutorial box).
6. **Page transitions:** when the next step's `page` differs from the current
   page, state is saved to `localStorage` and the app navigates to
   `page.html?tutorial=true`; the target page's init calls `checkTutorialResume()`
   → `resumeTutorial()`.
7. **Navigation buttons:** web has **Next** and **Skip** only (no Previous).
   Next advances; on the last step, Next finishes the tutorial (`endTutorial()`).
8. **Completion:** `endTutorial()` hides the overlay and clears tutorial state.
   Completing the **main** tutorial also returns the user to the Morning page
   (`morning.html`).
9. **Backdrop click:** the dimmed backdrop does NOT dismiss the tutorial on web
   (it is purely visual).

## Keeping These Docs Accurate

Whenever `tutorials` in `app.js` or the i18n strings change, update the matching
`*_tutorial.txt` file. Each file's step list mirrors `tutorials[<id>].steps`
order 1:1. A future script could generate these files directly from `app.js`.
