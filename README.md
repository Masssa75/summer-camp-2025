# Summer Camp 2025 Website

A modern, engaging website for Summer Camp 2025 featuring camp activities, registration information, and program details.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - AI assistant context and workflow
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical decisions and structure
- **[STYLE_GUIDE.md](./STYLE_GUIDE.md)** - Design system and code style
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Development workflow
- **[FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)** - Complete folder structure guide

## Project Structure

```
├── app/          # Next.js pages and API routes
├── components/   # React components
├── lib/          # Core utilities
├── hooks/        # Custom React hooks
├── types/        # TypeScript types
├── public/       # Static assets
├── scripts/      # Utility scripts
├── docs/         # Additional documentation
├── design/       # Design mockups (gitignored)
└── _testing/     # Test files (gitignored)
```

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Flexible (Telegram example included)
- **Deployment**: Netlify

## Template Features

- Complete documentation structure
- Multi-instance coordination (WORKING.md)
- Autonomous AI development support
- Clean folder organization
- Design mockup separation
- Test file management

## Contributing

See [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) for development workflow.