import { BallEvent, ScoreType } from "./scoreTypes";

export const applyBallEvent = (state: ScoreType, event: BallEvent) => {
    const innnigs = state.innings.find(i => i.number === event.innings);
    if(!innnigs) return;

    innnigs.score += event.runsAdded;
    if(event.isLegalBall) {
        innnigs.ballsBowled += 1;
    }
    if(event.isWicket) {
        innnigs.w += 1;
    }
}