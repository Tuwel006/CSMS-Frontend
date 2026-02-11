# SSE Live Score Implementation Summary

## Overview
Implemented Server-Sent Events (SSE) for real-time live score updates in the Cricket Scoring Management System. The implementation uses a **separate Redux store module** (`liveScore`) to keep SSE functionality isolated from the existing score editing functionality.

## Project Structure

```
src/
├── store/
│   ├── score/                    # Existing score editing functionality (UNCHANGED)
│   │   ├── applyBallEvent.ts
│   │   ├── score.state.ts
│   │   ├── scoreSelectors.ts
│   │   ├── scoreSlice.ts
│   │   ├── scoreThunks.ts
│   │   └── scoreTypes.ts
│   │
│   ├── liveScore/                # NEW: SSE live score functionality
│   │   ├── index.ts              # Public API exports
│   │   ├── liveScore.state.ts    # State interface
│   │   ├── liveScoreSlice.ts     # Redux slice
│   │   ├── liveScoreThunks.ts    # SSE subscription thunk
│   │   └── liveScoreSelectors.ts # State selectors
│   │
│   ├── hooks.ts
│   └── index.ts                  # Store configuration (updated)
│
├── utils/
│   └── api.ts                    # Added routes.sse.liveScore()
│
└── pages/
    └── LiveScore.tsx             # Updated to use liveScore store
```

## Changes Made

### 1. **New Module: `store/liveScore/`**

Created a completely separate Redux module for SSE functionality:

#### **liveScore.state.ts**
```typescript
interface LiveScoreState {
    loading: boolean;
    error: string | null;
    data: MatchScoreResponse | null;
    isConnected: boolean;  // Tracks SSE connection status
}
```

#### **liveScoreThunks.ts**
- `subscribeLiveScore` thunk that:
  - Takes only `matchId` as parameter (as requested)
  - Accepts `onUpdate` callback for handling incoming SSE data
  - Establishes SSE connection using `routes.sse.liveScore(matchId)`
  - Returns cleanup function to close the connection

**Function Signature:**
```typescript
subscribeLiveScore({
  matchId: string,
  onUpdate: (data: MatchScoreResponse) => void
})
```

#### **liveScoreSlice.ts**
Actions:
- `updateLiveScore` - Updates state with SSE data
- `clearLiveScore` - Clears all live score data
- `setConnectionStatus` - Updates connection status

Extra Reducers:
- Handles `subscribeLiveScore` lifecycle (pending, fulfilled, rejected)

#### **liveScoreSelectors.ts**
Selectors for accessing state:
- `selectLiveScoreData`
- `selectLiveScoreLoading`
- `selectLiveScoreError`
- `selectLiveScoreConnectionStatus`

### 2. **API Route Helper (`src/utils/api.ts`)**
- Added `routes.sse.liveScore(matchId)` helper
- Generates endpoint: `/sse/score/${matchId}`

### 3. **Redux Store (`src/store/index.ts`)**
- Added `liveScore` reducer to store configuration
- Existing `score` reducer remains unchanged

### 4. **LiveScore Page (`src/pages/LiveScore.tsx`)**
- Uses `liveScore` Redux store (not `score` store)
- Flow:
  1. Initial fetch via REST API
  2. Update `liveScore` Redux state
  3. Subscribe to SSE
  4. SSE events → `updateLiveScore` action
  5. UI auto-updates from Redux state
  6. Cleanup on unmount

## Separation of Concerns

### **score/** Module (Existing - UNCHANGED)
- **Purpose**: Score editing and ball recording
- **Used by**: Score editing pages
- **Key Actions**: `recordBall`, `setScore`, `clearScore`
- **State**: Optimistic updates for ball events

### **liveScore/** Module (New)
- **Purpose**: Real-time SSE score updates
- **Used by**: LiveScore viewing page
- **Key Actions**: `subscribeLiveScore`, `updateLiveScore`, `clearLiveScore`
- **State**: Live match data from SSE stream

## Data Flow

```
LiveScore Component
    ↓
Initial Fetch (REST API)
    ↓
Update liveScore Redux State
    ↓
Subscribe to SSE
    ↓
SSE Events → onUpdate callback
    ↓
Dispatch updateLiveScore action
    ↓
liveScore Redux State Updated
    ↓
Component Re-renders with new data
```

## Usage in LiveScore Component

```typescript
// Import from liveScore module
import { subscribeLiveScore } from "../store/liveScore/liveScoreThunks";
import { updateLiveScore, clearLiveScore } from "../store/liveScore/liveScoreSlice";

// Access liveScore state
const data = useAppSelector((state) => state.liveScore.data);
const isConnected = useAppSelector((state) => state.liveScore.isConnected);

// Subscribe to SSE
dispatch(subscribeLiveScore({
  matchId: id,
  onUpdate: (liveData) => {
    dispatch(updateLiveScore(liveData));
  }
}));

// Cleanup
dispatch(clearLiveScore());
```

## Benefits

1. ✅ **Separation of Concerns**: SSE logic isolated from score editing
2. ✅ **No Breaking Changes**: Existing score functionality untouched
3. ✅ **Real-time Updates**: Instant score updates via SSE
4. ✅ **Efficient**: Server pushes only when data changes
5. ✅ **Type-safe**: Full TypeScript support
6. ✅ **Clean Architecture**: Modular and maintainable
7. ✅ **Connection Tracking**: `isConnected` state for UI feedback
8. ✅ **Memory Safe**: Proper cleanup prevents leaks

## Testing

Navigate to a live match page and check:
1. Browser console logs:
   - `"SSE Connection opened for match: {matchId}"`
   - Live score updates as they arrive
2. Network tab: Active EventSource connection
3. Redux DevTools: `liveScore` state updates

## API Endpoint

The SSE endpoint:
```
GET /api/v1/sse/score/:matchId
```

Should send `MatchScoreResponse` data as SSE events.

## Key Differences from Initial Implementation

| Aspect | Initial | Final |
|--------|---------|-------|
| Location | `store/score/` | `store/liveScore/` (separate) |
| Affects existing code | Yes | No |
| State shape | Mixed with score editing | Dedicated for SSE |
| Connection tracking | No | Yes (`isConnected`) |
| Module isolation | Shared | Complete separation |
