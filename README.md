# WybCoding Construction CRM

Production-ready, highly polished SaaS solution for construction and renovation companies, designed to act as an all-in-one unified dashboard (like Linear / Notion / Monday). 

## Architecture & Technology Stack

- **Frontend Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4, Inter font, custom variables for a premium aesthetic
- **Routing**: React Router DOM (v6)
- **State Management**: Zustand for global state
- **Drag and Drop**: `@hello-pangea/dnd` for smooth Object Kanban boards
- **Data Visualization**: Recharts for responsive financial metrics
- **Database & Backend Ready**: Contains SQL Schema (`/supabase/schema.sql`) customized for Supabase with PostgreSQL Row Level Security.
- **Form / Validation (Prepared)**: React Hook Form + Zod

## Feature Modules

1. **Dashboard (Financial Overview)**: Key metrics, total incomes vs expenses, net profit, margin calculations, and interactive charts.
2. **Projects Kanban & List**: Manage construction objects through various statuses (`new`, `agreed`, `in_progress`, `completed`). Drag-and-drop to update statuses.
3. **Project Details & Transactions**: Dig deep into a single object's timeline, track individual budgets vs actuals, upload documents, and manage step-by-step progress.
4. **Finance Management**: Complete ledger showing transaction histories grouped by type (income/expense) and category.
5. **Supabase Schema included**: The `/supabase/schema.sql` contains the exact tables, types, triggers, and Row Level Security required to connect the logic to a scalable cloud database.

## Running the Project

```bash
npm install
npm run dev
```

## Integrating Supabase

Update `.env.example` to your real keys:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Execute the raw SQL found in `/supabase/schema.sql` via your Supabase SQL Editor. 
The current configuration uses the Mock logic inside `src/store/index.ts` to provide immediate interactivity. You can swap `useStore` logic for Supabase queries by leveraging the provided `@supabase/supabase-js` library.
