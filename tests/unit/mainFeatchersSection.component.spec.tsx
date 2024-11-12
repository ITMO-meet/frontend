import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainFeatchersSection from '../../src/components/basic/MainFeatchersSection';

describe('MainFeatchersSection', () => {
    test('renders MainFeatchersSection without crashing', () => {
      render(<MainFeatchersSection />);
    });
  
    test('renders all main features', () => {
      render(<MainFeatchersSection />);
      expect(screen.getByText('Height')).toBeInTheDocument();
      expect(screen.getByText('Worldview')).toBeInTheDocument();
      expect(screen.getByText('Zodiac Sign')).toBeInTheDocument();
      expect(screen.getByText('Children')).toBeInTheDocument();
      expect(screen.getByText('Languages')).toBeInTheDocument();
      expect(screen.getByText('Alcohol')).toBeInTheDocument();
      expect(screen.getByText('Smoking')).toBeInTheDocument();
    });

    test('renders all feature items', () => {
        render(<MainFeatchersSection />);
        const featureItems = [
            '170 cm',
            'Atheism',
            'Aries',
            'No but would like',
            'Neutral',
            'Neutral'
        ];

        featureItems.forEach(item => {
            const featureElements = screen.getAllByText(item);
            expect(featureElements.length).toBeGreaterThan(0);
        });
    });

    test('renders zodiac icon correctly', () => {
        render(<MainFeatchersSection />);
        const zodiacIcon = screen.getByText('♈️');
        expect(zodiacIcon).toBeInTheDocument();
    });
});