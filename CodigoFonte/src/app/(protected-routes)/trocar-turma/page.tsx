import { getCycles } from '@/app/services/external/ClassService';
import { ChangeCycle } from '@/components/ChangeCycle';
import { NotifyModal } from '@/components/NotifyModal';
import { nextAuthOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import { FunctionComponent } from 'react';
import React from 'react';

const PageTrocarTurma: FunctionComponent = async () => {
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

	const cycles = await getCycles(session.user.token);

	if (cycles) {
		return (
			<>
				<section className='flex justify-center w-full py-[40px] px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] min-h-screen bg-gray-100'>
					<div className='max-w-[1640px] w-full'>
						<ChangeCycle
							cycles={cycles}
							token={session.user.token}
							redirect='/home'
							role={session.user.role[0]}
						/>
					</div>
				</section>
			</>
		);
	}

	return (
		<section className='flex justify-center w-full py-[40px] px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] min-h-screen bg-gray-100'>
			<div className='max-w-[1640px] w-full'>
				<NotifyModal
					title={'Atenção'}
					message={`Não conseguimos buscar suas informações de turmas. Por favor, tente novamente ou entre em contato com ${supportName}.`}
					logout={false}
					backOnClose={true}
				/>
			</div>
		</section>
	);
};

export default PageTrocarTurma;
