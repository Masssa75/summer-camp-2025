# Project Template Usage Guide

## How to Use This Template

1. **Copy the template folder** to your new project location
   ```bash
   cp -r /path/to/template /path/to/your-project
   cd your-project
   ```

2. **Update project-specific files**:
   - Edit `CLAUDE.md` - Fill in [PROJECT NAME] and project details
   - Update `package.json` - Change name to your project
   - Modify `README.md` - Add your project description
   - Update `.env.local.example` with project-specific keys

3. **Set up services**:
   - Create Supabase project
   - Create GitHub repository
   - Create Netlify site
   - Get all required API keys

4. **Initialize git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit from template"
   git remote add origin [your-repo-url]
   git push -u origin main
   ```

5. **Install dependencies**:
   ```bash
   npm install
   ```

6. **Configure environment**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your keys
   ```

## What's Included

### Documentation (7 files)
- CLAUDE.md - AI workflow guide
- ARCHITECTURE.md - Tech decisions
- STYLE_GUIDE.md - Design system
- DEVELOPMENT_GUIDE.md - Dev workflow
- FOLDER_STRUCTURE.md - Directory guide
- README.md - Project overview
- WORKING.md - Multi-instance coordination

### Complete Folder Structure
- All Next.js app folders
- Component organization
- Script directories
- Documentation folders
- Special gitignored folders (design/, _testing/)

### Configuration Files
- Next.js, TypeScript, Tailwind configs
- ESLint, Playwright setups
- Proper .gitignore
- Environment template

### Features
- Dark theme with yellow accent
- Responsive design system
- Autonomous AI development support
- Multi-instance coordination
- Clean separation of concerns

## Customization Checklist

- [ ] Update CLAUDE.md with project details
- [ ] Set color scheme in tailwind.config.js
- [ ] Modify STYLE_GUIDE.md design tokens
- [ ] Add project-specific folders if needed
- [ ] Update auth method if not using Telegram
- [ ] Add any special dependencies
- [ ] Configure additional API integrations

## Tips

1. **Keep the structure** - It's designed for AI collaboration
2. **Use WORKING.md** - Essential for multi-instance work
3. **Follow the workflow** - Push immediately, test on deployed
4. **Document gotchas** - Add to CLAUDE.md as you discover them
5. **Maintain separation** - Keep test files in _testing/, designs in design/

This template ensures consistent, well-documented projects that support autonomous AI development!