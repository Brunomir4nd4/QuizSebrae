import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import { ClientLayout } from './ClientLayout.component';
import { ProvidersDecorator } from '../../../.storybook/decorators/ProvidersDecorator';
import { classDataWithProgressiveCertification } from '../../../.storybook/mocks/classData';

export default {
	title: 'components/Organisms/ClientLayout/ClientLayout',
	component: ClientLayout,
	tags: ['autodocs'],
	decorators: [ProvidersDecorator],
	parameters: {
		layout: 'fullscreen',
	},
} as Meta<typeof ClientLayout>;

const Template: StoryFn<React.ComponentProps<typeof ClientLayout>> = (args) => {
	React.useEffect(() => {
		localStorage.setItem(
			'participantModeStorage',
			JSON.stringify({
				id: 'supervisor-1',
				cpf: '123.456.789-00',
				participantId: 'participant-1',
				participantCpf: '987.654.321-00',
				displayName: 'Supervisor Exemplo',
			}),
		);
		localStorage.setItem('isParticipantMode', 'false');
		localStorage.setItem('originalPage', '/home');
	}, []);
	return (
		<ClientLayout {...args}>
			<div style={{ padding: 40, minHeight: '60vh', background: '#fff' }}>
				<h1 style={{ margin: 50 }}>Conteúdo principal</h1>
			</div>
		</ClientLayout>
	);
};

export const Default = Template.bind({});
Default.args = {
	session: { user: { id: 'user-1', role: ['student'] } },
	role: false,
	classData: [classDataWithProgressiveCertification],
};
