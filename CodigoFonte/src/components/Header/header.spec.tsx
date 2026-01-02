import { render, screen } from '@testing-library/react';
import { Header } from '@/components/Header';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(() => '/home'),
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
    })),
}));

const mockProps = {
    title: 'Teste do Componente',
    highlight: 'Destaque',
    cap: 'Capítulo 1',
    session: {
        user: {
            user_display_name: 'João L Silva',
            user_email: 'joao@example.com',
            user_nicename: 'João',
            role: [],
            token: 'mock_token_12345',
            user_first_name: 'João',
            user_last_name: 'Silva',
            cpf: '99999999999',
            id: 1,
        },
        expires: '',
    },
};

describe('Header Component', () => {
    it('should render the roleTitle and username correctly', () => {
        render(<Header {...mockProps} />);
        expect(screen.getByText(mockProps.cap)).toBeInTheDocument();
        expect(screen.getByText(/Participante/i)).toBeInTheDocument();
        expect(screen.getByText(`${mockProps.session.user.user_first_name} ${mockProps.session.user.user_last_name}`)).toBeInTheDocument();
    });

    it('should render the user_display_name if user_first_name is null or empty', () => {
        const props = { 
            ...mockProps, 
            session: {
                ...mockProps.session,
                user: { ...mockProps?.session?.user, user_first_name: "" },
            }
        };

        render(<Header {...props} />);
        expect(screen.getByText(`${mockProps.session.user.user_display_name}`)).toBeInTheDocument();
    });

    it('should render the avatar image correctly in md:hidden class', () => {
        const { container } = render(<Header {...mockProps} />);
        const avatarDiv = container.getElementsByClassName('md:hidden');
        const avatarImg = avatarDiv[0].querySelector('img');
        
        expect(avatarImg).toBeInTheDocument();
        expect(avatarImg).toHaveAttribute('src', '/icon-user-green.svg');
    });

    it('should render the avatar image correctly in md:flex class', () => {
        const { container } = render(<Header {...mockProps} />);
        const avatarDiv = container.getElementsByClassName('md:flex');
        const avatarImg = avatarDiv[0].querySelector('img');

        expect(avatarImg).toBeInTheDocument();
        expect(avatarImg).toHaveAttribute('src', '/icon-user-green.svg');
    });

    it('should render "Supervisor" as roleTitle if user role is not admin', () => {
        const props = { 
            ...mockProps, 
            session: {
                ...mockProps.session,
                user: { ...mockProps?.session?.user, role: ['supervisor'] },
            }
        };

        render(<Header {...props} />);

        expect(screen.getByText('Supervisor')).toBeInTheDocument();
    });

    it('should render "Facilitador" if user is a facilitator', () => {
        const props = { 
            ...mockProps, 
            session: {
                ...mockProps.session,
                user: { ...mockProps?.session?.user, role: ['facilitator'] },
            }
        };

        render(<Header {...props} />);

        expect(screen.getByText('Facilitador')).toBeInTheDocument();
    });

    it('should render nothing if session is not provided', () => {
        const props = { ...mockProps, session: undefined };

        render(<Header {...props} />);
        expect(screen.queryByText(/Participante/i)).not.toBeInTheDocument();
    });
    
    it('should render the roleTitle based on specific paths', () => {
        const pathPageTitle = ["/agendar", "/participacao"];

        pathPageTitle.forEach(path => {
            (usePathname as jest.Mock).mockReturnValue(`${path}`);
            render(<Header {...mockProps} />);
            expect(screen.getByText(/Agendar/i)).toBeInTheDocument();
        });
    });

    it('should render nothing if path includes restricted values', () => {
        const restrictedPaths = ['/saladereuniao', '/consultoria', '/grupo'];
        
        restrictedPaths.forEach((path) => {
            (usePathname as jest.Mock).mockReturnValue(path);
            render(<Header {...mockProps} />);
            expect(screen.queryByText(/Participante/i)).not.toBeInTheDocument();
        });
    });
});
