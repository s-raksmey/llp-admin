# LLP Admin

Administration dashboard for the Lecture Learning Platform.

## Structure

- `app/(auth)` - authentication routes such as login
- `app/(dashboard)` - protected CMS routes for dashboard, courses, lectures, media, users, and settings
- `components` - shared layout and UI building blocks
- `config` - navigation and app-level configuration
- `features` - domain-specific types, data, hooks, forms, and tables
- `graphql` - GraphQL documents and generated API types
- `lib` - shared utilities
- `types` - global TypeScript helpers

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the admin dashboard.
