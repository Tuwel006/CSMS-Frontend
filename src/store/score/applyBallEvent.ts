import { BallEvent, ScoreType } from "./scoreTypes";

export const applyBallEvent = (state: ScoreType, event: BallEvent) => {
    const innings = state.innings.find(i => i.i === event.innings);
    if (!innings) return;

    if (event.totalRuns !== undefined) innings.score.r = event.totalRuns;
    if (event.totalBalls !== undefined) innings.score.b = event.totalBalls;
    innings.score.o = Math.floor(innings.score.b / 6) + "." + (innings.score.b % 6);
    if (event.totalWickets !== undefined) innings.score.w = event.totalWickets;
    if (event.totalExtras !== undefined) innings.extras = event.totalExtras;

    if (event.currentOver) {
        innings.currentOver = event.currentOver;
    }

    if (innings.batting?.striker) {
        innings.batting.striker.r += event.batsmanRuns;
        if (event.isLegalBall) innings.batting.striker.b += 1;
        if (event.batsmanRuns === 4) innings.batting.striker['4s'] = (innings.batting.striker['4s'] || 0) + 1;
        if (event.batsmanRuns === 6) innings.batting.striker['6s'] = (innings.batting.striker['6s'] || 0) + 1;
        innings.batting.striker.sr = innings.batting.striker.b > 0 ? ((innings.batting.striker.r / innings.batting.striker.b) * 100).toFixed(2) : "0.00";
    }

    if (event.isOverComplete) {
        innings.bowling?.forEach(b => b.isCurrent = false);
    }

    if (event.shouldFlipStrike && innings.batting) {
        const temp = innings.batting.striker;
        innings.batting.striker = innings.batting.nonStriker;
        innings.batting.nonStriker = temp;
    }

    if (event.is_innings_over) {
        innings.is_innings_over = event.is_innings_over;
    }
}