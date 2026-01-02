import {
	GetSubmissionFilesParams,
	GetSubmissionNotificationsParams,
	SubmissionFilters,
	SubmissionNotify,
	SubmissionResponse,
	SubmissionUpdateRequest,
} from '@/types/ISubmission';
import { proxyRequest } from '../api';
import { Participant } from '@/types/IParticipants';
/**
 * Lista todas as submissões com filtros opcionais.
 * @param filters Filtros opcionais para refinar a busca de submissões.
 * @returns Uma Promise com todas as submissões disponíveis.
 */
export const getAllSubmissions = (
	filters: SubmissionFilters = {},
): Promise<SubmissionResponse[]> => {
	const queryParams = new URLSearchParams();

	if (filters.status) queryParams.append('status', filters.status);
	if (filters.facilitator_id)
		queryParams.append('facilitator_id', filters.facilitator_id.toString());
	if (filters.participant_id)
		queryParams.append('participant_id', filters.participant_id.toString());
	if (filters.class_id)
		queryParams.append('class_id', filters.class_id.toString());
	if (filters.course_id)
		queryParams.append('course_id', filters.course_id.toString());

	const queryString = queryParams.toString();
	const url = `/submissions${queryString ? `?${queryString}` : ''}`;

	return proxyRequest(url, 'GET');
};

/**
 * Busca uma submissão específica por ID.
 * @param id - O ID da submissão a ser buscada.
 * @returns Uma Promise com a submissão correspondente.
 */
export const getSubmissionById = (
	id: string | number,
): Promise<SubmissionResponse> => {
	return proxyRequest(`submissions/${id}`, 'GET');
};

/**
 * Cria uma nova submissão.
 * @param submission - Os dados da nova submissão.
 * @returns Uma Promise com a submissão criada.
 */
export const createSubmission = async (
	submission: FormData,
): Promise<SubmissionResponse> => {
	const tokenData = await proxyRequest('/submissions/api-token', 'GET');
	if (!tokenData.token) throw new Error(`Erro na submissão: Token inválido`);

	const res = await fetch('/api/submissions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${tokenData.token}`,
		},
		body: submission,
	});

	/* const res = await fetch(
		`${process.env.SUBMISSIONS_URL}/submissions`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${tokenData.token}`,
			},
			body: submission,
		},
	); */

	if (!res.ok) {
		throw new Error(`Erro na submissão: ${res.status}`);
	}

	const data: SubmissionResponse = await res.json();
	return data;
};

/**
 * Atualiza uma submissão existente.
 * @param id - O ID da submissão a ser atualizada.
 * @param submission - Os novos dados da submissão.
 * @returns Uma Promise com a submissão atualizada.
 */
export async function updateSubmission(
	id: string | number,
	payload: SubmissionUpdateRequest,
): Promise<SubmissionResponse> {
	const formData = new FormData();
	formData.append('id', id.toString());
	formData.append('status', payload.status);
	formData.append('score', String(payload.score));
	if (payload.facilitator_comment !== undefined) {
		formData.append('facilitator_comment', payload.facilitator_comment);
	}
	if (payload.participant_email !== undefined) {
		formData.append('participant_email', payload.participant_email);
	}
	if (payload.participant_name !== undefined) {
		formData.append('participant_name', payload.participant_name);
	}
	if (payload.course_name !== undefined) {
		formData.append('course_name', payload.course_name);
	}

	const res = await proxyRequest(`/submissions/${id}`, 'PUT', formData);

	if (!res.activity_id) throw new Error('Falha ao atualizar submissão');
	return res;
}

/**
 * Deleta uma submissão específica por ID.
 * @param id - O ID da submissão a ser deletada.
 * @returns Uma Promise que resolve quando a submissão for deletada.
 */
export const deleteSubmission = (
	id: number,
	data?: {
		participant_name: string;
		participant_email: string;
		action: string;
		course_name: string;
	},
): Promise<void> => {
	return proxyRequest(`/submissions/${id}`, 'DELETE', data ? data : null);
};

export const getParticipants = (
	class_id: string | number,
): Promise<Participant[]> => {
	return proxyRequest(`/submissions/class/${class_id}`, 'GET');
};

export const getSubmissionNotifications = async (
	params: GetSubmissionNotificationsParams,
): Promise<SubmissionNotify> => {
	const { facilitador_id, cycle_id, class_id } = params;

	if (!facilitador_id) {
		throw new Error('facilitator_id é obrigatório');
	}

	const query = new URLSearchParams({
		facilitator_id: String(facilitador_id),
		...(cycle_id && { cycle_id: String(cycle_id) }),
		...(class_id && { class_id: String(class_id) }),
	});

	return proxyRequest(`/submissions/status-sumary?${query.toString()}`, 'GET');
};

export const getSubmissionFiles = async (
	params: GetSubmissionFilesParams,
): Promise<Blob> => {
	const { participant_id, activity_id, submission_id, class_id } = params;

	if (!class_id) {
		throw new Error('class_id é obrigatório');
	}

	const query = new URLSearchParams({
		...(participant_id && { participant_id: String(participant_id) }),
		...(activity_id && { activity_id: String(activity_id) }),
		...(class_id && { class_id: String(class_id) }),
		...(submission_id && { submission_id: String(submission_id) }),
	});

	return proxyRequest(
		`/submissions/download?${query.toString()}`,
		'GET',
		undefined,
		'blob',
	);
};
