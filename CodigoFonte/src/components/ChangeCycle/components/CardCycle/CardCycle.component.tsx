'use client';
import { FunctionComponent } from 'react';
import type { Props } from './CardCycle.interface';
import React from 'react';
import NotifyDot from '@/components/NotifyDot';

/**
 * **CardCycle**
 * 
 * Card para seleção de ciclo com três estados visuais distintos.
 * 
 * Usado na interface de seleção de ciclos para permitir navegação
 * entre diferentes períodos do curso.
 * 
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza card com título e número.
 * - Estados: ativo (preto), disponível (branco com hover), desabilitado (cinza).
 * - Suporte a notificação visual (NotifyDot).
 * - ID automático baseado no id.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <CardCycle
 *   title="Ciclo"
 *   numberDay="1"
 *   id="123"
 *   active={false}
 *   disabled={false}
 *   setConsultancyDate={handleSelect}
 *   notify={true}
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
export const CardCycle: FunctionComponent<Props> = ({
	title,
	numberDay,
	id,
	active,
	disabled,
	setConsultancyDate,
	notify = false,
}) => {
	return (
		<>
			{active ? (
				<div className='relative flex flex-col items-center justify-center w-[100%] h-20 md:h-[100px] bg-black rounded-[18px] shadow-sm'>
					<div className='items-center uppercase justify-center text-xs md:text-sm text-[#6E707A]'>
						{title}
					</div>
					<div className='items-center justify-center text-[28px] md:text-32 leading-none text-green-light'>
						{numberDay}
					</div>
					{notify && <NotifyDot />}
				</div>
			) : disabled ? (
				<div className='flex flex-col relative items-center justify-center w-[100%] h-20 md:h-[100px] bg-[#6E707A] border border-[#5E606C] rounded-[18px] shadow-sm pb-[32px]'>
					<div className='items-center uppercase justify-center text-sm text-[#B7B7BD]'>
						{title}
					</div>
					<div className='items-center justify-center text-32 text-[#B7B7BD]'>
						{numberDay}
					</div>
					<div className='text-[10px] md:text-xs text-white uppercase bg-[#575961] py-[4px] md:py-[8px] absolute bottom-0 left-0 w-full text-center rounded-b-[18px]'>
						Indisponível
					</div>
				</div>
			) : (
				<button
					id={`cycle_${id}`}
					onClick={setConsultancyDate}
					className={`relative flex flex-col items-center justify-center w-[100%] h-20 md:h-[100px] rounded-[18px] shadow-sm transition-all border border-transparent bg-white hover:bg-[#00FFA3] hover:border-[#14E48A] text-[#131616]`}>
					<div className='items-center uppercase justify-center text-sm text-[#6E707A]'>
						{title}
					</div>
					<div
						className={`items-center justify-center text-[28px] md:text-32 leading-none`}>
						{numberDay}
					</div>
					{notify && <NotifyDot />}
				</button>
			)}
		</>
	);
};
