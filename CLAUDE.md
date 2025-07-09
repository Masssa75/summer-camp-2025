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
- ✅ Can run migrations autonomously via Management API

### 🔥 Database Migration System (NO PASSWORDS NEEDED!)

We have a custom migration system that uses the Supabase Management API. You can run migrations without database passwords!

```bash
# Run any migration file:
npm run db:migrate supabase/migrations/your_migration.sql

# Example - already run but showing syntax:
npm run db:migrate supabase/migrations/20241103_create_camp_settings.sql

# Verify tables exist:
node scripts/verify-camp-settings.js

# Create new migration:
1. Create file: supabase/migrations/YYYYMMDD_description.sql
2. Write your SQL (CREATE TABLE, policies, etc.)
3. Run it: npm run db:migrate supabase/migrations/YYYYMMDD_description.sql
```

**How it works**: The `scripts/run-supabase-migration.js` uses the `SUPABASE_ACCESS_TOKEN` from `.env.local` to execute SQL via the Management API. No database password needed!

**If migration fails**: The script will show the error and provide a direct link to run it manually in the Supabase dashboard.

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
- **Admin Dashboard** - View registrations at /admin (Telegram or test login)
- **Test Admin Authentication** - Password-based login for AI testing (password: test123)
- **Editable Timetable** - Admins can edit the camp schedule in the dashboard, changes reflect on public site
- **Telegram Notifications** - Group notifications working to group ID: -1002582721018
- **Notification Settings Modal** - Gear icon in notification panel with join group link
- **Admin Workflow UI** - Designed workflow for payment tracking (send request → record payment → send confirmation)

### 🚧 In Progress (Jan 9, 2025)
- **Database Normalization** - Created schema for parents, students, enrollments, attendance
- **Google Sheets Import** - Analyzed 2 registration sheets + 1 attendance sheet
  - Explorer Camp (7-13): ~30+ registrations with duplicates
  - Mini Camp (3-6): ~15+ registrations with duplicates
  - Many duplicates are siblings from same family
- **Enhanced Tracking Fields** - Added payment_request_sent, confirmation_email_sent, etc.

### 📋 Next Steps
- **Import Google Sheets** - Import all registrations (including duplicates)
- **Process into Normalized Structure** - Create unique parent/student records
- **Build Attendance Interface** - Daily check-in/out tracking
- **Staff Management** - Import staff assignments from sheets

---

## Critical Context

### Database Schema Evolution
1. **Original Structure** (Deployed):
   - **registrations** - Denormalized table with parent + child info
   - **admin_users** - Telegram users for admin access
   - **admin_notifications** - Notification tracking
   - **camp_settings** - Key-value config store

2. **New Normalized Structure** (Created Jan 9):
   - **parents** - Unique parents (deduped by email)
   - **students** - Unique children (deduped by name + DOB)
   - **parent_student** - Links parents to children
   - **enrollments** - Links students to camp sessions
   - **camp_sessions** - Define weeks/sessions
   - **attendance** - Daily check-in/out
   - **staff** - Staff members
   - **staff_assignments** - Staff schedule

### Import Strategy
- Keep ALL registrations (including duplicates)
- Create unique parent/student records from registrations
- Use `create_or_get_parent()` and `create_or_get_student()` functions for deduplication
- Link enrollments back to original registrations

### Google Sheets Data Sources
1. **Explorer Camp Registrations**: https://docs.google.com/spreadsheets/d/1G7UBjwPsDfEDAeXWNecATYHHwY6RXJti2im_1NKXA00
2. **Mini Camp Registrations**: https://docs.google.com/spreadsheets/d/12IIwb8mtZ-BeJm34RgFVvSw6r3xYyJ9pCFtD63Iix-g
3. **Attendance Tracking**: https://docs.google.com/spreadsheets/d/1EfdpTFP_YJpAFJT5KElD7x79ChIKAZ3j4x1Imms6Wz8

### Known Duplicates
- **assafster@gmail.com** - Multiple children in both camps
- **nikizhang112233@gmail.com** - 3-4 registrations
- **Cohen Family** - 5+ children
- Most duplicates are siblings, not errors

### Authentication
- **Public registration** - No login required for parents to register
- **Admin access** - Telegram authentication with @Bamboo_Valley_Admin_Bot
- **Test admin login** - Available at /test-auth with password: test123 (for AI testing)

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

## Test Users & Authentication

### 🔐 Test Admin Access (IMPORTANT FOR AI TESTING)
**Purpose**: Allows AI assistants to test password-protected features without Telegram

