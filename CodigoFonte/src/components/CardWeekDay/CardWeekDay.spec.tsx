import { render, screen, fireEvent } from '@testing-library/react';
import { CardWeekDay } from '@/components/CardWeekDay';

describe('CardWeekDay Component', () => {
  const mockSetConsultancyDate = jest.fn();

  const defaultProps = {
    availableDate: '2025-08-12',
    setConsultancyDate: mockSetConsultancyDate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when active', () => {
    render(<CardWeekDay {...defaultProps} active={true} />);

    expect(screen.getByText(/ter\./i)).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();

    const container = screen.getByText('12').closest('div.flex');
    expect(container).toHaveClass('bg-black');
  });

  it('renders correctly when disabled', () => {
    render(<CardWeekDay {...defaultProps} disabled={true} />);

    expect(screen.getByText(/ter\./i)).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText(/Indisponível/i)).toBeInTheDocument();

    const container = screen.getByText('12').closest('div.flex');
    expect(container).toHaveClass('bg-[#6E707A]');
  });

  it('calls setConsultancyDate when clicking the button', () => {
    render(<CardWeekDay {...defaultProps} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockSetConsultancyDate).toHaveBeenCalledWith(defaultProps.availableDate);
  });

  it('applies correct hover class when isDrawerView=true', () => {
    render(<CardWeekDay {...defaultProps} isDrawerView={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-opacity-50');
  });

  it('applies correct hover class when isDrawerView=false', () => {
    render(<CardWeekDay {...defaultProps} isDrawerView={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-[#00FFA3]');
  });

  it('renders nothing if availableDate is empty', () => {
    const { container } = render(<CardWeekDay availableDate="" setConsultancyDate={mockSetConsultancyDate} />);
    expect(container.firstChild).toBeNull();
  });
});
