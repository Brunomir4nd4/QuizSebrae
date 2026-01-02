import React from 'react';
import { render } from '@testing-library/react';
import NotifyDot from './index';

describe('NotifyDot', () => {
	it('renders the component with default position', () => {
		const { container } = render(<NotifyDot />);

		const notifyDot = container.querySelector('span');
		expect(notifyDot).toBeInTheDocument();
		expect(notifyDot).toHaveClass(
			'absolute',
			'inline-flex',
			'size-2',
			'md:size-3',
			'rounded-full',
			'bg-gradient-to-br',
			'from-pink-dark',
			'to-pink-light',
			'shadow-md',
			'top-2',
			'right-2',
		);
	});

	it('renders with position top-right-sm', () => {
		const { container } = render(<NotifyDot position='top-right-sm' />);

		const notifyDot = container.querySelector('span');
		expect(notifyDot).toHaveClass('top-2', 'right-2');
	});

	it('renders with position top-left-sm', () => {
		const { container } = render(<NotifyDot position='top-left-sm' />);

		const notifyDot = container.querySelector('span');
		expect(notifyDot).toHaveClass('top-2', 'left-2');
	});

	it('renders with position top-right-lg', () => {
		const { container } = render(<NotifyDot position='top-right-lg' />);

		const notifyDot = container.querySelector('span');
		expect(notifyDot).toHaveClass('top-4', 'right-4');
	});

	it('renders with position top-left-lg', () => {
		const { container } = render(<NotifyDot position='top-left-lg' />);

		const notifyDot = container.querySelector('span');
		expect(notifyDot).toHaveClass('top-4', 'left-4');
	});
});
