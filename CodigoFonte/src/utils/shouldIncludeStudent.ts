import { Participant } from '@/types/IParticipants';

export type FilterType = 'todas' | 'pendente' | 'recebida' | 'avaliada';

export const shouldIncludeStudent = (
	student: Participant,
	filter: FilterType,
): boolean => {
	if (filter === 'todas') return true;

	return student.activities.some((activity) => {
		if (filter === 'recebida') {
			return ['recebida', 'recebida em outro canal'].includes(
				activity.status as string,
			);
		}
		return activity.status === filter;
	});
};
