export interface Participant {
	is_cancel_requested?: boolean;
	is_enroll_canceled?: boolean;
	cpf: string;
	id: string;
	name: string;
	phone: string;
	email: string;
	activities: {
		status: ActivityStatus;
		id?: string;
		activity_id: string;
	}[];
}

export interface Turma {
	activities: number;
	students: Participant[];
}

export type ActivityStatus =
	| 'avaliada'
	| 'recebida'
	| 'não recebida'
	| 'recebida em outro canal';
