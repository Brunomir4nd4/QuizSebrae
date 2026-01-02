import React from 'react';
import { render, screen } from '@testing-library/react';
import { ParticipacaoTable } from './index';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SessionProvider } from 'next-auth/react';
import { mockClassData } from '@/mocks/  mockClassData';
import { ClassData } from '@/types/IClass';
import { Student } from '@/types/IStudent';
import * as hooks from '@/hooks';

jest.mock('@/app/services/bff/ClassService', () => ({
	requestEnrollmentCancellation: jest.fn(),
}));

jest.mock('@/hooks', () => ({
	...jest.requireActual('@/hooks'),
	isDateWithinEditPeriod: jest.fn(),
	useIsTodayWithinDateRange: jest.fn(),
}));

const theme = createTheme(); // tema padrão do MUI

const mockStudents: Student[] = [
	{
		id: 1,
		name: 'Aluno 1',
		cpf: '12345678901',
		phone: '11999999999',
		enrollment_id: 1,
		is_enroll_canceled: false,
		is_cancel_requested: false,
		activities: { '1': true, '2': false, '3': true },
	},
	{
		id: 2,
		name: 'Aluno 2',
		cpf: null,
		phone: '11988888888',
		enrollment_id: 2,
		is_enroll_canceled: false,
		is_cancel_requested: false,
		activities: { '1': false, '2': true, '3': false },
	},
	{
		id: 3,
		name: 'Aluno 3',
		cpf: '33333333333',
		phone: '11977777777',
		enrollment_id: 3,
		is_enroll_canceled: undefined,
		is_cancel_requested: false,
		activities: { '1': true, '2': true, '3': true },
	},
	{
		id: 4,
		name: 'Aluno 4',
		cpf: '44444444444',
		phone: '11966666666',
		enrollment_id: 4,
		is_enroll_canceled: false,
		is_cancel_requested: true,
		activities: { '1': true, '2': true, '3': true },
	},
];

describe('ParticipacaoTable', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(hooks.isDateWithinEditPeriod as jest.Mock).mockReturnValue(true);
		(hooks.useIsTodayWithinDateRange as jest.Mock).mockReturnValue(true);
	});

	it('renders table and activity headers correctly', () => {
		render(
			<SessionProvider session={null}>
				<ThemeProvider theme={theme}>
					<ParticipacaoTable
						type='supervisor'
						classData={mockClassData() as ClassData}
						whatsAppMessage='Mensagem'
						students={mockStudents}
					/>
				</ThemeProvider>
			</SessionProvider>,
		);
		mockClassData().ciclos.activity_titles.forEach((_, index) => {
			const headerText = `${index + 1}ª`;
			expect(screen.getByText(headerText)).toBeInTheDocument();
		});
	});

	it('renders students and their switches', () => {
		render(
			<SessionProvider session={null}>
				<ThemeProvider theme={theme}>
					<ParticipacaoTable
						type='supervisor'
						classData={mockClassData() as ClassData}
						whatsAppMessage='Mensagem'
						students={mockStudents}
					/>
				</ThemeProvider>
			</SessionProvider>,
		);

		mockStudents.forEach((student) => {
			const link = screen.getByRole('link', {
				name: new RegExp(student.phone),
			});
			expect(link).toHaveAttribute(
				'href',
				expect.stringContaining(`Oi ${student.name}! Mensagem`),
			);
		});
	});

	it('renders canceled enrollment button for student with is_enroll_canceled undefined', () => {
		render(
			<SessionProvider session={null}>
				<ThemeProvider theme={theme}>
					<ParticipacaoTable
						type='supervisor'
						classData={mockClassData() as ClassData}
						whatsAppMessage='Mensagem'
						students={mockStudents}
					/>
				</ThemeProvider>
			</SessionProvider>,
		);

		const canceledButtons = screen.getAllByText('Matrícula Cancelada');
		expect(canceledButtons.length).toBeGreaterThan(0);
	});

	it('renders cancellation requested button for student with is_cancel_requested true', () => {
		render(
			<SessionProvider session={null}>
				<ThemeProvider theme={theme}>
					<ParticipacaoTable
						type='supervisor'
						classData={mockClassData() as ClassData}
						whatsAppMessage='Mensagem'
						students={mockStudents}
					/>
				</ThemeProvider>
			</SessionProvider>,
		);

		expect(screen.getByText('Cancelamento Solicitado')).toBeInTheDocument();
	});

	it('renders enabled cancel enrollment button when progressive certification is active', () => {
		render(
			<SessionProvider session={null}>
				<ThemeProvider theme={theme}>
					<ParticipacaoTable
						type='supervisor'
						classData={
							mockClassData({
								enable_certificacao_progressiva: true,
							}) as ClassData
						}
						whatsAppMessage='Mensagem'
						students={mockStudents}
					/>
				</ThemeProvider>
			</SessionProvider>,
		);

		const cancelButtons = screen.getAllByText('Cancelar Matrícula');
		expect(cancelButtons.length).toBeGreaterThan(0);
		expect(cancelButtons[0].closest('button')).not.toBeDisabled();
	});
});
