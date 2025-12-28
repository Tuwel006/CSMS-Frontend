# Score Editor Components

## New Beautiful Score Editor Components

### Layout Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    Current Score Card                        │
│  (Gradient Blue-Purple, Large Score Display, Run Rates)     │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────┐
│                                  │                          │
│     Batting Management           │   Over Management        │
│  ┌────────────────────────────┐  │  ┌────────────────────┐ │
│  │ ⭐ Striker (Green)         │  │  │ Current Over       │ │
│  │   Name: 45 runs (32 balls) │  │  │ [●][●][●][●][ ][ ]│ │
│  └────────────────────────────┘  │  └────────────────────┘ │
│  ┌────────────────────────────┐  │  ┌────────────────────┐ │
│  │ Non-Striker (Gray)         │  │  │ Current Bowler     │ │
│  │   Name: 28 runs (21 balls) │  │  │ [Dropdown]         │ │
│  └────────────────────────────┘  │  └────────────────────┘ │
│  ┌────────────────────────────┐  │  ┌────────────────────┐ │
│  │ Next Batsman [Dropdown]    │  │  │ Next Bowler        │ │
│  └────────────────────────────┘  │  │ [Dropdown]         │ │
│  ┌────────────────────────────┐  │  └────────────────────┘ │
│  │ Partnership: 73 runs       │  │  ┌────────────────────┐ │
│  └────────────────────────────┘  │  │ Recent Overs       │ │
│                                  │  │ Over 10: 12 runs   │ │
│     Ball Outcome Buttons         │  │ Over 9: 8 runs     │ │
│  ┌──┬──┬──┬──┬──┬──┬──┬──┬──┐  │  │ Over 8: 15 runs    │ │
│  │0 │1 │2 │3 │4 │6 │W │WD│NB│  │  └────────────────────┘ │
│  └──┴──┴──┴──┴──┴──┴──┴──┴──┘  │                          │
│  ┌──┬──┐                        │                          │
│  │LB│B │                        │                          │
│  └──┴──┘                        │                          │
│  ┌──────────┬──────────┐        │                          │
│  │Undo Ball │ End Over │        │                          │
│  └──────────┴──────────┘        │                          │
└──────────────────────────────────┴──────────────────────────┘
```

## Component Files

### 1. CurrentScoreCard.tsx
**Purpose:** Display current match score and statistics
**Features:**
- Large score display (runs/wickets)
- Overs progress
- Target information (if chasing)
- Current Run Rate (CRR)
- Required Run Rate (RRR)
- Gradient background design

### 2. BattingManagement.tsx
**Purpose:** Manage batting lineup and current batsmen
**Features:**
- Current striker (highlighted with star icon)
- Non-striker display
- Individual statistics (runs, balls, strike rate)
- Next batsman selection dropdown
- Partnership information
- Visual distinction between striker and non-striker

### 3. OverManagement.tsx
**Purpose:** Manage bowling and over tracking
**Features:**
- Current over ball-by-ball display
- Color-coded ball outcomes
- Current bowler selection
- Next over bowler pre-selection
- Recent overs history (last 5 overs)
- Over runs calculation

### 4. BallOutcomeButtons.tsx
**Purpose:** Input ball outcomes
**Features:**
- 11 outcome buttons (0,1,2,3,4,6,W,WD,NB,LB,B)
- Color-coded buttons
- Hover tooltips
- Visual feedback on click
- Quick action buttons (Undo, End Over)

## Color Coding

### Ball Outcomes
- **0** - Gray (Dot ball)
- **1** - Green (Single)
- **2** - Dark Green (Two runs)
- **3** - Darker Green (Three runs)
- **4** - Blue (Boundary)
- **6** - Yellow (Six)
- **W** - Red (Wicket)
- **WD** - Pink (Wide)
- **NB** - Purple (No Ball)
- **LB** - Cyan (Leg Bye)
- **B** - Orange (Bye)

### UI Elements
- **Striker** - Green gradient background
- **Non-Striker** - Gray background
- **Current Ball** - Blue pulsing indicator
- **Partnership** - Purple background
- **Score Card** - Blue-Purple gradient

## Usage

### Import Components
```tsx
import {
  CurrentScoreCard,
  BattingManagement,
  OverManagement,
  BallOutcomeButtons
} from '@/components/ui/ScoreEditorComponets';
```

### Use in Page
```tsx
<ScoreProvider>
  <CurrentScoreCard />
  <div className="grid grid-cols-3 gap-4">
    <div className="col-span-2">
      <BattingManagement />
      <BallOutcomeButtons />
    </div>
    <div className="col-span-1">
      <OverManagement />
    </div>
  </div>
</ScoreProvider>
```

## State Management
All components use the `ScoreContext` for state management:
- `useScore()` hook provides access to:
  - Current score and statistics
  - Batsmen information
  - Over data
  - Actions (addBallRun, editBallRun, etc.)

## Responsive Behavior
- **Desktop (lg+):** 3-column layout (2:1 ratio)
- **Tablet (md):** Stacked layout
- **Mobile (sm):** Single column, full width

## Dark Mode
All components support dark mode with:
- Automatic theme detection
- Optimized colors for dark backgrounds
- Maintained contrast ratios
- Smooth theme transitions
