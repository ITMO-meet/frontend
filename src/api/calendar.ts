import { getJson } from './index';


export interface Day {
    date: string;
    lessons: Array<{
        subject: string;
        room: string | null;
        building: string | null;
        time_start: string;
        time_end: string;
    }>;
}

export async function fetchUserSchedule(isu: number): Promise<Day[]> {
    return await getJson<Day[]>(`/calendar/get_calendar/${isu}`);
}
