export const titles: PageTitle = {
	facilitador: {
		home: 'Gerencie suas atividades',
		agenda: 'Administrar Agenda',
		participacao: 'Administrar Turma',
		trocarturma: 'Trocar Turma',
		atividadesestrategicas: 'Atividades Estratégicas',
		avaliaratividade: 'Avaliar Atividade',
		gestaodeatividades: 'Administrar Turma',
		saladereuniao: '',
		quiz: 'Quiz',
	},
	aluno: {
		home: 'Acompanhe sua jornada',
		agendar: 'Agendar mentoria',
		participacao: 'Administrar Turma',
		trocarturma: 'Trocar Turma',
		atividadesestrategicas: 'Atividades Estratégicas',
		avaliaratividade: 'Avaliar Atividade',
		gestaodeatividades: 'Administrar Turma',
		saladereuniao: '',
		quiz: 'Quiz',
	},
};

export interface PageTitle {
	facilitador: {
		[key: string]: string;
	};
	aluno: {
		[key: string]: string;
	};
}
