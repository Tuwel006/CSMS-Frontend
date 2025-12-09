# UI Fix: Dark Mode Hover Styles

## Problem
In dark theme, the hover background for the collapsible section headers (Player Input & Player List) was appearing "too white", making the text and content difficult to read.

## Cause
The previous style used `dark:hover:bg-gray-800`. 
Depending on the color palette, `gray-800` can appear as a light gray block when placed on a deeper dark background (like `gray-900` or `black`), creating a high contrast that washes out text or looks inconsistent with a dark theme.

## Solution
Updated the hover class to use a semi-transparent white overlay instead of a solid gray color.

**Old Class**:
`dark:hover:bg-gray-800`

**New Class**:
`dark:hover:bg-white/5` (White with 5% opacity)

## Benefits
1. **Subtlety**: Provides a clear hover indication without being overwhelming.
2. **Compatibility**: Works well on any dark background color (gray, blue-gray, black).
3. **Legibility**: Keeps the text (which is light in dark mode) clearly visible against the background.

## Affected Components
- `TeamSetup.tsx`
  - "Add Player/Edit Player" collapsible header
  - "Team Players" collapsible header
- `Sidebar.tsx`
  - Sidebar Toggle Button (at top)
  - Navigation Links

## Changes Summary

### TeamSetup.tsx
- Replaced `dark:hover:bg-gray-800` with `dark:hover:bg-white/5`

### Sidebar.tsx
- **Hover State**: Replaced `dark:hover:bg-gray-700` with `dark:hover:bg-white/5`
- **Active State**: Replaced `dark:bg-gray-700` with `dark:bg-white/10`

The hover effects are now a subtle lightening of the background across the application, preserving the "dark mode" aesthetic and avoiding harsh white contrast.
