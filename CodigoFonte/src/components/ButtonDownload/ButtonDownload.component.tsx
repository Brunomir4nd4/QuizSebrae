'use client';
import { FunctionComponent } from 'react';
import type { Props } from './ButtonDownload.interface';
import React from 'react';

/**
 * **ButtonDownload**
 *
 * Botão estilizado para download de arquivos, exibindo ícone e texto.
 * Usado para ações de download em tabelas ou listas, com efeitos de hover.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza botão com ícone amarelo e texto.
 * - Efeitos de hover para mudança de fundo e cor do texto.
 * - Callback onClick para executar o download.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ButtonDownload
 *   icon="/icon-download.svg"
 *   text="Baixar Arquivo"
 *   onClick={handleDownload}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (estilos inline no componente).
 *
 * ---
 *
 * @component
 */
export const ButtonDownload: FunctionComponent<Props> = ({
	icon,
	text,
	onClick,
}) => {
	return (
		<button className='group' onClick={onClick}>
			<div className='flex items-center gap-2 p-[6px] pr-4 bg-transparent rounded-[40px] hover:bg-[#222325] hover:text-[#1EFF9D] transition-all'>
				<div className='w-[32px] min-w-[32px] h-[32px] rounded-full bg-[#EBD406] flex items-center justify-center pl-[1px] pb-[1px]'>
					<img src={icon} alt={text} width={18} />
				</div>
				<span className='text-xs font-bold'>{text}</span>
			</div>
		</button>
	);
};
