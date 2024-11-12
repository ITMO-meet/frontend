import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactCard from '../../src/components/Contact';

describe('ContactCard Component', () => {
  const mockContact = {
    id: '1',
    name: 'John Doe',
    pfp: 'path/to/avatar.jpg',
    lastMessage: 'Hello, how are you?',
    stories: [],
  };

  const mockHandleClick = jest.fn();

  beforeEach(() => {
    render(<ContactCard contact={mockContact} handleClick={mockHandleClick} />);
  });

  it('renders the contact name', () => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders the contact last message', () => {
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
  });

  it('renders the contact avatar with correct src', () => {
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'path/to/avatar.jpg');
  });

  it('calls handleClick with correct id when clicked', () => {
    const cardActionArea = screen.getByRole('button');
    fireEvent.click(cardActionArea);
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
    expect(mockHandleClick).toHaveBeenCalledWith('1');
  });
});