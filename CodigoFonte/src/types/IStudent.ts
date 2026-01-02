export interface Student {
	id: number;
	name: string;
	cpf?: string | null;
	activities: Record<string, boolean>;
	phone: string;
	is_enroll_canceled?: boolean;
	is_cancel_requested?: boolean;
	enrollment_id?: number;
}
