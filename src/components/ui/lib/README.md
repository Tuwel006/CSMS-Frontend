# Mobile-First Component Library

## Overview
This library provides reusable, mobile-responsive UI components for building consistent layouts across the application.

## Components

### Layout Components

#### `Box`
Flexible container with consistent spacing and styling.

```tsx
import { Box } from '@/components/ui/lib';

<Box p="md" bg="card" border rounded="md" shadow="sm">
  Content here
</Box>
```

**Props:**
- `p`: Padding - 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `m`: Margin - 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `bg`: Background - 'card' | 'hover' | 'transparent'
- `rounded`: Border radius - 'none' | 'sm' | 'md' | 'lg' | 'full'
- `border`: Boolean for border
- `shadow`: Shadow - 'none' | 'sm' | 'md' | 'lg'

#### `Stack`
Flexbox container for directional layouts.

```tsx
import { Stack } from '@/components/ui/lib';

<Stack direction="row" gap="md" align="center" justify="between">
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>
```

**Props:**
- `direction`: 'row' | 'col'
- `gap`: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `align`: 'start' | 'center' | 'end' | 'stretch'
- `justify`: 'start' | 'center' | 'end' | 'between' | 'around'
- `wrap`: Boolean for flex-wrap

#### `GridLayout`
Responsive grid system.

```tsx
import { GridLayout } from '@/components/ui/lib';

<GridLayout cols={3} gap="md" responsive>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</GridLayout>
```

**Props:**
- `cols`: 1 | 2 | 3 | 4 | 6 | 12
- `gap`: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `responsive`: Boolean (auto-adjusts columns for mobile)

#### `Section`
Page section with optional title and action.

```tsx
import { Section } from '@/components/ui/lib';

<Section 
  title="Score Details" 
  subtitle="Current match statistics"
  action={<Button>Action</Button>}
>
  Content here
</Section>
```

### Interactive Components

#### `IconButton`
Button with icon and optional tooltip.

```tsx
import { IconButton } from '@/components/ui/lib';
import { Settings } from 'lucide-react';

<IconButton
  icon={<Settings size={18} />}
  tooltip="Settings"
  variant="ghost"
  size="md"
  onClick={handleClick}
/>
```

**Props:**
- `icon`: ReactNode (icon element)
- `tooltip`: String (optional)
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'

#### `Tooltip`
Hover tooltip wrapper.

```tsx
import { Tooltip } from '@/components/ui/lib';

<Tooltip content="Click to edit" position="top">
  <button>Edit</button>
</Tooltip>
```

## Mobile-First Layout System

### Responsive Header
- Desktop: Full header with search and profile
- Mobile: Compact header with hamburger menu

### Responsive Sidebar
- Desktop: Collapsible sidebar (16px collapsed, 208px expanded)
- Mobile: Drawer overlay + bottom navigation bar

### Bottom Navigation (Mobile Only)
- Fixed bottom bar with 5 main navigation items
- Icons with labels
- Active state highlighting

## Usage Examples

### Score Edit Page
```tsx
import { Box, Stack, GridLayout, IconButton } from '@/components/ui/lib';

<Box p="sm" className="h-[calc(100vh-3.5rem)] overflow-y-auto pb-20 lg:pb-4">
  <Stack direction="row" justify="between" align="center" className="mb-3">
    <IconButton icon={<Menu />} tooltip="Menu" />
    <IconButton icon={<Eye />} tooltip="Preview" />
  </Stack>
  
  <GridLayout cols={2} gap="sm">
    <CurrentScoreCard />
    <RecentOversCard />
  </GridLayout>
</Box>
```

### Team Management Page
```tsx
import { Box, Stack } from '@/components/ui/lib';

<Box p="none">
  <Stack direction="row" gap="none">
    <TabButton active>Setup</TabButton>
    <TabButton>Start</TabButton>
  </Stack>
  
  <Box p="sm" className="md:p-6">
    <TabContent />
  </Box>
</Box>
```

## Design Principles

1. **Mobile-First**: All components are designed for mobile and scale up
2. **Consistent Spacing**: Use predefined spacing scales (xs, sm, md, lg, xl)
3. **Icon-First**: Use icons with tooltips instead of long text labels
4. **Responsive Grids**: Auto-adjust columns based on screen size
5. **Touch-Friendly**: Minimum 44px touch targets on mobile
6. **Performance**: Minimal re-renders with React.memo
7. **Accessibility**: Proper ARIA labels and keyboard navigation

## Spacing Scale
- `none`: 0
- `xs`: 0.25rem (4px)
- `sm`: 0.5rem (8px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)

## Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Migration Guide

### Before (Old Pattern)
```tsx
<div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4">
  <div className="flex items-center justify-between mb-4">
    <h3>Title</h3>
    <button>Action</button>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>Item 1</div>
    <div>Item 2</div>
  </div>
</div>
```

### After (New Pattern)
```tsx
<Box p="md" bg="card" border rounded="md">
  <Stack direction="row" justify="between" align="center" className="mb-4">
    <h3>Title</h3>
    <button>Action</button>
  </Stack>
  <GridLayout cols={2} gap="md">
    <div>Item 1</div>
    <div>Item 2</div>
  </GridLayout>
</Box>
```

## Benefits

1. **Less Code**: Reduce repetitive className strings
2. **Consistency**: Enforced design system
3. **Maintainability**: Change styles in one place
4. **Readability**: Semantic component names
5. **Mobile-Optimized**: Built-in responsive behavior
6. **Type Safety**: Full TypeScript support
