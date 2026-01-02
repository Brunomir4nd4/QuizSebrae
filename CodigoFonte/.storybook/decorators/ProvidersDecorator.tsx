import React from 'react';
import { Provider } from '../../src/theme/Provider.component';
import NextAuthSessionProvider from '../../src/app/providers/SessionProvider';
import ScheduleProvider from '../../src/app/providers/ScheduleProvider';
import { UserContext } from '../../src/app/providers/UserProvider';
import { SubmissionsProvider } from '../../src/app/providers/SubmissionsProvider';
import { classDataWithProgressiveCertification } from '../mocks/classData';
import { mockSubmissionResponse } from '../mocks/submissionData';

const mockClassData = [
	classDataWithProgressiveCertification,
];


const mockUserContextValue = {
	classId: '1',
	error: null,
	classesData: {
		'1': mockClassData[0],
	},
	scheduleData: 0,
	themeSettings: null,
	userAppointments: null,
	coursesShowed: false,
	courseLoading: false,
	setClassId: () => {},
	setScheduleData: () => {},
	setError: () => {},
	setUserAppointments: () => {},
	setClassesData: () => {},
	setThemeSettings: () => {},
	setCoursesShowed: () => {},
	setCourseLoading: () => {},
};

	const mockSession = {
		user: {
			user_first_name: 'Mock',
			user_last_name: 'User',
			user_display_name: 'Mock User',
			user_email: 'mock@example.com',
			user_nicename: 'mockuser',
			role: ['facilitator'],
			token: 'mock-token',
			cpf: '000.000.000-00',
			id: 1,
		},
		expires: '9999-12-31T23:59:59.999Z',
	};

