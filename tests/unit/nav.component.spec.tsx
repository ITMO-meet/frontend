// Nav.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Nav from '../../src/components/basic/Nav';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

describe('Nav component', () => {
  test('renders Nav component without crashing', () => {
    render(<Nav />);
  });

  test('renders all navigation actions', () => {
    render(<Nav />);
    expect(screen.getByRole('button', { name: 'Chats' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Matches' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tests' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
  });

  test('initially selects "Search"', () => {
    render(<Nav />);
    const searchAction = screen.getByRole('button', { name: 'Search' });
    expect(searchAction).toHaveClass('Mui-selected');
  });

  test('updates selected action', async () => {
    render(<Nav />);
    const testsAction = screen.getByRole('button', { name: 'Tests' });
    await userEvent.click(testsAction);
    expect(testsAction).toHaveClass('Mui-selected');

    const searchAction = screen.getByRole('button', { name: 'Search' });
    expect(searchAction).not.toHaveClass('Mui-selected');
  });
});
