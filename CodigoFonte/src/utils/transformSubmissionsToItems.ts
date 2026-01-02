import { FileItem } from '@/components/EnvioDeAtividades/EnvioDeAtividades.component';
import {
	Submission,
	SubmissionFile,
	SubmissionResponse,
} from '@/types/ISubmission';

export function transformSubmissionsToItems(
	submissions: SubmissionResponse[],
): Submission[] {
	return submissions.map((submission) => {
		const items: FileItem[] | undefined = submission.files?.map(
			(file: SubmissionFile) => ({
				id: String(file.id),
				name: file.original_name,
				type: file.file_type,
				url: file.file_path,
			}),
		);

		const item: Submission = {
			id: submission.activity_id,
			sent:
				submission.status === 'submitted' || submission.status === 'evaluated',
			feedback:
				submission.status === 'evaluated' &&
				submission.score !== null &&
				submission.facilitator_comment
					? {
							note: submission.score,
							comment: submission.facilitator_comment,
						}
					: undefined,
			items: items?.length ? items : undefined,
		};

		return item;
	});
}
