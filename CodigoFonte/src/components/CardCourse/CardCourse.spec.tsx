import { render, screen, fireEvent } from '@testing-library/react';
import { CardCourse } from '@/components/CardCourse';
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img {...props} />;
  },
}));
describe('CardCourse Component', () => {
  const onClickMock = jest.fn();

  const defaultProps = {
    title: 'Curso Teste',
    text: 'Descrição do curso',
    onClick: onClickMock,
    image: '/imagem-curso.png',
    width: 180,
    height: 80,
    active: false,
    classId: 42,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

   it('renders title, text and image', () => {
    render(<CardCourse {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(defaultProps.text, 'i'))).toBeInTheDocument();

    const imgs = screen.getAllByRole('presentation');
    const img = imgs[0];
    expect(img).toHaveAttribute('src', expect.stringContaining(defaultProps.image));
  });

  it('triggers onClick when clicked', () => {
    render(<CardCourse {...defaultProps} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('has the correct id on the button', () => {
    render(<CardCourse {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('id', `course_${defaultProps.classId}`);
  });

  it('adds active class when active prop is true', () => {
    render(<CardCourse {...defaultProps} active={true} />);
    const button = screen.getByRole('button');
    const styledCard = button.firstElementChild;
    expect(styledCard).toHaveClass('active');
  });
});
