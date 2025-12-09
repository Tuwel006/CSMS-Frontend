# Collapsible Player Sections Feature

## Overview
Added collapsible functionality to the player input form and player list in the TeamSetup component for better UI organization and space management.

## Features Added

### 1. Collapsible Player Input Form
- **Toggle Button**: Click to show/hide the player input form
- **Visual Indicator**: Chevron icon (up/down) shows current state
- **Default State**: Expanded (visible) by default
- **Smooth Transition**: Hover effect on toggle button

### 2. Collapsible Player List
- **Toggle Button**: Click to show/hide the list of added players
- **Visual Indicator**: Chevron icon (up/down) shows current state
- **Default State**: Expanded (visible) by default
- **Player Count**: Shows number of players in the header

## UI Components

### Player Input Section Header
```
┌─────────────────────────────────────┐
│ Add Player                    ▲     │  ← Click to collapse
├─────────────────────────────────────┤
│ [Player Name] [ID] [Role]           │
│ [Clear] [Save]                      │
└─────────────────────────────────────┘
```

When collapsed:
```
┌─────────────────────────────────────┐
│ Add Player                    ▼     │  ← Click to expand
└─────────────────────────────────────┘
```

### Player List Section Header
```
┌─────────────────────────────────────┐
│ TEAM 1 PLAYERS (4)            ▲     │  ← Click to collapse
├─────────────────────────────────────┤
│ Player A  #123  Batsman  [Edit][Del]│
│ Player B  #124  Bowler   [Edit][Del]│
│ Player C  #125  All-rounder [Edit][Del]│
│ Player D  #126  Wicket Keeper [Edit][Del]│
└─────────────────────────────────────┘
```

When collapsed:
```
┌─────────────────────────────────────┐
│ TEAM 1 PLAYERS (4)            ▼     │  ← Click to expand
└─────────────────────────────────────┘
```

## Implementation Details

### State Management
```typescript
// Collapsible states
const [showPlayerInput, setShowPlayerInput] = useState(true);
const [showPlayerList, setShowPlayerList] = useState(true);
```

### Icons Used
- `ChevronUp`: Indicates section is expanded (can be collapsed)
- `ChevronDown`: Indicates section is collapsed (can be expanded)

### Toggle Buttons
- Full-width clickable area
- Hover effect for better UX
- Smooth transitions
- Accessible with proper button semantics

## Benefits

1. **Space Saving**: Collapse sections you're not currently using
2. **Better Focus**: Hide the input form when reviewing players
3. **Cleaner UI**: Reduce visual clutter when managing multiple teams
4. **Flexibility**: Each section can be independently collapsed/expanded

## User Interactions

### Typical Workflow
1. **Adding Players**:
   - Player input is expanded by default
   - Fill in player details
   - Click Save
   - Player appears in the list below

2. **Reviewing Players**:
   - Collapse the input form
   - Expand the player list
   - Review all added players

3. **Editing Players**:
   - Click Edit on a player in the list
   - Input form auto-expands (if collapsed)
   - Make changes
   - Click Update

4. **Clean View**:
   - Collapse both sections
   - Only team header visible
   - Minimal space usage

## Styling

### Toggle Button Classes
```css
.toggle-button {
  - Full width
  - Flex layout (space-between)
  - Hover: Light background
  - Padding: 8px
  - Rounded corners
  - Smooth transitions
}
```

### Chevron Icons
- Size: 18-20px
- Color: Gray (500)
- Positioned on the right
- Changes based on state

## Accessibility

- ✅ Semantic `<button>` elements
- ✅ Full keyboard navigation
- ✅ Clear visual indicators
- ✅ Hover states for feedback
- ✅ Logical tab order

## Future Enhancements

### Potential Additions
1. **Remember State**: Save collapse state to localStorage
2. **Animations**: Add smooth slide animations
3. **Collapse All**: Button to collapse all sections at once
4. **Auto-collapse**: Collapse input after saving a player
5. **Keyboard Shortcuts**: Space/Enter to toggle

### Example: Remember State
```typescript
useEffect(() => {
  const saved = localStorage.getItem(`team${teamNumber}_playerInputCollapsed`);
  if (saved !== null) {
    setShowPlayerInput(saved === 'false');
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    `team${teamNumber}_playerInputCollapsed`, 
    String(!showPlayerInput)
  );
}, [showPlayerInput]);
```

## Testing Checklist

- [x] Player input section toggles correctly
- [x] Player list section toggles correctly
- [x] Chevron icons change direction
- [x] Hover effects work
- [x] Both sections can be collapsed simultaneously
- [x] Both sections can be expanded simultaneously
- [x] Editing a player works when input is collapsed
- [x] Adding a player works normally
- [x] No layout shifts when toggling
- [x] Works on mobile/responsive layouts

## Code Changes

### Files Modified
- `src/components/TeamSetup.tsx`

### Changes Made
1. Added `ChevronDown` and `ChevronUp` imports from lucide-react
2. Added `showPlayerInput` and `showPlayerList` state variables
3. Wrapped player input form in collapsible container
4. Wrapped player list in collapsible container
5. Added toggle buttons with chevron icons
6. Added hover effects and transitions

### Lines of Code
- Added: ~40 lines
- Modified: ~30 lines
- Total impact: ~70 lines

## Visual Preview

### Fully Expanded (Default)
```
┌─────────────────────────────────────┐
│ Team 1                              │
│ Build your first team               │
├─────────────────────────────────────┤
│ [Team Name] [Location] [ID]         │
│ [Clear] [Save]                      │
├─────────────────────────────────────┤
│ Add Player                    ▲     │
│ [Player Name] [ID] [Role]           │
│ [Clear] [Save]                      │
├─────────────────────────────────────┤
│ TEAM 1 PLAYERS (2)            ▲     │
│ Player A  #123  Batsman             │
│ Player B  #124  Bowler              │
└─────────────────────────────────────┘
```

### Fully Collapsed
```
┌─────────────────────────────────────┐
│ Team 1                              │
│ Build your first team               │
├─────────────────────────────────────┤
│ [Team Name] [Location] [ID]         │
│ [Clear] [Save]                      │
├─────────────────────────────────────┤
│ Add Player                    ▼     │
├─────────────────────────────────────┤
│ TEAM 1 PLAYERS (2)            ▼     │
└─────────────────────────────────────┘
```

Much cleaner and space-efficient! 🎉
