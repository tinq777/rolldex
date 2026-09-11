# RollDex — BJJ Technique Video Library

A single-file PWA. No build step, no framework, no dependencies beyond two Google Fonts.

## Files
- `index.html` — the entire app (data, logic, styles)
- `manifest.json`, `sw.js`, `icon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` — PWA install support

## Deploy (any static host works)
Drop all six files into one folder and host it — e.g. drag the folder onto Cloudflare Pages,
Netlify, or GitHub Pages. No build command, no root directory config needed.
Opening `index.html` directly also works for local testing, though the service worker
(offline app-shell caching) only activates when served over http(s), not `file://`.

## How it's organized
- 14 positions (Standing, Closed Guard, Half Guard, Butterfly, Open Guard, Mount,
  Knee-on-Belly, Side Control, North-South, Back Control, Turtle, Guard Passing,
  Leg Entanglement, Self-Defense)
- 84 techniques, each linked to a real, freely-available YouTube instructional from a
  credible instructor (Lachlan Giles, Chewjitsu, John Danaher, Roger Gracie, Marcelo
  Garcia, Jean Jacques Machado, Khabib Nurmagomedov, Stephan Kesting, Evolve
  University, Caio Terra, and others)
- Self-Defense is a deliberately separate category from the sport positions above —
  standing headlock, bear-hug, and front-choke defenses, plus defending strikes from
  bottom mount — the kind of thing a Gracie Combatives-style curriculum covers that
  pure sport BJJ often skips
- Each technique links to 2–3 related techniques (shared position, complementary
  attack/escape, or a natural follow-up), so browsing one leads naturally to the next
- "Continue watching" on the home screen remembers the last 8 techniques opened
- "Mark as drilled" on each technique tracks what you've actually practiced — drilled
  techniques get a green checkmark badge everywhere they're listed
- Both features are stored locally on-device via `localStorage`; nothing leaves the
  browser, there's no account, and nothing is shared if you use the app on another
  device

## Accessibility
Every position, technique, and related-technique card is keyboard-focusable and
activates on Enter/Space, not just mouse click or touch — built as `role="link"`
elements with visible focus rings, since a real Word/design-review pass should
mean useful to keyboard and screen-reader users too, not just a mouse. Reduced-motion
preference is respected.

## Adding more techniques
Everything lives in the `TECHNIQUES` array near the top of the `<script>` block in
`index.html`. Add an object with `id`, `title`, `position` (must match a POSITIONS id),
`category` (submission / sweep / escape / pass / takedown), `instructor`, `youtube`
(the video ID from the YouTube URL), `desc`, and `related` (array of other technique
ids). No other file needs to change.

## Why these videos
All 84 were individually verified via web search to be real, currently-live YouTube
videos from established BJJ instructors/channels — not generated or guessed IDs.
Descriptions are written in original language, not copied from any source. A few
entries credit a channel generically (e.g. "Deep Half Guard instructional") where the
video's title made the technique and quality obvious but the channel name wasn't
clearly attributable from search results alone — the video itself was still verified
as real before being added.

## Maintenance
Third-party YouTube videos can occasionally be taken down or made private. If a
technique's embed stops working, check the video ID against the current YouTube URL
and swap it in the `TECHNIQUES` array — there's no other place that needs updating.

Whenever `index.html`'s content changes, bump the `CACHE` constant at the top of
`sw.js` (e.g. `rolldex-v2` → `rolldex-v3`). The service worker serves cached files
cache-first, so without a version bump, people who already installed the PWA can get
stuck looking at an old snapshot of the library even after you've updated the file.

## Design notes
Dark, mat-inspired palette instead of a generic light theme; belt-gold accent;
category tags color-coded (red=submission, blue=sweep, green=escape, amber=pass,
purple=takedown) so the type of technique is scannable at a glance in any list.
Condensed Oswald for headings (athletic/poster feel), Inter for body text.

## Tested
Verified with Playwright (mobile viewport) end-to-end: home → positions → position
detail → technique detail → related-technique navigation → search. No console errors.
