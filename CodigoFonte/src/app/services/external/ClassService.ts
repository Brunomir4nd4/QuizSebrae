'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Course } from '@/types/ITurma';
import { wpRequest } from '../api';
import { ClassResponse } from '@/types/IClass';
import { WPImage } from '@/types/IWordpress';
import { baseUrl } from '@/utils/consts';
import { Student } from '@/types/IStudent';
import { Sidebar } from '@/types/ISidebar';
import { ClassByClycleResponse, Cycle } from '@/types/ICycles';
import { ThemeSettings } from '@/types/IThemeSettings';
import { UserLogin } from '@/types/IUser';
import { GroupTypeResponse } from '@/types/ICourses';

/**
 * Obtém uma lista de todas as turmas.
 * @param token - O token de autenticação necessário para acessar os dados.
 * @returns Uma Promise que resolve em um array de objetos ClassResponse, representando as turmas.
 */
export const getClasses = (
	token: string,
	userType: string,
): Promise<ClassResponse> => {
	return wpRequest(`/dhedalos/v1/classes?role=${userType}`, token);
};

/**
 * Obtém os dados de uma turma específica pelo ID.
 * @param id - O ID da turma a ser recuperada.
 * @param token - O token de autenticação necessário para acessar os dados.
 * @returns Uma Promise que resolve nos dados da turma.
 */
export const getClassDataById = (
	id: string | number,
	token: string,
	userType: string,
): Promise<Course> => {
	return wpRequest(`/dhedalos/v1/class/${id}?role=${userType}`, token);
};

/**
 * Define a participação de um aluno em uma atividade específica.
 * @param class_id - O ID da turma.
 * @param student_id - O ID do aluno.
 * @param activity_id - O ID da atividade.
 * @param token - O token de autenticação necessário para acessar os dados.
 */
export const setParticipacaoById = (
	class_id: string,
	student_id: string,
	activity_id: string,
	token: string,
) => {
	return wpRequest(
		`/dhedalos/v1/class/${class_id}/student/${student_id}/activity/${activity_id}`,
		token,
		'POST',
	);
};

/**
 * Define a participação automatica de um aluno em uma atividade específica.
 * @param class_id - O ID da turma.
 * @param student_id - O ID do aluno.
 */
export const setAutoPresenceByClassId = (class_id: string, token: string) => {
	return wpRequest(
		`/dhedalos/v1/class/${class_id}/auto-presence`,
		token,
		'POST',
	);
};

/**
 * Obtém uma sala de atendimento individual (one-on-one).
 * @param class_id - O ID da turma.
 * @param client_id - O ID do cliente.
 * @param token - O token de autenticação necessário para acessar os dados.
 * @returns Uma Promise que resolve em um objeto contendo o token e o nome da sala.
 */
export const getOneOnOneRoom = (
	class_id: string | number,
	client_id: string | number,
	token: string,
	userType: string,
): Promise<{ 
	token: string; 
	room_name: string; 
	room_title: string;
	jitsi_server_url?: string;
	jitsiServerUrl?: string;
	jitsi_url?: string;
}> => {
	const queryParams = new URLSearchParams({
		participant_id: client_id.toString(),
		class: class_id.toString(),
		role: userType,
	});
	return wpRequest(`/dhedalos/v1/class_room/one_on_one/?${queryParams}`, token);
};

/**
 * Obtém uma sala de atendimento individual (one-on-one).
 * @param class_id - O ID da turma.
 * @param client_id - O ID do cliente.
 * @param token - O token de autenticação necessário para acessar os dados.
 * @returns Uma Promise que resolve em um objeto contendo o token e o nome da sala.
 */
export const getGroupRoom = (
	class_id: string | number,
	client_id: string | number,
	room_id: string,
	token: string,
): Promise<{
	room_title: string | undefined;
	token: string;
	room_name: string;
	jitsi_server_url?: string;
	jitsiServerUrl?: string;
	jitsi_url?: string;
}> => {
	const queryParams = new URLSearchParams({
		participant_id: client_id.toString(),
		class: class_id.toString(),
		room_id: room_id,
	});
	return wpRequest(`/dhedalos/v1/class_room/group/?${queryParams}`, token);
};

/**
 * Obtém uma sala pelo ID da turma.
 * @param class_id - O ID da turma.
 * @param token - O token de autenticação necessário para acessar os dados.
 * @returns Uma Promise que resolve em um objeto contendo o token e o nome da sala.
 */
export const getRoomByClassId = (
	class_id: string | number,
	token: string,
	userType: string,
): Promise<{
	room_title: string | undefined;
	token: string;
	room_name: string;
	jitsi_server_url?: string;
	jitsiServerUrl?: string;
	jitsi_url?: string;
}> => {
	const queryParams = new URLSearchParams({
		class: class_id.toString(),
		role: userType,
	});
	return wpRequest(`/dhedalos/v1/class_room/?${queryParams}`, token);
};

