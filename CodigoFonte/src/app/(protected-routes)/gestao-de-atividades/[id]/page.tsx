'use client';

import { FunctionComponent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getAllSubmissions } from '@/app/services/bff/SubmissionService';
import { useUserContext } from '@/app/providers/UserProvider';
import { Loader } from '@/components/Loader';
import { WhatsAppButton } from '@/components/ParticipacaoTable/components';
import { Divider } from '@mui/material';
import { Class } from '@/components/Class';
import { ActivityEvaluationSlider } from '@/components/ActivityEvaluationSlider';
import { submissionsToSliderItems } from '@/utils/submissionsToSliderItems';
import { ActivityEvaluationProps } from '@/components/ActivityEvaluation/ ActivityEvaluation.component';

interface PageAvaliarAtividadeProps {
	params: {
		id: string;
	};
}

interface Participant {
	name: string;
	phone: string;
	cpf: string;
	email: string;
}

const PageAvaliarAtividade: FunctionComponent<PageAvaliarAtividadeProps> = ({
	params,
}) => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const { classId, classesData } = useUserContext();
	const [items, setItems] = useState<ActivityEvaluationProps[]>([]);
	const [selectedParticipant, setSelectedParticipant] = useState<Participant>({
		name: '',
		phone: '',
		cpf: '',
		email: '',
	});
	const [selectedActivity, setSelectedActivity] = useState<number>(1);

	useEffect(() => {
		const rawParticipant = sessionStorage.getItem('selectedParticipant');
		const rawActivity = sessionStorage.getItem('selectedActivity');
		if (rawParticipant) {
			try {
				const parsedParticipant = JSON.parse(rawParticipant);
				setSelectedParticipant(parsedParticipant);
			} catch (e) {
				console.error('Erro ao fazer parse do participante:', e);
			}
		}

		if (rawActivity) {
			setSelectedActivity(Number(rawActivity));
		}
	}, []);

	useEffect(() => {
		if (status === 'loading') return;
		if (!session) return router.push('/');

		getSubmissions().catch(console.error);
	}, [status, session, params.id, classId, classesData, router]);

	const getSubmissions = async () => {
		if (!classId || !classesData) return;

		const total = classesData[classId].strategic_activities_number;
		const subs = await getAllSubmissions({
			participant_id: Number(params.id),
			class_id: classesData[classId].id,
		});

		setItems(submissionsToSliderItems(subs, total));
	};

	const participantLoaded =
		selectedParticipant.name &&
		selectedParticipant.phone &&
		selectedParticipant.cpf;

	if (!participantLoaded) return <Loader />;

	return (
		<>
			<section className='flex justify-center w-full pt-[50px] pb-[32px] px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] bg-gray-100'>
				<div className='max-w-[1640px] w-full'>
					<div className='flex items-center justify-between'>
						<div className='text-left text-4xl py-7 w-[585px] flex flex-col items-start md:flex-row-reverse md:justify-end gap-2'>
							<div className='flex gap-4'>
								<span className='font-bold'>{selectedParticipant.name}</span>
								{`(${selectedParticipant.cpf ? selectedParticipant.cpf : 'S/N'})`}
							</div>
							<WhatsAppButton
								whatsAppMessage={`Oi ${selectedParticipant.name}!`}
								phone={selectedParticipant.phone}
							/>
						</div>
						<div className='hidden md:flex items-center justify-end'>
							<div className='min-w-[465px]'>
								<Class
									query='participacao'
									small
									href='/trocar-turma'
									buttonText='Trocar'
								/>
							</div>
						</div>
					</div>
					<div className='block md:hidden'>
						<Class
							query='participacao'
							small
							href='/trocar-turma'
							buttonText='Trocar'
						/>
					</div>
					<Divider sx={{ pt: '35px' }} />
				</div>
			</section>
			<ActivityEvaluationSlider
				items={items}
				selectedActivity={selectedActivity}
				selectedParticipant={Number(params.id)}
				selectedStudentName={selectedParticipant.name}
				selectedStudentEmail={selectedParticipant.email}
				onChange={getSubmissions}
			/>
		</>
	);
};

export default PageAvaliarAtividade;
