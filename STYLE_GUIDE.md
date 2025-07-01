# Style Guide

## Design DNA - Core Principles

### 1. Instant Wow Factor
- Within 3 seconds, users understand this is special
- First impression matters - make it count
- No generic Bootstrap look

### 2. Real Functionality
- Everything works - no fake buttons or "coming soon"
- If it's visible, it's functional
- Test every interaction

### 3. Aesthetic Excellence
- Pick a cohesive visual theme and stick to it
- Current theme: Dark mode with yellow accent (#F5D547)
- Bold typography, not timid
- Consistent spacing and alignment

### 4. Smooth Performance
- 60fps animations or don't animate
- Instant responses (< 100ms)
- Loading states for everything async
- No layout shifts

### 5. Mobile-First
- Perfect on phones (where most users are)
- Touch targets minimum 44px
- Thumbs can reach everything important
- Fast load times on cellular

### 6. No Unicode Emojis in UI
- Always use Font Awesome icons or custom SVGs
- Emojis only in user content, never in interface
- Consistent iconography

## Current Design System

### Colors
```css
--color-primary: #F5D547;      /* Yellow accent */
--color-background: #000000;    /* Pure black */
--color-surface: #111111;       /* Slightly lighter */
--color-text: #FFFFFF;          /* White text */
--color-text-secondary: rgba(255, 255, 255, 0.7);
--color-text-muted: rgba(255, 255, 255, 0.5);
--color-border: rgba(255, 255, 255, 0.1);
```

### Typography
```css
/* Scale */
--text-display: 48px;    /* Hero headings */
--text-title-lg: 36px;   /* Page titles */
--text-title: 24px;      /* Section headers */
--text-body: 16px;       /* Default */
--text-small: 14px;      /* Secondary info */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing
```css
/* Base unit: 4px */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
```

### Border Radius
```css
--radius-button: 25px;   /* Pills for buttons */
--radius-card: 16px;     /* Content cards */
--radius-input: 12px;    /* Form inputs */
--radius-small: 8px;     /* Small elements */
```

## Component Patterns

### Buttons
```tsx
/* Primary */
<button className="
  bg-primary text-black
  px-6 py-3
  rounded-full
  font-semibold
  hover:bg-primary/90
  active:scale-95
  transition-all
">

/* Secondary */
<button className="
  bg-white/10 text-white
  backdrop-blur-sm
  hover:bg-white/20
">
```

### Cards
```tsx
<div className="
  bg-surface
  border border-border
  rounded-2xl
  p-6
  hover:border-primary/50
  transition-colors
">
```

### Forms
```tsx
<input className="
  bg-white/5
  border border-white/10
  rounded-xl
  px-4 py-3
  text-white
  placeholder:text-white/50
  focus:border-primary
  focus:outline-none
">
```

## Animation Guidelines

### Transitions
- Use `transition-all` sparingly
- Prefer specific properties: `transition-colors`, `transition-transform`
- Duration: 150ms for micro, 300ms for normal
- Easing: Use default (ease-in-out)

### Hover Effects
- Scale: `hover:scale-105` for cards
- Opacity: `hover:opacity-80` for subtle
- Color: Always provide hover state
- Active: `active:scale-95` for buttons

### Loading States
```tsx
/* Skeleton */
<div className="animate-pulse bg-white/10 rounded-lg" />

/* Spinner */
<div className="animate-spin rounded-full border-2 border-primary border-t-transparent" />

/* Dots */
<span className="animate-bounce">.</span>
```

## Accessibility

### Focus States
- Always visible: `focus:ring-2 focus:ring-primary`
- High contrast: `focus:outline-none focus:border-primary`
- Skip links for keyboard navigation

### Touch Targets
- Minimum 44x44px
- Spacing between targets
- Clear active states

### Color Contrast
- Text on background: 15:1 (AAA)
- Important elements: Use yellow accent
- Never rely on color alone

## Code Style

### Component Structure
```tsx
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui'

// 2. Types
interface Props {
  title: string
  onAction: () => void
}

// 3. Component
export function MyComponent({ title, onAction }: Props) {
  // 4. State
  const [isOpen, setIsOpen] = useState(false)
  
  // 5. Handlers
  const handleClick = () => {
    setIsOpen(true)
    onAction()
  }
  
  // 6. Render
  return (
    <div>
      {/* Content */}
    </div>
  )
}
```

### Tailwind Class Order
1. Layout: `flex`, `grid`
2. Positioning: `absolute`, `top-0`
3. Sizing: `w-full`, `h-64`
4. Spacing: `p-4`, `m-2`
5. Typography: `text-lg`, `font-bold`
6. Colors: `bg-black`, `text-white`
7. Borders: `border`, `rounded-lg`
8. Effects: `shadow`, `opacity`
9. Transitions: `transition`, `hover:`
10. Responsive: `md:`, `lg:`

## File Naming
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Types: `types/feature-name.ts`
- API routes: `app/api/resource/route.ts`