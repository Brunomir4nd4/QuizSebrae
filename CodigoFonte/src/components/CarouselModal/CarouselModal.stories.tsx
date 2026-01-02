import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { CarouselModal } from './CarouselModal.component';

const meta: Meta<typeof CarouselModal> = {
	title: 'components/Molecules/Modal/CarouselModal',
	component: CarouselModal,
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

export default meta;

type Story = StoryObj<typeof CarouselModal>;

export const Default: Story = {
	render: (args) => {
		const Wrapper: React.FC = () => {
			const [open, setOpen] = React.useState(true);
			return (
				<CarouselModal {...args} open={open} onClose={() => setOpen(false)}>
					{args.children}
				</CarouselModal>
			);
		};

		return <Wrapper />;
	},
	args: {
		children: (
			<div style={{ display: 'flex', flexDirection: 'column', minWidth: 360 }}>
				<header style={{ padding: 20, borderBottom: '1px solid #eee' }}>
					<h1 style={{ margin: 0 }}>Galeria de Imagens</h1>
					<p style={{ margin: '6px 0 0', color: '#666' }}>
						Visualize e baixe as imagens
					</p>
				</header>

				<main
					style={{
						padding: 40,
						textAlign: 'center',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}>
					<h2>Imagem 1</h2>
					<img
						src='/logo-up-marketing.svg'
						alt='mock image'
						style={{ maxWidth: 300 }}
					/>
					<p style={{ marginTop: 12 }}>Descrição da imagem de exemplo.</p>
				</main>

				<footer
					style={{
						padding: 16,
						borderTop: '1px solid #eee',
						display: 'flex',
						justifyContent: 'space-between',
					}}>
					<div>
						<button className='btn-secondary' aria-label='download'>
							Baixar
						</button>
					</div>
					<div>
						<button className='btn-link' aria-label='help'>
							Ajuda
						</button>
					</div>
				</footer>
			</div>
		),
	},
};
