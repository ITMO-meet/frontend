import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Contact from '../../src/components/Contact';

describe('Contact Component', () => {
  const mockContact = {
    id: 1,
    name: 'John Doe',
    pfp: 'path/to/avatar1.jpg',
    lastMessage: 'Hello!',
    stories: [],
  };

  const mockHandleClick = jest.fn();

  it('renders the contact card with correct information', () => {
    render(<Contact contact={mockContact} handleClick={mockHandleClick} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    // Additional checks can be added here
  });

  it('calls handleClick with correct id when clicked', () => {
    render(<Contact contact={mockContact} handleClick={mockHandleClick} />);

    const cardActionArea = screen.getByRole('button');
    fireEvent.click(cardActionArea);
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
    expect(mockHandleClick).toHaveBeenCalledWith(1); // Changed from '1' to 1
  });
});
