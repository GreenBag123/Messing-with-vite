# Messing-with-vite — Portfolio OS

An experimental portfolio built with Vite + React, Tailwind, and Framer Motion. It pairs a bold neon visual system with interactive scenes (shatter hero, custom cursors, themed sections) and updated content for projects and contact.

## Tech
- React 19, Vite 7
- Tailwind CSS 3
- Framer Motion 12

## Scripts
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run preview` — preview the built output
- `npm run lint` — lint the project

## Structure
- `src/pages` — Home (shatter reveal), About Me, My Works (Shiproom), Creativity Lab, Productivity, Reach Me Out
- `src/components/CustomCursor.jsx` — multi-skin cursor with lighter trails
- `src/contexts` — theme provider + hook

## Notes
- Debug overlay toggles with `Ctrl+Shift+D`.
- Cursor is hidden globally; use the on-screen “Cursor styles” toggle to switch variants.
