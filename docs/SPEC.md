# Poker Manager — Preflop Range Creator (v1)

## 1. Goal

A desktop application to create, save and review **preflop ranges for 5-max cash games**
on a 13×13 hand grid, with a live counter showing how much of all starting hands the
range contains (e.g. `UTG: 40.1% · 532/1326 combos`).

## 2. Platform & stack

- **Tauri 2** desktop shell (Rust) + **React + TypeScript** UI, bundled with **Vite**.
- Must stay compatible with **macOS and Windows**: no macOS-only packages, crates, APIs
  or scripts. Producing Windows builds is out of scope for now.
- Tests: **Vitest** for the TypeScript core logic.

## 3. Scope

### In v1
- Create a range by selecting hands on a 13×13 grid.
- Live helper counter: percentage and number of combos selected out of 1326.
- Several named ranges per position.
- Save ranges; reopen them later to view or edit.

### Out of v1
Action types (raise/call/fold), mixed frequencies, stack depths, scenarios
(vs open, vs 3-bet…), import/export formats, postflop, hand-history analyzer.

## 4. Domain

### Hand classes
- 169 classes on a 13×13 grid (ranks `A K Q J T 9 8 7 6 5 4 3 2`):
  - Diagonal: pairs (`AA`…`22`) — **6 combos** each (13 classes, 78 combos).
  - Above the diagonal: suited (`AKs`…`32s`) — **4 combos** each (78 classes, 312 combos).
  - Below the diagonal: offsuit (`AKo`…`32o`) — **12 combos** each (78 classes, 936 combos).
- Total: **1326 combos**.

### Counter
- `percentage = selectedCombos / 1326 × 100`, displayed with one decimal.
- Also displayed: combo count and breakdown by pairs / suited / offsuit.
- Computed from the selection, never stored.

### Positions (5-max)
`UTG`, `CO`, `BTN`, `SB`, `BB`.

## 5. Data model & storage

Each range is one JSON file:

```json
{
  "schemaVersion": 1,
  "id": "2b6f0c1e-…",
  "name": "UTG open",
  "position": "UTG",
  "hands": ["AA", "KK", "AKs", "AKo"],
  "updatedAt": "2026-09-30T18:00:00.000Z"
}
```

- `hands` contains only selected hand classes, in canonical grid order.
- Files live **inside the repository folder** but are **gitignored** (user data, not source code):
  `ranges/<POSITION>/<slug-of-name>.json` (e.g. `ranges/UTG/utg-open.json`).
- Renaming a range or changing its position moves the file accordingly.
- The app locates `ranges/` by walking up from the executable (or dev working directory)
  until it finds the repository root (directory containing `.git`). `ranges/` is created
  if missing.
- Built executables go to `dist/` inside the repository and are **gitignored**.

## 6. User interface

- **Sidebar**: saved ranges grouped by position; actions: New, Rename, Duplicate,
  Delete (with confirmation).
- **Main area**: 13×13 grid.
  - Click toggles a hand; click-and-drag paints (if the first cell was unselected) or
    erases (if it was selected) every cell crossed.
  - Selected cells are highlighted; cells show the hand label.
- **Header**: range name, position selector, live counter, breakdown, buttons
  **Save** (`Ctrl/Cmd+S`) and **Clear**.
- **View mode**: opening a saved range is read-only until **Edit** is clicked.
- **Unsaved changes**: indicator in the header; confirmation before switching range or
  closing the window.

## 7. Architecture

```
poker-manager/
├─ docs/SPEC.md
├─ ranges/                 # saved ranges (gitignored)
├─ dist/                   # built executables (gitignored)
├─ src/                    # React UI
│  ├─ core/                # pure TS logic: hands, combos, counter, validation (+ tests)
│  ├─ storage/             # calls to Tauri commands for ranges
│  └─ components/          # Grid, Cell, Sidebar, Header
└─ src-tauri/              # Rust shell: locate repo root, list/read/write/delete range files
```

- `src/core` has no dependency on React or Tauri, and is fully unit-tested.
- The Rust side only does file I/O on `ranges/` (with path validation so it can never
  write outside that folder).

## 8. Milestones

| #  | Deliverable | Done when |
|----|-------------|-----------|
| M0 | Tauri + React + TS scaffold, Vitest, `.gitignore`, docs | `npm run tauri dev` opens a window; `npm test` passes |
| M1 | `core/`: hand classes, combos, counter | Tests: 169 classes, 1326 combos, correct percentages |
| M2 | Grid with click/drag selection and live counter | Selecting `AA` + `AKs` shows `0.8% · 10 combos` |
| M3 | Save/load to `ranges/` + sidebar | A saved range survives an app restart unchanged |
| M4 | View/edit mode, unsaved-changes guard, rename/duplicate/delete | Manual test checklist passes |
