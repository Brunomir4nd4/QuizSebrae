import { render, screen, fireEvent } from '@testing-library/react';

import { DateTime } from 'luxon';
import { DayNavigation } from './DayNavigation.component';

describe('DayNavigation', () => {
  test('renderiza datas e dispara eventos de navegação', () => {
    const weekStart = DateTime.now();
    const weekEnd = weekStart.plus({ days: 6 });
    const mockOnPrevious = jest.fn();
    const mockOnNext = jest.fn();

    render(
      <>
        {DayNavigation(weekStart, weekEnd, mockOnPrevious, mockOnNext)}
      </>
    );

    expect(screen.getByTitle('Semana anterior')).toBeInTheDocument();
    expect(screen.getByTitle('Próxima semana')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Semana anterior'));
    expect(mockOnPrevious).toHaveBeenCalled();

    fireEvent.click(screen.getByTitle('Próxima semana'));
    expect(mockOnNext).toHaveBeenCalled();
  });
});