export const ProvidersDecorator = (Story: any, context: any) => {
	const initialSubmissions = context?.parameters?.initialSubmissions || [];
	const turmaData = context?.parameters?.turmaData;
	
	// Mock global do fetch para interceptar chamadas da API
	React.useLayoutEffect(() => {
		const originalFetch = global.fetch;
		
		global.fetch = async (url: RequestInfo | URL, init?: RequestInit) => {
			const urlString = url.toString();
			
			if (urlString.includes('/api/submissions/class/') || urlString.match(/\/submissions\/class\/\d+/)) {
				const participants = turmaData?.students || [];
				return Promise.resolve({
					ok: true,
					status: 200,
					json: async () => participants,
					text: async () => JSON.stringify(participants),
					blob: async () => new Blob(),
					arrayBuffer: async () => new ArrayBuffer(0),
					formData: async () => new FormData(),
					headers: new Headers(),
					redirected: false,
					statusText: 'OK',
					type: 'basic',
					url: urlString,
					clone: function() { return this; },
					body: null,
					bodyUsed: false,
				} as Response);
			}
			
			// Intercepta chamadas para submissions (getAllSubmissions)
			if (urlString.includes('/api/submissions') && !urlString.includes('/api/submissions/class/')) {
				// Se temos turmaData, gerar submissions a partir dele
				if (turmaData) {
					const submissions = turmaData.students.flatMap((student: any) =>
						student.activities.map((activity: any) => {
							// Mapear status para o formato da API
							let apiStatus: 'pending' | 'submitted' | 'evaluated' | 'submitted_external' = 'pending';
							if (activity.status === 'recebida') apiStatus = 'submitted';
							else if (activity.status === 'avaliada') apiStatus = 'evaluated';
							else if (activity.status === 'recebida em outro canal') apiStatus = 'submitted_external';
							
							return {
								id: Number(`${student.id}${activity.activity_id}`),
								participant_id: Number(student.id),
								activity_id: Number(activity.activity_id),
								title: `Atividade ${activity.activity_id}`,
								class_id: 1,
								course_id: 1,
								cycle_id: 1,
								facilitator_id: 1,
								score: activity.status === 'avaliada' ? 10 : null,
								facilitator_comment: activity.status === 'avaliada' ? 'Ótimo trabalho!' : null,
								evaluated_at: activity.status === 'avaliada' ? new Date().toISOString() : null,
								created_at: new Date().toISOString(),
								updated_at: new Date().toISOString(),
								status: apiStatus,
								files: [],
							};
						})
					);
					
					return Promise.resolve({
						ok: true,
						status: 200,
						json: async () => submissions,
						text: async () => JSON.stringify(submissions),
						blob: async () => new Blob(),
						arrayBuffer: async () => new ArrayBuffer(0),
						formData: async () => new FormData(),
						headers: new Headers(),
						redirected: false,
						statusText: 'OK',
						type: 'basic',
						url: urlString,
						clone: function() { return this; },
						body: null,
						bodyUsed: false,
					} as Response);
				}
				
				// Senão, usa o mock padrão
				return Promise.resolve({
					ok: true,
					status: 200,
					json: async () => mockSubmissionResponse,
					text: async () => JSON.stringify(mockSubmissionResponse),
					blob: async () => new Blob(),
					arrayBuffer: async () => new ArrayBuffer(0),
					formData: async () => new FormData(),
					headers: new Headers(),
					redirected: false,
					statusText: 'OK',
					type: 'basic',
					url: urlString,
					clone: function() { return this; },
					body: null,
					bodyUsed: false,
				} as Response);
			}

			// Intercepta chamada para obter tipo de reunião da turma (/api/courses/:id)
			if (urlString.includes('/api/courses/')) {
				const data = {
					data: {
						is_group_meetings_enabled: false,
						facilitator: {
							ID: mockClassData[0].facilitator || 1,
							user_firstname: mockClassData[0].facilitator_name || '',
							user_lastname: '',
							display_name: mockClassData[0].facilitator_name || 'Facilitador',
							user_email: mockClassData[0].facilitator_email || '',
							phone: '',
						},
					},
				};

				return Promise.resolve({
					ok: true,
					status: 200,
					json: async () => data,
					text: async () => JSON.stringify(data),
					blob: async () => new Blob(),
					arrayBuffer: async () => new ArrayBuffer(0),
					formData: async () => new FormData(),
					headers: new Headers(),
					redirected: false,
					statusText: 'OK',
					type: 'basic',
					url: urlString,
					clone: function() { return this; },
					body: null,
					bodyUsed: false,
				} as Response);
			}

		// Intercepta chamada para obter agendamentos do usuário (/api/schedule/appointment/class/:id)
		if (urlString.includes('/api/schedule/appointment/class/')) {
			const appointmentsData = { data: [] };
			return Promise.resolve({
				ok: true,
				status: 200,
				json: async () => appointmentsData,
				text: async () => JSON.stringify(appointmentsData),
				blob: async () => new Blob(),
				arrayBuffer: async () => new ArrayBuffer(0),
				formData: async () => new FormData(),
				headers: new Headers(),
				redirected: false,
				statusText: 'OK',
				type: 'basic',
				url: urlString,
				clone: function() { return this; },
				body: null,
				bodyUsed: false,
			} as Response);
		}

		// Intercepta chamadas para obter presença/alunos da turma (/api/presence/:id)
		if (urlString.match(/\/api\/presence\/\d+/)) {
			const participants = turmaData?.students || [];
			return Promise.resolve({
				ok: true,
				status: 200,
				json: async () => participants,
				text: async () => JSON.stringify(participants),
				blob: async () => new Blob(),
				arrayBuffer: async () => new ArrayBuffer(0),
				formData: async () => new FormData(),
				headers: new Headers(),
				redirected: false,
				statusText: 'OK',
				type: 'basic',
				url: urlString,
				clone: function() { return this; },
				body: null,
				bodyUsed: false,
			} as Response);
		}

		// Intercepta chamadas para obter slots disponíveis (/api/schedule/slot/:date/class/:id)
		if (urlString.match(/\/api\/schedule\/slot\/[^/]+\/class\/\d+/)) {
			const match = urlString.match(/\/api\/schedule\/slot\/([^/]+)\/class\/(\d+)/);
			const date = match ? match[1] : '';
			const slotsData = {
				// use full time format with seconds so it matches component expectations (HH:MM:SS)
				status: 200,
				message: 'OK',
				data: [
					{ id: '1', date, time: '09:00:00' },
					{ id: '2', date, time: '10:00:00' },
					{ id: '3', date, time: '11:00:00' },
					{ id: '4', date, time: '14:00:00' },
					{ id: '5', date, time: '15:00:00' },
					{ id: '6', date, time: '16:00:00' },
				],
			};
			return Promise.resolve({
				ok: true,
				status: 200,
				json: async () => slotsData,
				text: async () => JSON.stringify(slotsData),
				blob: async () => new Blob(),
				arrayBuffer: async () => new ArrayBuffer(0),
				formData: async () => new FormData(),
				headers: new Headers(),
				redirected: false,
				statusText: 'OK',
				type: 'basic',
				url: urlString,
				clone: function() { return this; },
				body: null,
				bodyUsed: false,
			} as Response);
		}

		// Intercepta chamadas para obter slots de reuniões em grupo (POST /api/schedule/slot)
		if (urlString.includes('/api/schedule/slot') && init?.method === 'POST') {
			const body = init?.body ? JSON.parse(init.body as string) : {};
			const date = body.date || '';
			const slotsData = {
				// group slots with seconds
				status: 200,
				message: 'OK',
				data: [
					{ id: '1', date, time: '09:00:00', appointment_count: 2, type: 'group' },
					{ id: '2', date, time: '10:00:00', appointment_count: 1, type: 'group' },
					{ id: '3', date, time: '11:00:00', appointment_count: 0, type: 'group' },
					{ id: '4', date, time: '14:00:00', appointment_count: 3, type: 'group' },
					{ id: '5', date, time: '15:00:00', appointment_count: 1, type: 'group' },
				],
			};
			return Promise.resolve({
				ok: true,
				status: 200,
				json: async () => slotsData,
				text: async () => JSON.stringify(slotsData),
				blob: async () => new Blob(),
				arrayBuffer: async () => new ArrayBuffer(0),
				formData: async () => new FormData(),
				headers: new Headers(),
				redirected: false,
				statusText: 'OK',
				type: 'basic',
				url: urlString,
				clone: function() { return this; },
				body: null,
				bodyUsed: false,
			} as Response);
		}			// Para outras chamadas, usa o fetch original
			return originalFetch(url, init);
		};
		
		return () => {
			global.fetch = originalFetch;
		};
	}, [turmaData]);
	
	return (
		<Provider fontFamily={["Ample Alt", "sans-serif"]}>
			<NextAuthSessionProvider session={mockSession}>
				<ScheduleProvider>
					<UserContext.Provider value={mockUserContextValue}>
						<SubmissionsProvider initialSubmissions={initialSubmissions}>
							<Story />
						</SubmissionsProvider>
					</UserContext.Provider>
				</ScheduleProvider>
			</NextAuthSessionProvider>
		</Provider>
	);
};