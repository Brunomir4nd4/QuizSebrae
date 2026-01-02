export interface ThemeSettings {
	facilitator: FeatureFlags;
	participant: FeatureFlags;
	supervisor: FeatureFlags;
	maintenance_mode: boolean;
	site_url: string;
	whatsapp_message_to_facilitator: string;
	whatsapp_message_to_participant: string;
	whatsapp_support_link: string;
	maintenance_mode_general_hub_active: boolean;
	maintenance_mode_general_hub_title: string;
	maintenance_mode_general_hub_message: string;
	maintenance_mode_general_hub_description: string;
}

interface FeatureFlags {
	enable_room: boolean;
	enable_calendar: boolean;
}