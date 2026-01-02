import { render, screen } from '@testing-library/react';
import type { Props } from './ButtonSimple.interface';
import { ButtonSimple } from '@/components/ButtonSimple';

describe("ButtonSimple Component", () => {
    const mockProps: Props = {
        icon: "mock-icon",       
        text: "Mock Text",
        href: "https://example.com",
        index: 1
    }

    it("renders the button without target", () => {
        render(<ButtonSimple {...{ ...mockProps }} />);
        
        const linkElement = screen.getByRole("link");
        expect(linkElement).toHaveAttribute("target", "_self");
    });

    it("renders with default target '_self' when target is not provided", () => {
        render(<ButtonSimple {...{ ...mockProps, target: undefined }} />);
        
        const linkElement = screen.getByRole("link");
        expect(linkElement).toHaveAttribute("target", "_self");
    });

    it("renders without an icon when icon is not provided", () => {
        render(<ButtonSimple {...{ ...mockProps, icon: undefined }} />);
        
        const imageElement = screen.queryByAltText(mockProps.text);
        expect(imageElement).not.toHaveAttribute("src");
    });

    it("renders with the correct ID for indexing", () => {
        render(<ButtonSimple {...mockProps} />);
        
        const linkElement = screen.getByRole("link");
        expect(linkElement).toHaveAttribute("id", `home_link_${mockProps.index}`);
    });
});