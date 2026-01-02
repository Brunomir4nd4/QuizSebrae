import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateTime } from 'luxon';

import { ScheduleHeader } from './ScheduleHeader.component';
import { ScheduleCalendarView } from '../../utils/ScheduleCalendarView';

// Mock dos componentes filhos
jest.mock('./components', () => ({
	DayHeader: jest.fn(() => <div data-testid='day-header'>Day Header</div>),
	DayHeading: jest.fn(() => <div data-testid='day-heading'>Day Heading</div>),
	DayNavigation: jest.fn(() => (
		<div data-testid='day-navigation'>Day Navigation</div>
	)),
	WeekHeader: jest.fn(() => <div data-testid='week-header'>Week Header</div>),
	WeekHeading: jest.fn(() => (
		<div data-testid='week-heading'>Week Heading</div>
	)),
	WeekNavigation: jest.fn(() => (
		<div data-testid='week-navigation'>Week Navigation</div>
	)),
}));

// Mock do componente Class
jest.mock('@/components/Class', () => ({
	Class: ({
		href,
		buttonText,
		small,
	}: {
		href: string;
		buttonText: string;
		small?: boolean;
	}) => (
		<div
			data-testid='class-component'
			data-href={href}
			data-button-text={buttonText}
			data-small={small}>
			Class Component
		</div>
	),
}));

// Mock do MUI
jest.mock('@mui/material', () => ({
	...jest.requireActual('@mui/material'),
	Button: ({
		children,
		...props
	}: React.PropsWithChildren<Record<string, unknown>>) => (
		<button data-testid='mui-button' {...props}>
			{children}
		</button>
	),
	Divider: ({
		children,
		...props
	}: React.PropsWithChildren<Record<string, unknown>>) => (
		<div data-testid='mui-divider' {...props}>
			{children}
		</div>
	),
}));

jest.mock('./ScheduleHeader.styles', () => ({
	HeaderContent: ({
		children,
		...props
	}: React.PropsWithChildren<Record<string, unknown>>) => (
		<div data-testid='header-content' {...props}>
			{children}
		</div>
	),
	Header: ({
		children,
		...props
	}: React.PropsWithChildren<Record<string, unknown>>) => (
		<div data-testid='header' {...props}>
			{children}
		</div>
	),
	DayButton: ({
		children,
		...props
	}: React.PropsWithChildren<Record<string, unknown>>) => (
		<button data-testid='day-button' {...props}>
			{children}
		</button>
	),
}));

describe('ScheduleHeader', () => {
	const mockSetDate = jest.fn();
	const mockDate = DateTime.fromISO('2025-10-27');
	const mockWeekStart = DateTime.fromISO('2025-10-27');
	const mockWeekEnd = DateTime.fromISO('2025-11-02');

	const defaultProps = {
		type: ScheduleCalendarView.Week,
		date: mockDate,
		weekStart: mockWeekStart,
		weekEnd: mockWeekEnd,
		setDate: mockSetDate,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		Object.defineProperty(window, 'scrollY', {
			writable: true,
			value: 0,
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('renders with default props', () => {
		render(<ScheduleHeader {...defaultProps} />);

		expect(screen.getByTestId('week-heading')).toBeInTheDocument();
		expect(screen.getByTestId('week-navigation')).toBeInTheDocument();
		expect(screen.getByTestId('week-header')).toBeInTheDocument();
		expect(screen.getByText('Hoje')).toBeInTheDocument();
	});

	it('renders day view components when type is Day', () => {
		render(
			<ScheduleHeader {...defaultProps} type={ScheduleCalendarView.Day} />,
		);

		expect(screen.getByTestId('day-heading')).toBeInTheDocument();
		expect(screen.getByTestId('day-navigation')).toBeInTheDocument();
		expect(screen.getByTestId('day-header')).toBeInTheDocument();
	});

	it('renders week view components when type is Week', () => {
		render(
			<ScheduleHeader {...defaultProps} type={ScheduleCalendarView.Week} />,
		);

		expect(screen.getByTestId('week-heading')).toBeInTheDocument();
		expect(screen.getByTestId('week-navigation')).toBeInTheDocument();
		expect(screen.getByTestId('week-header')).toBeInTheDocument();
	});

	it('shows Class component on mobile and desktop with correct props', () => {
		render(<ScheduleHeader {...defaultProps} />);

		const classComponents = screen.getAllByTestId('class-component');
		expect(classComponents).toHaveLength(2);

		expect(classComponents[0]).toHaveAttribute('data-href', '/trocar-turma');
		expect(classComponents[0]).toHaveAttribute('data-button-text', 'Trocar');
		expect(classComponents[1]).toHaveAttribute('data-href', '/trocar-turma');
		expect(classComponents[1]).toHaveAttribute('data-button-text', 'Trocar');
		expect(classComponents[1]).toHaveAttribute('data-small', 'true');
	});

	it('shows Divider on mobile only', () => {
		render(<ScheduleHeader {...defaultProps} />);

		expect(screen.getByTestId('mui-divider')).toBeInTheDocument();
	});

	it('calls setDate with current date when Hoje button is clicked', () => {
		render(<ScheduleHeader {...defaultProps} />);

		const hojeButton = screen.getByText('Hoje');
		fireEvent.click(hojeButton);

		expect(mockSetDate).toHaveBeenCalledWith(expect.any(DateTime));
	});

	it('renders with correct structure and classes', () => {
		render(<ScheduleHeader {...defaultProps} />);

		const header = screen.getByRole('banner');
		expect(header).toHaveClass('flex', 'w-full', 'flex-col');
	});
});
