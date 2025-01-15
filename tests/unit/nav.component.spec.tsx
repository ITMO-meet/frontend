import React from 'react';
import { render, screen } from '@testing-library/react';
import Nav from '../../src/components/basic/Nav';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Nav component', () => {
  test('renders Nav component without crashing', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );
  });

  test('renders all navigation actions', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: 'Чаты' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Мэтчи' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Лента' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Тесты' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Профиль' })).toBeInTheDocument();
  });

  test('initially selects "Feed"', () => {
    render(
      <MemoryRouter initialEntries={['/feed']}>
        <Nav />
      </MemoryRouter>
    );
    const searchAction = screen.getByRole('button', { name: 'Лента' });
    expect(searchAction).toHaveClass('Mui-selected');
  });

  test('initially selects "Chats"', () => {
    render(
      <MemoryRouter initialEntries={['/chats']}>
        <Nav />
      </MemoryRouter>
    );
    const chatsAction = screen.getByRole('button', { name: 'Чаты' });
    expect(chatsAction).toHaveClass('Mui-selected');
  });

  test('updates selected action and navigates', async () => {
    const user = userEvent.setup();

    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    render(
      <MemoryRouter initialEntries={['/feed']}>
        <Nav />
      </MemoryRouter>
    );

    const testsAction = screen.getByRole('button', { name: 'Тесты' });
    await user.click(testsAction);

    expect(navigateMock).toHaveBeenCalledWith('/tests');
  });
});