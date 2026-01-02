import { render, screen, fireEvent } from '@testing-library/react';
import UploadButton from './UploadButton.component';

// Mock das dependências externas
jest.mock('@/constants/fileTypes', () => ({
	allowedSubmitionTypes: ['image/jpeg', 'image/png', 'application/pdf'],
}));

jest.mock('next/image', () => ({
	__esModule: true,
	default: ({
		src,
		alt,
		width,
		height,
		className,
	}: {
		src: string;
		alt: string;
		width: number;
		height: number;
		className?: string;
	}) => (
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={className}
			data-testid='next-image'
		/>
	),
}));

describe('UploadButton Component', () => {
	const mockAction = jest.fn();
	const defaultProps = {
		action: mockAction,
		items: [],
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Initial Rendering', () => {
		it('should render upload button with correct initial text', () => {
			render(<UploadButton {...defaultProps} />);

			expect(screen.getByText('Escolher arquivo(s)')).toBeInTheDocument();
		});

		it('should render file input with correct attributes', () => {
			render(<UploadButton {...defaultProps} />);

			const input = document.querySelector(
				'input[type="file"]',
			) as HTMLInputElement;
			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute('type', 'file');
			expect(input).toHaveAttribute('multiple');
			expect(input).toHaveAttribute(
				'accept',
				'image/jpeg,image/png,application/pdf',
			);
		});

		it('should render upload icon', () => {
			render(<UploadButton {...defaultProps} />);

			const icon = screen.getByTestId('next-image');
			expect(icon).toHaveAttribute('src', './icon-upload.svg');
			expect(icon).toHaveAttribute('alt', '');
			expect(icon).toHaveAttribute('width', '36');
			expect(icon).toHaveAttribute('height', '36');
		});

		it('should render button with correct styling classes', () => {
			render(<UploadButton {...defaultProps} />);

			const button = screen.getByRole('button');
			expect(button).toHaveClass(
				'w-[390px]',
				'!bg-white',
				'!text-[#222325]',
				'px-10',
				'py-5',
				'rounded-full',
				'shadow-md',
				'text-lg',
				'text-left',
				'relative',
			);
		});
	});

	describe('File Selection Text', () => {
		it('should show singular text when one file is selected', () => {
			const items = [
				{
					id: '1',
					name: 'file1.pdf',
					type: 'application/pdf',
					url: 'url1',
					file: new File([''], 'file1.pdf'),
				},
			];
			render(<UploadButton {...defaultProps} items={items} />);

			expect(screen.getByText('1 arquivos selecionados')).toBeInTheDocument();
		});

		it('should show plural text when multiple files are selected', () => {
			const items = [
				{
					id: '1',
					name: 'file1.pdf',
					type: 'application/pdf',
					url: 'url1',
					file: new File([''], 'file1.pdf'),
				},
				{
					id: '2',
					name: 'file2.jpg',
					type: 'image/jpeg',
					url: 'url2',
					file: new File([''], 'file2.jpg'),
				},
				{
					id: '3',
					name: 'file3.png',
					type: 'image/png',
					url: 'url3',
					file: new File([''], 'file3.png'),
				},
			];
			render(<UploadButton {...defaultProps} items={items} />);

			expect(screen.getByText('3 arquivos selecionados')).toBeInTheDocument();
		});

		it('should show initial text when items array is empty', () => {
			render(<UploadButton {...defaultProps} items={[]} />);

			expect(screen.getByText('Escolher arquivo(s)')).toBeInTheDocument();
		});
	});

	describe('File Input Interaction', () => {
		it('should call action prop when files are selected', () => {
			render(<UploadButton {...defaultProps} />);

			const input = document.querySelector(
				'input[type="file"]',
			) as HTMLInputElement;
			const files = [
				new File(['content1'], 'file1.pdf', { type: 'application/pdf' }),
				new File(['content2'], 'file2.jpg', { type: 'image/jpeg' }),
			];

			fireEvent.change(input, { target: { files } });

			expect(mockAction).toHaveBeenCalledTimes(1);
			expect(mockAction).toHaveBeenCalledWith(expect.any(Object));
		});

		it('should accept multiple file selection', () => {
			render(<UploadButton {...defaultProps} />);

			const input = document.querySelector(
				'input[type="file"]',
			) as HTMLInputElement;
			expect(input).toHaveAttribute('multiple');
		});

		it('should have correct accept attribute with allowed file types', () => {
			render(<UploadButton {...defaultProps} />);

			const input = document.querySelector(
				'input[type="file"]',
			) as HTMLInputElement;
			expect(input).toHaveAttribute(
				'accept',
				'image/jpeg,image/png,application/pdf',
			);
		});
	});

	describe('Accessibility', () => {
		it('should have proper cursor pointer styling', () => {
			render(<UploadButton {...defaultProps} />);

			const input = document.querySelector(
				'input[type="file"]',
			) as HTMLInputElement;
			expect(input).toHaveClass('cursor-pointer');
		});

		it('should have proper opacity and positioning for overlay', () => {
			render(<UploadButton {...defaultProps} />);

			const input = document.querySelector(
				'input[type="file"]',
			) as HTMLInputElement;
			expect(input).toHaveClass(
				'absolute',
				'inset-0',
				'w-full',
				'h-full',
				'opacity-0',
				'cursor-pointer',
				'z-10',
			);
		});
	});

	describe('Visual Elements', () => {
		it('should render button with correct background and text colors', () => {
			render(<UploadButton {...defaultProps} />);

			const button = screen.getByRole('button');
			expect(button).toHaveClass('!bg-white', '!text-[#222325]');
		});

		it('should render icon container with correct styling', () => {
			render(<UploadButton {...defaultProps} />);

			// The span containing the icon should have specific classes
			const button = screen.getByRole('button');
			const iconContainer = button.querySelector('span');
			expect(iconContainer).toHaveClass(
				'bg-[#222325]',
				'absolute',
				'top-0',
				'right-0',
				'rounded-tr-full',
				'rounded-br-full',
				'h-[100%]',
				'w-[80px]',
				'flex',
				'items-center',
				'justify-center',
			);
		});

		it('should have hover effect on icon', () => {
			render(<UploadButton {...defaultProps} />);

			const icon = screen.getByTestId('next-image');
			expect(icon).toHaveClass('group-hover:scale-110', 'transition-all');
		});
	});
});
