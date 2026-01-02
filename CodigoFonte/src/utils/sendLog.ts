import { sendLogBff } from '@/app/services/bff/LogsService';

export async function sendLog(enrollId: string, action: string, title: string) {
	if (enrollId) {
		try {
			const res = await sendLogBff(enrollId, `${action}: ${title}`);
			if (res.status !== 200) {
				console.error('Erro ao enviar log:', res.error || 'Erro desconhecido');
			}
		} catch (error) {
			console.error('Erro ao enviar log:', error);
		}
	}
}
