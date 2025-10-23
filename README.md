# My Fumadocs Template

A monorepo template for Fumadocs documentation sites with Turbo.

## Structure

This monorepo contains the following apps:

- `apps/docs` - The main Fumadocs documentation site
- `apps/validate-content` - Content validation and copying utility

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

3. Build all apps:
   ```bash
   pnpm build
   ```

## Content Management

To validate and copy content from the `content-example` directory to the docs app:

```bash
pnpm validate-and-copy ../../content-example
```

This will:

- Validate the structure and JSON files in the origin directory
- Copy content to `apps/docs/content`
- Copy images to `apps/docs/public`

## Available Scripts

- `pnpm dev` - Start development servers for all apps
- `pnpm build` - Build all apps
- `pnpm start` - Start production servers for all apps
- `pnpm lint` - Lint all apps
- `pnpm type-check` - Type check all apps
- `pnpm validate-and-copy <origin-dir>` - Validate and copy content
