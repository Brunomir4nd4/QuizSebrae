import { render, screen, fireEvent } from '@testing-library/react';
import { BaseModal } from '@/components/BaseModal';
import '@testing-library/jest-dom';

describe('BaseModal Component', () => {
  const onCloseMock = jest.fn();

  const renderModal = (props = {}) =>
    render(
      <BaseModal
        open={true}
        onClose={onCloseMock}
        {...props}
      >
        <div>Conteúdo do modal</div>
      </BaseModal>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders content when open is true', () => {
    renderModal();
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument();
  });

  it('renders the header when provided', () => {
    renderModal({ header: <div>Header Teste</div> });
    expect(screen.getByText('Header Teste')).toBeInTheDocument();
  });

  it('renders the footer when provided', () => {
    renderModal({ footer: <div>Footer Teste</div> });
    expect(screen.getByText('Footer Teste')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    renderModal();
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('does not render anything when open is false', () => {
    render(
      <BaseModal open={false} onClose={onCloseMock}>
        <div>Conteúdo oculto</div>
      </BaseModal>
    );
    expect(screen.queryByText('Conteúdo oculto')).not.toBeInTheDocument();
  });
});
