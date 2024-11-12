import React from 'react';
import { render, screen } from '@testing-library/react';
import NavBar from '../../src/components/basic/NavBar';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

describe('Nav component', () => {
  test('renders Nav component without crashing', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
  });

  test('renders all navigation actions', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: 'Chats' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Matches' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tests' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
  });

  test('initially selects "Search"', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <NavBar />
      </MemoryRouter>
    );
    const searchAction = screen.getByRole('button', { name: 'Search' });
    expect(searchAction).toHaveClass('Mui-selected');
  });

  test('updates selected action', async () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <NavBar />
      </MemoryRouter>
    );
    const testsAction = screen.getByRole('button', { name: 'Tests' });
    await userEvent.click(testsAction);
    expect(testsAction).toHaveClass('Mui-selected');

    const searchAction = screen.getByRole('button', { name: 'Search' });
    expect(searchAction).not.toHaveClass('Mui-selected');
  });

  test('navigates to Chats when Chats button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <NavBar />
      </MemoryRouter>
    );
    const chatsAction = screen.getByRole('button', { name: 'Chats' });
    await userEvent.click(chatsAction);
    expect(chatsAction).toHaveClass('Mui-selected');

    const searchAction = screen.getByRole('button', { name: 'Search' });
    expect(searchAction).not.toHaveClass('Mui-selected');
  });

  test('navigates to Matches when Matches button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <NavBar />
      </MemoryRouter>
    );
    const matchesAction = screen.getByRole('button', { name: 'Matches' });
    await userEvent.click(matchesAction);
    expect(matchesAction).toHaveClass('Mui-selected');

    const searchAction = screen.getByRole('button', { name: 'Search' });
    expect(searchAction).not.toHaveClass('Mui-selected');
  });

  test('navigates to Profile when Profile button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <NavBar />
      </MemoryRouter>
    );
    const profileAction = screen.getByRole('button', { name: 'Profile' });
    await userEvent.click(profileAction);
    expect(profileAction).toHaveClass('Mui-selected');

    const searchAction = screen.getByRole('button', { name: 'Search' });
    expect(searchAction).not.toHaveClass('Mui-selected');
  });
});