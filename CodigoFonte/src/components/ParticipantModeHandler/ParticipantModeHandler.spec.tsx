import React from 'react';
import { render } from '@testing-library/react';
import { ParticipantModeHandler } from './index';

// Mocks
jest.mock('next-auth/react', () => ({
	useSession: jest.fn(),
}));

// Mock do localStorage
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

import { useSession } from 'next-auth/react';

const mockUseSession = useSession as jest.Mock;

describe('ParticipantModeHandler', () => {
	const mockOnModeChange = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		localStorageMock.clear();
		mockOnModeChange.mockClear();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	it('renders without crashing', () => {
		mockUseSession.mockReturnValue({ data: null });

		expect(() => render(<ParticipantModeHandler />)).not.toThrow();
	});

	it('renders nothing (returns null)', () => {
		mockUseSession.mockReturnValue({ data: null });

		const { container } = render(<ParticipantModeHandler />);
		expect(container.firstChild).toBeNull();
	});

	it('does nothing when session is null', () => {
		mockUseSession.mockReturnValue({ data: null });

		render(<ParticipantModeHandler onModeChange={mockOnModeChange} />);

		expect(localStorageMock.removeItem).not.toHaveBeenCalled();
		expect(mockOnModeChange).not.toHaveBeenCalled();
	});

	it('removes participant mode and calls onModeChange(false) when user is facilitator', () => {
		const mockSession = {
			user: {
				role: ['facilitator'],
			},
		};
		mockUseSession.mockReturnValue({ data: mockSession });

		render(<ParticipantModeHandler onModeChange={mockOnModeChange} />);

		expect(localStorageMock.removeItem).toHaveBeenCalledWith(
			'isParticipantMode',
		);
		expect(mockOnModeChange).toHaveBeenCalledWith(false);
	});

	it('removes participant mode when user role includes facilitator', () => {
		const mockSession = {
			user: {
				role: ['admin', 'facilitator', 'teacher'],
			},
		};
		mockUseSession.mockReturnValue({ data: mockSession });

		render(<ParticipantModeHandler onModeChange={mockOnModeChange} />);

		expect(localStorageMock.removeItem).toHaveBeenCalledWith(
			'isParticipantMode',
		);
		expect(mockOnModeChange).toHaveBeenCalledWith(false);
	});

	it('calls onModeChange(true) when participant mode is enabled', () => {
		const mockSession = {
			user: {
				role: ['student'],
			},
		};
		mockUseSession.mockReturnValue({ data: mockSession });
		localStorageMock.getItem.mockReturnValue('true');

		render(<ParticipantModeHandler onModeChange={mockOnModeChange} />);

		expect(localStorageMock.getItem).toHaveBeenCalledWith('isParticipantMode');
		expect(mockOnModeChange).toHaveBeenCalledWith(true);
	});

	it('calls onModeChange(false) when participant mode is disabled', () => {
		const mockSession = {
			user: {
				role: ['student'],
			},
		};
		mockUseSession.mockReturnValue({ data: mockSession });
		localStorageMock.getItem.mockReturnValue('false');

		render(<ParticipantModeHandler onModeChange={mockOnModeChange} />);

		expect(localStorageMock.getItem).toHaveBeenCalledWith('isParticipantMode');
		expect(mockOnModeChange).toHaveBeenCalledWith(false);
	});

	it('calls onModeChange(false) when participant mode flag is not set', () => {
		const mockSession = {
			user: {
				role: ['student'],
			},
		};
		mockUseSession.mockReturnValue({ data: mockSession });
		localStorageMock.getItem.mockReturnValue(null);

		render(<ParticipantModeHandler onModeChange={mockOnModeChange} />);

		expect(localStorageMock.getItem).toHaveBeenCalledWith('isParticipantMode');
		expect(mockOnModeChange).toHaveBeenCalledWith(false);
	});

	it('does not call onModeChange when callback is not provided', () => {
		const mockSession = {
			user: {
				role: ['student'],
			},
		};
		mockUseSession.mockReturnValue({ data: mockSession });
		localStorageMock.getItem.mockReturnValue('true');

		render(<ParticipantModeHandler />);

		expect(localStorageMock.getItem).toHaveBeenCalledWith('isParticipantMode');
		expect(mockOnModeChange).not.toHaveBeenCalled();
	});

	it('handles user without role property', () => {
		const mockSession = {
			user: {
				name: 'Test User',
			},
		};
		mockUseSession.mockReturnValue({ data: mockSession });
		localStorageMock.getItem.mockReturnValue('true');

		render(<ParticipantModeHandler onModeChange={mockOnModeChange} />);

		expect(localStorageMock.getItem).toHaveBeenCalledWith('isParticipantMode');
		expect(mockOnModeChange).toHaveBeenCalledWith(true);
	});

	it('handles empty role array', () => {
		const mockSession = {
			user: {
				role: [],
			},
		};
		mockUseSession.mockReturnValue({ data: mockSession });
		localStorageMock.getItem.mockReturnValue('true');

		render(<ParticipantModeHandler onModeChange={mockOnModeChange} />);

		expect(localStorageMock.getItem).toHaveBeenCalledWith('isParticipantMode');
		expect(mockOnModeChange).toHaveBeenCalledWith(true);
	});
});
