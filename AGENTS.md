# Agendify — Agent Instructions

This file describes the project structure, conventions, and rules for AI coding agents (Claude Code, Cursor, Copilot, etc.) working on this codebase. Read this entire file before generating any code.

---

## Project Overview

**Agendify** is a student productivity mobile app built with Expo (React Native) and TypeScript. It helps users track study goals, schedule sessions, manage tasks, and stay motivated.

**Live stack:**
- Expo SDK 51+ with Expo Router v3 (file-based routing)
- React Native + TypeScript (`strict: true`)
- Zustand (state management) + AsyncStorage (persistence)
- NativeWind v4 (Tailwind CSS for React Native)
- react-hook-form + zod (forms and validation)
- date-fns (date utilities)
- expo-notifications (local push notifications)

---

## Project Structure

```
agendify/
├── app/                        # Expo Router — routing only, no business logic here
│   ├── (auth)/                 # Onboarding screens (no tab bar)
│   │   ├── index.tsx
│   │   └── setup.tsx
│   ├── (tabs)/                 # Main app (bottom tab bar)
│   │   ├── _layout.tsx
│   │   ├── index.tsx           # Dashboard
│   │   ├── calendar.tsx
│   │   ├── goals.tsx
│   │   ├── tasks.tsx
│   │   └── tips.tsx
│   ├── session/
│   │   ├── [id].tsx
│   │   └── new.tsx
│   ├── _layout.tsx             # Root layout
│   └── +not-found.tsx
│
├── src/
│   ├── components/
│   │   ├── ui/                 # Generic primitives
│   │   ├── layout/             # ScreenWrapper, Header etc.
│   │   ├── goals/
│   │   ├── calendar/
│   │   ├── tasks/
│   │   └── tips/
│   ├── store/                  # Zustand slices
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Pure helpers (no React)
│   ├── types/                  # TypeScript interfaces and types
│   ├── constants/              # Theme tokens, static data
│   └── validation/             # Zod schemas
│
└── assets/
    ├── fonts/
    └── images/
```

---

## Strict Rules — Always Follow

### TypeScript
- `strict: true` is enabled. Never use `any`. Use `unknown` and narrow it.
- All props must be typed with an explicit interface or type alias.
- All Zustand store slices must be fully typed (state + actions).
- All zod schemas must be inferred with `z.infer<typeof schema>` — no duplicate type definitions.
- Use `satisfies` operator where appropriate for config objects.

### File naming
- Components: `PascalCase.tsx` (e.g. `GoalCard.tsx`)
- Hooks: `camelCase.ts` prefixed with `use` (e.g. `useGoalProgress.ts`)
- Stores: `camelCase.ts` prefixed with `use` (e.g. `useGoalStore.ts`)
- Utilities / helpers: `camelCase.ts` (e.g. `date.ts`)
- Types: `camelCase.ts` (e.g. `goal.ts`)
- Constants: `camelCase.ts` (e.g. `theme.ts`)

### Component rules
- Every component must have a named export (no default anonymous exports).
- Props interface must be defined directly above the component, named `[ComponentName]Props`.
- No inline styles unless absolutely required for dynamic values. Use NativeWind classes first.
- For dynamic styles (e.g. progress bar width from state), use `StyleSheet.create` or inline style with typed values.
- Do not put business logic in screen files inside `app/`. Screens import from `src/`.

### Routing (Expo Router v3)
- Files in `app/` are route definitions only — minimal logic.
- Use route groups `(auth)` and `(tabs)` for layout separation.
- Dynamic routes use `[id].tsx` convention.
- Never hardcode route strings — use typed routes from `expo-router`.

### State management (Zustand)
- One store per domain: goals, tasks, calendar, user.
- Each store file exports one hook (e.g. `useGoalStore`).
- Actions are defined inside the store, not outside.
- Async actions (e.g. loading from storage) are handled inside the store.
- Do not use React Context for app state — Zustand only.
- Persist all stores using the AsyncStorage adapter.

Store slice pattern:
```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface GoalState {
  goals: Goal[]
  addGoal: (goal: Goal) => void
  removeGoal: (id: string) => void
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goals: [],
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      removeGoal: (id) => set((state) => ({ goals: state.goals.filter(g => g.id !== id) })),
    }),
    {
      name: 'goal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
```

### Forms (react-hook-form + zod)
- All forms use `useForm` from `react-hook-form` with `zodResolver`.
- Schema defined in `src/validation/` and imported into the form component.
- Never manage form state manually with `useState`.

### Styling (NativeWind v4)
- Use Tailwind classes via `className` prop.
- Design tokens (colors, spacing) defined in `src/constants/theme.ts` and `tailwind.config.js`.
- Dark mode only for now — no light mode variants needed yet.
- Avoid hardcoded color hex values in components — always reference theme tokens.

### Date handling
- All date utilities go through `src/lib/date.ts` which wraps `date-fns`.
- Never use `new Date()` directly in components — use the lib wrapper.
- Store dates as ISO strings in Zustand state, not Date objects.

### Notifications
- All notification logic lives in `src/lib/notifications.ts`.
- Request permissions once at app startup in the root `_layout.tsx`.
- Never schedule notifications from inside a component directly.

---

## Types Reference

```ts
// src/types/goal.ts
export interface Goal {
  id: string
  title: string
  category: GoalCategory
  type: 'daily' | 'weekly' | 'monthly'
  targetHours: number
  completedHours: number
  createdAt: string   // ISO string
  deadline: string    // ISO string
}

export type GoalCategory = 'study' | 'reading' | 'exercise' | 'personal'

// src/types/task.ts
export interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string    // ISO string
  createdAt: string   // ISO string
}

// src/types/session.ts
export interface Session {
  id: string
  title: string
  subject: string
  startTime: string   // ISO string
  endTime: string     // ISO string
  completed: boolean
  rescheduled: boolean
  originalDate?: string
}
```

---

## What NOT to Generate

- Do not use `class` components — functional components only.
- Do not use Redux, MobX, or React Context for global state.
- Do not use `AsyncStorage` directly in components — only through Zustand persist.
- Do not use `moment.js` — use `date-fns` only.
- Do not add `console.log` statements in committed code.
- Do not use `StyleSheet.create` for static styles that can be expressed in NativeWind.
- Do not create files outside `src/` except for route files in `app/`.
- Do not generate placeholder/lorem ipsum content in components.
- Do not wrap every component in its own folder unless it has multiple related files (e.g. `GoalCard/index.tsx` + `GoalCard.styles.ts`).

---

## Code Generation Checklist

Before generating any component or feature, confirm:
- [ ] Is the file in the right directory per the structure above?
- [ ] Are all props typed with an explicit interface?
- [ ] Are NativeWind classes used for styling (not inline styles)?
- [ ] If it's a form, is `react-hook-form` + `zod` being used?
- [ ] If it touches state, is the correct Zustand store being used?
- [ ] Are dates handled through `src/lib/date.ts`?
- [ ] Are there no `any` types?
- [ ] Does the component have a named export?
