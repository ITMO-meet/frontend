import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../src/components/App'; 
import { expect } from 'chai';

describe('App Component', () => {
  it('renders the text', () => {
    render(<App />);
    const headingElement = screen.getByText("Welcome to My React App");
    expect(headingElement).to.exist; 
  });
});