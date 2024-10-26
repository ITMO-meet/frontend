import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../src/components/App'; 
import '@testing-library/jest-dom';

describe('App Component', () => {
  it('renders the text', () => {
    render(<App />);
    const headingElement = screen.getByText("Welcome to My React App");
    expect(headingElement).toBeInTheDocument(); 
  });
});