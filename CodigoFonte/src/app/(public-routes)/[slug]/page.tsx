import { Login } from '@/components/Login';
import { getHomeData } from '@/app/services/external/ClassService';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import MaintenancePage from '@/app/maintenance';

const DynamicLoginPage = async ({ params }: { params: { slug: string } }) => {
	const headersList = headers();
	const host = headersList.get('host');

	const getUserType = (host: string | null) => {
		if (!host) return null;

		if (host.includes('hub')) {
			return 'participante';
		}

		if (host.includes('supervisor')) {
			return 'supervisor';
		}

		if (host.includes('facilitador')) {
			return 'facilitador';
		}

		if (host.includes('dhedalos')) {
			return 'facilitador';
		}

		return null;
	};

	const pageData = await getHomeData(params.slug);

	if (pageData) {
		if (pageData?.maintenance_mode_course_hub_active) {
			return (
				<MaintenancePage
					title={pageData?.maintenance_mode_course_hub_title}
					message={pageData?.maintenance_mode_course_hub_message}
					description={pageData?.maintenance_mode_course_hub_description}
					banner={pageData?.banner.url}
				/>
			);
		}
		return (
			<Login pageData={pageData} userType={getUserType(host)} host={host} />
		);
	}

	return redirect('/');
};

export default DynamicLoginPage;
