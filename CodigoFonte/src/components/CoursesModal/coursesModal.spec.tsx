/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { CoursesModal } from '@/components/CoursesModal';
import type { Props } from './CoursesModal.interface';
import { Session } from 'next-auth';
import { WPImage } from '@/types/IWordpress';
import { useUserContext } from '@/app/providers/UserProvider';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
    })),
    usePathname: jest.fn(() => '/home'),
}));

jest.mock('@/app/providers/UserProvider', () => ({
    useUserContext: jest.fn(),
}));


const mockWPImage: WPImage = {
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
};
const mockSidebar = {
    cycle_id: 1,
    course_id: 101,
    class_id: 151673,
    class_name: '2024',
    class_slug: '2024',
    cycle_name: '44',
    cycle_slug: '44',
    course_name: 'Matematica',
    course_slug: 'matematica',
    logo: mockWPImage,
    logo_b: mockWPImage,
};
const mockSession: Session = {
    user: {
        user_display_name: 'João Silva',
        user_email: 'joao@example.com',
        user_nicename: 'João',
        role: ['admin'],
        token: 'mock_token_12345',
        user_first_name: 'João',
        user_last_name: 'Silva',
        cpf: '99999999999',
        id: 1
    },
    expires: ''
};
const mockProps: Props = {
    open: true,
    onClose: jest.fn(),
    session: mockSession,
    sidebar: [mockSidebar],
}

const mockClassId = '151673';
const mockClassesData = {
    [mockClassId]: { 
        name: 'Matematica', 
        teacher: 'João Silva',
        courses: {
            evaluate_course: 'https://example.com/evaluate',
            links_and_materials: [{
                    icon: "https://localhost:8082/wp-content/uploads/2024/04/git-repository-line.svg",
                    link: "http://localhost:8082/respositorioDelas",
                    title: "Biblioteca",
            }]
        },
        turno: { 
            value: 'diurno' 
        },
    },
};

function setUserContext(classesData: any, classId: any) {
    (useUserContext as jest.Mock).mockReturnValue({
        classesData: classesData,
        classId: classId,
        setClassId: jest.fn(),
        setClassesData: jest.fn(),
        setCoursesShowed: jest.fn(),
        setCourseLoading: jest.fn(),
        changeCourse: jest.fn(),
    });
}

describe('CoursesModal Component', () => {
    it('should render the modal correctly', () => {
        setUserContext(mockClassesData, mockClassId);
        render(<CoursesModal {...mockProps} />);
        
        const imgs = screen.getAllByRole('presentation');
        const logo = imgs.find(img => {
            const imgSrc = img.getAttribute('src');
            const decodedImgSrc = decodeURIComponent(imgSrc?.split('=')[1]?.split('&')[0] || '');
            
            return decodedImgSrc === mockWPImage.url;
        });
        const cardCheck = imgs.find(img => img.getAttribute('src') === '/icon-check-green.svg');
        const cardText = imgs.find(img => img.getAttribute('src') === '/card-dot.svg');

        mockProps.sidebar.forEach(sidebar => {
            expect(screen.getByText(sidebar.course_name)).toBeInTheDocument();
        });

        expect(logo).toBeInTheDocument();
        expect(cardCheck).toBeInTheDocument();
        expect(cardText).toBeInTheDocument();

    });

    it('should render the roleTitle based on specific paths', () => {
        const pathPageTitle = ["/agendar", "/participacao"];

        pathPageTitle.forEach(path => {
            (usePathname as jest.Mock).mockReturnValue(`${path}`);
            setUserContext(mockClassesData, mockClassId);
            render(<CoursesModal {...mockProps} />);
        });
    });

    it("classesData and classId as null", () => {
        const mockPropsNull = {
            ...mockProps,
            sidebar: []
        };
        setUserContext(null, null);
        render(<CoursesModal {...mockPropsNull} />);

        expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
    });

    it("classesData without turma_id property", () => {
        const updatedMockSidebar = {
            ...mockSidebar,
            class_id: 0
        };

        const updatedMockProps = {
            ...mockProps,
            sidebar: [updatedMockSidebar]
        }

        setUserContext({}, mockClassId);
        render(<CoursesModal {...updatedMockProps} />);
    });

    it("course_id in localStorage", () => {
        const localStorageMock = (() => {
            let store: any = {};
        
            return {
            getItem: jest.fn((key) => store[key] || null),
            setItem: jest.fn((key, value) => {
                store[key] = value.toString();
            }),
            removeItem: jest.fn((key) => {
                delete store[key];
            }),
            clear: jest.fn(() => {
                store = {};
            }),
            };
        })();
        
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
        });

        setUserContext(mockClassesData, mockClassId);
        localStorageMock.setItem('course_id',mockSidebar.course_id); 

        render(<CoursesModal {...mockProps} />);
    });

    it('should call changeCourse and close the modal', async () => {
        setUserContext(mockClassesData, mockClassId);
        const mockChangeCourse = jest.fn();
        render(<CoursesModal {...{...mockProps, onClose: mockChangeCourse, open: true} } />);
    
        const button = screen.getByRole('button', { name: /entrar/i });
    
        fireEvent.click(button);
    
        expect(mockChangeCourse).toHaveBeenCalled();
    
        expect(screen.queryByText(/escolha um curso/i)).not.toBeInTheDocument();
    });
});