**How to use**:
1. Go to https://phuketsummercamp.com/admin
2. Click "Use Test Login" link (appears below Telegram widget)
3. Enter password: `test123`
4. You're now logged in as Test Admin

**Test User Details**:
- Name: Test Admin
- Telegram ID: 123456789
- Username: testadmin
- Access: Full admin dashboard

**When to use this**:
- Testing admin features
- Verifying form submissions appear in dashboard
- Testing any password-protected pages
- Checking admin-only functionality

**Note**: This only works when `NEXT_PUBLIC_ALLOW_DEV_LOGIN=true` is set in environment variables (already configured)

---

## Quick Commands

```bash
# Test with Playwright (headless)
npx playwright test

# Test with Playwright (headed - see browser)
npx playwright test --headed

# Run Supabase migrations
npm run db:migrate supabase/migrations/your_migration.sql

# Check TypeScript
npx tsc --noEmit

# Build locally
npm run build

# Check Netlify deployment status (requires NETLIFY_AUTH_TOKEN)
export NETLIFY_AUTH_TOKEN=nfp_fi8Q61oLAnGC7pRXPYnCYECz71Gh2QHW9c70
curl -s -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" "https://api.netlify.com/api/v1/sites/9720022b-8cdc-44ac-a855-5ec15dd6746b/deploys?per_page=1" | jq '.[0] | {state: .state, created_at: .created_at}'
```

### Headless Browser Testing Pattern
When testing deployed changes, always use this pattern:
```javascript
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://phuketsummercamp.com', { waitUntil: 'networkidle' });
  // Your test code here
  await browser.close();
})();
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

### Recent Changes (2025-07-04)
1. **Fixed schedule grid alignment issues**:
   - Added ScheduleGridAdjuster component for dynamic row height adjustment
   - Fixed TypeScript errors with proper type assertions
   - Added non-breaking space (`&nbsp;`) to empty time-header cells
   - Increased min-height to 70px for both time-header and day-header cells
   - All header cells now align perfectly at 70px height

2. **Marketing materials created**:
   - Trifold brochure with sunny yellow design
   - A6 acrylic stand cards (front and back designs)
   - Multiple color variations for marketing materials
   - Set up redirect from /daycare to home page

3. **Build and deployment fixes**:
   - Resolved TypeScript compilation errors in ScheduleGridAdjuster
   - Fixed Netlify deployment failures
   - Verified deployments using Netlify API

### Known Issues
- No email notifications after registration
- No payment processing integration
- Registration success only shows on frontend, no email confirmation

### Next Priorities
1. Set up email notifications using Supabase Edge Functions or external service
2. Add payment gateway integration (consider local Thai payment options)
3. Add proper error handling and loading states
4. Implement registration confirmation/status page
5. Test all functionality with headless browser automation

---

## Facebook/Instagram Ads Tools & Learnings

### Recent Session (2025-07-04)
Created interactive tools for Facebook/Instagram ad copy testing and refinement:

#### Ad Copy Testing Tools Created:
1. **phuket-camp-ad-options.html** - Initial catalog of 30 ad variations
   - Categories: Luxury/Relaxation, Educational, Summer Camp, Problem/Solution
   - Structured format: Primary Text, Headline, Description

2. **ad-feedback-standalone.html** - Interactive feedback tool (Round 1)
   - Delete functionality (ads disappear when deleted)
   - Comment bubbles for specific feedback
   - Export functionality to share feedback data
   - LocalStorage persistence for saving progress

3. **ad-feedback-round2.html** - Refined feedback tool (Round 2)
   - 20 new ads based on Round 1 feedback
   - Focus shift to "holiday childcare for vacationing parents"
   - Added overall feedback section
   - Categories: Holiday, Direct, Freedom

#### Key Learnings from Ad Testing:
- **What didn't work**: Educational content, complex messaging, "enrichment" focus
- **What worked**: Simple summer camp angle, direct benefits, problem/solution format
- **Critical insight**: Focus on "parents who want a holiday with full day child care" not just camp
- **Winning message**: Full day childcare (8am-5pm) that lets parents enjoy their vacation

#### Abandoned Technical Experiments:
- **WebSocket server** (realtime-ad-feedback-server.js) - Too complex for simple feedback
- **AI auto-responder** (ai-auto-responder.js) - Not needed for this use case
- **Continuous monitor** (ai-continuous-monitor.js) - Overkill for feedback collection

#### Facebook Ads Strategy:
- Start with engagement campaign ($10/day) to build social proof
- Target affluent parents with children 3-6 who can afford $500/week
- Use text-only ads initially (expert recommendation)
- Test different angles through multiple ad variations