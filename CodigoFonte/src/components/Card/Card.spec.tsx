import { render, screen } from '@testing-library/react';
import { Card } from '@/components/Card';
import '@testing-library/jest-dom';

describe('Card Component', () => {
    const props = {
        title: 'Título do Card',
        text: 'Texto do Card',
        href: '/pagina-teste',
        image: '/imagem-teste.png',
        target: '_blank',
    };

    it('renders title, text, and image correctly', () => {
        render(<Card {...props} />);
        expect(screen.getByText(props.title)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(props.text, 'i'))).toBeInTheDocument();

        const images = screen.getAllByRole('presentation');
        expect(images[0]).toHaveAttribute('src', props.image);
    });

    it('link has correct href and target', () => {
        render(<Card {...props} />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', props.href);
        expect(link).toHaveAttribute('target', props.target);
    });

    it('link without optional target', () => {
        const { href, ...rest } = props;
        render(<Card href={href} title={rest.title} text={rest.text} image={rest.image} />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', href);
        expect(link).not.toHaveAttribute('target');
    });
});
