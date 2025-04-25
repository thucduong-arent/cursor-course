# ThucDT AI Application

## Environment Setup

To run this application, you need to set up the following environment variables:

1. Create a `.env.local` file in the root directory of the project.
2. Add the following variables to the file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
```

Replace `your_supabase_url_here` with your actual Supabase project URL.

## API Key Validation

The application validates API keys against Supabase. To set up the validation:

1. Create a table named `api_keys` in your Supabase project.
2. Add any necessary columns to the table.
3. Set up appropriate Row Level Security (RLS) policies for the table.

## Running the Application

```bash
npm run dev
```

The application will be available at http://localhost:3000.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
