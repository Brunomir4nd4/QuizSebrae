import { render, screen } from '@testing-library/react';
import { SummaryOfActivities } from './SummaryOfActivities.component';
import React from 'react';

describe('SummaryOfActivities', () => {
	const mockTurma = {
		activities: 3,
		students: [
			{
				id: 'stu1',
				name: 'Aluno 1',
				cpf: '123456789',
				phone: '999999999',
				email: 'aluno1@example.com',
				activities: [
					{ status: 'avaliada' as const, activity_id: '1' },
					{ status: 'recebida' as const, activity_id: '2' },
					{ status: 'não recebida' as const, activity_id: '3' },
				],
			},
			{
				id: 'stu2',
				name: 'Aluno 2',
				cpf: '987654321',
				phone: '888888888',
				email: 'aluno2@example.com',
				activities: [
					{ status: 'avaliada' as const, activity_id: '1' },
					{ status: 'avaliada' as const, activity_id: '2' },
					{ status: 'recebida em outro canal' as const, activity_id: '3' },
				],
			},
		],
	};

	it('renderiza o título e os status', () => {
		render(<SummaryOfActivities data={mockTurma} />);
		expect(screen.getByText('Resumo das atividades')).toBeInTheDocument();
		expect(screen.getByText(/Avaliadas/)).toBeInTheDocument();
		expect(screen.getByText(/Pendentes/)).toBeInTheDocument();
		expect(screen.getByText(/Não recebidas/)).toBeInTheDocument();
	});

	it('renderiza os contadores corretos para cada status', () => {
		render(<SummaryOfActivities data={mockTurma} />);
		expect(
			screen.getByText(
				(content) => content.replace(/\s+/g, '') === 'Avaliadas(3)',
			),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				(content) => content.replace(/\s+/g, '') === 'Pendentes(2)',
			),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				(content) => content.replace(/\s+/g, '') === 'Nãorecebidas(1)',
			),
		).toBeInTheDocument();
	});

	it('renderiza os spans coloridos para cada status', () => {
		render(<SummaryOfActivities data={mockTurma} />);
		// Avaliada: rgb(30, 255, 157), Recebida: rgb(255, 179, 30), Não recebida: rgb(159, 159, 159)
		const colors = [
			'rgb(30, 255, 157)',
			'rgb(255, 179, 30)',
			'rgb(159, 159, 159)',
		];
		const colorSpans = document.querySelectorAll('span[style]');
		expect(colorSpans.length).toBeGreaterThanOrEqual(3);
		colors.forEach((color) => {
			expect(
				Array.from(colorSpans).some((span) =>
					span.getAttribute('style')?.includes(color),
				),
			).toBe(true);
		});
	});

	it("ignora o status 'recebida em outro canal' na barra e legenda", () => {
		render(<SummaryOfActivities data={mockTurma} />);
		// Não deve renderizar 'recebida em outro canal' como label
		expect(screen.queryByText(/recebida em outro canal/i)).toBeNull();
	});
});
