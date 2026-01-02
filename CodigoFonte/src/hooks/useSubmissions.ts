import { useState, useEffect } from 'react';
import {
	getAllSubmissions,
	getParticipants,
} from '@/app/services/bff/SubmissionService';
import { ActivityStatus, Turma } from '@/types/IParticipants';
import { useUserContext } from '@/app/providers/UserProvider';
import { mapStatus } from '@/utils/mapSubmissionStatus';
import { missingActivities } from '@/utils/createMissingActivities';

/**
 * Hook para obter a lista de alunos de uma turma e suas presenças.
 *
 * @param {string | null | number} [classId] - O ID da turma para a qual obter a lista de alunos.
 * @param {boolean} [isAdmin=true] - Um booleano que representa se o usuário é admin ou não. Por padrão, é verdadeiro.
 *
 * @returns {{ students: Participant[] | null, loading: boolean }} - Retorna um objeto contendo a lista de alunos e o estado de carregamento.
 *
 * @example
 * const { students, loading } = useSubmitions('classId123', 'yourAuthToken');
 *
 * if (loading) {
 *   return <div>Carregando...</div>;
 * }
 *
 * return (
 *   <ul>
 *     {students.map(student => (
 *       <li key={student.id}>{student.name}</li>
 *     ))}
 *   </ul>
 * );
 */
const useSubmissions = (
	classId?: string | null | number,
	isAdmin: boolean = true,
): {
	turma: Turma | null;
	loading: boolean;
	updateStudentActivity: (
		studentId: number,
		activityId: string,
		newStatus: ActivityStatus,
	) => void;
} => {
	const [turma, setTurma] = useState<Turma | null>(null);
	const [loading, setLoading] = useState(true);

	const { classesData } = useUserContext();

	useEffect(() => {
		if (classId && isAdmin) {
			getParticipants(classId)
				.then((result) => {
					setLoading(false);

					if (result && result.length) {
						const studentsData = result
							.filter((item) => item.id)
							.sort((a, b) => a.name.localeCompare(b.name));

						setLoading(true);
						getAllSubmissions({ class_id: Number(classId) })
							.then((result) => {
								setLoading(false);

								const totalActivities = classesData
									? classesData[classId].strategic_activities_number
									: 1;
								const studentsWithActivities = studentsData.map((student) => {
									const participantId = Number(student.id);

									// Atividades reais desse aluno (vindas do backend)
									const seenActivityIds = new Set();
									const existingActivities = result
										.filter(
											(sub) =>
												sub.participant_id === participantId &&
												sub.activity_id <= totalActivities,
										)
										.filter((sub) => {
											if (seenActivityIds.has(sub.activity_id)) {
												return false;
											}
											seenActivityIds.add(sub.activity_id);
											return true;
										})
										.map((sub) => ({
											id: String(sub.id),
											activity_id: String(sub.activity_id),
											status: mapStatus(sub.status),
										}));

									const missingActivitiesData = missingActivities(
										totalActivities,
										existingActivities,
									);

									// Junta tudo
									const fullActivities = [
										...existingActivities,
										...missingActivitiesData,
									].sort(
										(a, b) => Number(a.activity_id) - Number(b.activity_id),
									);

									return {
										...student,
										activities: fullActivities,
									};
								});

								setTurma({
									activities: totalActivities,
									students: studentsWithActivities,
								});
							})
							.catch((error) => {
								setLoading(false);
								console.info(error);
							});
					}
				})
				.catch((error) => {
					setLoading(false);
					console.info(error);
				});
		}
	}, [classId, isAdmin, classesData]);

	const updateStudentActivity = (
		studentId: number,
		activityId: string,
		newStatus: ActivityStatus,
	) => {
		if (!turma) return;

		const updatedStudents = turma.students.map((student) => {
			if (Number(student.id) !== studentId) return student;

			const updatedActivities = student.activities.map((activity) => {
				if (activity.activity_id === activityId) {
					return {
						...activity,
						status: newStatus,
					};
				}
				return activity;
			});

			return {
				...student,
				activities: updatedActivities,
			};
		});

		setTurma({
			...turma,
			students: updatedStudents,
		});
	};

	return { turma, updateStudentActivity, loading };
};

export default useSubmissions;
