import { Quiz } from '@/components/Quiz';
import { nextAuthOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { FunctionComponent } from 'react';

const QuizPage: FunctionComponent = async () => {
	const session = await getServerSession(nextAuthOptions);
	if (!session) {
		redirect('/');
	}

	return (
		<section className='flex justify-center w-full min-h-screen bg-white px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] py-[50px]'>
			<div className='max-w-[1640px] w-full'>
				<Quiz totalQuestions={5} currentQuestion={1} encounterNumber={3} />
			</div>
		</section>
	);
};

export default QuizPage;

