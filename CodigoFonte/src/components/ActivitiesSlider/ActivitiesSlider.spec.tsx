import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActivitiesSlider } from './index';

import { ClassData } from '@/types/IClass';
import { mockClassData } from '@/mocks/  mockClassData';
import * as hooks from '@/hooks';

const mockIsDateWithinEditPeriod =
	hooks.isDateWithinEditPeriod as jest.MockedFunction<
		typeof hooks.isDateWithinEditPeriod
	>;
const mockUseIsTodayWithinDateRange =
	hooks.useIsTodayWithinDateRange as jest.MockedFunction<
		typeof hooks.useIsTodayWithinDateRange
	>;

jest.mock('react-slick', () => {
	const MockSlick = React.forwardRef<
		HTMLDivElement,
		{ children: React.ReactNode }
	>(({ children }, ref) => <div ref={ref}>{children}</div>);
	MockSlick.displayName = 'MockSlick';
	return MockSlick;
});

jest.mock('../StyledSwitch', () => ({
	StyledSwitch: ({ active }: { active: boolean }) => (
		<div data-testid='styled-switch'>{active ? 'on' : 'off'}</div>
	),
}));

jest.mock('../ParticipacaoTable/components', () => ({
	WhatsAppButton: ({ phone }: { phone: string }) => (
		<button data-testid='whatsapp-btn'>{phone}</button>
	),
	NavigateAsParticipantIcon: () => (
		<div data-testid='navigate-icon'>Navigate</div>
	),
}));

jest.mock('../CancelMatriculaModal', () => ({
	CancelMatriculaModal: () => (
		<div data-testid='cancel-modal'>Cancel Modal</div>
	),
}));

jest.mock('@/app/services/bff/ClassService', () => ({
	requestEnrollmentCancellation: jest.fn(),
}));

jest.mock('@/hooks', () => {
	const actualHooks = jest.requireActual('@/hooks');
	return {
		...actualHooks,
		isDateWithinEditPeriod: jest.fn(() => true),
		useIsTodayWithinDateRange: jest.fn(() => true),
	};
});

