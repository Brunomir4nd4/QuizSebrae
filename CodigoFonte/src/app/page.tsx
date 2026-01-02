import { Login } from '@/components/Login';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/utils/authOptions';
import { redirect } from 'next/navigation';
import { Loader } from '@/components/Loader';

export default async function Home() {
	const session = await getServerSession(nextAuthOptions);

	// Note: localStorage operations moved to client component
	// This is handled in the ClientLayout component
	if (session) {
		redirect('/home');
	}

	return (
		<Suspense fallback={<Loader />}>
			<Login
				pageData={{
					banner: null,
					logo: null,
					course_id: null,
				}}
			/>
		</Suspense>
	);
}
