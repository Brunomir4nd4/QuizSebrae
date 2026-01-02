import { ApiResponse } from './IApiResponse';
import { WPImage } from './IWordpress';

interface LinkAndMaterial {
	icon: string;
	title: string;
	link: string;
	target?: string;
	notify?: boolean;
}

interface CourseInfo {
	group_limit?: number | null;
	group_link: string;
	id: number;
	name: string;
	slug: string;
	description: string;
	links_and_materials: LinkAndMaterial[];
	evaluate_course: string;
	form_subjects?: string[];
	maintenance_mode_title: string;
	maintenance_mode_message: string;
	maintenance_mode_description: string;
	maintenance_mode_active: boolean;
}

interface CycleInfo {
	id: number;
	name: string;
	slug: string;
	description: string;
	activities: number;
	activity_titles: string[];
}

interface Turno {
	value: 'diurno' | 'noturno' | 'vespertino' | 'unica';
	label: string;
}

export interface ClassData {
	enable_strategic_activities: boolean;
	strategic_activities_number: number;
	enroll_id: string;
	links_and_materials: {
		facilitator: LinkAndMaterial[];
		subscriber: LinkAndMaterial[];
	};
	id: number;
	title: string;
	slug: string;
	ciclos: CycleInfo;
	start_date: string;
	end_date: string;
	courses: CourseInfo;
	logo: WPImage;
	logo_b: WPImage;
	individual_meetings: string[][];
	collective_meetings: string[];
	label_configuration: {
		label_configuration_regular: string;
		label_configuration_strong: string;
		label_configuration_suffix: string;
	};
	enable_room: boolean;
	enable_calendar: boolean;
	turno: Turno;
	facilitator: number;
	facilitator_name: string;
	facilitator_email: string;
	group_link: string;
	enable_certificacao_progressiva?: boolean;
	contact?: {
		phone: string;
		message: string;
	};
}

export interface ClassResponse extends ApiResponse {
	data: ClassData[];
}
