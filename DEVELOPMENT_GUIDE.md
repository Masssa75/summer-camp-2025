# Development Guide

## Project Setup

### Initial Setup
```bash
# Clone repository
git clone [repo-url]
cd Learn2

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

### Required Environment Variables
See `.env.local.example` for all required keys. You MUST have:
- Supabase keys (all 3)
- Netlify auth token
- GitHub token
- Telegram bot credentials
- Dev login password

## Development Workflow

### The Golden Rule
```bash
1. Check WORKING.md for file conflicts
2. Update WORKING.md with your files
3. Make changes
4. git add -A && git commit -m "feat: description" && git push
5. Wait 2 minutes for deployment
6. Test with Playwright on LIVE site
7. Update WORKING.md to release files
```

### Branch Strategy
- Work directly on main (we have good rollback)
- Use feature branches only for experiments
- Always deploy and test immediately

## Common Tasks

### Add New Page
```bash
# Create page
mkdir app/new-feature
touch app/new-feature/page.tsx

# Basic page structure
export default function NewFeaturePage() {
  return <div>New Feature</div>
}
```

### Add API Route
```bash
# Create API endpoint
mkdir -p app/api/new-endpoint
touch app/api/new-endpoint/route.ts

# Basic route structure
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return Response.json({ data: 'hello' })
}
```

### Add Component
```bash
# Create component
mkdir components/new-component
touch components/new-component/index.tsx
touch components/new-component/new-component.tsx

# Export from index
export { NewComponent } from './new-component'
```

## Testing

### Playwright Testing
```bash
# Run tests headless
npx playwright test

# Run tests with browser
npx playwright test --headed

# Create new test
touch _testing/test-new-feature.js
```

### Manual Testing
1. Always test on deployed site
2. Test with dev users (see CLAUDE.md)
3. Test on mobile (responsive)
4. Test error states

## Database

### Running Migrations
```bash
# Link to Supabase (if not done)
npx supabase link --project-ref [project-id]

# Create migration
npx supabase migration new feature_name

# Apply migrations
npx supabase db push
```

### Common Queries
```typescript
// With RLS (anon key)
const { data, error } = await supabase
  .from('posts')
  .select('*')

// Bypass RLS (service key)
const { data, error } = await supabaseAdmin
  .from('posts')
  .select('*')
```

## Debugging

### Check Deployment
```bash
# Check Netlify deploy status
node scripts/deployment/check-deploy.js

# Check latest commits
git log --oneline -5
```

### Common Issues

**TypeScript Errors**
```bash
npx tsc --noEmit
```

**Build Errors**
```bash
# Clear cache
rm -rf .next
npm run build
```

**Database Errors**
- Check RLS policies
- Test with service key
- Check column names

## Deployment

### Pre-deployment Checklist
- [ ] TypeScript passes
- [ ] Build succeeds locally
- [ ] Environment variables set
- [ ] No console.logs in production code

### Deploy Process
```bash
# It's automatic!
git push origin main

# Check deployment
# https://app.netlify.com/sites/[site-name]/deploys
```

### Rollback
```bash
# Netlify UI has instant rollback
# Or revert commit
git revert HEAD
git push origin main
```