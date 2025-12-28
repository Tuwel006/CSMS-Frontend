# Tab State Persistence

## Objective
Fix the issue where reloading the page resets the active tab to the default ("Single Match Setup").

## Solution
Implemented URL-based state management for tabs using `react-router-dom`'s `useSearchParams`.

## Changes
1.  **Replaced State with URL Params**:
    -   Removed `useState<Tab>`.
    -   Added `useSearchParams()` hook.
    -   `activeTab` is now derived directly from the `?tab=` query parameter in the URL.
2.  **Navigation Logic**:
    -   Clicking a tab now updates the URL (e.g., `?tab=match-schedule`) instead of setting internal state.
3.  **Default Behavior**:
    -   If no `tab` parameter exists (e.g., fresh navigation), it defaults to `match-setup`.

## Benefits
-   **Persistence**: Reloading the page retains the current tab.
-   **Deep Linking**: You can now bookmark or share a URL that opens directly to the "Team Management" or "Match Schedule" tab.
-   **Browser History**: using back/forward buttons now works for tab switching.