describe('ActivitiesSlider', () => {
	let classData: ClassData;

	beforeEach(() => {
		classData = mockClassData();
		// Reset dos mocks para valores padrão
		mockIsDateWithinEditPeriod.mockReturnValue(true);
		mockUseIsTodayWithinDateRange.mockReturnValue(true);
	});

	it('renders current activity title', () => {
		render(
			<ActivitiesSlider
				classData={classData}
				students={[
					{
						id: 1,
						name: 'João',
						cpf: '12345678900',
						phone: '999999999',
						activities: { 1: true, 2: false },
					},
				]}
				whatsAppMessage='Mensagem de teste'
				type='supervisor'
			/>,
		);

		expect(screen.getByText('Atividade 1')).toBeInTheDocument();
	});

	it('renders WhatsAppButton and StyledSwitch', () => {
		render(
			<ActivitiesSlider
				classData={classData}
				students={[
					{
						id: 1,
						name: 'João',
						cpf: '12345678900',
						phone: '999999999',
						activities: { 1: true, 2: false },
					},
				]}
				whatsAppMessage='Mensagem de teste'
				type='supervisor'
			/>,
		);

		// Usar getAllByTestId porque temos múltiplos elementos
		expect(screen.getAllByTestId('whatsapp-btn').length).toBeGreaterThan(0);
		expect(screen.getAllByTestId('styled-switch').length).toBeGreaterThan(0);
	});

	it('navigation buttons exist and are clickable', () => {
		render(
			<ActivitiesSlider
				classData={classData}
				students={[
					{
						id: 1,
						name: 'João',
						cpf: '12345678900',
						phone: '999999999',
						activities: { 1: true, 2: false },
					},
				]}
				whatsAppMessage='Mensagem de teste'
				type='supervisor'
			/>,
		);

		const prevBtn = screen.getByAltText('Anterior').closest('div');
		const nextBtn = screen.getByAltText('Próximo').closest('div');

		expect(prevBtn).toBeInTheDocument();
		expect(nextBtn).toBeInTheDocument();

		fireEvent.click(prevBtn!);
		fireEvent.click(nextBtn!);
	});

	it('shows student name and partial CPF', () => {
		render(
			<ActivitiesSlider
				classData={classData}
				students={[
					{
						id: 1,
						name: 'João',
						cpf: '12345678900',
						phone: '999999999',
						activities: { 1: true, 2: false },
					},
				]}
				whatsAppMessage='Mensagem de teste'
				type='supervisor'
			/>,
		);

		expect(screen.getAllByText(/João \(123/)[0]).toBeInTheDocument();
		const studentCells = screen.getAllByText(/João \(123/);
		expect(studentCells.length).toBeGreaterThan(0);
	});

	it('StyledSwitch shows "on" or "off" according to student activity', () => {
		render(
			<ActivitiesSlider
				classData={classData}
				students={[
					{
						id: 1,
						name: 'João',
						cpf: '12345678900',
						phone: '999999999',
						activities: { 1: true, 2: false },
					},
				]}
				whatsAppMessage='Mensagem de teste'
				type='supervisor'
			/>,
		);

		const switches = screen.getAllByTestId('styled-switch');
		expect(switches[0].textContent).toBe('on'); // atividade 1
		expect(switches[1].textContent).toBe('off'); // atividade 2
	});

	it('displays "Active Enrollment" button when enrollment is not canceled', () => {
		render(
			<ActivitiesSlider
				classData={classData}
				students={[
					{
						id: 1,
						name: 'João',
						cpf: '12345678900',
						phone: '999999999',
						activities: { 1: true },
						is_enroll_canceled: false,
						is_cancel_requested: false,
					},
				]}
				whatsAppMessage='Mensagem de teste'
				type='supervisor'
			/>,
		);

		const activeButtons = screen.getAllByText('Matrícula Ativa');
		expect(activeButtons.length).toBeGreaterThan(0);
		expect(activeButtons[0]).toBeInTheDocument();
	});

	it('displays "Canceled Enrollment" button when enrollment is canceled', () => {
		render(
			<ActivitiesSlider
				classData={classData}
				students={[
					{
						id: 1,
						name: 'João',
						cpf: '12345678900',
						phone: '999999999',
						activities: { 1: true },
						is_enroll_canceled: true,
						is_cancel_requested: false,
					},
				]}
				whatsAppMessage='Mensagem de teste'
				type='supervisor'
			/>,
		);

		const canceledButtons = screen.getAllByText('Matrícula Cancelada');
		expect(canceledButtons.length).toBeGreaterThan(0);
		expect(canceledButtons[0]).toBeInTheDocument();
	});

	it('displays "Cancellation Requested" button when cancellation was requested', () => {
		render(
			<ActivitiesSlider
				classData={classData}
				students={[
					{
						id: 1,
						name: 'João',
						cpf: '12345678900',
						phone: '999999999',
						activities: { 1: true },
						is_enroll_canceled: false,
						is_cancel_requested: true,
					},
				]}
				whatsAppMessage='Mensagem de teste'
				type='supervisor'
			/>,
		);

		const requestedButtons = screen.getAllByText('Cancelamento Solicitado');
		expect(requestedButtons.length).toBeGreaterThan(0);
		expect(requestedButtons[0]).toBeInTheDocument();
	});

	it('opens cancellation modal when clicking "Active Enrollment"', () => {
		const modifiedClassData = {
			...classData,
			enable_certificacao_progressiva: true,
		};

		render(
			<ActivitiesSlider
				classData={modifiedClassData}
				students={[
					{
						id: 1,
						name: 'João',
						cpf: '12345678900',
						phone: '999999999',
						activities: { 1: true },
						is_enroll_canceled: false,
						is_cancel_requested: false,
						enrollment_id: 123,
					},
				]}
				whatsAppMessage='Mensagem de teste'
				type='supervisor'
			/>,
		);

		const activeButtons = screen.getAllByText('Matrícula Ativa');
		fireEvent.click(activeButtons[0]);

		expect(screen.getByTestId('cancel-modal')).toBeInTheDocument();
	});

	it('does not open modal when clicking "Canceled Enrollment"', () => {
		render(
			<ActivitiesSlider
				classData={classData}
				students={[
					{
						id: 1,
						name: 'João',
						cpf: '12345678900',
						phone: '999999999',
						activities: { 1: true },
						is_enroll_canceled: true,
						is_cancel_requested: false,
					},
				]}
				whatsAppMessage='Mensagem de teste'
				type='supervisor'
			/>,
		);

		const canceledButtons = screen.getAllByText('Matrícula Cancelada');
		fireEvent.click(canceledButtons[0]);

		expect(screen.queryByTestId('cancel-modal')).not.toBeInTheDocument();
	});

	it('enrollment buttons are disabled when outside edit period', () => {
		mockUseIsTodayWithinDateRange.mockReturnValue(false);

		render(
			<ActivitiesSlider
				classData={classData}
				students={[
					{
						id: 1,
						name: 'João',
						cpf: '12345678900',
						phone: '999999999',
						activities: { 1: true },
						is_enroll_canceled: false,
						is_cancel_requested: false,
					},
				]}
				whatsAppMessage='Mensagem de teste'
				type='supervisor'
			/>,
		);

		const activeButtons = screen.getAllByText('Matrícula Ativa');
		activeButtons.forEach((button) => {
			expect(button).toBeDisabled();
		});
	});

	it('enrollment buttons are disabled when progressive certification is disabled', () => {
		const modifiedClassData = {
			...classData,
			enable_certificacao_progressiva: false,
		};

		render(
			<ActivitiesSlider
				classData={modifiedClassData}
				students={[
					{
						id: 1,
						name: 'João',
						cpf: '12345678900',
						phone: '999999999',
						activities: { 1: true },
						is_enroll_canceled: false,
						is_cancel_requested: false,
					},
				]}
				whatsAppMessage='Mensagem de teste'
				type='supervisor'
			/>,
		);

		const activeButtons = screen.getAllByText('Matrícula Ativa');
		activeButtons.forEach((button) => {
			expect(button).toBeDisabled();
		});
	});
});
