'use client';
import { ActivityStatus, Turma } from '@/types/IParticipants';
import { FunctionComponent } from 'react';
import React from 'react';

/**
 * Propriedades para o componente SummaryOfActivities
 */
type Props = {
	/** Dados da turma, incluindo alunos e atividades */
	data: Turma;
};

const statusColors: Record<ActivityStatus, string> = {
	avaliada: '#1EFF9D',
	recebida: '#FFB31E',
	'recebida em outro canal': '#FFB31E',
	'não recebida': '#9F9F9F',
};

/**
 * **SummaryOfActivities**
 *
 * Componente que exibe um resumo visual das atividades da turma, mostrando percentuais e totais por status.
 * Apresenta uma barra de progresso colorida e lista com contadores para cada status de atividade.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Calcula percentuais de atividades por status (avaliada, recebida, não recebida).
 * - Exibe barra visual com cores representando cada status.
 * - Lista textual com totais e descrições amigáveis.
 * - Agrupa "recebida em outro canal" com "recebida" para simplificação.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <SummaryOfActivities data={turmaData} />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (estilos inline no componente).
 *
 * ---
 *
 * @component
 */
export const SummaryOfActivities: FunctionComponent<Props> = ({ data }) => {
	const customOrder: ActivityStatus[] = [
		'avaliada',
		'recebida',
		'não recebida',
		'recebida em outro canal',
	];
	const getStatusPercentage = (turma: Turma) => {
		const totalActivities = turma.students.length * turma.activities;

		const statusCount: Record<ActivityStatus, number> = {
			'não recebida': 0,
			'recebida em outro canal': 0,
			recebida: 0,
			avaliada: 0,
		};

		turma.students.forEach((student) => {
			student.activities.forEach(({ status }) => {
				statusCount[status]++;
			});
		});

		if (statusCount['recebida em outro canal'] !== undefined) {
			statusCount['recebida'] += statusCount['recebida em outro canal'];
		}

		return Object.entries(statusCount)
			.map(([status, count]) => ({
				status,
				count,
				percentage: ((count / totalActivities) * 100).toFixed(2),
				color: statusColors[status as ActivityStatus],
			}))
			.sort(
				(a, b) =>
					customOrder.indexOf(a.status as ActivityStatus) -
					customOrder.indexOf(b.status as ActivityStatus),
			);
	};

	const percentages = getStatusPercentage(data);

	return (
		<div>
			<p className='text-2xl font-bold'>Resumo das atividades</p>
			<div className='pt-4'>
				<div className='flex items-center justify-start h-10 w-[390px] max-w-full rounded-full overflow-hidden mb-4'>
					{percentages.map(({ status, percentage, color }) => {
						if (status === 'recebida em outro canal') return;
						return (
							<span
								key={status}
								style={{ background: color, width: `${percentage}%` }}
								className={`flex h-full`}
							/>
						);
					})}
				</div>
				<div className='flex items-center gap-3 pl-2'>
					{percentages.map(({ status, count, color }) => {
						if (status === 'recebida em outro canal') return;

						return (
							<div key={status} className='flex items-center gap-1'>
								<span
									style={{ background: color }}
									className={`w-2 h-2 rounded-full`}
								/>
								<p className='text-base font-bold'>
									{status === 'avaliada'
										? 'Avaliadas'
										: status === 'recebida'
											? 'Pendentes'
											: 'Não recebidas'}{' '}
									({count})
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
