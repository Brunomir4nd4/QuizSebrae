import type { Meta, StoryObj } from '@storybook/nextjs';
import { ParticipacaoTable } from './ParticipacaoTable.component';
import { ClassData } from '@/types/IClass';
import { Student } from '@/types/IStudent';
import {classDataWithProgressiveCertification} from '../../../.storybook/mocks/classData';

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
		is_enroll_canceled: true,
		is_cancel_requested: false,
	},
];

const studentsWithMixedStatus: Student[] = [
	...studentsWithActiveEnrollment,
	...studentsWithCancelRequested.slice(0, 1),
	...studentsWithCanceledEnrollment.slice(0, 1),
];

const meta: Meta<typeof ParticipacaoTable> = {
		title: 'components/Molecules/Table/ParticipacaoTable',
	component: ParticipacaoTable,
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: 'select',
			options: ['supervisor', 'estudante'],
			description: 'Tipo de usuário visualizando o componente',
		},
		onStudentUpdate: {
			action: 'onStudentUpdate',
			description: 'Callback chamado quando um estudante é atualizado para dar refetch na lista',
		},
	},
};

export default meta;

type Story = StoryObj<typeof ParticipacaoTable>;

export const VisaoSupervisor: Story = {
	args: {
		classData: classDataWithProgressiveCertification,
		whatsAppMessage: 'Olá! Como posso ajudá-lo com sua atividade?',
		students: studentsWithActiveEnrollment,
		type: 'supervisor',
	},
};

export const StatusDiferentes: Story = {
	args: {
		classData: classDataWithProgressiveCertification,
		whatsAppMessage: 'Precisa de ajuda?',
		students: studentsWithMixedStatus,
		type: 'supervisor',
	},
};

export const ForaDoPeriodoDeEdicao: Story = {
	args: {
		classData: classDataOutsideEditPeriod,
		whatsAppMessage: 'Olá!',
		students: studentsWithActiveEnrollment,
		type: 'supervisor',
	},
};

export const VisaoEstudante: Story = {
	args: {
		classData: classDataWithProgressiveCertification,
		whatsAppMessage: 'Olá!',
		students: studentsWithActiveEnrollment,
		type: 'student',
	},
};

export const ListaVaziaDeEstudantes: Story = {
	args: {
		classData: classDataWithProgressiveCertification,
		whatsAppMessage: 'Olá!',
		students: [],
		type: 'supervisor',
	},
};
