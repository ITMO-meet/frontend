// tests/unit/registerSteps/tags.step.spec.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import TagsStep from '../../../src/components/registerSteps/TagsStep';
import '@testing-library/jest-dom';
import { ErrorProvider } from '../../../src/contexts/ErrorContext';

// Inline mocks
jest.mock('../../../src/api/register', () => ({
  __esModule: true,
  fetchTags: jest.fn().mockResolvedValue(['music', 'gym']),
  selectTags: jest.fn().mockResolvedValue({}),
}));

describe('TagsStep', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    mockOnNext.mockClear(); // Сбрасываем мок перед каждым тестом
    render(
        <ErrorProvider>
          <TagsStep isu={123456} onNext={mockOnNext} />
        </ErrorProvider>
    );
  });

  it('renders the component', () => {
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });



});
