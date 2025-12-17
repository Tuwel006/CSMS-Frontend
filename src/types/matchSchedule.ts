export interface ScheduleMatchPayload {
    venue: string;
    match_date: string;
    format: string;
    umpire_1?: string;
    umpire_2?: string;
}

export interface ScheduleMatchInput {
    venue: string;
    date: string;
    time: string;
    format: string;
    umpire_1?: string;
    umpire_2?: string;
}

export interface ScheduleMatchResponse extends ScheduleMatchPayload {
    id: string;
    status: string;
}
