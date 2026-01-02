import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Header } from './Header.component';
import { Avatar } from '@mui/material';

const meta: Meta<typeof Header> = {
	title: 'components/Molecules/Header/Header',
	component: Header,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Participante: Story = {
	render: () => (
		<section
			className='
					3xl:pl-[200px]
					md:pl-[150px]
					md:pr-[70px]
					pl-[20px]
					pr-[20px]
					py-[15px]
					mt-[66px]
					w-full
					md:mt-0
					bg-white
					shadow-[0_2px_20px_0px_rgba(0, 0, 0, 0.08)]
					border-[rgba(0,0,0,0.05)]
					border-b
					'>
			<div className='flex justify-between items-center'>
				<div className='flex gap-[16px] items-center'>
					<div className='md:hidden'>
						<Avatar>
							<img className='inline-block' src='/icon-user-green.svg' alt='' />
						</Avatar>
					</div>
					<div>
						<p className='text-xl 3xl:text-2xl text-[#6E707A]'>Boas-vindas</p>
						<h1 className='text-2xl md:text-5xl 3xl:text-[60px] text-[#070D26] font-bold'>
							Acompanhe <span className='font-extralight'> sua jornada</span>
						</h1>
					</div>
				</div>
				<div className='items-center hidden md:flex'>
					<div className='text-right mr-4'>
						<p className='text-[#AAA] text-sm 3xl:text-lg'>Participante</p>
						<p className='font-semibold text-xl 3xl:text-2xl capitalize'>
							Nome Participante
						</p>
					</div>
					<div className='md:flex'>
						<Avatar>
							<img className='inline-block' src='/icon-user-green.svg' alt='' />
						</Avatar>
					</div>
				</div>
			</div>
		</section>
	),
};

export const Supervisor: Story = {
	render: () => (
		<section
			className='
					3xl:pl-[200px]
					md:pl-[150px]
					md:pr-[70px]
					pl-[20px]
					pr-[20px]
					py-[15px]
					mt-[66px]
					w-full
					md:mt-0
					bg-white
					shadow-[0_2px_20px_0px_rgba(0, 0, 0, 0.08)]
					border-[rgba(0,0,0,0.05)]
					border-b
					'>
			<div className='flex justify-between items-center'>
				<div className='flex gap-[16px] items-center'>
					<div className='md:hidden'>
						<Avatar>
							<img className='inline-block' src='/icon-user-green.svg' alt='' />
						</Avatar>
					</div>
					<div>
						<p className='text-xl 3xl:text-2xl text-[#6E707A]'>Boas-vindas</p>
						<h1 className='text-2xl md:text-5xl 3xl:text-[60px] text-[#070D26] font-bold'>
							Gerencie <span className='font-extralight'> suas atividades</span>
						</h1>
					</div>
				</div>
				<div className='items-center hidden md:flex'>
					<div className='text-right mr-4'>
						<p className='text-[#AAA] text-sm 3xl:text-lg'>Supervisor</p>
						<p className='font-semibold text-xl 3xl:text-2xl capitalize'>
							Supervisor Nome
						</p>
					</div>
					<div className='md:flex'>
						<Avatar>
							<img className='inline-block' src='/icon-user-green.svg' alt='' />
						</Avatar>
					</div>
				</div>
			</div>
		</section>
	),
};
