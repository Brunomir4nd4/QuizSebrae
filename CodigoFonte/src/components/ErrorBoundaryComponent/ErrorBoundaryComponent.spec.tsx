import { render, screen } from '@testing-library/react';
import React from 'react';
import { ErrorBoundaryComponent } from './index';
import { useUserContext } from '@/app/providers/UserProvider';

jest.mock('@/app/providers/UserProvider');
jest.mock('../NotifyModal', () => ({
	NotifyModal: jest.fn(({ title, message, logout }) => (
		<div data-testid='notify-modal'>
			<span>{title}</span>
			<span>{message}</span>
			<span>{logout ? 'logout' : 'no-logout'}</span>
		</div>
	)),
}));

describe('ErrorBoundaryComponent', () => {
	it('renders NotifyModal when there is error', () => {
		(useUserContext as jest.Mock).mockReturnValue({
			error: {
				title: 'Erro Teste',
				message: 'Mensagem de erro',
				logout: true,
			},
		});

		render(<ErrorBoundaryComponent />);

		const modal = screen.getByTestId('notify-modal');
		expect(modal).toBeInTheDocument();
		expect(modal).toHaveTextContent('Erro Teste');
		expect(modal).toHaveTextContent('Mensagem de erro');
		expect(modal).toHaveTextContent('logout');
	});

	it('renders nothing when there is no error', () => {
		(useUserContext as jest.Mock).mockReturnValue({
			error: null,
		});

		const { container } = render(<ErrorBoundaryComponent />);
		expect(container.firstChild).toBeNull();
	});
});
