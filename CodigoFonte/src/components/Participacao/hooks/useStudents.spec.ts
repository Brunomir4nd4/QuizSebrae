import { renderHook, waitFor } from '@testing-library/react';
import { getPresence } from '@/app/services/bff/ClassService';
import { Student } from '@/types/IStudent';
import useStudents from './useStudents';

// Mock do serviço
jest.mock('@/app/services/bff/ClassService', () => ({
	getPresence: jest.fn(),
}));

const mockGetPresence = getPresence as jest.MockedFunction<typeof getPresence>;

describe('useStudents', () => {
	const mockStudents = [
		{ id: 1, name: 'João Silva', activities: {}, phone: '11999999999' },
		{ id: 2, name: 'Ana Santos', activities: {}, phone: '11888888888' },
		{ id: 3, name: 'Carlos Oliveira', activities: {}, phone: '11777777777' },
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockGetPresence.mockResolvedValue([]);
	});

	it('should return loading true initially', () => {
		const { result } = renderHook(() =>
			useStudents('class123', 'token123', true),
		);

		expect(result.current.loading).toBe(true);
		expect(result.current.students).toBeNull();
	});

	it('should fetch students when has classId and token', async () => {
		mockGetPresence.mockResolvedValue(mockStudents);

		const { result } = renderHook(() =>
			useStudents('class123', 'token123', true),
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(mockGetPresence).toHaveBeenCalledWith('class123', 'token123');
		expect(result.current.students).toEqual([
			mockStudents[1], // Ana Santos (ordenado alfabeticamente)
			mockStudents[2], // Carlos Oliveira
			mockStudents[0], // João Silva
		]);
	});

	it('should filter students without id', async () => {
		const studentsWithNullId = [
			{ id: 1, name: 'João Silva', activities: {}, phone: '11999999999' },
			{
				id: null as unknown as number,
				name: 'Sem ID',
				activities: {},
				phone: '11666666666',
			},
			{ id: 2, name: 'Ana Santos', activities: {}, phone: '11888888888' },
		];

		mockGetPresence.mockResolvedValue(
			studentsWithNullId as unknown as Student[],
		);

		const { result } = renderHook(() =>
			useStudents('class123', 'token123', true),
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.students).toEqual([
			{ id: 2, name: 'Ana Santos', activities: {}, phone: '11888888888' },
			{ id: 1, name: 'João Silva', activities: {}, phone: '11999999999' },
		]);
	});

	it('should return empty array when result is empty', async () => {
		mockGetPresence.mockResolvedValue([]);

		const { result } = renderHook(() =>
			useStudents('class123', 'token123', true),
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.students).toEqual([]);
	});

	it('should not make call when has no classId', () => {
		const { result } = renderHook(() => useStudents(null, 'token123', true));

		expect(result.current.loading).toBe(true);
		expect(result.current.students).toBeNull();
		expect(mockGetPresence).not.toHaveBeenCalled();
	});

	it('should not make call when has no token', () => {
		const { result } = renderHook(() =>
			useStudents('class123', undefined, true),
		);

		expect(result.current.loading).toBe(true);
		expect(result.current.students).toBeNull();
		expect(mockGetPresence).not.toHaveBeenCalled();
	});

	it('should not make call when isAdmin is false', () => {
		const { result } = renderHook(() =>
			useStudents('class123', 'token123', false),
		);

		expect(result.current.loading).toBe(true);
		expect(result.current.students).toBeNull();
		expect(mockGetPresence).not.toHaveBeenCalled();
	});

	it('should use isAdmin true by default', async () => {
		mockGetPresence.mockResolvedValue(mockStudents);

		const { result } = renderHook(() => useStudents('class123', 'token123'));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(mockGetPresence).toHaveBeenCalledWith('class123', 'token123');
	});

	it('should handle error in call', async () => {
		const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
		mockGetPresence.mockRejectedValue(new Error('API Error'));

		const { result } = renderHook(() =>
			useStudents('class123', 'token123', true),
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.students).toBeNull();
		expect(consoleSpy).toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it('should allow refetch of data', async () => {
		mockGetPresence.mockResolvedValue(mockStudents);

		const { result } = renderHook(() =>
			useStudents('class123', 'token123', true),
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		// Simular mudança nos dados
		const updatedStudents = [
			{ id: 4, name: 'Novo Aluno', activities: {}, phone: '11555555555' },
		];
		mockGetPresence.mockResolvedValue(updatedStudents);

		// Chamar refetch
		result.current.refetch();

		await waitFor(() => {
			expect(result.current.students).toEqual(updatedStudents);
		});

		expect(mockGetPresence).toHaveBeenCalledTimes(2);
	});
});
