# Impekable Calendar — React JS Test Task

A calendar application with full event management, built to match the provided
Impekable UI/UX design. Click a date to create an event, click an event to view
/ edit / delete it, and drag events to reschedule them.

## Live demo

GitHub Pages: **https://USERNAME.github.io/calendar-test-task/**

> After forking, update `USERNAME` here, in `package.json` (`homepage`), and the
> `base` option in `vite.config.ts` if your repository name differs.

## Tech stack

- **React 19 + TypeScript** (strict mode)
- **Vite** — build tooling & dev server
- **FullCalendar v6** — `daygrid`, `timegrid`, `list`, `interaction` plugins
- **Zustand** — client state (the events store)
- **localStorage** — persistence across reloads
- **Tailwind CSS v4** — styling
- **Lucide React** — icons

## Features

| Requirement | Implementation |
| --- | --- |
| Full copy of the layout | Dark sidebar, top bar and calendar card (`Sidebar`, `Topbar`, `CalendarView`) |
| Add an event (max 30 chars) for a day & time | Click a date → popover form; title capped at 30 chars |
| Display events in correct time order | FullCalendar sorts same-day events by time automatically |
| Select a colour and display it | `ColorPicker` swatches; colour applied to the event chip |
| Overlapping events | Handled natively by FullCalendar's slot layout |
| Edit events (text, day, time, colour) | View popover → **Edit** |
| Delete events | View popover → **Discard** |
| Drag & drop | `editable` + `eventDrop` / `eventResize` persist to the store |
| Change month / week / day / agenda | FullCalendar header toolbar |

### Popover behaviour (per the design annotations)

- Opens as a popover anchored to the clicked date / event, with an arrow pointing at it.
- The **✕** and **Cancel** close the popover without saving.
- All fields are required, validated with **custom** messages (no HTML5 validation).
- **Past dates are rejected.**
- **Save** persists and closes.
- In view mode, **Discard** deletes the event and **Edit** switches to editing.

> Note: each event requires a time (per the "all fields required" annotation),
> so created events are timed rather than all-day. Drag-and-drop onto an
> all-day slot is still supported and persisted.

## Project structure

```
src/
  components/
    CalendarView.tsx   # FullCalendar wiring + drag/drop + view switching
    EventModal.tsx     # anchored popover: create / view / edit / delete + validation
    ColorPicker.tsx    # colour swatch selector
    Sidebar.tsx        # static layout (Lucide icons)
    Topbar.tsx         # static layout (Lucide icons + avatar)
  store/
    eventsStore.ts     # Zustand store, persisted to localStorage
  types/
    event.ts           # CalendarEvent / EventDraft types
  utils/
    localStorage.ts    # load / save helpers
    datetime.ts        # ISO ⇆ input-value conversions, past-date check
  App.tsx              # app shell
  main.tsx             # entry point
```

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
```

## Deployment (GitHub Pages)

Two options are included:

1. **GitHub Actions (recommended):** push to `main` and the workflow in
   `.github/workflows/deploy.yml` builds and publishes to Pages. Enable
   *Settings → Pages → Source: GitHub Actions* once.
2. **Manual:** `npm run deploy` (uses the `gh-pages` package to publish `dist`).
```
