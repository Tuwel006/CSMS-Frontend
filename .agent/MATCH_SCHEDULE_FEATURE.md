# Match Schedule Tab Feature

## Overview
Added a new "Match Schedule" tab to the Team Management page. This tab allows users to configure a specific match by selecting teams, defining the playing 11, and setting match conditions like venue and toss.

## Key Features

### 1. New Tab Integration
- Added "Match Schedule" tab alongside "Single Match Setup" and "Team Management".
- Accessible via the main tab navigation.

### 2. Match Schedule Interface
**Layout Structure:**

1.  **Match Details (Top)**
    - **Venue Input**: Common venue for the match.
    - **Overs Input**: Number of overs for the match.

2.  **Team Configuration (Middle Split View)**
    - **Select Team 1 & Team 2**: Dropdowns populated with teams from your saved team list.
    - **Playing 11 Selection**:
        - Once a team is selected, its player list loads.
        - **Collapsible List**: Show/hide player list to save space.
        - **Multi-select**: Click players to add/remove them from the Playing 11.
        - **Visual Feedback**: Selected players are highlighted with a blue background and checkmark.

3.  **Toss & Schedule (Bottom)**
    - **Toss Winner**: Radio buttons to select Team 1 or Team 2.
    - **Toss Decision**: Radio buttons to select Bat or Bowl.
    - **Schedule Match Button**: Finalize the setup.

## Technical Details

- **Component**: `src/components/MatchSchedule.tsx`
- **Data Source**: Reuses the fetched `managedTeams` from the Team Management API call.
- **State Management**: Local state within the component manages the current selection (teams, players, venue, etc.).
- **Styling**: Fully responsive and dark-mode compatible using existing design tokens (`var(--card-bg)`, etc.).

## How to Use

1.  Click the **Match Schedule** tab.
2.  Enter **Venue** and **Overs**.
3.  Select **Team 1** from the dropdown.
4.  Expand the list and click players to select your **Playing 11**.
5.  Repeat for **Team 2**.
6.  Select who won the **Toss** and their **Decision**.
7.  Click **Schedule Match**.

## Future Considerations
- API integration for the "Schedule Match" button is currently a placeholder (`console.log`).
- Validation logic ensures teams and details are selected before submitting.
