import { render, screen, fireEvent } from '@testing-library/react';
import { Filter } from './Filter.component';
import React from 'react';

describe('Filter', () => {
	const onChange = jest.fn();
	const filterOptions = [
		{ value: 'todas', label: 'Listar todos os participantes' },
		{ value: 'não recebida', label: 'Listar atividades não recebidas' },
		{ value: 'recebida', label: 'Listar atividades pendentes de avaliação' },
		{ value: 'avaliada', label: 'Listar atividades concluídas' },
	];

	it('renders select and options correctly', () => {
		render(<Filter filter='todas' onChange={onChange} />);
		// O label deve estar presente
		expect(
			screen.getByLabelText('Listar todos os participantes'),
		).toBeInTheDocument();
		// As opções só aparecem após abrir o menu
		const select = screen.getByRole('combobox');
		fireEvent.mouseDown(select);
		filterOptions.forEach((opt) => {
			expect(screen.getAllByText(opt.label).length).toBeGreaterThan(0);
		});
	});

	it('selects correct option based on filter prop', () => {
		render(<Filter filter='avaliada' onChange={onChange} />);
		const select = screen.getByRole('combobox');
		expect(select).toHaveTextContent('Listar atividades concluídas');
	});

	it('calls onChange when selecting a new option', () => {
		render(<Filter filter='todas' onChange={onChange} />);
		const select = screen.getByRole('combobox');
		fireEvent.mouseDown(select);
		const options = screen.getAllByRole('option');
		const targetOption = options.find(
			(opt) => opt.textContent === 'Listar atividades não recebidas',
		);
		fireEvent.click(targetOption!);
		expect(onChange).toHaveBeenCalledWith('não recebida');
	});

	it('calls onChange for all options except the already selected one', () => {
		render(<Filter filter='todas' onChange={onChange} />);
		const select = screen.getByRole('combobox');
		// Ignora a opção já selecionada ('todas') na primeira iteração
		filterOptions.slice(1).forEach((opt) => {
			fireEvent.mouseDown(select);
			const options = screen.getAllByRole('option');
			const targetOption = options.find((o) => o.textContent === opt.label);
			fireEvent.click(targetOption!);
			expect(onChange).toHaveBeenCalledWith(opt.value);
		});
	});
});
