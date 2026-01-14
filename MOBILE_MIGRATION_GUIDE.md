# Mobile Layout Migration Guide

## Overview
This guide helps you migrate existing pages to the new mobile-first component library.

## Step-by-Step Migration

### 1. Update Layout Component
Replace `AdminLayout` with `MobileAdminLayout` in `Layout.tsx` (already done).

### 2. Update Imports
```tsx
// Add to your page imports
import { Box, Stack, GridLayout, IconButton, Section } from '@/components/ui/lib';
```

### 3. Replace Container Divs

#### Pattern 1: Card Containers
**Before:**
```tsx
<div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4">
```

**After:**
```tsx
<Box p="md" bg="card" border rounded="md">
```

#### Pattern 2: Flex Containers
**Before:**
```tsx
<div className="flex items-center justify-between gap-4">
```

**After:**
```tsx
<Stack direction="row" align="center" justify="between" gap="md">
```

#### Pattern 3: Grid Layouts
**Before:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

**After:**
```tsx
<GridLayout cols={3} gap="md" responsive>
```

### 4. Replace Buttons with Icons

**Before:**
```tsx
<Button onClick={handleClick} variant="outline" size="sm">
  <Settings size={16} />
  Settings
</Button>
```

**After:**
```tsx
<IconButton
  icon={<Settings size={18} />}
  onClick={handleClick}
  tooltip="Settings"
  variant="secondary"
  size="sm"
/>
```

### 5. Add Mobile Padding

**Before:**
```tsx
<div className="p-4">
```

**After:**
```tsx
<Box p="sm" className="md:p-6">
```

### 6. Add Bottom Padding for Mobile Nav

**Before:**
```tsx
<div className="h-[calc(100vh-4rem)] overflow-y-auto">
```

**After:**
```tsx
<Box className="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] overflow-y-auto pb-20 lg:pb-4">
```

## Page-Specific Migrations

### ScoreEdit Page
✅ **Completed** - See `ScoreEditRefactored.tsx`

Key changes:
- Replaced all divs with Box/Stack components
- Added IconButton for header controls
- Used GridLayout for score cards
- Added mobile bottom padding (pb-20 lg:pb-4)
- Responsive height calculations

### TeamManagement Page
✅ **Completed** - See `TeamManagementRefactored.tsx`

Key changes:
- Tab navigation with icons
- Responsive tab labels (full text on desktop, short on mobile)
- Box wrapper with responsive padding
- Icon-first design

### Remaining Pages to Migrate

#### 1. Home/Dashboard
- [ ] Replace container divs with Box
- [ ] Use GridLayout for card grids
- [ ] Add IconButton for actions
- [ ] Add mobile bottom padding

#### 2. Player Management
- [ ] Replace table containers with Box
- [ ] Use Stack for filters
- [ ] Add IconButton for edit/delete
- [ ] Responsive table layout

#### 3. Statistics
- [ ] Replace chart containers with Box
- [ ] Use GridLayout for stat cards
- [ ] Add IconButton for filters
- [ ] Mobile-friendly charts

#### 4. Settings
- [ ] Replace form containers with Box
- [ ] Use Stack for form groups
- [ ] Add IconButton for actions
- [ ] Mobile-optimized forms

## Common Patterns

### Page Container
```tsx
<Box p="sm" className="md:p-6 pb-20 lg:pb-4">
  {/* Page content */}
</Box>
```

### Section with Header
```tsx
<Section 
  title="Section Title"
  subtitle="Optional description"
  action={<IconButton icon={<Plus />} tooltip="Add" />}
>
  {/* Section content */}
</Section>
```

### Two-Column Layout
```tsx
<GridLayout cols={2} gap="md" className="mb-4">
  <Box p="md" bg="card" border rounded="md">
    {/* Left column */}
  </Box>
  <Box p="md" bg="card" border rounded="md">
    {/* Right column */}
  </Box>
</GridLayout>
```

### Action Bar
```tsx
<Stack direction="row" justify="between" align="center" className="mb-4">
  <h2 className="text-xl font-bold">Title</h2>
  <Stack direction="row" gap="sm">
    <IconButton icon={<Filter />} tooltip="Filter" />
    <IconButton icon={<Download />} tooltip="Export" />
    <IconButton icon={<Plus />} tooltip="Add" variant="primary" />
  </Stack>
</Stack>
```

### Mobile-Responsive Text
```tsx
<h1 className="text-base md:text-xl lg:text-2xl font-bold">
  Responsive Heading
</h1>
```

### Mobile-Responsive Grid
```tsx
<GridLayout cols={1} gap="sm" className="sm:grid-cols-2 lg:grid-cols-4">
  {/* Auto-adjusts: 1 col mobile, 2 cols tablet, 4 cols desktop */}
</GridLayout>
```

## Testing Checklist

After migrating a page, test:

- [ ] Mobile view (< 640px)
  - [ ] Bottom navigation visible and functional
  - [ ] Content doesn't overlap with bottom nav
  - [ ] Touch targets are at least 44px
  - [ ] Horizontal scrolling is prevented
  
- [ ] Tablet view (640px - 1024px)
  - [ ] Layout adjusts appropriately
  - [ ] Sidebar drawer works
  - [ ] Grid columns adjust
  
- [ ] Desktop view (> 1024px)
  - [ ] Sidebar collapsible
  - [ ] No bottom navigation
  - [ ] Full layout visible
  
- [ ] Dark mode
  - [ ] All components render correctly
  - [ ] Colors are appropriate
  
- [ ] Interactions
  - [ ] Tooltips appear on hover
  - [ ] Buttons are clickable
  - [ ] Modals work on mobile

## Tips

1. **Start Small**: Migrate one component at a time
2. **Test Often**: Check mobile view after each change
3. **Use Icons**: Replace text buttons with IconButton + tooltip
4. **Consistent Spacing**: Use the spacing scale (xs, sm, md, lg, xl)
5. **Mobile First**: Design for mobile, then add desktop enhancements
6. **Semantic Names**: Use Box, Stack, Grid instead of generic divs
7. **Avoid Inline Styles**: Use className for custom styles

## Common Issues

### Issue: Content hidden behind bottom nav
**Solution:** Add `pb-20 lg:pb-4` to page container

### Issue: Horizontal scroll on mobile
**Solution:** Add `overflow-x-hidden` to page container

### Issue: Touch targets too small
**Solution:** Use minimum `size="md"` for IconButton on mobile

### Issue: Text too large on mobile
**Solution:** Use responsive text classes: `text-sm md:text-base lg:text-lg`

### Issue: Grid doesn't adjust on mobile
**Solution:** Set `responsive={true}` on GridLayout

## Need Help?

Refer to:
- `/src/components/ui/lib/README.md` - Component documentation
- `/src/pages/ScoreEdit/ScoreEditRefactored.tsx` - Example implementation
- `/src/components/layout/MobileAdminLayout.tsx` - Layout example
