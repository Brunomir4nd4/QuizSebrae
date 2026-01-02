import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '@/components/Login';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(() => ({
		push: jest.fn(),
		pathname: '/',
		query: {},
		asPath: '/',
	})),
}));

jest.mock('next-auth/react', () => ({
	signIn: jest.fn(),
}));

describe('Login Component', () => {
	const mockPageData = {
		course_id: 20046,
		logo: {
			ID: 23418,
			id: 23418,
			title: 'MP-white',
			filename: 'MP-white.svg',
			filesize: 0,
			url: 'http://localhost:8082/wp-content/uploads/2024/04/MP-white.svg',
			link: 'http://localhost:8082/curso/marcadelas/mp-white/',
			alt: '',
			author: '2',
			description: '',
			caption: '',
			name: 'mp-white',
			status: 'inherit',
			uploaded_to: 20046,
			date: '2024-05-10 07:09:25',
			modified: '2024-05-10 07:09:25',
			menu_order: 0,
			mime_type: 'image/svg+xml',
			type: 'image',
			subtype: 'svg+xml',
			icon: 'http://localhost:8082/wp-includes/images/media/default.png',
			width: 117,
			height: 88,
			sizes: {
				thumbnail:
					'http://localhost:8082/wp-content/uploads/2024/04/MP-white.svg',
				'thumbnail-width': 150,
				'thumbnail-height': 113,
				medium: 'http://localhost:8082/wp-content/uploads/2024/04/MP-white.svg',
				'medium-width': 300,
				'medium-height': 226,
				medium_large:
					'http://localhost:8082/wp-content/uploads/2024/04/MP-white.svg',
				'medium_large-width': 768,
				'medium_large-height': 577,
				large: 'http://localhost:8082/wp-content/uploads/2024/04/MP-white.svg',
				'large-width': 1024,
				'large-height': 770,
				'1536x1536':
					'http://localhost:8082/wp-content/uploads/2024/04/MP-white.svg',
				'1536x1536-width': 117,
				'1536x1536-height': 88,
				'2048x2048':
					'http://localhost:8082/wp-content/uploads/2024/04/MP-white.svg',
				'2048x2048-width': 117,
				'2048x2048-height': 88,
			},
		},
		banner: {
			ID: 23421,
			id: 23421,
			title: 'marca',
			filename: 'marca.webp',
			filesize: 133556,
			url: 'http://localhost:8082/wp-content/uploads/2024/04/marca.webp',
			link: 'http://localhost:8082/curso/marcadelas/marca/',
			alt: '',
			author: '2',
			description: '',
			caption: '',
			name: 'marca',
			status: 'inherit',
			uploaded_to: 20046,
			date: '2024-05-10 07:26:40',
			modified: '2024-05-10 07:26:40',
			menu_order: 0,
			mime_type: 'image/webp',
			type: 'image',
			subtype: 'webp',
			icon: 'http://localhost:8082/wp-includes/images/media/default.png',
			width: 1080,
			height: 1080,
			sizes: {
				thumbnail:
					'http://localhost:8082/wp-content/uploads/2024/04/marca-150x150.webp',
				'thumbnail-width': 150,
				'thumbnail-height': 150,
				medium:
					'http://localhost:8082/wp-content/uploads/2024/04/marca-300x300.webp',
				'medium-width': 300,
				'medium-height': 300,
				medium_large:
					'http://localhost:8082/wp-content/uploads/2024/04/marca-768x768.webp',
				'medium_large-width': 768,
				'medium_large-height': 768,
				large:
					'http://localhost:8082/wp-content/uploads/2024/04/marca-1024x1024.webp',
				'large-width': 1024,
				'large-height': 1024,
				'1536x1536':
					'http://localhost:8082/wp-content/uploads/2024/04/marca.webp',
				'1536x1536-width': 1080,
				'1536x1536-height': 1080,
				'2048x2048':
					'http://localhost:8082/wp-content/uploads/2024/04/marca.webp',
				'2048x2048-width': 1080,
				'2048x2048-height': 1080,
			},
		},
		title: 'Marca Pessoal Poderosa',
		excerpt: '',
		slug: 'marcadelas',
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('renders correctly with page data', () => {
		render(
			<Login pageData={mockPageData} userType='participante' host={null} />,
		);

		expect(screen.getByText(/Digite seu CPF/i)).toBeInTheDocument();
	});

	test('renders title for participante user type', () => {
		render(
			<Login pageData={mockPageData} userType='participante' host={null} />,
		);

		expect(
			screen.getByText(/Ingresse no Marca Pessoal Poderosa/i),
		).toBeInTheDocument();
	});

	test('renders title for supervisor user type', () => {
		render(<Login pageData={mockPageData} userType='supervisor' host={null} />);

		expect(screen.getByText(/Boas-vindas, supervisor!/i)).toBeInTheDocument();
	});

	test('renders title for facilitador user type', () => {
		render(
			<Login pageData={mockPageData} userType='facilitador' host={null} />,
		);

		expect(screen.getByText(/Boas-vindas, facilitador!/i)).toBeInTheDocument();
	});

	test('renders default title when no title provided', () => {
		const dataWithoutTitle = { ...mockPageData, title: undefined };
		render(
			<Login pageData={dataWithoutTitle} userType='participante' host={null} />,
		);

		expect(screen.getByText(/Ingresse no Seu Curso/i)).toBeInTheDocument();
	});

	test('formats CPF input correctly', () => {
		render(
			<Login pageData={mockPageData} userType='participante' host={null} />,
		);

		const input = screen.getByPlaceholderText(
			'000.000.000-00',
		) as HTMLInputElement;
		fireEvent.change(input, { target: { value: '12345678900' } });

		expect(input.value).toBe('123.456.789-00');
	});

	test('shows error message on failed login', async () => {
		(signIn as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });

		render(
			<Login pageData={mockPageData} userType='participante' host={null} />,
		);

		const input = screen.getByPlaceholderText('000.000.000-00');
		const submitButton = screen.getByText('Entrar');

		fireEvent.change(input, { target: { value: '12345678900' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText(/Usuário ou senha incorretos/i),
			).toBeInTheDocument();
		});
	});

	test('redirects to home on successful login', async () => {
		const mockPush = jest.fn();
		const mockRouterInstance = {
			push: mockPush,
			back: jest.fn(),
			forward: jest.fn(),
			refresh: jest.fn(),
			replace: jest.fn(),
			prefetch: jest.fn(),
		};
		(useRouter as jest.MockedFunction<typeof useRouter>).mockReturnValue(
			mockRouterInstance,
		);

		(signIn as jest.Mock).mockResolvedValue({ error: null });

		render(
			<Login pageData={mockPageData} userType='participante' host={null} />,
		);

		const input = screen.getByPlaceholderText('000.000.000-00');
		const submitButton = screen.getByText('Entrar');

		fireEvent.change(input, { target: { value: '12345678900' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith('/home');
		});
	});

	test('removes participant mode for supervisor login', async () => {
		const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
		(signIn as jest.Mock).mockResolvedValue({ error: null });

		render(<Login pageData={mockPageData} userType='supervisor' host={null} />);

		const input = screen.getByPlaceholderText('000.000.000-00');
		const submitButton = screen.getByText('Entrar');

		fireEvent.change(input, { target: { value: '12345678900' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(removeItemSpy).toHaveBeenCalledWith('isParticipantMode');
		});

		removeItemSpy.mockRestore();
	});
});
