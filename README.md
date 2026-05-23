# Dormr

![Dormr logo](public/images/rounded-logo.png)

Dormr is a student housing marketplace for university students and listers. It helps students find compatible accommodation, message listers in real time, and manage tenant requests. Listers get their own dashboard for listings, applications, notifications, and analytics.

## What it does

- Matches students to listings and current tenants using a compatibility algorithm.
- Supports separate student and lister accounts.
- Provides real-time chat between students and listers using Supabase websockets.
- Includes full dashboards for both roles with analytics and operational views.
- Handles the full notifications flow for requests, approvals, and updates.
- Uses React Query for prefetching, caching, and fast navigation.
- Supports dark mode and light mode.
- Responsive and mobile-friendly.

## Core features

- Compatibility matching for roommate and listing fit.
- Real-time chat between students and listers.
- Student and lister dashboards with charts and status cards.
- Listing management, tenant requests, approvals, and notifications.
- Saved listings and profile management.
- Map-based listing location views.
- Mobile-first responsive layout.

## Tech stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Supabase for auth, Postgres, realtime, and storage
- Tailwind CSS 4
- `zod` for runtime validation and schema safety
- `@tanstack/react-query` for caching and prefetching
- `recharts` for lister analytics charts
- `leaflet` for listing maps and location selection
- `react-hook-form` and `@hookform/resolvers` for forms
- `zustand` for persisted client state
- `sonner` for notifications
- `lucide-react` for iconography

### Dashboards

| Student dashboard                                    | Lister dashboard                                    |
| ---------------------------------------------------- | --------------------------------------------------- |
| ![Student dashboard](public/images/s-dashboard.jpeg) | ![Lister dashboard](public/images/l-dashboard.jpeg) |

### App screenshots

| Screenshot 1                                                                          | Screenshot 2                                                                          |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| ![Screenshot 1](public/images/WhatsApp%20Image%202026-05-20%20at%203.52.36%20PM.jpeg) | ![Screenshot 2](public/images/WhatsApp%20Image%202026-05-20%20at%203.56.23%20PM.jpeg) |

| Screenshot 3                                                                          | Screenshot 4                                                                          |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| ![Screenshot 3](public/images/WhatsApp%20Image%202026-05-20%20at%203.57.43%20PM.jpeg) | ![Screenshot 4](public/images/WhatsApp%20Image%202026-05-20%20at%204.01.34%20PM.jpeg) |

| Screenshot 5                                                                          |
| ------------------------------------------------------------------------------------- |
| ![Screenshot 5](public/images/WhatsApp%20Image%202026-05-21%20at%206.37.06%20PM.jpeg) |

## Local setup

```bash
npm install
npm run dev
```

Set the required Supabase environment variables in `.env.local` before running the app.

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=
```
