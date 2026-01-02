import { useCallback, useEffect, useState } from 'react';

type ActivityTemplate = {
	id: number;
	activity_id: number;
	course_id: number;
	cycle_id: number;
	class_id: number;
	original_name: string;
	file_path: string;
	file_type: string;
	description?: string;
	created_at: string;
	updated_at: string;
};

type TemplatesByActivity = Record<number, ActivityTemplate>;

type UseActivityTemplatesParams = {
	classId: number | null;
	courseId: number | null;
	cycleId: number | null;
};

export function useActivityTemplates({
	classId,
	courseId,
	cycleId,
}: UseActivityTemplatesParams) {
	const [templates, setTemplates] = useState<TemplatesByActivity>({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchTemplates = useCallback(async () => {
		if (!classId || !courseId || !cycleId) {
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const res = await fetch(
				`/api/activity-template?class_id=${classId}&course_id=${courseId}&cycle_id=${cycleId}`,
			);

			if (!res.ok) {
				throw new Error('Erro ao buscar templates');
			}

			const json = await res.json();
			setTemplates(json.data ?? {});
		} catch (err) {
			setError('Erro ao carregar templates');
		} finally {
			setLoading(false);
		}
	}, [classId, courseId, cycleId]);

	const uploadTemplate = useCallback(async (formData: FormData) => {
		if (!classId || !courseId || !cycleId) {
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const res = await fetch('/api/activity-template', {
				method: 'POST',
				body: formData,
			});

			if (!res.ok) {
				throw new Error('Erro ao salvar template');
			}

			const json = await res.json();

			setTemplates(json.data ?? {});
		} catch (err) {
			setError('Erro ao salvar template');
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const deleteTemplate = useCallback(async (activity_id: number) => {
		if (!classId || !courseId || !cycleId) {
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const res = await fetch(
				`/api/activity-template?class_id=${classId}&course_id=${courseId}&cycle_id=${cycleId}&activity_id=${activity_id}`,
				{
					method: 'DELETE',
				},
			);

			if (!res.ok) {
				throw new Error('Erro ao deletar template');
			}

			const json = await res.json();

			setTemplates(json.data ?? {});
		} catch (err) {
			setError('Erro ao remover template');
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!classId || !courseId || !cycleId) return;

		fetchTemplates();
	}, [fetchTemplates]);

	return {
		templates,
		loading,
		error,
		fetchTemplates,
		uploadTemplate,
		deleteTemplate,
	};
}
