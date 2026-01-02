import { render, screen, fireEvent } from '@testing-library/react';

import { DateTime } from 'luxon';
import { DrawableScheduleToday } from '@/resources/drawables';
import { DayDisplay } from './DayDisplay.component';

jest.mock('@/resources/drawables', () => ({
    DrawableScheduleToday: () => <div data-testid="today-drawable" />
}));

describe('DayDisplay', () => {
    const date = DateTime.local(2025, 8, 13);

    it('renders the day of the week and day number', () => {
        render(<DayDisplay date={date} />);
        expect(screen.getByText(date.toFormat('ccc').replace('.', ''))).toBeInTheDocument();
        expect(screen.getByText(date.toFormat('d'))).toBeInTheDocument();
    });

    it('adds "today" class and shows DrawableScheduleToday if isToday=true', () => {
        render(<DayDisplay date={date} isToday />);
        const container = screen.getByText(date.toFormat('d')).parentElement;
        expect(container).toHaveClass('today');
        expect(screen.getByTestId('today-drawable')).toBeInTheDocument();
    });

    it('adds "on-header" class if isHeader=true', () => {
        render(<DayDisplay date={date} isHeader />);
        const container = screen.getByText(date.toFormat('d')).parentElement;
        expect(container).toHaveClass('on-header');
    });

    it('adds "clickable" class and calls onClick on click', () => {
        const handleClick = jest.fn();
        render(<DayDisplay date={date} onClick={handleClick} />);
        const container = screen.getByText(date.toFormat('d')).parentElement;
        expect(container).toHaveClass('clickable');

        fireEvent.click(container!);
        expect(handleClick).toHaveBeenCalled();
    });
});
