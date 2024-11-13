import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainFeaturesSection from '../../src/components/basic/MainFeatchersSection';

describe('MainFeaturesSection', () => {
    test('renders MainFeaturesSection without crashing', () => {
        render(<MainFeaturesSection />);
    });

    test('renders all main features', () => {
        render(<MainFeaturesSection />);
        expect(screen.getByText('Main Features')).toBeInTheDocument();
        expect(screen.getByText('170 cm')).toBeInTheDocument();
        expect(screen.getByText('Atheism')).toBeInTheDocument();
        expect(screen.getByText('Aries')).toBeInTheDocument();
        expect(screen.getByText('No but would like')).toBeInTheDocument();
        expect(screen.getAllByText('Neutral').length).toBe(2);
    });

    test('renders all feature items', () => {
        render(<MainFeaturesSection />);
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
        render(<MainFeaturesSection />);
        const zodiacIcon = screen.getByText('♈️');
        expect(zodiacIcon).toBeInTheDocument();
    });
});