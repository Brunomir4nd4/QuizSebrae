export const dynamic = 'force-dynamic';

import { Class } from '@/components/Class';
import { ActivityManagement } from '@/components/ActivityManagement';
import { nextAuthOptions } from '@/utils/authOptions';
import { Divider } from '@mui/material';
import { getServerSession } from 'next-auth';
import { FunctionComponent } from 'react';
import { redirect } from 'next/navigation';

const PageGestaoDeAtividades: FunctionComponent = async () => {
	const session = await getServerSession(nextAuthOptions);
	if (!session) {
		redirect('/');
	}

	return (
		<>
			<section className='flex justify-center w-full py-[40px] px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] min-h-screen bg-gray-100'>
				<div className='max-w-[1640px] w-full block'>
					<div className='hidden md:flex items-center justify-end mb-[60px]'>
						<div className='min-w-[465px]'>
							<Class
								query='participacao'
								small
								href='/trocar-turma'
								buttonText='Trocar'
							/>
						</div>
					</div>
					<div className='block md:hidden'>
						<Class
							query='participacao'
							small
							href='/trocar-turma'
							buttonText='Trocar'
						/>
						<Divider sx={{ margin: '30px 0' }} />
					</div>
					<ActivityManagement />
				</div>
			</section>
		</>
	);
};

export default PageGestaoDeAtividades;
