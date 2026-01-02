import { render, fireEvent, screen } from '@testing-library/react';
import type { Props } from './ButtonIcon.interface';
import { ButtonIcon } from '@/components/ButtonIcon';
import { StyledButton } from './ButtonIcon.styles';

const mockProps: Props = {
    icon: "https://example.com/icon.png",
    text: "Click me",
    onClick: jest.fn(),
    disabled: false,
};

describe("ButtonIcon component", () => {
    it("renders the button with the correct text and icon", () => {
        render(<ButtonIcon {...mockProps} />);

        const button = screen.getByRole("button", { name: `${mockProps.text} ${mockProps.text}` });
        const icon = screen.getByRole("img", { name: mockProps.text });

        expect(button).toBeInTheDocument();
        expect(icon).toHaveAttribute("src", mockProps.icon);
    });

    it("calls onClick when button is clicked", () => {
        render(<ButtonIcon {...mockProps} />);

        const button = screen.getByRole("button", { name: `${mockProps.text} ${mockProps.text}` });
        fireEvent.click(button);

        expect(mockProps.onClick).toHaveBeenCalledTimes(1);
    });

    it("disables the button when disabled is true", () => {
        render(<ButtonIcon {...{ ...mockProps, disabled: true }} />);

        const button = screen.getByRole("button", { name: `${mockProps.text} ${mockProps.text}` });
        expect(button).toBeDisabled();
    });

    it("render styledButton", () => {
        render(<StyledButton className='group' onClick={mockProps.onClick} disabled={mockProps.disabled} />);

        const button = screen.getByRole("button", { name: "" });
        expect(button).toBeInTheDocument();
    });
});