import { getServerSession } from 'next-auth';
import { FunctionComponent } from 'react';
import { nextAuthOptions } from '@/utils/authOptions';
import { redirect } from 'next/navigation';
import {
	getClassesByUser,
	getThemeSettings,
} from '@/app/services/external/ClassService';
import { NotifyModal } from '@/components/NotifyModal';
import {
	createUser,
	getUserByCpf,
} from '@/app/services/external/ScheduleService';
import { userIsAdmin } from '@/utils/userIsAdmin';
import HomeFacilitador from '@/components/Home/HomeFacilitador.component';
import HomeAluno from '@/components/Home/HomeAluno.component';

const PageHome: FunctionComponent = async () => {
	const session = await getServerSession(nextAuthOptions);

	if (!session) {
		redirect('/');
	}

	const role = userIsAdmin(session?.user?.role);
	const settings = await getThemeSettings(session?.user?.token);

	if (settings?.maintenance_mode) {
		return (
			<NotifyModal
				title={'Atenção'}
				message={'Estamos em manutenção.'}
				logout={true}
			/>
		);
	}

	if (
		(role && settings?.facilitator?.enable_calendar) ||
		(!role && settings?.participant?.enable_calendar)
	) {
		const user = await getUserByCpf(
			role ? 'facilitator' : 'subscriber',
			session.user.cpf,
		);

		if (user?.status && user?.status !== 200) {
			const { user_first_name, user_last_name, cpf, user_email } = session.user;
			const create = await createUser(
				role ? 'facilitator' : 'subscriber',
				user_email,
				cpf,
				`${user_first_name} ${user_last_name}`,
			);
		}
	}

	return (
		<>
			{role ? (
				<HomeFacilitador settings={settings} />
			) : (
				<HomeAluno settings={settings} />
			)}
		</>
	);
};

export default PageHome;
