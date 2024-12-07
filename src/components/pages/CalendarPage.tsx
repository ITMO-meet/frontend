import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom'

const localizer = momentLocalizer(moment);
const getToken = async (itmoId: string): Promise<string> => {
    console.log(`getting token for itmo id: ${itmoId}`);
    const mockedToken = 'Bearer xxx';
    return new Promise((resolve) => setTimeout(() => resolve(mockedToken), 1000));
};


const CalendarPage: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const location = useLocation();
    const { itmoId } = location.state || {};


    useEffect(() => {
        if (!itmoId) {
            console.error('ITMO ID is missing');
            return;
        }
        const fetchSchedule = async () => {
            setLoading(true);

            const dateStart = '2024-09-01'; // TODO: fix to normal dates ;)
            const dateEnd = '2025-02-01';

            try {
                const token = await getToken(itmoId);

                const response = await fetch(
                    `https://my.itmo.ru/api/schedule/schedule/personal?date_start=${dateStart}&date_end=${dateEnd}`,
                    {
                        headers: {
                            Authorization: token,
                            'Accept-Language': 'ru',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Error fetching schedule');
                }

                const data = await response.json();
                console.log(data);
                const parsedEvents = data.data.flatMap((day: any) =>
                    day.lessons.map((lesson: any) => ({
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
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [itmoId]);

    if (!itmoId) {
        return (
            <Box p={2}>
                <Typography variant="h6" textAlign="center">
                    ITMO ID is missing. Please return to the previous page.
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
                />
            )}
        </Box>
    );
};

export default CalendarPage;
