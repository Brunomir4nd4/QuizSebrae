export interface ApiResponse {
	status: number;
	message: string;
	code?: 'cycle_not_found' | 'classes_not_found';
	course?: string;
}
