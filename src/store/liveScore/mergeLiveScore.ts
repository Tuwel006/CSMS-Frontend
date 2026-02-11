import { MatchScoreResponse, Innings } from "@/types/scoreService";
import { LiveScorePayload } from "./liveScoreTypes";

/**
 * Converts LiveScorePayload to Innings format
 */
function convertLiveScoreToInnings(liveScore: LiveScorePayload): Partial<Innings> {
    return {
        i: liveScore.i,
        is_completed: liveScore.is_completed,
        innings_number: liveScore.innings_number,
        battingTeam: liveScore.battingTeam,
        bowlingTeam: liveScore.bowlingTeam,
        score: {
            r: liveScore.score.r,
            w: liveScore.score.w,
            o: calculateOvers(liveScore.score.b), // Convert balls to overs string
            b: liveScore.score.b,
        },
        batting: {
            striker: liveScore.batting.striker ? {
                id: liveScore.batting.striker.id,
                n: liveScore.batting.striker.n,
                r: liveScore.batting.striker.r,
                b: liveScore.batting.striker.b,
                sr: liveScore.batting.striker.sr,
                '4s': liveScore.batting.striker['4s'],
                '6s': liveScore.batting.striker['6s'],
                onStrike: true,
            } : null as any,
            nonStriker: liveScore.batting.nonStriker ? {
                id: liveScore.batting.nonStriker.id,
                n: liveScore.batting.nonStriker.n,
                r: liveScore.batting.nonStriker.r,
                b: liveScore.batting.nonStriker.b,
                sr: liveScore.batting.nonStriker.sr,
                '4s': liveScore.batting.nonStriker['4s'],
                '6s': liveScore.batting.nonStriker['6s'],
                onStrike: false,
            } : null as any,
        },
        dismissed: liveScore.dismissed.map(d => ({
            id: d.id,
            n: d.n,
            r: d.r,
            b: d.b,
            sr: calculateStrikeRate(d.r, d.b),
            '4s': 0, // Not provided in LiveScorePayload
            '6s': 0, // Not provided in LiveScorePayload
            w: {
                wicket_type: d.w.type || '',
                bowler: d.w.bowler || '',
                by: d.w.fielder || '',
            },
            order: 0, // Not provided in LiveScorePayload
        })),
        bowling: liveScore.bowling.map(b => ({
            id: b.id,
            n: b.n,
            b: b.b,
            o: calculateOvers(b.b),
            r: b.r,
            w: b.w,
            eco: b.e,
            '4s': 0, // Not provided in LiveScorePayload
            '6s': 0, // Not provided in LiveScorePayload
            extras: 0, // Not provided in LiveScorePayload
        })),
        currentOver: {
            bowlerId: liveScore.currentOver.bowlerId || 0,
            o: liveScore.currentOver.o,
            isOverComplete: liveScore.currentOver.isOverComplete,
            illegalBallsCount: liveScore.currentOver.illegalBallsCount,
            ballsCount: liveScore.currentOver.ballsCount,
            balls: liveScore.currentOver.balls.map(ball => ({
                b: ball.b,
                t: ball.t,
                r: ball.r,
            })),
        },
    };
}

/**
 * Calculate overs from balls (e.g., 13 balls = "2.1")
 */
function calculateOvers(balls: number): string {
    const overs = Math.floor(balls / 6);
    const remainingBalls = balls % 6;
    return remainingBalls > 0 ? `${overs}.${remainingBalls}` : `${overs}`;
}

/**
 * Calculate strike rate
 */
function calculateStrikeRate(runs: number, balls: number): string {
    if (balls === 0) return "0.00";
    return ((runs / balls) * 100).toFixed(2);
}

/**
 * Merges LiveScorePayload into MatchScoreResponse by updating the matching innings
 * @param currentData - Current MatchScoreResponse state
 * @param liveScorePayload - New innings data from SSE
 * @returns Updated MatchScoreResponse
 */
export function mergeLiveScoreIntoMatch(
    currentData: MatchScoreResponse,
    liveScorePayload: LiveScorePayload
): MatchScoreResponse {
    // Find the innings index by matching the innings id
    const inningsIndex = currentData.innings.findIndex(
        (innings) => String(innings.i) === String(liveScorePayload.i)
    );

    console.log(`[Merge] Payload Innings ID: ${liveScorePayload.i}, Matches found at index: ${inningsIndex}`);
    console.log(`[Merge] Available IDs in state:`, currentData.innings.map(inn => inn.i));

    // If innings not found, return current data unchanged
    if (inningsIndex === -1) {
        console.warn(`[Merge] Innings with id ${liveScorePayload.i} not found in current data`);
        return currentData;
    }

    // Convert LiveScorePayload to Innings format
    const updatedInnings = convertLiveScoreToInnings(liveScorePayload);

    // Create a new innings array with the updated innings
    const newInnings = [...currentData.innings];
    newInnings[inningsIndex] = {
        ...newInnings[inningsIndex],
        ...updatedInnings,
    } as Innings;

    // Return updated MatchScoreResponse
    return {
        ...currentData,
        innings: newInnings,
        meta: {
            ...currentData.meta,
            lastUpdated: new Date().toISOString(),
        },
    };
}
