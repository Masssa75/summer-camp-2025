# Supabase Migration Guide

This project uses a custom migration system that allows AI assistants and developers to run Supabase migrations autonomously.

## Running Migrations

To run a migration file:

```bash
npm run db:migrate <path-to-migration-file>

# Example:
npm run db:migrate supabase/migrations/20241103_create_camp_settings.sql
```

## How It Works

The migration runner uses the Supabase Management API with the access token configured in `.env.local`. This allows migrations to be run without needing database passwords.

## Creating New Migrations

1. Create a new SQL file in `supabase/migrations/` with the format `YYYYMMDD_description.sql`
2. Write your SQL migration
3. Run it using: `npm run db:migrate supabase/migrations/your_migration.sql`

## Requirements

The following environment variables must be set in `.env.local`:
- `SUPABASE_ACCESS_TOKEN` - Your Supabase access token
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for server-side operations

## Troubleshooting

If a migration fails:
1. Check the error message for details
2. The script will provide a link to run the migration manually in the Supabase dashboard
3. Make sure your Supabase access token has the necessary permissions

## Available Scripts

- `scripts/run-supabase-migration.js` - General purpose migration runner
- `scripts/verify-camp-settings.js` - Verify the camp settings table is working
- `scripts/setup-camp-settings.js` - Initial setup for camp settings (already run)