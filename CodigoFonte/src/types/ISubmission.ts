export interface SubmissionFile {
	id: number;
	deliverable_submission_id: number;
	file_path: string;
	original_name: string;
	file_type: string;
	created_at: string;
	updated_at: string;
}

export interface SubmissionResponse {
	id: number;
	participant_id: number;
	activity_id: number;
	title: string;
	class_id: number;
	course_id: number;
	cycle_id: number;
	facilitator_id: number;
	score: number | null;
	facilitator_comment: string | null;
	evaluated_at: string | null;
	created_at: string;
	updated_at: string;
	status: 'pending' | 'submitted' | 'evaluated' | 'submitted_external';
	files: SubmissionFile[];
}

export interface SubmissionRequest {
	participant_id: number;
	activity_id: number;
	title: string;
	class_id: number;
	course_id: number;
	cycle_id: number;
	facilitator_id: number;
	score?: number;
	facilitator_comment?: string;
	evaluated_at?: string;
	status: 'pending' | 'submitted' | 'evaluated' | 'submitted_external';
	files?: File[];
}

export interface SubmissionUpdateRequest {
	status: 'pending' | 'submitted' | 'evaluated' | 'submitted_external';
	score?: number;
	facilitator_comment?: string;
	participant_email?: string;
	participant_name?: string;
	course_name?: string;
}

export type SubmissionFilters = {
	status?: 'pending' | 'submitted' | 'evaluated' | 'submitted_external';
	facilitator_id?: number;
	participant_id?: number;
	class_id?: number;
	course_id?: number;
};

export type SubmissionItem = {
	id: string;
	name: string;
	type: string;
	url: string;
};

export type Feedback = {
	note: number;
	comment: string;
};

export type Submission = {
	sent: boolean;
	id: number;
	feedback?: Feedback;
	items?: SubmissionItem[];
};

export interface GetSubmissionNotificationsParams {
	facilitador_id: string | number;
	cycle_id?: string | number;
	class_id?: string | number;
}

export interface GetSubmissionFilesParams {
	participant_id?: string | number;
	activity_id?: string | number;
	submission_id?: string | number;
	class_id: string | number;
}

export interface ClassNotification {
	class_id: number;
	hasSubmittedActivities: boolean;
}

export interface CycleNotification {
	cycle_id: number;
	hasSubmittedActivities: boolean;
	classes: Record<string, ClassNotification>;
}

export interface SubmissionNotify {
	[cycleId: string]: CycleNotification;
}
