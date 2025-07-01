# API Keys Guide

## Required Keys for Autonomous Work

### Supabase Keys
- **SUPABASE_SERVICE_ROLE_KEY**: Full database access, bypasses RLS
  - Get from: Supabase Dashboard → Settings → API
  - Allows: Schema changes, admin operations, bypassing RLS

### Netlify Automation
- **NETLIFY_AUTH_TOKEN**: Deploy and manage sites
  - Get from: Netlify → User Settings → Applications → Personal Access Tokens
  - Create new token with full access
  - Allows: Check deployments, trigger builds, manage env vars

### GitHub Automation  
- **GITHUB_TOKEN**: Repository management
  - Get from: GitHub → Settings → Developer Settings → Personal Access Tokens
  - Scopes needed: repo (full control)
  - Allows: Push to main, create branches, manage secrets

### Development Access
- **DEV_LOGIN_PASSWORD**: Access test users without Telegram
  - Choose a secure password
  - Enables `/test-auth` route

## How to Get These Keys

1. **Supabase**: Already have project? Use existing keys
2. **Netlify**: Create personal access token (one-time setup)
3. **GitHub**: Create PAT with repo scope
4. **Telegram**: Create bot via @BotFather

## Security Notes
- Never commit `.env` file
- Rotate keys if exposed
- Use different keys per project when possible