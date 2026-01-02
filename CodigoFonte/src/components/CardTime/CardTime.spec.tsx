import { render, screen, fireEvent } from '@testing-library/react';
import { CardTime } from '@/components/CardTime';

describe('CardTime Component', () => {
  const mockSetStartTime = jest.fn();

  const defaultProps = {
    id: 'test-1',
    time: '10',
    active: false,
    available: true,
    setStartTime: mockSetStartTime,
    is_group_meetings_enabled: false,
    variant: 'default' as const,
    group: null,
    groupLimit: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Element.prototype.scrollIntoView = jest.fn();
    const divDestino = document.createElement('div');
    divDestino.id = 'divDestino';
    document.body.appendChild(divDestino);
  });

  afterEach(() => {
    const divDestino = document.getElementById('divDestino');
    if (divDestino) divDestino.remove();
  });

  it('renders available button correctly', () => {
    render(<CardTime {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText(/10h/i)).toBeInTheDocument();
    expect(screen.getByText(/Disponível/i)).toBeInTheDocument();
  });

  it('calls setStartTime and scrollIntoView when the button is clicked', () => {
    render(<CardTime {...defaultProps} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockSetStartTime).toHaveBeenCalledWith('10');
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('renders unavailable div when available=false', () => {
    render(<CardTime {...defaultProps} available={false} />);
    expect(screen.getByText(/Indisponível/i)).toBeInTheDocument();
  });

  it('displays group counter when is_group_meetings_enabled=true and group is present', () => {
    render(<CardTime {...defaultProps} is_group_meetings_enabled={true} group={2} groupLimit={5} />);
    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
  });

  it('does not display group counter when groupCount <= 0', () => {
    render(<CardTime {...defaultProps} is_group_meetings_enabled={true} group={5} groupLimit={5} />);
    const badge = screen.queryByText('0');
    expect(badge).not.toBeInTheDocument();
  });
});
