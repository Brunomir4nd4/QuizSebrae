import { ActivityEvaluationProps } from '@/components/ActivityEvaluation/ ActivityEvaluation.component';
import { SubmissionResponse } from '@/types/ISubmission';
import { mapStatus } from '@/utils/mapSubmissionStatus';

export function submissionsToSliderItems(
	submissions: SubmissionResponse[],
	totalActivities: number,
): ActivityEvaluationProps[] {
	const base: ActivityEvaluationProps[] = Array.from({
		length: totalActivities,
	}).map((_, idx) => ({
		id: idx + 1,
		status: 'não recebida',
	}));

	submissions.forEach((sub) => {
		const idx = Number(sub.activity_id) - 1;
		base[idx] = {
			id: sub.id,
			status: mapStatus(sub.status),
			feedback:
				sub.score && sub.facilitator_comment
					? { note: sub.score, comment: sub.facilitator_comment }
					: undefined,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			items: sub.files?.map((f: any) => ({
				id: String(f.id),
				name: f.original_name,
				type: f.file_type,
				url: f.file_path,
			})),
		};
	});

	return base;
}
