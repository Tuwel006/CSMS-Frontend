# Team Management Changes

## Overview
Updated the Team Management feature to support tournament-specific team management with a single localStorage key for team creation.

## Key Changes

### 1. Tournament-Specific Teams
- Added `tournamentId` field to `TeamData` interface
- Introduced `currentTournamentId` state variable (currently mocked as '1')
- Teams in the Team Management tab will be filtered by the current tournament
- UI displays which tournament is being managed: "Manage teams for Tournament #1"

### 2. Single localStorage Key: `teamManage`
The Team Management tab now uses a single localStorage key with the following structure:

```typescript
interface TeamManageLocalStorage {
  team: { 
    name: string; 
    location: string; 
    id: string | null 
  };
  players: Array<{ 
    id: string | null; 
    name: string; 
    role: string 
  }>;
}
```

**Key**: `teamManage`

### 3. localStorage Lifecycle
- **Auto-save**: Data is automatically saved to `teamManage` whenever `currentTeam` or `currentPlayers` changes
- **Load**: Data is loaded from `teamManage` when switching to the Team Management tab
- **Clear**: localStorage is cleared in two scenarios:
  1. After successful API save (team created/updated)
  2. When canceling the form

### 4. Separation of Concerns
- **Match Setup Tab**: Uses `matchSetup_team1` and `matchSetup_team2` localStorage keys (unchanged)
- **Team Management Tab**: Uses `teamManage` localStorage key (new implementation)

## Implementation Details

### Data Flow
1. User enters team and player information
2. Data is automatically saved to `localStorage.teamManage`
3. User clicks "Submit"
4. Data is sent to API via `TeamService.create()` or `TeamService.update()`
5. On success:
   - `localStorage.teamManage` is cleared
   - Teams list is refreshed from API
   - Form is reset

### Future Enhancements (TODOs)

#### 1. Tournament Selection
```typescript
// TODO: Replace with actual tournament context/selection
const [currentTournamentId] = useState<string | null>('1');
```
Currently using a mock tournament ID. This should be replaced with:
- A tournament selection dropdown
- Tournament context from React Context API or Redux
- URL parameter for tournament ID

#### 2. Backend Tournament Support
```typescript
// TODO: Add tournament_id when backend supports it
// tournament_id: currentTournamentId ? parseInt(currentTournamentId) : undefined,
```
The backend API needs to support `tournament_id` field in the teams table.

#### 3. Player-Team Association
```typescript
// TODO: Save players to DB when player-team association API is ready
// for (const player of currentPlayers) {
//   await PlayerTeamService.create({
//     team_id: createdTeam.id,
//     player_id: player.id,
//     role: player.role
//   });
// }
```
Currently, players are only stored in localStorage. Need to:
- Create a player-team association table in the backend
- Implement `PlayerTeamService` to manage associations
- Save players when creating/updating teams

#### 4. Tournament Filtering
```typescript
// Filter by tournament - for now showing all teams since tournament field might not exist yet
// TODO: Uncomment when tournament field is added to teams
// const tournamentTeams = allTeams.filter(team => team.tournamentId === currentTournamentId);
// setManagedTeams(tournamentTeams);
```
Once the backend supports `tournament_id`, uncomment this code to filter teams by tournament.

## Testing Checklist

- [ ] Team Management tab loads existing data from `teamManage` localStorage
- [ ] Team and player data auto-saves to `teamManage` as user types
- [ ] Submitting a team saves to API and clears localStorage
- [ ] Canceling the form clears localStorage
- [ ] Match Setup tab continues to work with its own localStorage keys
- [ ] Teams list refreshes after creating/updating a team
- [ ] Tournament ID is displayed in the UI
- [ ] No conflicts between Match Setup and Team Management localStorage

## Migration Notes

### For Users
- No migration needed - this is a new feature
- Existing Match Setup data in `matchSetup_team1` and `matchSetup_team2` is preserved

### For Developers
When implementing tournament support:
1. Add `tournament_id` column to teams table
2. Update `TeamService` to accept `tournament_id` parameter
3. Implement tournament selection UI
4. Uncomment tournament filtering code
5. Update API calls to include `tournament_id`
