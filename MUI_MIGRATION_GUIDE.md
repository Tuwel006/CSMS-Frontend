# Material-UI Migration Guide

## Overview
This document outlines the comprehensive migration of the CSMS-Frontend project to Material-UI (MUI) v7, implementing a professional, clean design system with minimal border radius and consistent component styling.

## Key Changes

### 1. Theme Configuration (`src/theme/muiTheme.ts`)
- **Created professional theme** with minimal border radius (4px)
- **Dual theme support**: Light and Dark modes
- **Professional color palette**:
  - Primary: `#1976d2` (light) / `#42a5f5` (dark)
  - Secondary: `#9c27b0`
  - Success, Error, Warning, Info colors configured
- **Typography**: Inter font family with proper hierarchy
- **Component overrides**: Customized Button, Card, Paper, TextField, Chip, AppBar

### 2. App Integration (`src/App.tsx`)
- **Added MUI ThemeProvider** wrapping the entire app
- **Integrated CssBaseline** for consistent baseline styles
- **Synced with existing ThemeContext** for seamless theme switching
- **Maintained all existing functionality** (ToastContainer, routing, providers)

### 3. Header Component (`src/components/layout/Header.tsx`)
- **Replaced custom header** with MUI AppBar and Toolbar
- **Professional styling**:
  - Sticky positioning with elevation={1}
  - Clean background using theme palette
  - Proper spacing and alignment
- **Components used**:
  - AppBar, Toolbar, Typography, IconButton, Avatar, Box
- **Maintained functionality**: Theme toggle, search, profile dropdown

### 4. MatchSchedule Component (`src/components/MatchSchedule.tsx`)
- **Complete rewrite** using MUI components
- **Replaced custom components** with:
  - Card and CardContent for containers
  - TextField for inputs (text, number, select)
  - Stack and Box for layout (avoiding Grid v7 issues)
  - List, ListItem, ListItemButton for player selection
  - Chip for badges
  - ToggleButtonGroup for toss selection
  - Collapse for expandable sections
  - IconButton for actions
- **Professional features**:
  - Minimal border radius (4px)
  - Proper spacing using Stack
  - Responsive layout with useMediaQuery
  - Clean visual hierarchy
  - Smooth transitions
- **Preserved all logic**: Team selection, player management, toss handling

## Design Principles

### 1. Minimal Border Radius
- All components use 4px border radius
- Consistent across buttons, cards, inputs, chips
- Professional, clean appearance

### 2. Small, Focused Components
- Each component has a single responsibility
- Proper use of MUI's composition model
- Reusable and maintainable

### 3. Professional Styling
- Subtle shadows (elevation={1})
- Proper color contrast
- Consistent spacing (using theme spacing units)
- Clean typography hierarchy

### 4. Theme Consistency
- All colors from theme palette
- Proper dark/light mode support
- Consistent component behavior

## Component Mapping

### Old → New
- `<Button>` (custom) → `<Button>` (MUI)
- `<Input>` (custom) → `<TextField>` (MUI)
- `<div className="...">` → `<Box sx={{...}}>` or `<Stack>`
- Custom cards → `<Card>` with `<CardContent>`
- Custom headers → `<AppBar>` with `<Toolbar>`
- Custom badges → `<Chip>`
- Custom toggles → `<ToggleButtonGroup>`

## Benefits

### 1. Consistency
- Unified design language across the app
- Predictable component behavior
- Professional appearance

### 2. Accessibility
- MUI components are WCAG compliant
- Proper ARIA labels
- Keyboard navigation support

### 3. Maintainability
- Less custom CSS to maintain
- Well-documented MUI API
- Community support

### 4. Performance
- Optimized component rendering
- Proper tree-shaking
- Smaller bundle size (removing custom components)

### 5. Developer Experience
- TypeScript support out of the box
- IntelliSense for all props
- Comprehensive documentation

## Migration Strategy

### Phase 1: Core Setup ✅
- [x] Create theme configuration
- [x] Integrate MUI ThemeProvider
- [x] Update App.tsx

### Phase 2: Layout Components ✅
- [x] Migrate Header
- [ ] Migrate Sidebar
- [ ] Migrate Footer (if exists)

### Phase 3: Feature Components ✅
- [x] Migrate MatchSchedule
- [ ] Migrate TeamCard
- [ ] Migrate TeamSetup
- [ ] Migrate other feature components

### Phase 4: UI Components
- [ ] Replace custom Button (if still used)
- [ ] Replace custom Input (if still used)
- [ ] Replace other custom UI components

### Phase 5: Pages
- [ ] Migrate Login page
- [ ] Migrate Dashboard pages
- [ ] Migrate other pages

## Usage Examples

### Using Theme in Components
```tsx
import { useTheme } from '@mui/material';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      bgcolor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    }}>
      Content
    </Box>
  );
}
```

### Responsive Layouts
```tsx
import { Stack, useMediaQuery, useTheme } from '@mui/material';

function ResponsiveLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
      {/* Content */}
    </Stack>
  );
}
```

### Custom Styling
```tsx
import { Button } from '@mui/material';

function CustomButton() {
  return (
    <Button 
      variant="contained"
      sx={{
        borderRadius: 1, // 4px
        textTransform: 'none',
        fontWeight: 500,
      }}
    >
      Click Me
    </Button>
  );
}
```

## Best Practices

1. **Use theme values**: Always use `theme.palette`, `theme.spacing`, etc.
2. **Avoid inline styles**: Use `sx` prop instead
3. **Leverage composition**: Combine MUI components
4. **Maintain consistency**: Follow the established patterns
5. **Test responsiveness**: Use `useMediaQuery` for responsive designs
6. **Accessibility first**: Use proper semantic HTML and ARIA labels

## Next Steps

1. **Continue migration**: Follow the migration strategy phases
2. **Update documentation**: Document new patterns as they emerge
3. **Code review**: Ensure consistency across the codebase
4. **Performance testing**: Monitor bundle size and render performance
5. **User feedback**: Gather feedback on the new design

## Resources

- [Material-UI Documentation](https://mui.com/material-ui/getting-started/)
- [Theme Customization](https://mui.com/material-ui/customization/theming/)
- [Component API](https://mui.com/material-ui/api/button/)
- [Migration Guide](https://mui.com/material-ui/migration/migration-v4/)
