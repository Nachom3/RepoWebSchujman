# Feature Example — Appointments

A real feature applying every rule in `SKILL.md`.

## File Tree

```
features/appointments/
├── components/
│   ├── AppointmentList/
│   │   ├── AppointmentList.tsx
│   │   ├── AppointmentList.test.tsx
│   │   ├── AppointmentList.types.ts
│   │   └── index.ts
│   ├── AppointmentListItem/
│   │   ├── AppointmentListItem.tsx
│   │   ├── AppointmentListItem.test.tsx
│   │   ├── AppointmentListItem.types.ts
│   │   └── index.ts
│   └── AppointmentFilters/
│       ├── AppointmentFilters.tsx
│       ├── AppointmentFilters.test.tsx
│       ├── AppointmentFilters.types.ts
│       └── index.ts
├── hooks/
│   └── useAppointments.ts
├── services/
│   └── appointments.api.ts
├── types.ts
├── schemas.ts
└── index.ts

# Cross-feature primitives (Button, Input, Dialog, Form, etc.) live in
# components/ui/ and come from shadcn/ui — never hand-rolled (see SKILL.md
# Hard Rule #10). Feature components import them directly, e.g.:
#
#   import { Button } from '@/components/ui/button'
#   import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
```
```

## Public Barrel

```ts
// features/appointments/index.ts
export { AppointmentList } from './components/AppointmentList'
export { AppointmentFilters } from './components/AppointmentFilters'
export { useAppointments } from './hooks/useAppointments'
export type { Appointment } from './types'
```

Other features import from this barrel only:

```ts
// features/dashboard/components/DashboardPanel/DashboardPanel.tsx
import { useAppointments, type Appointment } from '@/features/appointments'
```

## Component Folder Pattern

Each component lives in its own folder. The `index.ts` re-exports only the component, never internal helpers.

```ts
// features/appointments/components/AppointmentListItem/index.ts
export { AppointmentListItem } from './AppointmentListItem'
export type { AppointmentListItemProps } from './AppointmentListItem.types'
```

## Types Live With the Component

```ts
// features/appointments/components/AppointmentListItem/AppointmentListItem.types.ts
import type { Appointment } from '../../types'

export type AppointmentListItemProps = {
  appointment: Appointment
  onSelect: (id: string) => void
}
```

## Presentational Component

```tsx
// features/appointments/components/AppointmentListItem/AppointmentListItem.tsx
import type { AppointmentListItemProps } from './AppointmentListItem.types'

export function AppointmentListItem({ appointment, onSelect }: AppointmentListItemProps) {
  return (
    <li>
      <button type="button" onClick={() => onSelect(appointment.id)}>
        {appointment.patientName} — {appointment.scheduledAt}
      </button>
    </li>
  )
}
```

## Data Layer (Hook)

```ts
// features/appointments/hooks/useAppointments.ts
import { useQuery } from '@tanstack/react-query'
import { fetchAppointments } from '../services/appointments.api'
import type { Appointment } from '../types'

export function useAppointments(filters: AppointmentFilters) {
  return useQuery<Appointment[]>({
    queryKey: ['appointments', filters],
    queryFn: () => fetchAppointments(filters),
  })
}
```

## Container / Presentational Split

The page is a thin Server Component that fetches and delegates to a Client Component:

```tsx
// app/(app)/appointments/page.tsx
import { AppointmentList } from '@/features/appointments'

export default async function AppointmentsPage() {
  return <AppointmentList />  // client component owns the rest
}
```

```tsx
// features/appointments/components/AppointmentList/AppointmentList.tsx
'use client'
import { useAppointments } from '../../hooks/useAppointments'
import { AppointmentListItem } from '../AppointmentListItem'
import type { AppointmentListProps } from './AppointmentList.types'

export function AppointmentList(_: AppointmentListProps = {}) {
  const { data, isLoading, error } = useAppointments({ status: 'upcoming' })

  if (isLoading) return <div>Loading…</div>
  if (error) return <div>Failed to load</div>
  if (!data?.length) return <div>No appointments</div>

  return (
    <ul>
      {data.map((a) => (
        <AppointmentListItem key={a.id} appointment={a} onSelect={console.log} />
      ))}
    </ul>
  )
}
```

Notice: `AppointmentList` is a container (owns the query). `AppointmentListItem` is presentational (props in, JSX out, no state beyond UI).
