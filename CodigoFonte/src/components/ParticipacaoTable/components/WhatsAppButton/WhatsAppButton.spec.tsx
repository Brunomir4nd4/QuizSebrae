import { render, screen } from '@testing-library/react';
import { WhatsAppButton } from './WhatsAppButton.component';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

describe('WhatsAppButton', () => {
    const phone = '11999999999';
    const message = 'Oi Aluno 1! Mensagem';

    it('should render correct link with href and tooltip', () => {
        render(
            <ThemeProvider theme={theme}>
                <WhatsAppButton phone={phone} whatsAppMessage={message} />
            </ThemeProvider>
        );

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute(
            'href',
            expect.stringContaining(`https://api.whatsapp.com/send?phone=${phone}&text=${message}`)
        );
        expect(link).toHaveAttribute('target', '_blank');
    });
});
