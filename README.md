# FinanceIQ — Personal Finance Dashboard

A clean, functional personal finance dashboard built with React (Vite) and Tailwind CSS. 

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Features](#features)
- [Approach](#approach)
- [Mock Data](#mock-data)

---

## Overview

FinanceIQ lets you:

- To view the financial summary (balance, income, expenses)
- Explore and manage the transactions
- Understand the spending patterns through charts
- See insights calculated from the transactions

The app uses no backend — all data is mocked locally. State is managed with React `useState`, lifted where needed. The UI follows a light and dark theme fintech aesthetic looks.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 (functional components) |
| Bundler | Vite 5 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Charts | Recharts |
| State | `useState` (no Redux/Zustand) |
| Fonts | Inter (Google Fonts) |
| Data | Mock only (`src/data/mockData.js`) |

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18 (tested on v20.17.0 and v22.10.0)
- npm ≥ 9

### 1. Clone / navigate to the project

```bash
cd "finance dashboard"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open in browser

```
http://localhost:5173
```

### Build for production

```bash
npm run build
```

Output is generated in the `dist/` folder. Preview it with:

```bash
npm run preview
```

---

## Project Structure

```
finance dashboard/
├── index.html                  # Entry HTML, Google Fonts link, SEO meta
├── vite.config.js              # Vite config with React + Tailwind plugins
├── package.json
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Root component: layout, routing, global state
    ├── index.css               # Tailwind import + CSS custom properties (theme tokens)
    ├── data/
    │   └── mockData.js         # 20 mock transactions + CATEGORIES constant
    └── components/
        ├── Dashboard.jsx       # Overview: summary cards + charts
        ├── Transactions.jsx    # Table with search/filter/sort + CRUD modal
        ├── Insights.jsx        # 4 auto-calculated insight cards
        ├── Charts.jsx          # Recharts wrappers (line chart, pie chart, bar chart)
        └── RoleSwitcher.jsx    # Role dropdown (Viewer / Admin)
```

---

## Features

### 1. Dashboard Overview

The landing page shows three summary cards calculated live from transaction data:

- **Total Balance** — total income minus total expenses
- **Total Income** — sum of all income-type transactions
- **Total Expenses** — sum of all expense-type transactions

Below are the cards, two charts provide visual context:

- **Monthly Trend** (line chart) — plots income, expense, and net balance per month across the dataset
- **Spending by Category** (pie chart) — shows the proportional breakdown of expenses across categories

All values update dynamically if transactions are added, edited, or deleted.

---

### 2. Transactions

A full-featured table displaying all 20 mock transactions with the columns:

| Column | Notes |
|---|---|
| Date | Formatted as `DD Mon YYYY` |
| Description | Free-text label |
| Category | Displayed as a pill badge |
| Type | Color-coded: green for Income, red for Expense |
| Amount | Prefixed with `+` or `−` and coloured accordingly |

**Controls:**

- **Search** — filters rows by description text (case-insensitive)
- **Category filter** — dropdown to isolate a single category
- **Type filter** — dropdown to show only Income or Expense
- **Sort** — click Date or Amount column headers to toggle asc/desc order
- **Reset** — clears all filters and sort state in one click
- **Live count** — shows "Showing X of Y transactions" at all times

**Empty state:** When no results match, a friendly message replaces the table instead of leaving blank space.

---

### 3. Role-Based UI

A dropdown in the top navbar switches between two roles:

| Role | Can do |
|---|---|
| **Viewer** | Read-only — browse, search, filter |
| **Admin** | All Viewer permissions + Add, Edit, Delete transactions |

The current role is shown as a badge next to the switcher and in the sidebar footer.

**Admin-only features:**
- **+ Add button** — opens a modal form to create a new transaction
- **Edit** — pre-fills the modal with the selected transaction's data
- **Delete** — prompts for confirmation, then removes the transaction

**Form validation** (modal):
- Date, description, and amount are required
- Amount must be a positive number
- Inline error messages appear below invalid fields on submit

---

### 4. Insights

Four auto-calculated insight cards:

| Card | Calculation |
|---|---|
| **Highest Spending Category** | Category with the largest total expense across all transactions |
| **Monthly Expense Change** | % change between the current month's expenses and the previous month's |
| **Average Daily Spend** | Total expenses ÷ number of unique days with any expense transaction |
| **Largest Transaction This Month** | Highest-amount transaction (any type) in the current calendar month |

All values recalculate if the transaction list changes.

---

### 5. Dark Mode

A toggle button (🌙 / ☀️) in the top navbar switches between light and dark themes.

- The preference is saved to `localStorage` and restored on page load
- The dark theme is implemented via a `.dark` class on `document.documentElement`, using CSS custom properties (`--color-bg`, `--color-surface`, etc.) defined in `index.css`
- No flicker on reload — the initial value is read from `localStorage` synchronously inside `useState`

---

### 6. Responsive Layout

- **Desktop:** Persistent sidebar + top navbar + main content
- **Mobile/Tablet:** Sidebar hidden by default, revealed via a hamburger button — overlaid with a semi-transparent backdrop that closes it on click

---

## Approach

### State Management

All state lives in `App.jsx` and is passed down as props — no external state library needed for this scope.

```
App.jsx
├── transactions[]     — source of truth for all transaction data
├── currentRole        — 'Viewer' | 'Admin'
├── activePage         — current nav section
├── darkMode           — persisted to localStorage
└── sidebarOpen        — mobile-only sidebar toggle
```

Handlers (`handleAdd`, `handleEdit`, `handleDelete`) are defined in `App.jsx` and passed to `Transactions.jsx`. This keeps mutation logic centralised and components focused on UI.

### Styling Strategy

Tailwind utility classes handle layout and spacing. Semantic component classes (`.card`, `.btn-primary`, `.badge-income`, etc.) are defined in `index.css` using `@layer components` — keeping JSX readable and styles reusable without introducing a component library.

Theming is done entirely through CSS custom properties on `:root` and `.dark`, so switching themes requires only toggling a class on `<html>` — no JS-in-CSS, no additional libraries.

### Chart Architecture

Each chart type is a self-contained component in `Charts.jsx`. They accept `transactions[]` and compute their own aggregations internally (grouping by month, by category, etc.), so parent components stay clean.

---

## Mock Data

Located in `src/data/mockData.js`. Contains 20 transactions across January–March 2026 covering:

**Categories:** Food, Transport, Salary, Rent, Shopping, Entertainment, Healthcare

**Sample entries:**
- Freelance payment — Web project (`Salary`, Income, ₹45,000)
- Zomato order — Dinner (`Food`, Expense, ₹420)
- Metro recharge (`Transport`, Expense, ₹500)
- Netflix subscription (`Entertainment`, Expense, ₹649)
- Salary credit — March (`Salary`, Income, ₹50,000)
- Myntra shopping — Clothes (`Shopping`, Expense, ₹3,200)

To modify or extend the data, edit `src/data/mockData.js`. The entire UI recalculates automatically.

---

## Notes

- No external UI component library used — all components are hand-built
- No routing library — page switching is handled with a simple `activePage` state
- The app was designed with a focus on real-world development practices: readable code, sensible structure, and practical features.
