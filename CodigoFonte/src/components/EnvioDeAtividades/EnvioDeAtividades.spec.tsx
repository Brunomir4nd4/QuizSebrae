import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EnvioDeAtividades, { FileItem } from './EnvioDeAtividades.component';

// Mock das dependências externas
jest.mock('@mui/material', () => ({
	Grid: ({
		children,
		...props
	}: React.PropsWithChildren<Record<string, unknown>>) => {
		// Filtrar props booleanas para evitar warnings do React
		const filteredProps = Object.fromEntries(
			Object.entries(props).filter(([, value]) => typeof value !== 'boolean'),
		);
		return (
			<div data-testid='grid' {...filteredProps}>
				{children}
			</div>
		);
	},
	IconButton: ({
		children,
		onClick,
		...props
	}: React.PropsWithChildren<
		{ onClick?: () => void } & Record<string, unknown>
	>) => (
		<button data-testid='icon-button' onClick={onClick} {...props}>
			{children}
		</button>
	),
	Rating: ({
		value,
		...props
	}: { value?: number } & Record<string, unknown>) => (
		<div data-testid='rating' data-value={value} {...props}>
			Rating: {value}
		</div>
	),
	Tooltip: ({
		children,
		title,
	}: React.PropsWithChildren<{ title?: string }>) => (
		<div data-testid='tooltip' title={title}>
			{children}
		</div>
	),
}));

jest.mock('@mui/icons-material', () => ({
	Visibility: () => <div data-testid='visibility-icon'>👁️</div>,
}));

jest.mock('react-slick', () => {
	return {
		__esModule: true,
		default: (props: React.PropsWithChildren<Record<string, unknown>>) => (
			<div data-testid='slider'>{props.children}</div>
		),
	};
});

jest.mock('./components/Upload.component', () => ({
	__esModule: true,
	default: ({
		submissionId,
		islastSubmition,
	}: {
		submissionId?: string;
		islastSubmition?: boolean;
	}) => (
		<div
			data-testid='file-upload'
			data-submission-id={submissionId}
			data-is-last={islastSubmition}>
			File Upload Component
		</div>
	),
}));

jest.mock('../CarouselModal', () => ({
	CarouselModal: ({
		children,
		open,
		onClose,
		width,
	}: React.PropsWithChildren<{
		open?: boolean;
		onClose?: () => void;
		width?: string | number;
	}>) =>
		open ? (
			<div data-testid='carousel-modal' data-width={width} onClick={onClose}>
				<button data-testid='close-modal' onClick={onClose}>
					Close
				</button>
				{children}
			</div>
		) : null,
}));

jest.mock('./components/ArrowsButton.styles', () => ({
	NextButton: ({
		children,
	}: React.PropsWithChildren<Record<string, unknown>>) => (
		<div data-testid='next-button'>{children}</div>
	),
	PrevButton: ({
		children,
	}: React.PropsWithChildren<Record<string, unknown>>) => (
		<div data-testid='prev-button'>{children}</div>
	),
}));

jest.mock('@/utils/renderFile', () => ({
	renderFile: (file: FileItem) => (
		<div data-testid='rendered-file'>{file.name}</div>
	),
	renderFileThumbnail: (file: FileItem) => (
		<div data-testid='file-thumbnail'>{file.name}</div>
	),
}));

