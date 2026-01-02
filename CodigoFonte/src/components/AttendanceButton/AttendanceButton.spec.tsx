import { act } from 'react';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AtendimentoButton } from './AttendanceButton.component';

jest.mock('@/components/ButtonIcon', () => ({
	ButtonIcon: ({
		text,
		onClick,
		disabled,
	}: {
		text: string;
		onClick?: () => void;
		disabled?: boolean;
	}) => (
		<button data-testid='button-icon' onClick={onClick} disabled={disabled}>
			{text}
		</button>
	),
}));

const mockBuild = jest.fn();
const mockToogleChat = jest.fn();

jest.mock('blip-chat-widget', () => ({
	BlipChat: jest.fn().mockImplementation(function () {
		return {
			build: mockBuild,
			toogleChat: mockToogleChat,
			withAppKey: jest.fn().mockReturnThis(),
			withCustomCommonUrl: jest.fn().mockReturnThis(),
			withAuth: jest.fn().mockReturnThis(),
			withButton: jest.fn().mockReturnThis(),
			withEventHandler: jest.fn().mockReturnThis(),
			withCustomStyle: jest.fn().mockReturnThis(),
		};
	}),
	DEV_AUTH: 'DEV_AUTH',
	LOAD_EVENT: 'LOAD_EVENT',
}));

afterEach(() => {
	jest.clearAllMocks();
});

describe('AtendimentoButton', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ appKey: 'test-key' }),
			}),
		) as unknown as typeof fetch;
	});

	it('renders text and button correctly', async () => {
		await act(async () => {
			render(<AtendimentoButton text='Atender' />);
		});

		await waitFor(() => expect(mockBuild).toHaveBeenCalled());

		expect(screen.getByTestId('button-icon')).toBeInTheDocument();
		expect(screen.getByText('Atender')).toBeInTheDocument();
	});

	it('disables button when disabled=true', async () => {
		await act(async () => {
			render(<AtendimentoButton text='Atender' disabled={true} />);
		});
		expect(screen.getByTestId('button-icon')).toBeDisabled();
	});

	it('calls toogleChat when clicking the button', async () => {
		await act(async () => {
			render(<AtendimentoButton text='Atender' />);
		});

		await waitFor(() => expect(mockBuild).toHaveBeenCalled());

		fireEvent.click(screen.getByTestId('button-icon'));

		expect(mockToogleChat).toHaveBeenCalled();
	});

	it('aligns correctly according to align prop', async () => {
		const { container } = render(
			<AtendimentoButton text='Atender' align='justify-center' />,
		);

		await waitFor(() => expect(mockBuild).toHaveBeenCalled());

		expect(container.firstChild).toHaveClass('justify-center');
	});

	it('does not call toogleChat if blipChat is not ready', async () => {
		// Simula falha na API que não retorna appKey
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ appKey: null }),
			}),
		) as unknown as typeof fetch;

		await act(async () => {
			render(<AtendimentoButton text='Atender' />);
		});

		fireEvent.click(screen.getByTestId('button-icon'));

		// Como appKey é null, blipChat nunca é criado e toogleChat não deve ser chamado
		expect(mockToogleChat).not.toHaveBeenCalled();
	});
});
