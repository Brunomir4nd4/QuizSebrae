import { Turma } from '../../src/types/IParticipants';

export const mockTurmaData: Turma = {
	activities: 4,
	students: [
		{
			id: '1',
			name: 'João Silva',
			cpf: '123.456.789-00',
			phone: '5511999999999',
			email: 'joao@example.com',
			is_enroll_canceled: false,
			is_cancel_requested: false,
			activities: [
				{ activity_id: '1', status: 'avaliada' },
				{ activity_id: '2', status: 'recebida' },
				{ activity_id: '3', status: 'não recebida' },
				{ activity_id: '4', status: 'não recebida' },
			],
		},
		{
			id: '2',
			name: 'Maria Santos',
			cpf: '987.654.321-00',
			phone: '5511988888888',
			email: 'maria@example.com',
			is_enroll_canceled: false,
			is_cancel_requested: false,
			activities: [
				{ activity_id: '1', status: 'avaliada' },
				{ activity_id: '2', status: 'avaliada' },
				{ activity_id: '3', status: 'recebida' },
				{ activity_id: '4', status: 'não recebida' },
			],
		},
		{
			id: '3',
			name: 'Pedro Oliveira',
			cpf: '456.789.123-00',
			phone: '5511977777777',
			email: 'pedro@example.com',
			is_enroll_canceled: false,
			is_cancel_requested: false,
			activities: [
				{ activity_id: '1', status: 'recebida em outro canal' },
				{ activity_id: '2', status: 'não recebida' },
				{ activity_id: '3', status: 'não recebida' },
				{ activity_id: '4', status: 'não recebida' },
			],
		},
		{
			id: '4',
			name: 'Ana Costa',
			cpf: '321.654.987-00',
			phone: '5511966666666',
			email: 'ana@example.com',
			is_enroll_canceled: false,
			is_cancel_requested: false,
			activities: [
				{ activity_id: '1', status: 'avaliada' },
				{ activity_id: '2', status: 'avaliada' },
				{ activity_id: '3', status: 'avaliada' },
				{ activity_id: '4', status: 'avaliada' },
			],
		},
	],
};
