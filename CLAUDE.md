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
- **Homepage with age-based content switching** - Mini Camp (3-6) and Explorer Camp (7-13) content
- **Multi-child registration form** - Parents can register multiple children in one submission
- **Expandable images** - All content images can be clicked to view full-screen
- **Responsive navigation** - Top nav with age group selector and register button
- **Contact section** - Phone, email, and map integration
- **Schedule tables** - Weekly camp schedules with pastel colors and larger fonts
- **Photo carousels** - Activity photo galleries with navigation dots
- **WhatsApp integration** - Click-to-chat functionality

### 🚧 Partially Implemented
- **Supabase integration** - Database schema created but no backend API endpoints yet
- **Payment processing** - Registration form ready but no payment gateway
- **Email notifications** - Form submissions stored but no email sending

### 📋 Planned But Not Started
- **Admin dashboard** - View and manage registrations
- **Email confirmation system** - Automated emails after registration
- **Payment integration** - Stripe or local payment gateway
- **Multi-language support** - Thai/English toggle
- **Registration status tracking** - Check registration and payment status

---

## Critical Context

### Database Gotchas
- **Registration table** - Stores parent and child info together (denormalized for simplicity)
- **weeks_selected** - PostgreSQL array field storing week numbers (1-7)
- **Storage buckets** - 'registration-documents' bucket must have public access for passport uploads
- **Boolean fields** - has_insurance, photo_permission, terms_acknowledged, all_statements_true

### Authentication
- **No user auth yet** - Registration is public, no login required
- **Admin access** - Planned but not implemented

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
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - WhatsApp number for contact (currently hardcoded as +66989124218)
- `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` - Telegram bot username for login (e.g., WaldorfPhuketBot)
- `TELEGRAM_BOT_TOKEN` - Telegram bot token for sending notifications
- `TELEGRAM_ADMIN_CHAT_ID` - Telegram chat/group ID for admin notifications

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
- **Supabase**: https://supabase.com/dashboard/project/xunccqdrybxpwcvafvag
- **GitHub**: https://github.com/Masssa75/summer-camp-2025
- **Netlify**: https://app.netlify.com/sites/warm-hamster-50f715
- **Live Site**: https://warm-hamster-50f715.netlify.app

---

## Key Components & Patterns

### Registration Flow
- **MultiChildRegistrationForm** - Main registration component
  - Parents fill info once, then add multiple children
  - Each child can have different camp type (Mini/Explorer) and weeks
  - Files uploaded to Supabase Storage
  - Form data saved to 'registrations' table

### UI Components
- **ExpandableImage** - Click any image to view full-screen
- **PhotoCarousel** - Scrollable photo galleries with dot navigation
- **TopNavigation** - Fixed header with age toggle and register button
- **PageContent** - Switches between MiniContent and ExplorerContent

### Styling Patterns
- CSS modules in `/app/styles/`
- Tailwind for utility classes
- CSS variables for brand colors:
  ```css
  --green-primary: #7a9a3b
  --green-secondary: #a8c545
  --green-dark: #5a7a2b
  --green-light: #e8f5e9
  ```

### Image Organization
- Backgrounds: `/public/references/backgrounds/`
- Camp photos: `/public/references/Summer Camp Presentation Images/`
- Logo: `/public/references/Logo Only.png`

---

## Session Handoff Notes

### Recent Changes (2025-07-01)
1. **Multi-child registration** - Replaced individual child forms with a single form that allows adding multiple children
2. **Fixed build errors** - Removed unused ExplorerRegistrationForm and MiniRegistrationForm components
3. **UI improvements**:
   - Schedule tables now have larger fonts (1.1rem) and pastel colors
   - Registration form layout adjusted (nationality/school fields left, English slider right)
   - All content images are now expandable on click
4. **Database updates** - Added has_insurance and all_statements_true boolean fields

### Known Issues
- No email notifications after registration
- No payment processing integration
- No admin dashboard to view registrations
- Registration success only shows on frontend, no email confirmation

### Next Priorities
1. Set up email notifications using Supabase Edge Functions or external service
2. Add payment gateway integration (consider local Thai payment options)
3. Create admin dashboard for registration management
4. Add proper error handling and loading states
5. Implement registration confirmation/status page