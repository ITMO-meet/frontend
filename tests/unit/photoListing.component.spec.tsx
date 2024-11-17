import React from 'react';
import { render, screen } from '@testing-library/react';
import PhotoListing from '../../src/components/basic/PhotoListing';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

describe('PhotoListing component', () => {
  const photos = [
    'https://example.com/photo1.jpg',
    'https://example.com/photo2.jpg',
    'https://example.com/photo3.jpg',
  ];

  test('renders PhotoListing component without crashing', () => {
    render(<PhotoListing photos={photos} />);
  });

  test('displays the first photo initially', () => {
    render(<PhotoListing photos={photos} />);
    const firstPhoto = screen.getByRole('img', { name: 'Profile photo' });
    expect(firstPhoto).toHaveAttribute('src', photos[0]);
  });

  test('navigates to the next photo when the right side is clicked', async () => {
    render(<PhotoListing photos={photos} />);
    
    // Предположим, что правая область имеет уникальный класс, например, "next-area"
    const nextArea = document.querySelector('.css-14r51nf'); // Замените на фактическое значение className

    if (nextArea) {
      await userEvent.click(nextArea);
      const secondPhoto = screen.getByRole('img', { name: 'Profile photo' });
      expect(secondPhoto).toHaveAttribute('src', photos[1]);
    } else {
      throw new Error('Next area not found');
    }
  });

  test('navigates to the previous photo when the left side is clicked', async () => {
    render(<PhotoListing photos={photos} />);

    // Предположим, что левая область имеет уникальный класс, например, "prev-area"
    const prevArea = document.querySelector('.css-1jabz9l'); // Замените на фактическое значение className
    const nextArea = document.querySelector('.css-14r51nf'); // Замените на фактическое значение className

    if (nextArea && prevArea) {
      await userEvent.click(nextArea); // Сначала переходим ко второй фотографии
      await userEvent.click(prevArea); // Затем назад к первой

      const firstPhoto = screen.getByRole('img', { name: 'Profile photo' });
      expect(firstPhoto).toHaveAttribute('src', photos[0]);
    } else {
      throw new Error('Navigation areas not found');
    }
  });

  test('wraps around to the first photo after the last photo', async () => {
    render(<PhotoListing photos={photos} />);

    const nextArea = document.querySelector('.css-14r51nf'); // Замените на фактическое значение className

    if (nextArea) {
      await userEvent.click(nextArea);
      await userEvent.click(nextArea);
      await userEvent.click(nextArea); // Возврат к первой фотографии

      const firstPhoto = screen.getByRole('img', { name: 'Profile photo' });
      expect(firstPhoto).toHaveAttribute('src', photos[0]);
    } else {
      throw new Error('Next area not found');
    }
  });

  test('wraps around to the last photo when navigating backwards from the first photo', async () => {
    render(<PhotoListing photos={photos} />);

    const prevArea = document.querySelector('.css-1jabz9l'); // Замените на фактическое значение className

    if (prevArea) {
      await userEvent.click(prevArea); // Клик для перехода на последнюю фотографию

      const lastPhoto = screen.getByRole('img', { name: 'Profile photo' });
      expect(lastPhoto).toHaveAttribute('src', photos[2]);
    } else {
      throw new Error('Prev area not found');
    }
  });
});
