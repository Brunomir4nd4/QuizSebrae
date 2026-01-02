import { SubmissionResponse, Submission } from '../../src/types/ISubmission';

export const mockSubmissionResponse: SubmissionResponse[] = [
	{
		id: 1,
		participant_id: 1,
		activity_id: 1,
		title: 'Atividade Estratégica 1',
		class_id: 1,
		course_id: 1,
		cycle_id: 1,
		facilitator_id: 1,
		score: 8.5,
		facilitator_comment: 'Ótimo trabalho! Continue assim.',
		evaluated_at: '2024-11-10T10:00:00Z',
		created_at: '2024-11-01T10:00:00Z',
		updated_at: '2024-11-10T10:00:00Z',
		status: 'evaluated',
		files: [
			{
				id: 1,
				deliverable_submission_id: 1,
				file_path: '/uploads/documento1.pdf',
				original_name: 'documento1.pdf',
				file_type: 'application/pdf',
				created_at: '2024-11-01T10:00:00Z',
				updated_at: '2024-11-01T10:00:00Z',
			},
			{
				id: 2,
				deliverable_submission_id: 1,
				file_path: '/uploads/documento2.pdf',
				original_name: 'documento2.pdf',
				file_type: 'application/pdf',
				created_at: '2024-11-01T10:00:00Z',
				updated_at: '2024-11-01T10:00:00Z',
			},
		],
	},
	{
		id: 2,
		participant_id: 1,
		activity_id: 2,
		title: 'Atividade Estratégica 2',
		class_id: 1,
		course_id: 1,
		cycle_id: 1,
		facilitator_id: 1,
		score: null,
		facilitator_comment: null,
		evaluated_at: null,
		created_at: '2024-11-05T14:00:00Z',
		updated_at: '2024-11-05T14:00:00Z',
		status: 'submitted',
		files: [
			{
				id: 3,
				deliverable_submission_id: 2,
				file_path: '/uploads/apresentacao.pptx',
				original_name: 'apresentacao.pptx',
				file_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
				created_at: '2024-11-05T14:00:00Z',
				updated_at: '2024-11-05T14:00:00Z',
			},
		],
	},
];

export const mockSubmissions: Submission[] = [
	{
		sent: true,
		id: 1,
		feedback: {
			note: 8.5,
			comment: 'Ótimo trabalho! Continue assim.',
		},
		items: [
			{
				id: '1',
				name: 'documento1.pdf',
				type: 'application/pdf',
				url: '/uploads/documento1.pdf',
			},
			{
				id: '2',
				name: 'documento2.pdf',
				type: 'application/pdf',
				url: '/uploads/documento2.pdf',
			},
		],
	},
	{
		sent: true,
		id: 2,
		items: [
			{
				id: '3',
				name: 'apresentacao.pptx',
				type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
				url: '/uploads/apresentacao.pptx',
			},
		],
	},
	{
		sent: false,
		id: 3,
	},
	{
		sent: false,
		id: 4,
	},
];
