import { getSubmissionNotifications } from '@/app/services/bff/SubmissionService';
import { SubmissionNotify } from '@/types/ISubmission';
import { useEffect, useState } from 'react';

interface useSubmissionNotificationsProps {
	facilitador_id?: number;
	cycle_id?: number;
	class_id?: number;
}

export const useSubmissionNotifications = ({
	facilitador_id,
	cycle_id,
	class_id,
}: useSubmissionNotificationsProps) => {
	const [submissionNotifications, setSubmissionNotifications] =
		useState<SubmissionNotify | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const hasAllParams = typeof facilitador_id === 'number';

		if (!hasAllParams) return;

		const fetchPendingCount = async () => {
			setLoading(true);
			try {
				const data = await getSubmissionNotifications({
					facilitador_id,
					cycle_id,
					class_id,
				});
				setSubmissionNotifications(data);
				setError(null);
			} catch (err) {
				console.error(err);
				setError('Erro ao buscar notificações de submissões.');
				setSubmissionNotifications(null);
			} finally {
				setLoading(false);
			}
		};

		fetchPendingCount();
	}, [facilitador_id, cycle_id, class_id]);

	return { submissionNotifications, loading, error };
};
