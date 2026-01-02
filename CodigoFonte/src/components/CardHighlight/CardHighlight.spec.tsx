import { render, screen } from '@testing-library/react';
import { CardHighlight } from '@/components/CardHighlight';

describe('CardHighlight Component', () => {
  const defaultProps = {
    title: 'Curso Destaque',
    text: 'Descrição destaque',
    href: '/pagina-destaque',
    image: '/imagem-destaque.png',
    turno: 'diurno' as const,
  };

  it('renders title with time according to shift', () => {
    render(<CardHighlight {...defaultProps} />);
    // título com horário esperado para 'diurno' => '10h'
    expect(screen.getByText(/Curso Destaque 10h/i)).toBeInTheDocument();
  });

  it('renders text correctly', () => {
    render(<CardHighlight {...defaultProps} />);
    expect(screen.getByText(new RegExp(defaultProps.text, 'i'))).toBeInTheDocument();
  });

  it('renders images with presentation role', () => {
    render(<CardHighlight {...defaultProps} />);
    // Busca todas as imagens decorativas (alt="")
    const imgs = screen.getAllByRole('presentation');
    expect(imgs.length).toBeGreaterThanOrEqual(2); // pelo menos as duas imagens
  });

  it('link has correct href', () => {
    render(<CardHighlight {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', defaultProps.href);
  });
});