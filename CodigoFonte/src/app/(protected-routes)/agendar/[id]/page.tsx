import { FunctionComponent, Suspense } from 'react';
import React from 'react';
import { Consultorias } from '@/components/Consultorias/Consultorias.component';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from '@/utils/authOptions';
import { Loader } from '@/components/Loader';
import { getAppointmentByClassAndCpf } from '@/app/services/external/ScheduleService';
import { NotifyModal } from '@/components/NotifyModal';
import { getMeetingTypeByClassId } from '@/app/services/external/ClassService';

interface AgendarProps {
	params: {
		id: number;
		slug: string;
	};
}

const PageAgendar: FunctionComponent<AgendarProps> = async ({ params }) => {
	let supportName = 'o suporte da plataforma';

	if (process.env.PROJECT_NAME === 'sebrae') {
		supportName = 'o Sebrae';
	} else if (process.env.PROJECT_NAME === 'essencia') {
		supportName = 'o suporte da Essência';
	}

	const session = await getServerSession(nextAuthOptions);

	if (!session) {
		return <></>;
	}

	const { id: classId } = params;

	const meetingType = await getMeetingTypeByClassId(
		session.user.token,
		classId,
	);

	const userAppointments = await getAppointmentByClassAndCpf(
		classId,
		session.user.cpf,
	);

	if (userAppointments && userAppointments.status === 200) {
		return (
			<>
				<section className='flex justify-center w-full py-[60px] px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] min-h-screen bg-gray-100'>
					<div className='max-w-[1640px] w-full'>
						<Suspense fallback={<Loader />}>
							{session && (
								<Consultorias
									userAppointmentsByClass={userAppointments.data}
									meetingType={meetingType.data}
								/>
							)}
						</Suspense>
					</div>
				</section>
			</>
		);
	}

	return (
		<section className='flex justify-center w-full py-[60px] px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] min-h-screen bg-gray-100'>
			<div className='max-w-[1640px] w-full'>
				<NotifyModal
					title={'Atenção'}
					message={
						'Não conseguimos buscar suas informações de agendamento. Por favor, tente novamente ou entre em contato com ' +
						supportName +
						'.'
					}
					logout={false}
					backOnClose={true}
				/>
			</div>
		</section>
	);
};

export default PageAgendar;
