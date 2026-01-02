import { ActivityStatus } from '@/types/IParticipants';
import { SubmissionResponse } from '@/types/ISubmission';

interface UpdateActivityParams {
	classId: string;
	courseId: string;
	cycloId: string;
	facilitador_id: string;
	selectedActivityIndex: number;
	selectedStudentId: string | number;
	selectedStudentName: string;
	createSubmission: (submission: FormData) => Promise<SubmissionResponse>;
	updateStudentActivity: (
		studentId: number,
		activityId: string,
		newStatus: ActivityStatus,
	) => void;
	handleClose: () => void;
}

export const updateActivityToExternalUtil = async ({
	courseId,
	cycloId,
	classId,
	facilitador_id,
	selectedActivityIndex,
	selectedStudentId,
	selectedStudentName,
	createSubmission,
	updateStudentActivity,
	handleClose,
}: UpdateActivityParams) => {
	const submissionData = new FormData();
	submissionData.append('class_id', classId);
	submissionData.append('participant_id', String(selectedStudentId));
	submissionData.append('activity_id', String(selectedActivityIndex + 1));
	submissionData.append('participant_name', selectedStudentName);
	submissionData.append(
		'title',
		`ATIVIDADE ESTRATEGICA ${selectedActivityIndex + 1} - ${selectedStudentName}`,
	);
	submissionData.append('course_id', courseId);
	submissionData.append('cycle_id', cycloId);
	submissionData.append('facilitator_id', facilitador_id);
	submissionData.append('status', 'submitted_external');

	try {
		await createSubmission(submissionData);
		updateStudentActivity(
			Number(selectedStudentId),
			`${selectedActivityIndex + 1}`,
			'recebida em outro canal',
		);
		handleClose();
	} catch (e) {
		console.error(e);
		handleClose();
	}
};
