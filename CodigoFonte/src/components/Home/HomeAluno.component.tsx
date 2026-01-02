'use client';
import { Card } from '@/components/Card';
import { CardHighlight } from '@/components/CardHighlight';
import { Grid } from '@mui/material';
import { FunctionComponent } from 'react';
import React from 'react';
import { HomeLinks } from '@/components/HomeLinks';
import { ThemeSettings } from '@/types/IThemeSettings';
import { useUserContext } from '@/app/providers/UserProvider';
import { Loader } from '@/components/Loader';

interface HomeAlunoProps {
	/**
	 * Configurações de tema para customização da home do aluno.
	 */
	settings: ThemeSettings;
}

/**
 * **HomeAluno**
 *
 * ### 🧩 Funcionalidade
 * - Tela inicial para alunos com cards de acesso rápido.
 * - Mostra sala ao vivo, mentorias, jornada e links adicionais.
 * - Personaliza com configurações de tema e dados da turma.
 * - Verifica permissões (enable_room, enable_calendar).
 * - Usa HomeLinks para atalhos.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <HomeAluno settings={themeSettings} />
 * ```
 *
 * ### 🎨 Estilização
 * - Layout com Grid do Material-UI.
 * - Cards (Card, CardHighlight) para funcionalidades.
 * - Fundo cinza, responsivo.
 * - Margens e padding customizados.
 *
 * @component
 */
const HomeAluno: FunctionComponent<HomeAlunoProps> = ({ settings }) => {
	const { classId, classesData } = useUserContext();

	if (!classesData || !classId) {
		return <Loader />;
	}

	const classData = classesData[classId];
	const useStrategicActivities =
		classData?.enable_strategic_activities &&
		classData.strategic_activities_number > 0;

	return (
		<>
			<section className='flex justify-center w-full py-[40px] px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] min-h-screen bg-gray-100'>
				<div className='max-w-[1640px] w-full'>
					<Grid container spacing={3} sx={{ marginBottom: 5 }}>
						{settings?.participant?.enable_room &&
							classData?.enable_room !== false && (
								<Grid item xs={12} lg={3}>
									<CardHighlight
										title='ao vivo'
										text='entrar'
										href={`/sala-de-reuniao/${classId}`}
										image='/online.svg'
										turno={classData?.turno?.value}
									/>
								</Grid>
							)}
						{settings?.participant?.enable_calendar &&
							classData?.enable_calendar !== false && (
								<Grid item xs={12} lg={3}>
									<Card
										title='Mentorias'
										text='agendar'
										href={`agendar/${classId}`}
										image='/icon-consultoria-green.svg'
									/>
								</Grid>
							)}
						{useStrategicActivities && (
							<Grid item xs={12} lg={3}>
								<Card
									title='Atividades estratégicas'
									text='Enviar'
									href='/atividades-estrategicas'
									image='/icon-activities-verde.svg'
									target='_self'
								/>
							</Grid>
						)}
						<Grid item xs={12} lg={3}>
							<Card
								title='Jornada'
								text='avaliar'
								href={classData?.courses?.evaluate_course || ''}
								target='_blank'
								image='/icon-jornada-green.svg'
							/>
						</Grid>
					</Grid>
					<Grid container spacing={3} className='mt-[40px] md:mt-0'>
						<HomeLinks userType='subscriber' classData={classData} />
					</Grid>
				</div>
			</section>
		</>
	);
};

export default HomeAluno;
