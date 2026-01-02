'use client'
import { FunctionComponent } from 'react'
import type { Props } from './CloseButton.interface';

/**
 * **CloseButton**
 *
 * ### 🧩 Funcionalidade
 * - Botão para remoção de participante, com ícone de X.
 * - Dispara ação de remoção ao clicar.
 * - Estilizado como botão circular.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <CloseButton removeParticipant={() => handleRemove(id)} />
 * ```
 *
 * ### 🎨 Estilização
 * - SVG inline para ícone de fechamento.
 * - Cursor pointer, tamanho 16x16.
 * - Stroke branco.
 *
 * @component
 */
export const CloseButton: FunctionComponent<Props> = ({removeParticipant}) => {

  return (
    <button className='cursor-pointer w-16 h-16 flex flex-row items-center justify-center' onClick={removeParticipant} >
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2003.org/2000/svg">
        <path d="M25.5 8.5L8.5 25.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.5 8.5L25.5 25.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  );
};