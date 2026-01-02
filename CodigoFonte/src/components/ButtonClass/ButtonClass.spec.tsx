import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonClass } from '@/components/ButtonClass';

describe('ButtonClass Component', () => {
  const onClickMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the text passed via props', () => {
    render(<ButtonClass text="Clique aqui" onClick={() => {}} />);
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('triggers the onClick function when clicking the button', () => {
    render(<ButtonClass text="Botão" onClick={onClickMock} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
