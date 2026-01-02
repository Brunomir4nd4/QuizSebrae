import type { NextPage } from 'next';
import { Maintenance } from '@/components/Maintenance';
import { getThemeSettings } from './services/external/ClassService';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/utils/authOptions';

interface MaintenancePageProps {
	title?: string;
	message?: string;
	description?: string;
	banner?: string;
}

const MaintenancePage: NextPage<MaintenancePageProps> = async ({
	title = 'Modo de Manutenção',
	message = 'Estamos em manutenção',
	description = 'Perdão pela inconveniência, mas estamos passando por manutenção agendada',
	banner = '/bg-login2.jpg',
}) => {
	const session = await getServerSession(nextAuthOptions);

	let pageTitle = title;
	let pageMessage = message;
	let pageDescription = description;
	let pageBanner = banner;

	if (session) {
		const settings = await getThemeSettings(session?.user?.token);

		const isMaintenanceActive = settings?.maintenance_mode_general_hub_active;

		pageTitle = isMaintenanceActive
			? settings?.maintenance_mode_general_hub_title
			: title;
		pageMessage = isMaintenanceActive
			? settings?.maintenance_mode_general_hub_message
			: message;
		pageDescription = isMaintenanceActive
			? settings?.maintenance_mode_general_hub_description
			: description;
		pageBanner = banner;
	}

	return (
		<Maintenance
			title={pageTitle}
			message={pageMessage}
			description={pageDescription}
			banner={pageBanner}
		/>
	);
};

export default MaintenancePage;
