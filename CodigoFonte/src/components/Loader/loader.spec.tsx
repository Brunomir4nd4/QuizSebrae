import { render, screen } from '@testing-library/react';
import { Loader, LoaderOverlay } from '@/components/Loader';

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(() => ({
		push: jest.fn(),
		pathname: '/',
		query: {},
		asPath: '/',
	})),
}));

describe('Loader Component', () => {
	it('renders correctly with page data', () => {
		render(<Loader />);

		expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
	});

	it('renders with correct button attributes', () => {
		render(<Loader />);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('type', 'button');
		expect(button).toBeDisabled();
	});

	it('renders SVG spinner', () => {
		const { container } = render(<Loader />);

		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveClass('animate-spin');
	});
});

describe('LoaderOverlay Component', () => {
	it('renders LoaderOverlay with overlay', () => {
		render(<LoaderOverlay />);

		expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
	});
});
