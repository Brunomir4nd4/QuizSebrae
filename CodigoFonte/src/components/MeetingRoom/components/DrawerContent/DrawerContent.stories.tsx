import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { DrawerContent } from './DrawerContent.component';
import { ProvidersDecorator } from '../../../../../.storybook/decorators/ProvidersDecorator';
import { ThemeSettings } from '@/types/IThemeSettings';
import { classDataWithProgressiveCertification } from '../../../../../.storybook/mocks/classData';
import { mockTurmaData } from '../../../../../.storybook/mocks/turmaData';

type ExtendedArgs = Partial<React.ComponentProps<typeof DrawerContent>> & {
	students?: unknown[];
};

export default {
	title: 'components/Molecules/MeetingRoom/DrawerContent',
	component: DrawerContent,
	tags: ['autodocs'],
	decorators: [ProvidersDecorator],
	parameters: {
		layout: 'fullscreen',
	},
} as Meta<typeof DrawerContent>;

const Template: StoryFn<React.ComponentProps<typeof DrawerContent>> = (
	args,
) => {
	// Use local state so interactive callbacks (like setConsultancyDate)
	// actually update the component during Storybook interaction.
	const [openModal, setOpenModal] = useState<boolean>(args.openModal ?? false);
	const [drawerStep, setDrawerStep] = useState<0 | 1>(args.drawerStep ?? 0);
	const [consultancyDate, setConsultancyDate] = useState<
		string | null | undefined
	>(args.consultancyDate ?? null);
	const [startTime, setStartTime] = useState<string>(args.startTime ?? '');
	const [questions, setQuestions] = useState(
		args.questions ?? {
			social_network: '',
			main_topic: '',
			specific_questions: '',
		},
	);

	const handleDrawerClose = () => {
		setDrawerStep(0);
		setOpenModal(false);
		setConsultancyDate(null);
		setStartTime('');
	};

	return (
		<div style={{ padding: '40px', background: '#f3f4f6', minHeight: '100vh' }}>
			<DrawerContent
				{...args}
				openModal={openModal}
				setOpenModal={setOpenModal}
				drawerStep={drawerStep}
				setDrawerStep={setDrawerStep}
				consultancyDate={consultancyDate}
				setConsultancyDate={setConsultancyDate}
				startTime={startTime}
				setStartTime={setStartTime}
				questions={questions}
				setQuestions={setQuestions}
				handleDrawerClose={handleDrawerClose}
			/>
		</div>
	);
};

const themeSettings: ThemeSettings = {
	whatsapp_message_to_facilitator: 'Olá, preciso de ajuda',
	facilitator: {
		enable_room: false,
		enable_calendar: false,
	},
	participant: {
		enable_room: false,
		enable_calendar: false,
	},
	supervisor: {
		enable_room: false,
		enable_calendar: false,
	},
	maintenance_mode: false,
	site_url: '',
	whatsapp_message_to_participant: '',
	whatsapp_support_link: '',
	maintenance_mode_general_hub_active: false,
	maintenance_mode_general_hub_title: '',
	maintenance_mode_general_hub_message: '',
	maintenance_mode_general_hub_description: '',
};

export const StudentView = Template.bind({});
StudentView.args = {
	classId: '1',
	token: 'token-abc',
	isAdmin: false,
	themeSettings: themeSettings,
	classesData: undefined,
	openModal: false,
	setOpenModal: () => {},
	drawerStep: 0,
	setDrawerStep: () => {},
	consultancyDate: null,
	setConsultancyDate: () => {},
	startTime: '',
	setStartTime: () => {},
	setQuestions: () => {},
	questions: { social_network: '', main_topic: '', specific_questions: '' },
	handleDrawerClose: () => {},
	type: 'student',
};

export const AdminViewFallback = Template.bind({});
AdminViewFallback.args = {
	...StudentView.args,
	isAdmin: true,
	classesData: {
		'1': classDataWithProgressiveCertification,
	},
	students: mockTurmaData.students,
	type: 'supervisor',
} as ExtendedArgs;
AdminViewFallback.parameters = {
  turmaData: mockTurmaData,
};
