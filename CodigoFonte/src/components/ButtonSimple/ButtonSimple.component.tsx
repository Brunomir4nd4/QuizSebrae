'use client';
import { FunctionComponent } from 'react';
import type { Props } from './ButtonSimple.interface';
import React from 'react';
import { StyledButton } from './ButtonSimple.styles';
import Link from 'next/link';
import NotifyDot from '../NotifyDot';

/**
 * **ButtonSimple**
 * 
 * Botão simples de navegação com ícone e texto, renderizado como um link usando Next.js Link.
 * 
 * Ideal para criar menus de navegação ou cartões clicáveis que redirecionam para outras páginas.
 * O ícone é exibido acima do texto, e opcionalmente pode mostrar um ponto de notificação
 * para indicar novos conteúdos ou alertas.
 * 
 * O componente gera automaticamente um 'id' único no formato `home_link_{index}`,
 * útil para rastreamento e analytics.
 * 
 * Suporta abertura em nova aba (_blank) ou na mesma aba (_self).
 * 
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza Link do Next.js com ícone e texto.
 * - Suporte a notificação visual (NotifyDot).
 * - ID automático baseado no index.
 * - Target configurável (_self ou _blank).
 * - Callback onClick opcional.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ButtonSimple
 *   icon="/icon-home.svg"
 *   text="Página Inicial"
 *   href="/home"
 *   target="_self"
 *   index={1}
 *   notify={true}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: ButtonSimple.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const ButtonSimple: FunctionComponent<Props> = ({
	icon,
	text,
	href,
	target = '_self',
	index,
	onClick,
	notify,
}) => {
	return (
		<Link
			href={href || ''}
			target={target}
			onClick={onClick}
			id={`home_link_${index}`}>
			<StyledButton>
				<div className='relative'>
					<img src={icon} alt={text} />
					<p className='text-lg 3xl:text-22 text-black'>{text}</p>
					{notify && <NotifyDot />}
				</div>
			</StyledButton>
		</Link>
	);
};
