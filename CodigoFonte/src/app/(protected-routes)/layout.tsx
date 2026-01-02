import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/utils/authOptions';
import { redirect } from 'next/navigation';
import { userIsAdmin } from '@/utils/userIsAdmin';
import {
	getClassesByUser,
	getThemeSettings,
} from '../services/external/ClassService';
import { NotifyModal } from '@/components/NotifyModal';
import { ClientLayout } from '@/components/ClientLayout';
import MaintenancePage from '../maintenance';
import { getNotifyErrorModal } from '@/utils/getNotifyErrorModal';
import { QuizLayoutWrapper } from './QuizLayoutWrapper';

export const revalidate = 15;

interface PrivateLayoutProps {
	children: ReactNode;
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
	const session = await getServerSession(nextAuthOptions);
	if (!session) {
		redirect('/');
	}

	const role = userIsAdmin(session.user.role);

	const settings = await getThemeSettings(session?.user?.token);

	const classData = await getClassesByUser(
		session?.user?.role[0],
		session?.user?.token,
	);
	const notifyError = getNotifyErrorModal(
		classData,
		role,
		settings.whatsapp_support_link,
		session.user.user_display_name,
	);

	if (settings?.maintenance_mode_general_hub_active) {
		return (
			<MaintenancePage
				title={settings?.maintenance_mode_general_hub_title}
				message={settings?.maintenance_mode_general_hub_message}
				description={settings?.maintenance_mode_general_hub_description}
			/>
		);
	}

	// Usa wrapper para verificar se é rota de quiz
	return (
		<QuizLayoutWrapper
			session={session}
			role={role}
			classData={classData}
			notifyError={notifyError}>
			{children}
		</QuizLayoutWrapper>
	);
}
