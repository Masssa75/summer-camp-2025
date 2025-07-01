# Architecture

## Project Structure

```
Learn2/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── posts/        # Content endpoints
│   │   └── users/        # User endpoints
│   ├── (auth)/           # Protected pages
│   ├── admin/            # Admin dashboard
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles
│
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── features/         # Feature components
│   └── layouts/          # Layout components
│
├── lib/                   # Core libraries
│   ├── supabase.ts       # Database client
│   └── utils.ts          # Utilities
│
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
├── utils/                 # Helper functions
├── styles/               # Additional styles
├── public/               # Static assets
│
├── scripts/              # Utility scripts
│   ├── deployment/       # Deploy helpers
│   ├── database/         # DB utilities
│   └── dev/              # Dev tools
│
├── docs/                 # Documentation
│   ├── decisions/        # ADRs
│   └── guides/           # How-tos
│
├── design/               # Design files (GITIGNORED)
├── _testing/             # Test files (GITIGNORED)
│
└── [config files]        # Root config
```

## Tech Stack Decisions

### Frontend
- **Next.js 15**: App Router, Server Components, better performance
- **TypeScript**: Type safety, better DX
- **Tailwind CSS**: Utility-first, consistent styling

### Backend  
- **Supabase**: PostgreSQL, Auth ready, Real-time, RLS
- **Next.js API Routes**: Serverless, easy deployment

### Authentication
- **Telegram Login**: Target audience uses it, no passwords
- **Session Cookies**: Simple, secure, works everywhere

### Deployment
- **Netlify**: Great Next.js support, easy env vars, preview deploys

## Data Flow Patterns

### API Pattern
```
Client → API Route → Validation → Supabase → Response
```

### Auth Pattern
```
Telegram → Callback → Create Session → Cookie → Protected Routes
```

### State Management
- Server State: React Query / SWR
- Client State: React useState/useContext
- No heavy state libraries needed

## Security Architecture

### API Security
- Session validation on all protected routes
- Service role key only for admin operations
- Input validation with Zod
- Rate limiting on sensitive endpoints

### Database Security
- Row Level Security (RLS) enabled
- Anon key for public operations
- Service key for admin only
- Never expose service key to client

## Performance Guidelines

### Optimization Priority
1. Server Components by default
2. Client Components only when needed
3. Dynamic imports for heavy components
4. Image optimization with next/image
5. Font optimization with next/font

### Caching Strategy
- Static pages where possible
- ISR for dynamic content
- API response caching
- Supabase query caching