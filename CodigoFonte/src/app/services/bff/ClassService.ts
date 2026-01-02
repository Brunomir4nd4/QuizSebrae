/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Student } from '@/types/IStudent';
import { proxyRequest } from '../api';
import { ClassByClycleResponse } from '@/types/ICycles';
import { Course } from '@/types/ITurma';
import { UserLogin } from '@/types/IUser';
import { GroupTypeResponse } from '@/types/ICourses';

/**
 * Recupera todos os dados da classe.
 * @param endpoint - O endpoint para recuperar os dados da classe.
 * @returns Uma Promise que resolve em um objeto contendo os dados da classe.
 */
export const fetchAllClassData = (endpoint: string): Promise<any> => {
	return proxyRequest(endpoint, 'GET');
};

/**
 * Recupera dados de uma turma por id.
 * @param endpoint - O endpoint para recuperar os dados da turma.
 * @returns Uma Promise que resolve em um objeto contendo os dados da turma.
 */
export const getClassById = (id: string | number): Promise<Course> => {
	return proxyRequest(`/class/${id}`, 'GET');
};

/**
 * Recupera dados de uma turma por id.
 * @param endpoint - O endpoint para recuperar os dados da turma.
 * @returns Uma Promise que resolve em um objeto contendo os dados da turma.
 */
export const getRoomByClassId = (
	id: string | number,
): Promise<{
	status: number;
	data: {
		token: string;
		room_name: string;
		room_title: string;
	};
	message: string;
}> => {
	return proxyRequest(`/room/${id}`, 'GET');
};

export const getPresence = (
	class_id: string | number,
	token: string,
): Promise<Student[]> => {
	return proxyRequest(`/presence/${class_id}`, 'GET');
};

export const getClassesByCycle = (
	cycle_id: string | number,
	token: string,
): Promise<ClassByClycleResponse[]> => {
	return proxyRequest(`/cycles/${cycle_id}`, 'GET');
};

export const setParticipacaoByIdBff = (
	class_id: string | number,
	student_id: string | number,
	activity_id: string,
) => {
	return proxyRequest(`/presence`, 'POST', {
		class_id,
		student_id,
		activity_id,
	});
};

export const setAutoPresenceByClassId = (
	class_id: string,
): Promise<{
	status: number;
	message: string;
	data: number;
}> => {
	return proxyRequest(`/presence/auto`, 'POST', {
		class_id,
	});
};

export const getUserByEmail = (email: string): Promise<UserLogin> => {
	return proxyRequest(`/user/${email}`, 'GET');
};

/**
 * Recupera todos os dados de turma que o usuário está cadastrado.
 * @param endpoint - O endpoint para recuperar os dados da classe.
 * @returns Uma Promise que resolve em um objeto contendo os dados da classe.
 */
export const getClassesByUser = (): Promise<any> => {
	return proxyRequest(`/class`, 'GET');
};

/**
 *
 */
export const getMeetingTypeByClassId = (
	class_id: string | number,
): Promise<GroupTypeResponse> => {
	return proxyRequest(`/courses/${class_id}`, 'GET');
};

export const requestEnrollmentCancellation = (
	enrollment_id: number | undefined,
): Promise<{ status: number; message: string; data?: any }> => {
	return proxyRequest(
		`/enrollment/${enrollment_id}/request-cancellation`,
		'POST',
	);
};
