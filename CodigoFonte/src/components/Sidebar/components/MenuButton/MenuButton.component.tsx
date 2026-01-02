'use client'
import Link from 'next/link';
import * as React from 'react';
import type { Props } from './MenuButton.interface';
import type { FunctionComponent } from 'react';
import { Button } from './MenuButton.styles';

/**
 * **MenuButton**
 *
 * ### 🧩 Funcionalidade
 * - Botão estilizado para navegação lateral.
 * - Customiza destino e target.
 * - Aceita children React.
 * - Integra Next.js Link.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <MenuButton href="/home" target="_self">
 *   <span>Home</span>
 * </MenuButton>
 * ```
 *
 * ### 🎨 Estilização
 * - Button styled.
 * - Link interno.
 *
 * @component
 */
export const MenuButton: FunctionComponent<Props> = ({children, href, target}) => {

    return (
        <Button>
            <Link href={href} target={target || '_self'}>
                {children}
            </Link>
        </Button>
    );
};