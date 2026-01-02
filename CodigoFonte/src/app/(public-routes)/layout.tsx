import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/utils/authOptions';
import { getThemeSettings } from '../services/external/ClassService';
import MaintenancePage from '../maintenance';
import { redirect } from 'next/navigation';

interface PrivateLayoutProps {
	children: ReactNode;
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
	const session = await getServerSession(nextAuthOptions);

	if (!session) {
		redirect('/');
	}

	const settings = await getThemeSettings(session?.user?.token);

	if (settings?.maintenance_mode_general_hub_active) {
		return (
			<MaintenancePage
				title={settings?.maintenance_mode_general_hub_title}
				message={settings?.maintenance_mode_general_hub_message}
				description={settings?.maintenance_mode_general_hub_description}
			/>
		);
	}

	if (session) {
		// redirect('/home')
	}

	return <>{children}</>;
}
