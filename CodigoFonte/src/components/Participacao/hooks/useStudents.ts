import { useState, useEffect, useCallback } from 'react';
import { Student } from '@/types/IStudent';
import { getPresence } from '@/app/services/bff/ClassService';

/**
 * Hook para obter a lista de alunos de uma turma e suas presenças.
 *
 * @param {string | null | number} [classId] - O ID da turma para a qual obter a lista de alunos.
 * @param {string} [token] - O token de autenticação necessário para fazer a chamada ao serviço.
 * @param {boolean} [isAdmin=true] - Um booleano que representa se o usuário é admin ou não. Por padrão, é verdadeiro.
 *
 * @returns {{ students: Student[] | null, loading: boolean }} - Retorna um objeto contendo a lista de alunos e o estado de carregamento.
 *
 * @example
 * const { students, loading } = useStudents('classId123', 'yourAuthToken');
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
const useStudents = (
	classId?: string | null | number,
	token?: string,
	isAdmin: boolean = true,
): { students: Student[] | null; loading: boolean; refetch: () => void } => {
	const [students, setStudents] = useState<Student[] | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchStudents = useCallback(() => {
		if (classId && token && isAdmin) {
			setLoading(true);
			getPresence(classId, token)
				.then((result) => {
					setLoading(false);

					if (result && result.length == 0) {
						setStudents([]);
					}

					if (result && result.length) {
						setStudents(
							result
								.filter((item) => item.id)
								.sort((a, b) => a.name.localeCompare(b.name)),
						);
					}
				})
				.catch((error) => {
					setLoading(false);
					console.info(error);
				});
		}
	}, [classId, token, isAdmin]);

	useEffect(() => {
		fetchStudents();
	}, [classId, fetchStudents, isAdmin, token]);

	const refetch = () => {
		fetchStudents();
	};

	return { students, loading, refetch };
};

export default useStudents;