/**
 * Obtém o cpf de um aluno pelo ID.
 * @param student_id - O ID do aluno.
 * @param token - O token de autenticação necesario para acessar os dados.
 * @returns Uma Promise que resolve em uma string contendo o CPF do aluno.
 */
export const getStudentCpf = (student_id: string | number, token: string) => {
	return wpRequest(`/dhedalos/v1/classes/subscriber/${student_id}/cpf`, token);
};

/**
 * Obtém os dados da página inicial para um curso específico.
 * @param slug O slug do curso para o qual os dados da página inicial serão obtidos.
 * @returns Uma Promise que resolve em um objeto contendo os dados do banner, logo e o ID do curso, ou null se houver um erro.
 */
export const getHomeData = async (
	slug: string,
): Promise<{
	banner: WPImage;
	logo: WPImage;
	course_id: string | number;
	title: string;
	excerpt: string;
	slug: string;
	maintenance_mode_course_hub_title: string;
	maintenance_mode_course_hub_message: string;
	maintenance_mode_course_hub_description: string;
	maintenance_mode_course_hub_active: boolean;
} | null> => {
	const options = {
		method: 'GET',
	};
	try {
		const response = await fetch(
			`${baseUrl}/api/dhedalos/v1/course/${slug}`,
			options,
		);
		if (!response.ok) {
			console.error(`Erro ao buscar dados ${slug} :`, response.status);
		}
		return await response.json();
	} catch (error: any) {
		console.error('Erro ao buscar dados:', error);
		return null;
	}
};

export const getPresenceByClassId = (
	class_id: string | number,
	token: string,
	nextOptions: any,
): Promise<Student[]> => {
	return wpRequest(
		`/dhedalos/v1/class/${class_id}/presence`,
		token,
		'GET',
		nextOptions,
	);
};

export const getParticipantsByClassId = (
	class_id: string | number,
	token: string,
	nextOptions: any,
): Promise<Student[]> => {
	return wpRequest(
		`/dhedalos/v1/class/${class_id}/participants`,
		token,
		'GET',
		nextOptions,
	);
};

export const getSidebarData = (token: string): Promise<Sidebar[]> => {
	return wpRequest(`/dhedalos/v1/courses/sidebar`, token, 'GET');
};

export const getClassesByCycleId = (
	cycle_id: string | number,
	token: string,
): Promise<ClassByClycleResponse[]> => {
	return wpRequest(`/dhedalos/v1/cycles/${cycle_id}/classes`, token, 'GET');
};

export const getCycles = (token: string): Promise<Cycle[]> => {
	return wpRequest(`/dhedalos/v1/cycles`, token, 'GET');
};

export const getCyclesByYear = (
	token: string,
	year: string | number,
): Promise<Cycle[]> => {
	return wpRequest(`/dhedalos/v1/cycles/${year}`, token, 'GET');
};

export const getFacilitatorByClass = (
	class_id: string,
	token: string,
): Promise<{ id: string; cpf: string; name: string }> => {
	return wpRequest(`/dhedalos/v1/class/${class_id}/facilitator`, token, 'GET');
};

export const getThemeSettings = (token: string): Promise<ThemeSettings> => {
	return wpRequest(`/dhedalos/v1/theme_settings`, token, 'GET');
};

export const getUserByEmail = (
	email: string,
	token: string,
): Promise<UserLogin> => {
	return wpRequest(
		`/dhedalos/v1/login_by_cpf?user_email=${email}`,
		token,
		'GET',
	);
};

export const getUserByCPFOnly = (
	cpf: string,
	token: string,
): Promise<UserLogin> => {
	return wpRequest(`/dhedalos/v1/user_by_cpf?cpf=${cpf}`, token, 'GET');
};

/**
 * Recupera todos os dados de turma que o usuário está cadastrado.
 * @param role - A função do usuário.
 * @param token - O token de autenticação necessário para acessar os dados.
 * @returns Uma Promise que resolve em um objeto contendo os dados da classe.
 */
export const getClassesByUser = (
	role: string,
	token: string,
): Promise<ClassResponse> => {
	return wpRequest(`/dhedalos/v1/classes/${role}`, token, 'GET');
};

/**
 *
 */
export const getMeetingTypeByClassId = (
	token: string,
	class_id: string | number,
): Promise<GroupTypeResponse> => {
	return wpRequest(
		`/dhedalos/v1/courses/${class_id}/meeting-type`,
		token,
		'GET',
	);
};
