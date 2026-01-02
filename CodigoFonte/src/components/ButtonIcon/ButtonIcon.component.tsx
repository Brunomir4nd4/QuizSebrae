'use client';
import { FunctionComponent } from 'react';
import type { Props } from './ButtonIcon.interface';
import React from 'react';
import { StyledButton } from './ButtonIcon.styles';

/**
 * **ButtonIcon**
 * 
 * Botão estilizado com ícone e texto, utilizado para ações principais da interface.
 * 
 * Possui suporte a diferentes tamanhos (padrão ou 'large' para largura completa),
 * estados desabilitados, efeitos de hover customizados e adaptação responsiva para mobile.
 * 
 * O ícone é posicionado à direita do texto e pode ter seu tamanho customizado.
 * Em dispositivos móveis (quando mobile=true), o ícone é ocultado e o botão ocupa 100% da largura.
 * 
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza botão com texto e ícone à direita.
 * - Suporte a tamanhos 'large' (largura total) ou padrão.
 * - Estados desabilitados e hover customizáveis.
 * - Responsivo: oculta ícone em mobile se mobile=true.
 * - Bordas de hover opcionais.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ButtonIcon
 *   icon="/icon-arrow.svg"
 *   text="Continuar"
 *   onClick={handleClick}
 *   size="large"
 *   disabled={false}
 *   mobile={true}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: ButtonIcon.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const ButtonIcon: FunctionComponent<Props> = ({
	icon,
	text,
	onClick,
	disabled,
	size,
	iconSize,
	hoverBorder,
	mobile
}) => {
	return (
		<StyledButton
			className='group'
			onClick={onClick}
			disabled={disabled}
			sx={{
				...mobile && {
					'@media (max-width: 768px)': {
						width: "100% !important",
						paddingTop: ".7rem",
						paddingLeft: ".5rem",
						paddingRight: ".5rem",
						paddingBottom: ".7rem",
					}
				},

				width: size === 'large' ? '100%' : 'auto',

				justifyContent: size === 'large' ? 'flex-end' : 'center',
				...hoverBorder ? {
					'&:hover': {
						border: "1px solid black",
						transition: "border 0s"
					},
				} : undefined,
				div: {
					width: iconSize ? iconSize : size === 'large' ? '50px' : '60px',
					height: iconSize ? iconSize : size === 'large' ? '50px' : '60px',
					...mobile && {
						'@media (max-width: 768px)': {
							display: 'none',
						}
					},
				},
			}}>
			<p className='text-lg text-green-light font-bold group-hover:text-black-light'>
				{text}
			</p>
			<div>
				<img src={icon} alt={text} />
			</div>
		</StyledButton>
	);
};
