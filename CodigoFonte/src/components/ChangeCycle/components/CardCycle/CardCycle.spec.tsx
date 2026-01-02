import { render, screen, fireEvent } from '@testing-library/react';
import { CardCycle } from '../index';
import React from 'react';

describe('CardCycle component', () => {
	const mockSetConsultancyDate = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders active state correctly', () => {
		render(
			<CardCycle
				id='1'
				title='Ciclo Ativo'
				numberDay={5}
				active
				setConsultancyDate={mockSetConsultancyDate}
			/>,
		);

		expect(screen.getByText('Ciclo Ativo')).toBeInTheDocument();
		expect(screen.getByText('5')).toBeInTheDocument();

		// Pega o container correto do card (pai que tem bg-black)
		const cardContainer = screen
			.getByText('Ciclo Ativo')
			.closest('div')?.parentElement;
		expect(cardContainer).toHaveClass(
			'relative',
			'flex',
			'flex-col',
			'items-center',
			'justify-center',
			'w-[100%]',
			'h-20',
			'md:h-[100px]',
			'bg-black',
			' rounded-[18px]',
			'shadow-sm',
		);
	});

	it('renders disabled state correctly', () => {
		render(
			<CardCycle
				id='2'
				title='Ciclo Desabilitado'
				numberDay={10}
				disabled
				setConsultancyDate={mockSetConsultancyDate}
			/>,
		);

		expect(screen.getByText('Ciclo Desabilitado')).toBeInTheDocument();
		expect(screen.getByText('10')).toBeInTheDocument();
		expect(screen.getByText(/Indisponível/i)).toBeInTheDocument();

		const cardContainer = screen
			.getByText('Ciclo Desabilitado')
			.closest('div')?.parentElement;
		expect(cardContainer).toHaveClass(
			'flex',
			'flex-col',
			'relative',
			'items-center',
			'justify-center',
			'w-[100%]',
			'h-20',
			'md:h-[100px]',
			'bg-[#6E707A]',
			'border',
			'border-[#5E606C]',
			'rounded-[18px]',
			'shadow-sm',
			'pb-[32px]',
		);
	});

	it('renders clickable state and calls setConsultancyDate on click', () => {
		render(
			<CardCycle
				id='3'
				title='Ciclo Clicável'
				numberDay={15}
				setConsultancyDate={mockSetConsultancyDate}
			/>,
		);

		expect(screen.getByText('Ciclo Clicável')).toBeInTheDocument();
		expect(screen.getByText('15')).toBeInTheDocument();

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(mockSetConsultancyDate).toHaveBeenCalledTimes(1);
	});
});
