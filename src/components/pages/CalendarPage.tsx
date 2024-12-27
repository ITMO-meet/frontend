import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { logPageView } from '../../analytics';
import { fetchUserSchedule } from '../../api/calendar';


const localizer = momentLocalizer(moment);

interface Lesson {
    subject: string;
    room: string | null;
    building: string | null;
    time_start: string;
    time_end: string;
}

interface Day {
    date: string;
    lessons: Lesson[];
}

export interface Event {
    title: string;
    start: Date;
    end: Date;
    location: string;
}

const CalendarPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const { itmoId } = location.state || {};

    if (!itmoId) {
        return (
            <Box p={2}>
                <Typography variant="h6" textAlign="center">
                    ITMO ID is missing ;c
                </Typography>
            </Box>
        );
    }

    useEffect(() => {
        logPageView("/calendar")
    }, []);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetchUserSchedule(itmoId);
                const parsedEvents = response.flatMap((day: Day) =>
                    day.lessons.map((lesson: Lesson) => ({
                        title: `${lesson.subject} (${lesson.room || 'Online(?)'}, ${lesson.building || ''})`,
                        start: new Date(`${day.date}T${lesson.time_start}`),
                        end: new Date(`${day.date}T${lesson.time_end}`),
                        location: lesson.room
                            ? `${lesson.room}, ${lesson.building || 'No building'}`
                            : 'No location',
                    }))
                );

                setEvents(parsedEvents);
            } catch (error) {
                console.error(error);
                setError('Error fetching schedule');
            } finally {
                setLoading(false);
            }
        };


        fetchSchedule();
    }, [itmoId]);


    if (error) {
        return (
            <Box p={2}>
                <Typography variant="h6" textAlign="center">
                    Error occurred: {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box p={2}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                Student Schedule
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    titleAccessor="title"
                    tooltipAccessor={(event) => event.location}
                    style={{ height: '70vh', margin: '20px 0' }}
                    messages={{
                        next: 'Next',
                        previous: 'Prev',
                        today: 'Today',
                        month: 'Month',
                        day: 'Day',
                    }}
                    views={['month', 'day', 'agenda']}
                    data-testid="calendar"
                />
            )}
        </Box>
    );
};

export default CalendarPage;
