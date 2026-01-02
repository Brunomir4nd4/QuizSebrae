import { render, screen } from '@testing-library/react';
import { MenuButton } from './index';
import type { Props } from './MenuButton.interface';

describe('MenuButton Component', () => {
	const mockProps: Props = {
		children: 'Link to Google',
		href: 'https://www.google.com',
		target: '_blank',
	};

	it('render the roleTitle, username and target as _blank', () => {
		render(<MenuButton {...mockProps} />);

		expect(screen.getByText('Link to Google')).toBeInTheDocument();

		const linkElement = screen.getByRole('link');
		expect(linkElement).toHaveAttribute('href', mockProps.href);
		expect(linkElement).toHaveAttribute('target', mockProps.target);
	});

	it('render the roleTitle and username and target as _self', () => {
		render(<MenuButton {...{ ...mockProps, target: '_self' }} />);

		expect(screen.getByText(mockProps.children as string)).toBeInTheDocument();

		const linkElement = screen.getByRole('link');
		expect(linkElement).toHaveAttribute('href', mockProps.href);
		expect(linkElement).toHaveAttribute('target', '_self');
	});

	it('render the roleTitle and username and target is not provided', () => {
		render(<MenuButton {...{ ...mockProps, target: undefined }} />);
		expect(screen.getByRole('link')).toHaveAttribute('target', '_self');
	});
});
