'use client';
import { FunctionComponent } from 'react';
import type { Props } from './ButtonClass.interface';
import React from 'react';
import { StyledButton } from './ButtonClass.styles';
import NotifyDot from '../NotifyDot';

/**
 * **ButtonClass**
 * 
 * Botão específico para navegação e acesso a turmas (classes) no sistema.
 * 
 * Exibe o nome da turma com um ícone de seta animada à direita.
 * Ao passar o mouse, o texto muda de cor e a seta se move ligeiramente.
 * Opcionalmente, pode exibir um ponto de notificação no canto superior esquerdo
 * para indicar novidades ou alertas relacionados à turma.
 * 
 * O atributo 'id' do botão é gerado automaticamente no formato `class_{classId}`,
 * facilitando a identificação e testes automatizados.
 * 
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza botão estilizado com texto e ícone animado.
 * - Suporte a notificação visual (NotifyDot).
 * - ID automático baseado no classId para testes.
 * - Efeitos de hover para mudança de cor e movimento da seta.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ButtonClass
 *   text="Turma A"
 *   classId="123"
 *   onClick={handleClick}
 *   notify={true}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: ButtonClass.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const ButtonClass: FunctionComponent<Props> = ({
	text,
	classId,
	onClick,
	notify = false,
}) => {
	return (
		<StyledButton
			id={`class_${classId}`}
			className='group relative'
			onClick={onClick}>
			<span className='text-xl 3xl:text-2xl text-black-light group-hover:text-green-light'>
				{text}
			</span>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='20'
				height='10'
				viewBox='0 0 20 10'
				fill='none'>
				<path
					d='M15.25 1.25L19 5M19 5L15.25 8.75M19 5H1'
					stroke='#222325'
					strokeWidth='1.5'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</svg>
			{notify && <NotifyDot position='top-left-lg' />}
		</StyledButton>
	);
};
