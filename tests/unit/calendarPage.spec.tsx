import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CalendarPage from '../../src/components/pages/CalendarPage';
import { Event } from '../../src/components/pages/CalendarPage';
import { logPageView } from '../../src/analytics'

jest.mock('react-big-calendar', () => {
    const Calendar = ({ events }: { events: Event[] }) => (
        <div data-testid="calendar">
            {events.map((event, index) => (
                <div key={index} data-testid="event">
                    {event.title}
                </div>
            ))}
        </div>
    );

    return {
        Calendar,
        momentLocalizer: jest.fn(),
    };
});

jest.mock('../../src/analytics', () => ({
    logEvent: jest.fn(),
    logPageView: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
}));

const mockUseLocation = useLocation as jest.Mock;

const mockScheduleData = {
    data: [
        {
            date: '2024-09-01',
            lessons: [
                {
                    subject: 'Math',
                    room: 'Room 101',
                    building: 'Main Building',
                    time_start: '10:00',
                    time_end: '11:30',
                },
            ],
        },
        {
            date: '2024-09-02',
            lessons: [
                {
                    subject: 'Physics',
                    room: null,
                    building: null,
                    time_start: '12:00',
                    time_end: '13:30',
                },
            ],
        },
    ],
};

describe('CalendarPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockScheduleData),
            })
        ) as jest.Mock;
        mockUseLocation.mockReturnValue({
            state: { itmoId: '123456' },
        });
    });

    test('displays loading spinner while fetching data', async () => {
        render(
            <MemoryRouter>
                <CalendarPage />
            </MemoryRouter>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        expect(logPageView).toHaveBeenCalledWith('/calendar');
    });

    test('displays events fetched from API', async () => {
        render(
            <MemoryRouter>
                <CalendarPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('calendar')).toBeInTheDocument();

        const events = screen.getAllByTestId('event');
        expect(events.length).toBe(2);
        expect(screen.getByText('Math (Room 101, Main Building)')).toBeInTheDocument();
        expect(screen.getByText('Physics (Online(?), )')).toBeInTheDocument();
    });

    test('handles missing ITMO ID gracefully', async () => {
        mockUseLocation.mockReturnValueOnce({ state: {} });

        render(
            <MemoryRouter>
                <CalendarPage />
            </MemoryRouter>
        );

        expect(screen.getByText('ITMO ID is missing ;c')).toBeInTheDocument();
    });

    test('displays error message if API call fails', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
            })
        ) as jest.Mock;

        render(
            <MemoryRouter>
                <CalendarPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });
        expect(screen.getByText('Error occurred: Error fetching schedule')).toBeInTheDocument();
    });
});
