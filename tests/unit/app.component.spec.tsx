import React from 'react';
import { render } from '@testing-library/react';
import App from '../../src/components/App';
import '@testing-library/jest-dom';

describe('App Component', () => {
  it('renders the text', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});