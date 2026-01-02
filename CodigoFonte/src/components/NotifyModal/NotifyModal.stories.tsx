import type { Meta, StoryObj } from '@storybook/nextjs';
import { NotifyModal } from './NotifyModal.component';

const meta: Meta<typeof NotifyModal> = {
	title: 'components/Molecules/Modal/NotifyModal',
	component: NotifyModal,
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
};

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: 'Tudo certo!',
		highlight: 'Sucesso:',
		subtitle: 'Operação concluída',
		message: 'Sua ação foi realizada com sucesso.',
		logout: false,
		reload: false,
		whats: false,
	},
};

export const WithWhats: Story = {
	args: {
		...Default.args,
		whats: true,
		whatsLink: 'https://wa.me/5599999999999',
	},
};

export const WithReload: Story = {
	args: {
		...Default.args,
		message: 'Algo deu errado. Tente novamente.',
		reload: true,
	},
};

export default meta;
