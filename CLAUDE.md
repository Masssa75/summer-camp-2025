# CLAUDE.md - AI Assistant Context

## 🚨 CRITICAL: Autonomous Workflow (READ THIS FIRST!)

### File Coordination - CHECK FIRST!
Before editing ANY file:
1. **Check WORKING.md** - See if another instance is working on it
2. **Add your entry** - List files you'll edit with timestamp
3. **Remove when done** - Clean up after yourself

If a file is taken, either:
- Wait and work on something else
- Coordinate with user if urgent

### The Golden Rule - ALWAYS Follow This Pattern:
```bash
1. Make code changes
2. git add -A && git commit -m "feat: description" && git push origin main
3. sleep 120  # MUST wait 2 minutes for Netlify deployment
4. Check deployment: https://app.netlify.com/sites/[site-name]/deploys
5. npx playwright test --headed  # Test on DEPLOYED site
6. If broken, fix and repeat from step 1
```

**NEVER**:
- Wait to push code "until it's ready"
- Test only locally
- Skip deployment verification
- Leave broken code undeployed

### Your Full Permissions

You have COMPLETE autonomous control:

**Supabase**:
- ✅ Full management key access (in .env)
- ✅ Can run ANY Supabase CLI command
- ✅ Can modify schema, RLS policies, functions
- ✅ Can access service role for admin operations
```bash
# If not installed:
npm install -g supabase

# You can do:
npx supabase db push
npx supabase db execute --sql "YOUR SQL"
```

**Netlify**:
- ✅ Full deployment access
- ✅ Can add/modify environment variables
- ✅ Can trigger deployments
- ✅ Can check deployment status

**GitHub**:
- ✅ Full repository access
- ✅ Can push directly to main
- ✅ Can create branches, PRs
- ✅ Can manage secrets

**You are expected to work autonomously. Don't ask for permission - just do it!**

---

## 📚 Documentation Structure

When you need detailed information, check these files:

- **ARCHITECTURE.md** - Technical decisions, database schema, system design
- **STYLE_GUIDE.md** - Code conventions, naming rules, patterns
- **DEVELOPMENT_GUIDE.md** - Setup instructions, debugging recipes
- **FOLDER_STRUCTURE.md** - Complete folder structure guide

---

## Project Overview

**Summer Camp 2025** - Interactive website for a summer camp featuring program information, activities, registration, and camp culture

**Tech Stack**:
- Frontend: Next.js 15, TypeScript, Tailwind CSS
- Backend: Supabase (PostgreSQL)
- Auth: [Auth method]
- Deployment: Netlify
- Testing: Playwright

---

## Current Project State

### ✅ What's Working & Deployed
[TO BE FILLED: What features are actually live?]

### 🚧 Partially Implemented
[TO BE FILLED: What's built but not complete?]

### 📋 Planned But Not Started
[TO BE FILLED: What's in the roadmap?]

---

## Critical Context

### Database Gotchas
[TO BE FILLED: Project-specific database quirks]

### Authentication
[TO BE FILLED: Auth implementation details]

### Environment Variables
All sensitive values are stored in `.env` file (never commit this!)

**Required** (for autonomous work):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY` (full database access)
- `NETLIFY_AUTH_TOKEN` (deployment automation)
- `GITHUB_TOKEN` (repository automation)
- `DEV_LOGIN_PASSWORD`

**Project-specific**:
[TO BE FILLED: Additional required keys]

**Optional**:
- `GEMINI_API_KEY` (for AI features)
- `OPENAI_API_KEY` (for image generation)
- Other API keys as needed

---

## Test Users
[TO BE FILLED: Test user details]

---

## Quick Commands

```bash
# Check deployment
node scripts/check-deployment.js

# Test with Playwright
npx playwright test --headed

# Run Supabase migrations
npx supabase db push

# Check TypeScript
npx tsc --noEmit
```

---

## Important URLs
- **Supabase**: [Project URL]
- **GitHub**: [Repository URL]
- **Netlify**: [Netlify app URL]
- **Live Site**: [Production URL]

---

## Session Handoff Notes
[TO BE FILLED: Any specific context from recent work]