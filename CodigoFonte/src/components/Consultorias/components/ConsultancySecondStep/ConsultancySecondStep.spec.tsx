import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ConsultancySecondStep } from '../index';
import { Booking } from '@/types/ITurma';
jest.mock('@/hooks', () => ({
	isDateTimeOneHourBefore: jest.fn(() => false),
}));

describe('ConsultancySecondStep', () => {
	const setStartTimeMock = jest.fn();

	const dateWithSlotsMock: Booking = {
		date: '2025-08-18',
		slots: [
			{ id: '1', date: '2025-08-18', time: '06:00:00', appointment_count: 2 },
			{ id: '2', date: '2025-08-18', time: '07:00:00', appointment_count: 1 },
		],
	};

	it('renders times correctly', () => {
		render(
			<ConsultancySecondStep
				consultancyDate='2025-08-18'
				dateWithSlots={dateWithSlotsMock}
				setStartTime={setStartTimeMock}
				startTime=''
				is_group_meetings_enabled={false}
			/>,
		);

		expect(
			screen.getByText((content) => content.startsWith('06:00')),
		).toBeInTheDocument();
		expect(
			screen.getByText((content) => content.startsWith('07:00')),
		).toBeInTheDocument();
	});

	it('calls setStartTime when clicking an available time', () => {
		render(
			<ConsultancySecondStep
				consultancyDate='2025-08-18'
				dateWithSlots={dateWithSlotsMock}
				setStartTime={setStartTimeMock}
				startTime=''
				is_group_meetings_enabled={false}
			/>,
		);

		const timeButton = screen
			.getByText((content) => content.startsWith('06:00'))
			.closest('button');

		if (timeButton) fireEvent.click(timeButton);
		expect(setStartTimeMock).toHaveBeenCalledWith('06:00');
	});

	it('marks active time correctly', () => {
		render(
			<ConsultancySecondStep
				consultancyDate='2025-08-18'
				dateWithSlots={dateWithSlotsMock}
				setStartTime={setStartTimeMock}
				startTime='07:00'
				is_group_meetings_enabled={false}
			/>,
		);

		const activeText = screen.getByText((content) =>
			content.startsWith('07:00'),
		);
		const activeTime = activeText.closest('div[class*="bg-gradient-to-r"]');
		expect(activeTime).toBeInTheDocument();
	});
});
