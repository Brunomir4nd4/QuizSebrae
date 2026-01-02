import { getServerSession } from 'next-auth';
import { FunctionComponent } from 'react';
import { nextAuthOptions } from '@/utils/authOptions';
import { redirect } from 'next/navigation';
import { StrategicActivitiesSlider } from '@/components/StrategicActivitiesSlider';

const PageAtividadesEstrategicas: FunctionComponent = async () => {
	const session = await getServerSession(nextAuthOptions);

	if (!session) {
		redirect('/');
	}

	return <StrategicActivitiesSlider userId={session.user.id} />;
};

export default PageAtividadesEstrategicas;
