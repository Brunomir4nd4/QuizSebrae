'use client'
import { FunctionComponent } from 'react'
import type { Props } from './CardWeekDay.interface';
import React from 'react';
import { getDateObject } from '@/hooks';

/**
 * **CardWeekDay**
 *
 * Exibe um card de seleção de dias disponíveis para agendamento de consultorias.
 * Mostra o nome do dia da semana, número do dia e mês, com variações de estilo para ativo, desabilitado ou disponível.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza card com dia da semana, número e mês.
 * - Estados: ativo (preto com verde), disponível (branco com hover), desabilitado (cinza).
 * - Responsivo: ajusta tamanhos em mobile.
 * - Callback para selecionar data.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <CardWeekDay
 *   availableDate="2023-10-01"
 *   active={false}
 *   disabled={false}
 *   setConsultancyDate={setDate}
 *   isDrawerView={false}
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
export const CardWeekDay: FunctionComponent<Props> = ({availableDate, active, disabled, setConsultancyDate, isDrawerView}) => {
  if (!availableDate) {
    return <></>;
  }

  const { dayName, dayNumber, mounthName } = getDateObject(availableDate);

  return (
    <>
      {active ? (
        <div className="flex flex-col items-center justify-center w-[120px] md:w-[100%] h-[100px] bg-black rounded-[18px] shadow-sm">
          <div className="items-center uppercase justify-center text-xs md:text-sm text-[#6E707A]">
            {dayName}
          </div>
          <div className="items-center justify-center text-[28px] md:text-32 leading-none text-green-light">
            {dayNumber}
          </div>
          <div className="items-center justify-center text-[12px] md:text-14 leading-none text-green-light uppercase">
            {mounthName}
          </div>
        </div>
      ) : disabled ? (
        <div className="flex flex-col relative items-center justify-center w-[120px] md:w-[100%] h-[100px] bg-[#6E707A] border border-[#5E606C] rounded-[18px] shadow-sm pb-[32px]">
          <div className="items-center uppercase justify-center text-sm text-[#B7B7BD]">
            {dayName}
          </div>
          <div className="items-center justify-center text-32 text-[#B7B7BD]">
            {dayNumber}
          </div>
          <div className="text-[10px] md:text-xs text-white uppercase bg-[#575961] py-[4px] md:py-[8px] absolute bottom-0 left-0 w-full text-center rounded-b-[18px]">
            Indisponível
          </div>
        </div>
      ) : (
        <button
          onClick={() => setConsultancyDate(availableDate)}
          className={`flex flex-col items-center justify-center w-[120px] md:w-[100%] h-[100px] bg-white rounded-[18px] shadow-sm transition-all border border-transparent  hover:border-[#14E48A] ${isDrawerView ? 'hover:bg-opacity-50' : 'hover:bg-[#00FFA3]'}`}
        >
          <div className="items-center uppercase justify-center text-sm text-[#6E707A]">
            {dayName}
          </div>
          <div className="items-center justify-center text-[28px] md:text-32 leading-none text-[#131616]">
            {dayNumber}
          </div>
          <div className="items-center justify-center text-[12px] md:text-14 leading-none text-[#131616] uppercase">
            {mounthName}
          </div>
        </button>
      )}
    </>
  );
};