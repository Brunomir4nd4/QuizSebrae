'use client';
import { Card } from '@/components/Card';
import { CardHighlight } from '@/components/CardHighlight';
import { Class } from '@/components/Class';
import { Grid } from '@mui/material';
import { FunctionComponent } from 'react';
import { HomeLinks } from '@/components/HomeLinks';
import { ThemeSettings } from '@/types/IThemeSettings';
import { Loader } from '@/components/Loader';
import { useUserContext } from '@/app/providers/UserProvider';
import { useSubmissionNotifications } from '@/hooks/useSubmissionsNotification';
import { useSession } from 'next-auth/react';

interface HomeFacilitadorProps {
	/**
	 * Configurações de tema para customização da home do facilitador.
	 */
	settings: ThemeSettings;
}

/**
 * **HomeFacilitador**
 *
 * ### 🧩 Funcionalidade
 * - Tela inicial para facilitadores com cards para turmas, agenda, sala ao vivo.
 * - Permite trocar turma, administrar agenda, gerenciar turmas.
 * - Personaliza com configurações de tema.
 * - Adiciona settings ao contexto para mensagens WhatsApp.
 * - Usa HomeLinks para atalhos.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <HomeFacilitador settings={themeSettings} />
 * ```
 *
 * ### 🎨 Estilização
 * - Grid layout com cards (Card, CardHighlight, Class).
 * - Fundo cinza, responsivo.
 * - Margens customizadas.
 *
 * @component
 */
const HomeFacilitador: FunctionComponent<HomeFacilitadorProps> = ({
	settings,
}) => {
	const { classId, classesData, courseLoading, setThemeSettings } =
		useUserContext();
	const { data: session } = useSession();

	const classData = classId ? classesData?.[classId] : undefined;
	const { submissionNotifications } = useSubmissionNotifications({
		facilitador_id: session?.user?.id,
		cycle_id: classData?.ciclos?.id,
		class_id: classData?.id,
	});

	if (!classesData || !classId || courseLoading) {
		return <Loader />;
	}

	const useStrategicActivities =
		classData?.enable_strategic_activities &&
		classData.strategic_activities_number > 0;

	const notify = classData
		? submissionNotifications?.[classData.ciclos.id]?.classes?.[classData.id]
				.hasSubmittedActivities || false
		: false;

	/**
	 * Adiciona configurações dentro do context
	 * pra uso posterior das mensagens do whatsapp
	 */
	const setMessage = () => {
		setThemeSettings(settings);
	};

	return (
		<>
			<section className='flex justify-center w-full py-[40px] px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] min-h-screen bg-gray-100'>
				<div className='max-w-[1640px] w-full'>
					<Grid container spacing={3} justifyContent='space-between'>
						<Grid
							sx={{ marginBottom: 5 }}
							item
							xs={12}
							lg={8}
							onClick={setMessage}>
							<Class href='/trocar-turma' buttonText='Trocar turma' />
							<Grid container spacing={3} sx={{ marginTop: '40px' }}>
								{settings?.facilitator?.enable_room &&
									classesData[classId]?.enable_room !== false && (
										<Grid item xs={12} lg={4}>
											<CardHighlight
												title='ao vivo'
												text='entrar'
												href={`/sala-de-reuniao/${classId}`}
												image='/online.svg'
												turno={classesData[classId]?.turno?.value}
											/>
										</Grid>
									)}
								{settings?.facilitator?.enable_calendar &&
									classesData[classId]?.enable_calendar !== false && (
										<Grid item xs={12} lg={4}>
											<Card
												title='Agenda'
												text='administrar'
												href={`agenda`}
												image='/icon-agenda.svg'
											/>
										</Grid>
									)}
								{useStrategicActivities && (
									<Grid item xs={12} lg={4}>
										<Card
											title='Gestão de atividades'
											text='gerir'
											href='/gestao-de-atividades'
											target='_self'
											image='/icon-activities-verde.svg'
											notify={notify}
										/>
									</Grid>
								)}
								<Grid item xs={12} lg={4}>
									<Card
										title='Turmas'
										text='gerenciar'
										href={{
											pathname: `participacao/${classId}`,
											query: { time: Math.floor(Math.random() * 1000) },
										}}
										image='/icon-turmas.svg'
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} md={12} lg={3}>
							<HomeLinks
								userType='facilitator'
								classData={classesData[classId]}
							/>
						</Grid>
					</Grid>
				</div>
			</section>
		</>
	);
};

export default HomeFacilitador;
