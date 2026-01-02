import { ActivityStatus } from '@/types/IParticipants';

export const mapStatus = (status: string): ActivityStatus => {
	switch (status) {
		case 'evaluated':
			return 'avaliada';
		case 'submitted':
			return 'recebida';
		case 'pending':
			return 'não recebida';
		case 'submitted_external':
			return 'recebida em outro canal';
		default:
			return 'não recebida';
	}
};