describe('EnvioDeAtividades', () => {
	const mockProps = {
		id: 1,
		islastSubmition: false,
		sent: false,
		feedback: undefined,
		items: undefined,
	};

	const mockItems: FileItem[] = [
		{
			id: '1',
			name: 'document.pdf',
			type: 'application/pdf',
			url: 'https://example.com/document.pdf',
		},
		{
			id: '2',
			name: 'image.jpg',
			type: 'image/jpeg',
			url: 'https://example.com/image.jpg',
		},
	];

	const mockFeedback = {
		note: 4,
		comment: 'Ótimo trabalho!',
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		it('should render FileUpload component when sent is false', () => {
			render(<EnvioDeAtividades {...mockProps} />);

			expect(screen.getByTestId('file-upload')).toBeInTheDocument();
			expect(screen.getByText('File Upload Component')).toBeInTheDocument();
		});

		it('should render activity sent message when sent is true without feedback', () => {
			const sentProps = { ...mockProps, sent: true };
			render(<EnvioDeAtividades {...sentProps} />);

			expect(screen.getByText('Atividade enviada')).toBeInTheDocument();
			expect(screen.getByText('com sucesso')).toBeInTheDocument();
			expect(screen.queryByTestId('file-upload')).not.toBeInTheDocument();
		});

		it('should render activity evaluated message when sent is true with feedback', () => {
			const sentProps = { ...mockProps, sent: true, feedback: mockFeedback };
			render(<EnvioDeAtividades {...sentProps} />);

			expect(screen.getByText('Atividade')).toBeInTheDocument();
			expect(screen.getByText('realizada')).toBeInTheDocument();
			expect(
				screen.getByText((content) =>
					content.toLowerCase().includes('avaliada pelo facilitador'),
				),
			).toBeInTheDocument();
		});

		it('should render files section when items are provided', () => {
			const sentProps = { ...mockProps, sent: true, items: mockItems };
			render(<EnvioDeAtividades {...sentProps} />);

			expect(screen.getByText('Seus arquivos enviados')).toBeInTheDocument();
			expect(screen.getByText('2')).toBeInTheDocument(); // file count
			expect(screen.getAllByTestId('file-thumbnail')).toHaveLength(2);
		});

		it('should render alternative message when no items are provided', () => {
			const sentProps = { ...mockProps, sent: true, items: [] };
			render(<EnvioDeAtividades {...sentProps} />);

			expect(
				screen.getByText('Atividade recebida em outro canal.'),
			).toBeInTheDocument();
		});

		it('should render feedback section when feedback is provided', () => {
			const sentProps = {
				...mockProps,
				sent: true,
				feedback: mockFeedback,
				items: mockItems,
			};
			render(<EnvioDeAtividades {...sentProps} />);

			expect(
				screen.getByText((content) => content.includes('Avaliação')),
			).toBeInTheDocument();
			expect(screen.getByTestId('rating')).toHaveAttribute('data-value', '4');
			expect(screen.getByText('Comentário:')).toBeInTheDocument();
			expect(screen.getByText('Ótimo trabalho!')).toBeInTheDocument();
		});

		it('should render evaluation in progress when sent but no feedback', () => {
			const sentProps = { ...mockProps, sent: true, items: mockItems };
			render(<EnvioDeAtividades {...sentProps} />);

			expect(
				screen.getByText((content) =>
					content.includes('Avaliação em andamento'),
				),
			).toBeInTheDocument();
			expect(
				screen.getByText((content) =>
					content.toLowerCase().includes('em breve'),
				),
			).toBeInTheDocument();
			expect(
				screen.getByText((content) =>
					content.toLowerCase().includes('retorno do facilitador'),
				),
			).toBeInTheDocument();
			expect(
				screen.getByText((content) =>
					content.toLowerCase().includes('parabéns pela participação ativa'),
				),
			).toBeInTheDocument();
		});
	});

	describe('Interactions', () => {
		it('should open modal when file thumbnail is clicked', () => {
			const sentProps = { ...mockProps, sent: true, items: mockItems };
			render(<EnvioDeAtividades {...sentProps} />);

			const iconButtons = screen.getAllByTestId('icon-button');
			fireEvent.click(iconButtons[0]); // Click first file thumbnail

			expect(screen.getByTestId('carousel-modal')).toBeInTheDocument();
			expect(screen.getByTestId('slider')).toBeInTheDocument();
		});

		it('should close modal when close button is clicked', () => {
			const sentProps = { ...mockProps, sent: true, items: mockItems };
			render(<EnvioDeAtividades {...sentProps} />);

			// Open modal
			const iconButtons = screen.getAllByTestId('icon-button');
			fireEvent.click(iconButtons[0]);

			expect(screen.getByTestId('carousel-modal')).toBeInTheDocument();

			// Close modal
			fireEvent.click(screen.getByTestId('close-modal'));

			expect(screen.queryByTestId('carousel-modal')).not.toBeInTheDocument();
		});

		it('should render correct number of files in carousel', () => {
			const sentProps = { ...mockProps, sent: true, items: mockItems };
			render(<EnvioDeAtividades {...sentProps} />);

			// Open modal
			const iconButtons = screen.getAllByTestId('icon-button');
			fireEvent.click(iconButtons[0]);

			const renderedFiles = screen.getAllByTestId('rendered-file');
			expect(renderedFiles).toHaveLength(2);
			expect(renderedFiles[0]).toHaveTextContent('document.pdf');
			expect(renderedFiles[1]).toHaveTextContent('image.jpg');
		});
	});

	describe('Props handling', () => {
		it('should pass correct props to FileUpload component', () => {
			const uploadProps = { ...mockProps, id: 123, islastSubmition: true };
			render(<EnvioDeAtividades {...uploadProps} />);

			const fileUpload = screen.getByTestId('file-upload');
			expect(fileUpload).toHaveAttribute('data-submission-id', '123');
			expect(fileUpload).toHaveAttribute('data-is-last', 'true');
		});

		it('should handle different feedback ratings', () => {
			const feedbacks = [
				{ note: 1, comment: 'Needs improvement' },
				{ note: 3, comment: 'Good work' },
				{ note: 5, comment: 'Excellent!' },
			];

			feedbacks.forEach((feedback) => {
				const { rerender } = render(
					<EnvioDeAtividades
						{...mockProps}
						sent={true}
						feedback={feedback}
						items={mockItems}
					/>,
				);

				expect(screen.getByTestId('rating')).toHaveAttribute(
					'data-value',
					feedback.note.toString(),
				);
				expect(screen.getByText(feedback.comment)).toBeInTheDocument();

				rerender(<></>); // Clean up for next iteration
			});
		});

		it('should handle empty items array', () => {
			const sentProps = { ...mockProps, sent: true, items: [] };
			render(<EnvioDeAtividades {...sentProps} />);

			expect(
				screen.getByText('Atividade recebida em outro canal.'),
			).toBeInTheDocument();
			expect(screen.queryByTestId('file-thumbnail')).not.toBeInTheDocument();
		});

		it('should handle single item', () => {
			const singleItem = [mockItems[0]];
			const sentProps = { ...mockProps, sent: true, items: singleItem };
			render(<EnvioDeAtividades {...sentProps} />);

			expect(screen.getByText('1')).toBeInTheDocument(); // file count
			expect(screen.getAllByTestId('file-thumbnail')).toHaveLength(1);
		});
	});

	describe('Accessibility', () => {
		it('should have proper tooltip for expand button', () => {
			const sentProps = { ...mockProps, sent: true, items: mockItems };
			render(<EnvioDeAtividades {...sentProps} />);

			const tooltips = screen.getAllByTestId('tooltip');
			expect(tooltips[0]).toHaveAttribute('title', 'Expandir');
		});

		it('should render visibility icon in tooltips', () => {
			const sentProps = { ...mockProps, sent: true, items: mockItems };
			render(<EnvioDeAtividades {...sentProps} />);

			const visibilityIcons = screen.getAllByTestId('visibility-icon');
			expect(visibilityIcons).toHaveLength(2); // one for each file
		});
	});

	describe('Template do facilitador (quando atividade não foi enviada)', () => {
		it('should render template section when template prop is provided', () => {
			render(
				<EnvioDeAtividades
					id={1}
					islastSubmition={false}
					sent={false}
					template={{ file_path: 'templates/template-atividade.pdf' }}
				/>,
			);

			expect(
				screen.getByRole('heading', {
					name: /material da atividade/i,
				}),
			).toBeInTheDocument();

			expect(
				screen.getByText((content) =>
					content.includes('Para começar, faça o download do material'),
				),
			).toBeInTheDocument();

			expect(screen.getByText('Template das atividades')).toBeInTheDocument();
		});

		it('should render correct download link for template', () => {
			const filePath = 'templates/template-atividade.pdf';

			render(
				<EnvioDeAtividades
					id={1}
					islastSubmition={false}
					sent={false}
					template={{ file_path: filePath }}
				/>,
			);

			const link = screen.getByRole('link');

			expect(link).toHaveAttribute(
				'href',
				`${process.env.NEXT_PUBLIC_SUBMISSIONS_STORAGE_URL}/${filePath}`,
			);

			expect(link).toHaveAttribute('target', '_blank');
		});

		it('should NOT render template section when template prop is not provided', () => {
			render(<EnvioDeAtividades id={1} islastSubmition={false} sent={false} />);

			expect(
				screen.queryByText('Template das atividades'),
			).not.toBeInTheDocument();
		});
	});
});
