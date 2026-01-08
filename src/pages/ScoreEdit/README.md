# ScoreEdit Page Structure

This folder contains the ScoreEdit page and its related components.

## Structure

```
ScoreEdit/
├── components/           # Page-specific components
│   ├── MatchHeader.tsx          # Displays team names and match status
│   ├── CurrentScoreCard.tsx     # Shows current batting score and batsmen
│   ├── RecentOversCard.tsx      # Displays current over and bowler info
│   ├── BallOutcomes.tsx         # Ball input buttons (0-6, WD, NB, etc.)
│   ├── BallConfirmModal.tsx     # Modal to confirm ball outcomes
│   └── ExtrasWarningModal.tsx   # Modal for extras toggle confirmation
└── index.tsx            # Main page component with business logic
```

## Component Responsibilities

### index.tsx (Main Page)
- Manages all state and business logic
- Handles API calls via MatchService
- Coordinates between child components
- Manages modals and user interactions

### MatchHeader
- Displays team names (Team A vs Team B)
- Shows match status (LIVE indicator)
- Displays match format

### CurrentScoreCard
- Shows current score (runs/wickets, overs)
- Displays striker and non-striker information
- Handles batsman selection

### RecentOversCard
- Shows current bowler statistics
- Displays current over balls
- Lists all bowlers with their figures
- Handles bowler selection and over completion

### BallOutcomes
- Provides buttons for ball outcomes (0-6 runs)
- Extras buttons (WD, NB, BYE, LB)
- Wicket button
- Extras toggle switch

### BallConfirmModal
- Confirms ball outcome before recording
- Allows editing runs for extras
- Shows ball type and description

### ExtrasWarningModal
- Warns user when toggling extras setting
- Explains the difference between standard and gully cricket rules

## Usage

Import the page in your routes:
```tsx
import ScoreEdit from '@/pages/ScoreEdit';
```

The import automatically resolves to `index.tsx` in the ScoreEdit folder.
