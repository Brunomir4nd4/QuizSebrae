import type { Meta, StoryObj } from '@storybook/nextjs';
import { Login } from './Login.component';

const mockData = {
  "pageData": {
    "banner": null,
    "logo": null,
    "course_id": "12345",
    "title": "Seu Curso",
    "excerpt": "Acesse para encontrar o próximo nível do seu negócio :)",
    "slug": "empreenda-com-sucesso"
  },
  "userType": "participante",
  "host": "example.com"
}


const meta: Meta<typeof Login> = {
  title: 'Pages/Login',
	component: Login,
  tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		nextjs: {
			appDirectory: true,
		},
	},
};

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <Login pageData={mockData.pageData} />,
};

export default meta;
