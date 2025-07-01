# Complete Folder Structure

This is the standard folder structure for all projects:

```
Learn2/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── posts/        # Content endpoints  
│   │   └── users/        # User endpoints
│   ├── (auth)/           # Protected routes group
│   ├── admin/            # Admin pages
│   ├── components/       # Page-specific components
│   ├── lib/              # Page-specific utilities
│   ├── hooks/            # Page-specific hooks
│   ├── types/            # Page-specific types
│   ├── utils/            # Page-specific utils
│   ├── styles/           # Page-specific styles
│   ├── globals.css       # Global CSS
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
│
├── components/            # Shared React components
│   ├── ui/               # Base UI components (buttons, inputs)
│   ├── features/         # Feature components (feed, auth)
│   └── layouts/          # Layout components (header, footer)
│
├── lib/                   # Core libraries
│   ├── supabase.ts       # Database client setup
│   └── utils.ts          # Shared utilities
│
├── hooks/                 # Shared custom React hooks
├── types/                 # Shared TypeScript types
├── utils/                 # Shared helper functions
├── styles/               # Additional global styles
├── public/               # Static assets (images, fonts)
│
├── scripts/              # Utility scripts
│   ├── deployment/       # Deployment helpers
│   ├── database/         # Database utilities
│   └── dev/              # Development tools
│
├── docs/                 # Additional documentation
│   ├── decisions/        # Architecture Decision Records
│   ├── guides/           # Specific how-to guides
│   └── API_KEYS_GUIDE.md # How to get API keys
│
├── design/               # Design mockups (GITIGNORED)
│   └── README.md         # Explains folder purpose
│
├── _testing/             # Test files (GITIGNORED)
│   └── README.md         # Explains folder purpose
│
# Root Files (all essential)
├── .env.local            # Environment variables (GITIGNORED)
├── .env.local.example    # Template for env vars
├── .eslintrc.json        # ESLint configuration
├── .gitignore            # Git ignore patterns
├── ARCHITECTURE.md       # Technical decisions
├── CLAUDE.md             # AI assistant context
├── DEVELOPMENT_GUIDE.md  # Dev workflow
├── FOLDER_STRUCTURE.md   # This file
├── MIGRATION_PLAN.md     # Migration steps
├── README.md             # Project overview
├── STYLE_GUIDE.md        # Design & code style
├── WORKING.md            # Multi-instance coordination
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies
├── playwright.config.ts  # Test configuration
├── postcss.config.js     # PostCSS config
├── tailwind.config.js    # Tailwind config
└── tsconfig.json         # TypeScript config
```

## Folder Purposes

### `/app` Directory
Next.js App Router - all pages and API routes go here. Can have nested folders for organization.

### `/components` Directory  
Reusable React components shared across pages. Organized by type:
- `ui/` - Basic building blocks
- `features/` - Feature-specific components
- `layouts/` - Page layouts

### `/lib` Directory
Core setup files and utilities used throughout the app.

### `/scripts` Directory
Node.js scripts for automation:
- Deployment checks
- Database operations
- Development helpers

### `/docs` Directory
Extended documentation that doesn't fit in root MD files.

### Special Folders
- `/design` - HTML mockups, never committed
- `/_testing` - All test files, never committed
- Both have README files explaining their purpose

## When to Use Which Folder

**Page-specific code**: Put in `/app/[page]/components`  
**Shared components**: Put in `/components`  
**API routes**: Always in `/app/api`  
**Types used once**: Near where they're used  
**Types used multiple places**: In `/types`  
**Test files**: Always in `/_testing`  
**Design mockups**: Always in `/design`