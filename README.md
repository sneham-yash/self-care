# Nourish

A self-care tracker with the same UI as the RIZEN habit app: five seeded domains, daily checkboxes, optional remarks, calendar views, and downloadable PDF reports.

## Setup

```bash
npm install
cp .env.example .env.local
```

A hosted Supabase project named **nourish** is already created and the schema is applied.

`.env.local` should contain:

```
NEXT_PUBLIC_SUPABASE_URL=https://aujjolbxyabfnhjytshe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from the Nourish project>
```

In the [Supabase dashboard](https://supabase.com/dashboard/project/aujjolbxyabfnhjytshe/auth/url-configuration):

1. Set **Site URL** to `http://localhost:3000`
2. Add redirect URL `http://localhost:3000/auth/callback`
3. Enable **Google** under Auth providers if you want Google sign-in (email/password works immediately)

Then:

```bash
npm run dev
```

Open http://localhost:3000, sign up, check in on Home, and download a PDF from Reports.

## Stack

Next.js 15, React 19, Tailwind CSS 4, Supabase Auth/RLS, TanStack Query, `@react-pdf/renderer`.
