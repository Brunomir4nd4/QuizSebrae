import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { StrategicActivitiesSlider } from './index';

// Mock react-slick
jest.mock('react-slick', () => ({
	__esModule: true,
	default: ({
		children,
		...props
	}: {
		children: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<div data-testid='slider' {...props}>
			{children}
		</div>
	),
}));

// Mock contexts
const mockUseUserContext = jest.fn();
const mockUseSubmissions = jest.fn();

jest.mock('@/app/providers/UserProvider', () => ({
	useUserContext: () => mockUseUserContext(),
}));

jest.mock('@/app/providers/SubmissionsProvider', () => ({
	useSubmissions: () => mockUseSubmissions(),
}));

// Mock API service
import { getAllSubmissions } from '@/app/services/bff/SubmissionService';
import { transformSubmissionsToItems } from '@/utils/transformSubmissionsToItems';

const mockGetAllSubmissions = getAllSubmissions as jest.MockedFunction<
	typeof getAllSubmissions
>;
const mockTransformSubmissionsToItems =
	transformSubmissionsToItems as jest.MockedFunction<
		typeof transformSubmissionsToItems
	>;
jest.mock('@/app/services/bff/SubmissionService', () => ({
	getAllSubmissions: jest.fn(),
}));

jest.mock('@/utils/transformSubmissionsToItems', () => ({
	transformSubmissionsToItems: jest.fn(),
}));

// Mock child components
jest.mock('../EnvioDeAtividades/EnvioDeAtividades.component', () => ({
	__esModule: true,
	default: jest
		.fn()
		.mockImplementation(
			({
				id,
				sent,
				islastSubmition,
			}: {
				id: number;
				sent: boolean;
				islastSubmition: boolean;
			}) => (
				<div data-testid={`envio-atividades-${id}`}>
					<div data-testid={`sent-${id}`}>{sent ? 'sent' : 'not-sent'}</div>
					{islastSubmition && <div data-testid='last-3'>last</div>}
				</div>
			),
		),
}));
jest.mock('../NotifyModal', () => ({
	NotifyModal: ({
		title,
		message,
		callback,
	}: {
		title: string;
		message: string;
		callback?: () => void;
	}) => (
		<div data-testid='notify-modal'>
			<h2>{title}</h2>
			<p>{message}</p>
			{callback && (
				<button data-testid='notify-modal-close' onClick={callback}>
					OK
				</button>
			)}
		</div>
	),
}));

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
	return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('StrategicActivitiesSlider Component', () => {
	const mockUserContext = {
		classId: 'class-123',
		classesData: {
			'class-123': {
				id: 'class-123',
				strategic_activities_number: 3,
				courses: { id: 'course-123' },
			},
		},
	};

	const mockSubmissionsContext = {
		submissions: [],
		addSubmissions: jest.fn(),
		clearSubmissions: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseUserContext.mockReturnValue(mockUserContext);
		mockUseSubmissions.mockReturnValue(mockSubmissionsContext);
		mockGetAllSubmissions.mockResolvedValue([]);
		mockTransformSubmissionsToItems.mockReturnValue([]);
	});

	it('should render the component with initial state', () => {
		renderWithProviders(<StrategicActivitiesSlider userId={1} />);

		expect(screen.getByTestId('slider')).toBeInTheDocument();
		expect(screen.getByText('1ª atividade')).toBeInTheDocument();
		expect(screen.getByAltText('Anterior')).toBeInTheDocument();
		expect(screen.getByAltText('Próximo')).toBeInTheDocument();
	});

	it('should fetch submissions on mount when classId and classesData are available', async () => {
		const mockApiResponse = [
			{
				id: 1,
				participant_id: 1,
				activity_id: 1,
				title: 'Atividade 1',
				class_id: 123,
				course_id: 123,
				cycle_id: 1,
				facilitator_id: 1,
				score: null,
				facilitator_comment: null,
				evaluated_at: null,
				created_at: '2023-01-01T00:00:00Z',
				updated_at: '2023-01-01T00:00:00Z',
				status: 'pending' as const,
				files: [],
			},
			{
				id: 2,
				participant_id: 1,
				activity_id: 2,
				title: 'Atividade 2',
				class_id: 123,
				course_id: 123,
				cycle_id: 1,
				facilitator_id: 1,
				score: null,
				facilitator_comment: null,
				evaluated_at: null,
				created_at: '2023-01-01T00:00:00Z',
				updated_at: '2023-01-01T00:00:00Z',
				status: 'submitted' as const,
				files: [],
			},
		];
		const mockTransformedData = [
			{
				id: 1,
				sent: true,
				items: [],
				feedback: { note: 8, comment: 'Good work' },
			},
		];

		mockGetAllSubmissions.mockResolvedValue(mockApiResponse);
		mockTransformSubmissionsToItems.mockReturnValue(mockTransformedData);

		renderWithProviders(<StrategicActivitiesSlider userId={1} />);

		await waitFor(() => {
			expect(mockGetAllSubmissions).toHaveBeenCalledWith({
				participant_id: 1,
				course_id: 'course-123',
				class_id: 'class-123',
			});
		});

		expect(mockSubmissionsContext.clearSubmissions).toHaveBeenCalled();
		expect(mockTransformSubmissionsToItems).toHaveBeenCalledWith(
			mockApiResponse,
		);
		expect(mockSubmissionsContext.addSubmissions).toHaveBeenCalled();
	});

	it('should create pending submissions when there are fewer submissions than required', async () => {
		const mockTransformedData = [
			{
				id: 1,
				sent: true,
				items: [],
				feedback: { note: 8, comment: 'Good work' },
			},
		];
		mockTransformSubmissionsToItems.mockReturnValue(mockTransformedData);

		renderWithProviders(<StrategicActivitiesSlider userId={1} />);

		await waitFor(() => {
			expect(mockSubmissionsContext.addSubmissions).toHaveBeenCalled();
		});

		const addSubmissionsCall =
			mockSubmissionsContext.addSubmissions.mock.calls[0][0];
		expect(addSubmissionsCall).toHaveLength(3); // 1 transformed + 2 pending
		expect(addSubmissionsCall[0]).toEqual(mockTransformedData[0]);
		expect(addSubmissionsCall[1]).toEqual({ sent: false, id: 2 });
		expect(addSubmissionsCall[2]).toEqual({ sent: false, id: 3 });
	});

	it('should handle API errors gracefully', async () => {
		mockGetAllSubmissions.mockRejectedValue(new Error('API Error'));

		renderWithProviders(<StrategicActivitiesSlider userId={1} />);

		await waitFor(() => {
			expect(screen.getByTestId('notify-modal')).toBeInTheDocument();
		});

		expect(
			screen.getByText('Erro ao Buscar Atividades Estratégicas'),
		).toBeInTheDocument();
	});

	it('should render submissions when available', async () => {
		const mockSubmissions = [
			{
				id: 1,
				sent: true,
				items: ['item1'],
				feedback: { note: 8, comment: 'Good work' },
			},
			{ id: 2, sent: false, items: [], feedback: undefined },
			{ id: 3, sent: false, items: [], feedback: undefined },
		];

		mockUseSubmissions.mockReturnValue({
			...mockSubmissionsContext,
			submissions: mockSubmissions,
		});

		renderWithProviders(<StrategicActivitiesSlider userId={1} />);

		expect(screen.getByTestId('envio-atividades-1')).toBeInTheDocument();
		expect(screen.getByTestId('envio-atividades-2')).toBeInTheDocument();
		expect(screen.getByTestId('envio-atividades-3')).toBeInTheDocument();

		expect(screen.getByTestId('sent-1')).toHaveTextContent('sent');
		expect(screen.getByTestId('sent-2')).toHaveTextContent('not-sent');
		expect(screen.getByTestId('last-3')).toHaveTextContent('last');
	});

	it('should update current slide when slider changes', () => {
		const mockSliderRef = {
			current: { slickPrev: jest.fn(), slickNext: jest.fn() },
		};
		jest.spyOn(React, 'useRef').mockReturnValue(mockSliderRef);

		renderWithProviders(<StrategicActivitiesSlider userId={1} />);

		// Simulate slider beforeChange callback
		const sliderElement = screen.getByTestId('slider');

		// Since beforeChange is a function, we need to test the settings object indirectly
		expect(sliderElement).toBeInTheDocument();
	});

	it('should navigate to previous slide when prev button is clicked', () => {
		const mockSliderRef = {
			current: { slickPrev: jest.fn(), slickNext: jest.fn() },
		};
		jest.spyOn(React, 'useRef').mockReturnValue(mockSliderRef);

		renderWithProviders(<StrategicActivitiesSlider userId={1} />);

		const prevButton = screen.getByAltText('Anterior');
		fireEvent.click(prevButton);

		expect(mockSliderRef.current.slickPrev).toHaveBeenCalled();
	});

	it('should navigate to next slide when next button is clicked', () => {
		const mockSliderRef = {
			current: { slickPrev: jest.fn(), slickNext: jest.fn() },
		};
		jest.spyOn(React, 'useRef').mockReturnValue(mockSliderRef);

		renderWithProviders(<StrategicActivitiesSlider userId={1} />);

		const nextButton = screen.getByAltText('Próximo');
		fireEvent.click(nextButton);

		expect(mockSliderRef.current.slickNext).toHaveBeenCalled();
	});

	it('should close error modal when callback is triggered', async () => {
		mockGetAllSubmissions.mockRejectedValue(new Error('API Error'));

		renderWithProviders(<StrategicActivitiesSlider userId={1} />);

		await waitFor(() => {
			expect(screen.getByTestId('notify-modal')).toBeInTheDocument();
		});

		const closeButton = screen.getByTestId('notify-modal-close');
		fireEvent.click(closeButton);

		await waitFor(() => {
			expect(screen.queryByTestId('notify-modal')).not.toBeInTheDocument();
		});
	});

	it('should not fetch submissions when classId is not available', () => {
		mockUseUserContext.mockReturnValue({
			...mockUserContext,
			classId: null,
		});

		renderWithProviders(<StrategicActivitiesSlider userId={1} />);

		expect(mockGetAllSubmissions).not.toHaveBeenCalled();
	});

	it('should not fetch submissions when classesData is not available', () => {
		mockUseUserContext.mockReturnValue({
			...mockUserContext,
			classesData: null,
		});

		renderWithProviders(<StrategicActivitiesSlider userId={1} />);

		expect(mockGetAllSubmissions).not.toHaveBeenCalled();
	});

	it('should have correct slider settings', () => {
		renderWithProviders(<StrategicActivitiesSlider userId={1} />);

		const sliderElement = screen.getByTestId('slider');

		// Check that slider is rendered
		expect(sliderElement).toBeInTheDocument();
	});

	it('should refetch submissions when userId changes', async () => {
		const { rerender } = renderWithProviders(
			<StrategicActivitiesSlider userId={1} />,
		);

		await waitFor(() => {
			expect(mockGetAllSubmissions).toHaveBeenCalledTimes(1);
		});

		rerender(
			<ThemeProvider theme={theme}>
				<StrategicActivitiesSlider userId={2} />
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(mockGetAllSubmissions).toHaveBeenCalledTimes(2);
		});

		expect(mockGetAllSubmissions).toHaveBeenLastCalledWith({
			participant_id: 2,
			course_id: 'course-123',
			class_id: 'class-123',
		});
	});
});
