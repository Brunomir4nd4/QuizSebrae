'use client';
import { ActivitiesSlider } from './ActivitiesSlider.component';
import { Meta, StoryObj } from '@storybook/nextjs';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Student } from '@/types/IStudent';
import { ClassData } from '@/types/IClass';
import { classDataWithProgressiveCertification } from '../../../.storybook/mocks/classData';

const classDataOutsideEditPeriod: ClassData = {
	...classDataWithProgressiveCertification,
	id: 3,
	title: 'Turma Fora do Período',
	slug: 'turma-fora-periodo',
	start_date: '01/01/2024',
	end_date: '30/06/2024',
};

const studentsWithActiveEnrollment: Student[] = [
	{
		id: 1,
		name: 'João Silva',
		cpf: '12345678901',
		phone: '5511999999999',
		enrollment_id: 101,
		activities: { '1': true, '2': false, '3': true, '4': false },
		is_enroll_canceled: false,
		is_cancel_requested: false,
	},
	{
		id: 2,
		name: 'Maria Souza',
		cpf: '98765432100',
		phone: '5511988888888',
		enrollment_id: 102,
		activities: { '1': false, '2': true, '3': false, '4': true },
		is_enroll_canceled: false,
		is_cancel_requested: false,
	},
];

const studentsWithCancelRequested: Student[] = [
	{
		id: 3,
		name: 'Pedro Santos',
		cpf: '11122233344',
		phone: '5511977777777',
		enrollment_id: 103,
		activities: { '1': true, '2': true, '3': false, '4': false },
		is_enroll_canceled: false,
		is_cancel_requested: true,
	},
	{
		id: 4,
		name: 'Ana Costa',
		cpf: '55566677788',
		phone: '5511966666666',
		enrollment_id: 104,
		activities: { '1': false, '2': false, '3': true, '4': false },
		is_enroll_canceled: false,
		is_cancel_requested: true,
	},
];

const studentsWithCanceledEnrollment: Student[] = [
	{
		id: 5,
		name: 'Carlos Oliveira',
		cpf: '99988877766',
		phone: '5511955555555',
		enrollment_id: 105,
		activities: { '1': false, '2': false, '3': false, '4': false },
		is_enroll_canceled: true,
		is_cancel_requested: false,
	},
	{
		id: 6,
		name: 'Juliana Lima',
		cpf: null,
		phone: '5511944444444',
		enrollment_id: 106,
		activities: { '1': false, '2': false, '3': false, '4': false },
		is_enroll_canceled: undefined,
		is_cancel_requested: false,
	},
];

const studentsWithMixedStatus: Student[] = [
	...studentsWithActiveEnrollment,
	...studentsWithCancelRequested.slice(0, 1),
	...studentsWithCanceledEnrollment.slice(0, 1),
];

const meta: Meta<typeof ActivitiesSlider> = {
	title: 'components/Molecules/Sliders/ActivitiesSlider',
	component: ActivitiesSlider,
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: 'select',
			options: ['supervisor', 'estudante'],
		},
		onStudentUpdate: {
			action: 'onStudentUpdate',
		},
	},
};

export default meta;

type Story = StoryObj<typeof ActivitiesSlider>;

export const VisaoSupervisor: Story = {
	args: {
		classData: classDataWithProgressiveCertification,
		whatsAppMessage: 'Olá! Como posso ajudá-lo com sua atividade?',
		students: studentsWithActiveEnrollment,
		type: 'supervisor',
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const firstActivityTitle = args.classData?.ciclos?.activity_titles?.[0] || '1ª atividade';
		const activityTitle = canvas.getByText(firstActivityTitle);
		await expect(activityTitle).toBeInTheDocument();

		const joaoSilvaElements = canvas.getAllByText(/João Silva/i);
		await expect(joaoSilvaElements.length).toBeGreaterThan(0);

		const mariaSouzaElements = canvas.getAllByText(/Maria Souza/i);
		await expect(mariaSouzaElements.length).toBeGreaterThan(0);

		const prevButton = canvas.getByAltText(/anterior/i);
		const nextButton = canvas.getByAltText(/próximo/i);
		await expect(prevButton).toBeInTheDocument();
		await expect(nextButton).toBeInTheDocument();

		await user.click(nextButton);

		await new Promise(resolve => setTimeout(resolve, 300));

		const secondActivityTitle = args.classData?.ciclos?.activity_titles?.[1] || '2ª atividade';
		const secondActivity = canvas.getByText(secondActivityTitle);
		await expect(secondActivity).toBeInTheDocument();
	},
};

export const StatusDiferentes: Story = {
	args: {
		classData: classDataWithProgressiveCertification,
		whatsAppMessage: 'Precisa de ajuda?',
		students: studentsWithMixedStatus,
		type: 'supervisor',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const matriculaAtivaButtons = canvas.getAllByText(/matrícula ativa/i);
		await expect(matriculaAtivaButtons.length).toBeGreaterThan(0);

		const cancelamentoSolicitadoButtons = canvas.getAllByText(/cancelamento solicitado/i);
		await expect(cancelamentoSolicitadoButtons.length).toBeGreaterThan(0);

		const matriculaCanceladaButtons = canvas.getAllByText(/matrícula cancelada/i);
		await expect(matriculaCanceladaButtons.length).toBeGreaterThan(0);
	},
};

export const ForaDoPeriodoDeEdicao: Story = {
	args: {
		classData: classDataOutsideEditPeriod,
		whatsAppMessage: 'Olá!',
		students: studentsWithActiveEnrollment,
		type: 'supervisor',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const matriculaButtons = canvas.getAllByText(/matrícula ativa/i);
		
		matriculaButtons.forEach(button => {
			expect(button).toBeDisabled();
		});
	},
};

export const VisaoEstudante: Story = {
	args: {
		classData: classDataWithProgressiveCertification,
		whatsAppMessage: 'Olá!',
		students: studentsWithActiveEnrollment,
		type: 'student',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const navigateButtons = canvas.queryAllByText(/navegar como participante/i);
		await expect(navigateButtons).toHaveLength(0);
	},
};

export const ListaVaziaDeEstudantes: Story = {
	args: {
		classData: classDataWithProgressiveCertification,
		whatsAppMessage: 'Olá!',
		students: [],
		type: 'supervisor',
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		const firstActivityTitle = args.classData?.ciclos?.activity_titles?.[0] || '1ª atividade';
		const activityTitle = canvas.getByText(firstActivityTitle);
		await expect(activityTitle).toBeInTheDocument();

		const table = canvas.getByRole('table');
		const rows = within(table).queryAllByRole('row');
		await expect(rows).toHaveLength(0);
	},
};
