import type { Meta, StoryObj } from '@storybook/nextjs';
import { Sidebar } from './Sidebar.component';
import { Session } from 'next-auth';
import { Sidebar as SidebarResponse } from '@/types/ISidebar';
import { WPImage } from '@/types/IWordpress';

const meta: Meta<typeof Sidebar> = {
	title: 'components/Molecules/Sidebar/Sidebar',
	component: Sidebar,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		nextjs: {
			appDirectory: true,
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

const mockWPImage: WPImage = {
	ID: 1,
	id: 1,
	title: 'Logo',
	filename: 'logo.png',
	filesize: 1024,
	url: '/logo-up-marketing.svg',
	link: 'https://example.com/logo',
	alt: 'Logo da turma',
	author: '1',
	description: 'Logo description',
	caption: 'Logo caption',
	name: 'logo',
	status: 'inherit',
	uploaded_to: 0,
	date: '01/01/2025 00:00:00',
	modified: '01/01/2025 00:00:00',
	menu_order: 0,
	mime_type: 'image/png',
	type: 'image',
	subtype: 'png',
	icon: 'https://example.com/icon.png',
	width: 200,
	height: 200,
	sizes: {
		thumbnail: 'https://example.com/logo-thumbnail.png',
		'thumbnail-width': 150,
		'thumbnail-height': 150,
		medium: 'https://example.com/logo-medium.png',
		'medium-width': 300,
		'medium-height': 300,
		medium_large: 'https://example.com/logo-medium-large.png',
		'medium_large-width': 768,
		'medium_large-height': 768,
		large: 'https://example.com/logo-large.png',
		'large-width': 1024,
		'large-height': 1024,
		'1536x1536': 'https://example.com/logo-1536.png',
		'1536x1536-width': 1536,
		'1536x1536-height': 1536,
		'2048x2048': 'https://example.com/logo-2048.png',
		'2048x2048-width': 2048,
		'2048x2048-height': 2048,
	},
};

const mockSession: Session = {
	user: {
		user_first_name: 'John',
		user_last_name: 'Doe',
		user_display_name: 'John Doe',
		user_email: 'john.doe@example.com',
		user_nicename: 'johndoe',
		role: ['subscriber'],
		token: 'mock-token',
		cpf: '12345678900',
		id: 1,
	},
	expires: '2025-12-31T23:59:59.999Z',
};

const mockSidebar: SidebarResponse[] = [
	{
		cycle_id: 101,
		course_id: 201,
		class_id: 301,
		class_name: 'Up Digital Finanças 19h T391',
		class_slug: 'up-digital-financas-19h-t391',
		cycle_name: 'Ciclo 1',
		cycle_slug: 'up-digital-financas-ciclo-1',
		course_name: 'Up Digital Finanças',
		course_slug: 'up-digital-financas',
		logo: mockWPImage,
		logo_b: mockWPImage,
	},
];


export const Participante: Story = {
	args: {
		role: false,
		session: mockSession,
		sidebar: mockSidebar,
		isParticipantMode: false,
	},
	render: (args) => <Sidebar {...args} />,
};

export const Facilitador: Story = {
	args: {
		role: true,
		session: { ...mockSession, user: { ...mockSession.user, role: ['facilitator'] } },
		sidebar: mockSidebar,
		isParticipantMode: false,
	},
	render: (args) => <Sidebar {...args} />,
};

export const Supervisor: Story = {
	args: {
		role: true,
		session: { ...mockSession, user: { ...mockSession.user, role: ['supervisor'] } },
		sidebar: mockSidebar,
		isParticipantMode: false,
	},
	render: (args) => <Sidebar {...args} />,
};


