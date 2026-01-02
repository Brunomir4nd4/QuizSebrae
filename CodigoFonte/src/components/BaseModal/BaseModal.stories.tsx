import type { Meta, StoryObj } from '@storybook/nextjs';
import { BaseModal } from './BaseModal.component';
import { Box, Typography, Button } from '@mui/material';
import { useState } from 'react';
import { BaseModalProps } from './BaseModal.interface';

const meta: Meta<typeof BaseModal> = {
	title: 'components/Molecules/Modal/BaseModal',
	component: BaseModal,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			story: {
				inline: false,
				iframeHeight: '600px',
			},
		},
	},
	argTypes: {
		width: { control: 'text' },
		open: { control: 'boolean' },
	},
};

type Story = StoryObj<typeof meta>;


// Story com header e footer, controlando o estado de open via hook dentro de um componente
const Aberta = (args: BaseModalProps) => {
	const [open, setOpen] = useState(true);
	return (
		<BaseModal
			{...args}
			open={open}
			onClose={() => setOpen(false)}
			header={
				<Box>
					<Typography variant="h5">Cabeçalho do Modal</Typography>
				</Box>
			}
			footer={
				<Box>
					Rodapé
				</Box>
			}
		>
			<Box>
				<Typography>Conteúdo do modal com cabeçalho e rodapé.</Typography>
			</Box>
		</BaseModal>
	);
};

export const WithHeaderAndFooter: Story = {
	render: (args) => <Aberta {...args} />,
};



export default meta;