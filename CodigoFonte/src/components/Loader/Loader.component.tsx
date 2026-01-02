'use client';

import * as React from 'react';
import ReactDOM from 'react-dom';

/**
 * **Loader**
 *
 * ### 🧩 Funcionalidade
 * - Botão de carregamento fixo no canto inferior direito.
 * - Indica operação em andamento.
 * - Spinner animado para feedback visual.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <Loader />
 * ```
 *
 * ### 🎨 Estilização
 * - Posição fixed, z-index alto.
 * - Spinner SVG animado.
 * - Cores verde e cinza.
 *
 * @component
 */

/**
 * **LoaderOverlay**
 *
 * ### 🧩 Funcionalidade
 * - Overlay de carregamento cobrindo toda tela.
 * - Bloqueia interações durante operações.
 * - Usa portal para renderizar sobre o body.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <LoaderOverlay />
 * ```
 *
 * ### 🎨 Estilização
 * - Fundo escuro semi-transparente.
 * - Centraliza Loader.
 * - Pointer-events none para bloquear cliques.
 *
 * @component
 */
export const Loader: React.FunctionComponent = () => {
	return (
		<button
			type='button'
			className='fixed bottom-5 right-5 inline-flex items-center px-4 py-2 font-semibold leading-6 text-xl shadow rounded-md text-[#1c1d23] bg-[#1eff9d] hover:bg-[#1eff9d] transition ease-in-out duration-150 cursor-not-allowed z-[9999]'
			disabled>
			<svg
				className='animate-spin -ml-1 mr-3 h-5 w-5 text-[#1c1d23]'
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'>
				<circle
					className='opacity-25'
					cx='12'
					cy='12'
					r='10'
					stroke='currentColor'
					strokeWidth='4'></circle>
				<path
					className='opacity-75'
					fill='currentColor'
					d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
			</svg>
			Carregando...
		</button>
	);
};

/**
 * LoaderOverlay exibe um overlay de carregamento cobrindo toda a tela, bloqueando interações enquanto uma operação está em andamento.
 * Utiliza portal para renderizar o Loader centralizado sobre um fundo escurecido.
 */
export const LoaderOverlay: React.FunctionComponent = () => {
	if (typeof window === 'undefined') return null;

	return ReactDOM.createPortal(
		<div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 pointer-events-auto'>
			{Loader({})}
		</div>,
		document.body,
	);
};
