export interface MatchData {
    team1_id: string;
    team2_id: string;
    venue: string;
    match_time: string;
    umpire?: string;
    date: string;
}

export interface MatchTokenResponse {
    id: string;
    is_active: boolean;
    tenant_id: number;
    team_a_id: string | null;
    team_b_id: string | null;
    match_date: string | null;
    format: string | null;
    venue: string | null;
    status: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateTeamPayload {
    team: {
        id: number | null;
        name: string;
        location: string;
    };
    players: Array<{
        id: number | null;
        name: string;
        role: string;
    }>;
}

export interface TeamSetupPayload {
    matchId?: string;
    team: {
        name: string;
        location: string;
        id?: number | null;
    };
    players: Array<{
        name: string;
        role: string;
        id?: number | null;
    }>;
}

export interface TeamSetupResponse {
    matchId: string;
    teamId: number;
    teamAssignedTo: string;
    players: Array<{
        playerId: number;
        name: string;
        role: string;
    }>;
}

export interface DeleteTokenResponse {
    message: string;
}

export interface CurrentMatchResponse {
    id: string;
    match_date: string | null;
    format: string | null;
    venue: string | null;
    status: string | null;
    umpire_1: string | null;
    umpire_2: string | null;
    man_of_the_match: string | null;
    toss_winner_team_id?: number;
    batting_first_team_id?: number;
    teamA: {
        id: number;
        name: string;
        short_name: string;
        players: Array<{
            id: number;
            name: string;
            role: string;
        }>;
    } | null;
    teamB: {
        id: number;
        name: string;
        short_name: string;
        players: Array<{
            id: number;
            name: string;
            role: string;
        }>;
    } | null;
}

export interface StartMatchPayload {
    toss_winner_team_id: number;
    batting_first_team_id: number;
    over: number;
    teamA: {
        id: number;
        playing_11_id: number[];
        captain_id: number;
    };
    teamB: {
        id: number;
        playing_11_id: number[];
        captain_id: number;
    };
}

export type StartMatchResponse = StartMatchPayload;

export interface CompleteMatchPayload {
    default: boolean;
    man_of_the_match_player_id?: number | null;
    winner_team_id?: number | null;
    result_description?: string;
}
