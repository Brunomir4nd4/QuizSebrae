import { render, screen } from '@testing-library/react';
import { Maintenance } from './index';

// Mock das dependências externas
jest.mock('next/image', () => ({
	__esModule: true,
	default: ({
		src,
		alt,
		width,
		height,
	}: {
		src: string;
		alt: string;
		width: string | number;
		height: string | number;
	}) => (
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			data-testid='next-image'
		/>
	),
}));

// Mock dos componentes estilizados
jest.mock('./Maintenance.styles', () => ({
	Section: ({ children }: { children: React.ReactNode }) => (
		<section data-testid='maintenance-section'>{children}</section>
	),
	ImageCover: ({ children }: { children: React.ReactNode }) => (
		<div data-testid='maintenance-image-cover'>{children}</div>
	),
	Content: ({ children }: { children: React.ReactNode }) => (
		<div data-testid='maintenance-content'>{children}</div>
	),
	Label: ({ children }: { children: React.ReactNode }) => (
		<div data-testid='maintenance-label'>{children}</div>
	),
}));

describe('Maintenance Component', () => {
	const defaultProps = {
		banner: '/banner-image.jpg',
		title: 'Manutenção',
		message: 'Sistema em manutenção',
		description: 'Estamos trabalhando para melhorar sua experiência',
	};

	describe('Banner Rendering', () => {
		it('should render banner image when banner prop is provided', () => {
			render(<Maintenance {...defaultProps} />);

			const images = screen.getAllByTestId('next-image');
			const bannerImage = images[0]; // First image is the banner
			expect(bannerImage).toHaveAttribute('src', '/banner-image.jpg');
			expect(bannerImage).toHaveAttribute('alt', 'Background');
			expect(bannerImage).toHaveAttribute('width', '1394');
			expect(bannerImage).toHaveAttribute('height', '1080');
		});

		it('should not render banner image when banner prop is empty', () => {
			render(<Maintenance {...defaultProps} banner='' />);

			const imageCover = screen.getByTestId('maintenance-image-cover');
			expect(imageCover).toBeEmptyDOMElement();
		});

		it('should render banner image inside ImageCover component', () => {
			render(<Maintenance {...defaultProps} />);

			const imageCover = screen.getByTestId('maintenance-image-cover');
			const images = screen.getAllByTestId('next-image');
			const bannerImage = images[0];
			expect(imageCover).toContainElement(bannerImage);
		});
	});

	describe('Label Section', () => {
		it('should render label with construction icon', () => {
			render(<Maintenance {...defaultProps} />);

			const icon = screen.getAllByTestId('next-image')[1]; // Second image is the icon
			expect(icon).toHaveAttribute('src', '/icon-construction.svg');
			expect(icon).toHaveAttribute('alt', '');
			expect(icon).toHaveAttribute('width', '14');
			expect(icon).toHaveAttribute('height', '16');
		});

		it('should render title in label', () => {
			render(<Maintenance {...defaultProps} />);

			const titleElement = screen.getByRole('heading', { level: 3 });
			expect(titleElement).toHaveTextContent('Manutenção');
		});

		it('should render label with icon and title', () => {
			render(<Maintenance {...defaultProps} />);

			const icon = screen.getAllByTestId('next-image')[1];
			const title = screen.getByRole('heading', { level: 3 });

			expect(icon).toHaveAttribute('src', '/icon-construction.svg');
			expect(title).toHaveTextContent('Manutenção');
		});
	});

	describe('Content Section', () => {
		it('should render message as h1 with correct text and classes', () => {
			render(<Maintenance {...defaultProps} />);

			const messageElement = screen.getByRole('heading', { level: 1 });
			expect(messageElement).toHaveTextContent('Sistema em manutenção');
			expect(messageElement).toHaveClass(
				'text-[#070D26]',
				'font-bold',
				'text-5xl',
				'3xl:text-57',
				'leading-[1.1]',
				'mt-[50px]',
				'3xl:mt-[83px]',
			);
		});

		it('should render description as h2 with correct text and classes', () => {
			render(<Maintenance {...defaultProps} />);

			const descriptionElement = screen.getByRole('heading', { level: 2 });
			expect(descriptionElement).toHaveTextContent(
				'Estamos trabalhando para melhorar sua experiência',
			);
			expect(descriptionElement).toHaveClass(
				'text-[#6E707A]',
				'font-light',
				'text-xl',
				'md:text-2xl',
				'mt-[16px]',
				'mb-[38px]',
			);
		});
	});

	describe('Component Structure', () => {
		it('should render all content inside Section component', () => {
			render(<Maintenance {...defaultProps} />);

			const section = screen.getByTestId('maintenance-section');
			const imageCover = screen.getByTestId('maintenance-image-cover');
			const content = screen.getByTestId('maintenance-content');

			expect(section).toContainElement(imageCover);
			expect(section).toContainElement(content);
		});

		it('should render label and main content inside Content component', () => {
			render(<Maintenance {...defaultProps} />);

			const content = screen.getByTestId('maintenance-content');
			const label = screen.getByTestId('maintenance-label');
			const message = screen.getByRole('heading', { level: 1 });
			const description = screen.getByRole('heading', { level: 2 });

			expect(content).toContainElement(label);
			expect(content).toContainElement(message);
			expect(content).toContainElement(description);
		});
	});

	describe('Props Handling', () => {
		it('should render with all props provided', () => {
			render(<Maintenance {...defaultProps} />);

			const images = screen.getAllByTestId('next-image');
			expect(images[0]).toHaveAttribute('src', '/banner-image.jpg'); // Banner image
			expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
				'Manutenção',
			);
			expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
				'Sistema em manutenção',
			);
			expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
				'Estamos trabalhando para melhorar sua experiência',
			);
		});

		it('should render with only banner prop (required)', () => {
			render(<Maintenance banner='/banner.jpg' />);

			const images = screen.getAllByTestId('next-image');
			expect(images[0]).toHaveAttribute('src', '/banner.jpg'); // Banner image
			expect(screen.getByRole('heading', { level: 3 })).toBeEmptyDOMElement();
			expect(screen.getByRole('heading', { level: 1 })).toBeEmptyDOMElement();
			expect(screen.getByRole('heading', { level: 2 })).toBeEmptyDOMElement();
		});

		it('should handle undefined optional props gracefully', () => {
			render(
				<Maintenance
					banner='/banner.jpg'
					title={undefined}
					message={undefined}
					description={undefined}
				/>,
			);

			const images = screen.getAllByTestId('next-image');
			expect(images[0]).toHaveAttribute('src', '/banner.jpg'); // Banner image
			expect(screen.getByRole('heading', { level: 3 })).toBeEmptyDOMElement();
			expect(screen.getByRole('heading', { level: 1 })).toBeEmptyDOMElement();
			expect(screen.getByRole('heading', { level: 2 })).toBeEmptyDOMElement();
		});

		it('should render with custom title', () => {
			render(<Maintenance {...defaultProps} title='Custom Title' />);

			expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
				'Custom Title',
			);
		});

		it('should render with custom message', () => {
			render(<Maintenance {...defaultProps} message='Custom Message' />);

			expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
				'Custom Message',
			);
		});

		it('should render with custom description', () => {
			render(
				<Maintenance {...defaultProps} description='Custom Description' />,
			);

			expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
				'Custom Description',
			);
		});
	});

	describe('Accessibility', () => {
		it('should have proper heading hierarchy', () => {
			render(<Maintenance {...defaultProps} />);

			const h3 = screen.getByRole('heading', { level: 3 });
			const h1 = screen.getByRole('heading', { level: 1 });
			const h2 = screen.getByRole('heading', { level: 2 });

			expect(h3).toBeInTheDocument();
			expect(h1).toBeInTheDocument();
			expect(h2).toBeInTheDocument();
		});
	});
});
