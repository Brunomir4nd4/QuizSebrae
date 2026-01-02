import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StyledSwitch } from './StyledSwitch.component';

// Mock next-auth
jest.mock('next-auth/react', () => ({
	useSession: () => ({
		data: {
			user: {
				token: 'mock-token',
			},
		},
	}),
}));

// Mock BootstrapTooltip
jest.mock('../ParticipacaoTable/components', () => ({
	BootstrapTooltip: ({ children }: { children: React.ReactNode }) => (
		<div data-testid='bootstrap-tooltip'>{children}</div>
	),
}));

// Mock API service
jest.mock('@/app/services/bff/ClassService', () => ({
	setParticipacaoByIdBff: jest.fn(),
}));

import { setParticipacaoByIdBff } from '@/app/services/bff/ClassService';

const mockSetParticipacao = setParticipacaoByIdBff as jest.MockedFunction<
	typeof setParticipacaoByIdBff
>;

describe('StyledSwitch Component', () => {
	beforeEach(() => {
		mockSetParticipacao.mockClear();
	});

	it('should render with active state', () => {
		render(
			<StyledSwitch
				active={true}
				classId='1'
				studentId='1'
				activityId='activity-1'
				isEditingAllowed={true}
			/>,
		);

		const switchElement = screen.getByRole('switch');
		expect(switchElement).toBeInTheDocument();
		expect(switchElement).toBeChecked();
	});

	it('should render with inactive state', () => {
		render(
			<StyledSwitch
				active={false}
				classId='1'
				studentId='1'
				activityId='activity-1'
				isEditingAllowed={true}
			/>,
		);

		const switchElement = screen.getByRole('switch');
		expect(switchElement).toBeInTheDocument();
		expect(switchElement).not.toBeChecked();
	});

	it('should be disabled when isEditingAllowed is false', () => {
		render(
			<StyledSwitch
				active={false}
				classId='1'
				studentId='1'
				activityId='activity-1'
				isEditingAllowed={false}
			/>,
		);

		const switchElement = screen.getByRole('switch');
		expect(switchElement).toBeDisabled();
	});

	it('should call API when clicked and enabled', async () => {
		mockSetParticipacao.mockResolvedValue({
			message: 'Presença registrada com sucesso',
		});

		render(
			<StyledSwitch
				active={false}
				classId='1'
				studentId='1'
				activityId='activity-1'
				isEditingAllowed={true}
			/>,
		);

		const switchElement = screen.getByRole('switch');
		fireEvent.click(switchElement);

		await waitFor(() => {
			expect(mockSetParticipacao).toHaveBeenCalledWith('1', '1', 'activity-1');
		});
	});

	it('should show loading state during API call', async () => {
		mockSetParticipacao.mockImplementation(
			() => new Promise((resolve) => setTimeout(resolve, 100)),
		);

		render(
			<StyledSwitch
				active={false}
				classId='1'
				studentId='1'
				activityId='activity-1'
				isEditingAllowed={true}
			/>,
		);

		const switchElement = screen.getByRole('switch');
		fireEvent.click(switchElement);

		// Switch should be disabled during loading
		await waitFor(() => {
			expect(switchElement).toBeDisabled();
		});
	});

	it('should handle enroll canceled state', () => {
		render(
			<StyledSwitch
				active={false}
				classId='1'
				studentId='1'
				activityId='activity-1'
				isEditingAllowed={false}
				isEnrollCanceled={true}
			/>,
		);

		const switchElement = screen.getByRole('switch');
		expect(switchElement).toBeDisabled();
	});

	it('should render tooltip wrapper', () => {
		render(
			<StyledSwitch
				active={false}
				classId='1'
				studentId='1'
				activityId='activity-1'
				isEditingAllowed={true}
			/>,
		);

		expect(screen.getByTestId('bootstrap-tooltip')).toBeInTheDocument();
	});
});
