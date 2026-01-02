'use client'
import { FunctionComponent } from 'react'
import type { Props } from './CardTime.interface';
import React from 'react';

/**
 * **CardTime**
 *
 * Exibe um card interativo para seleção de horários disponíveis em agendamentos individuais ou em grupo.
 * Mostra o horário, status (ativo, disponível, indisponível), variante de cor e, se aplicável, vagas restantes para grupos.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza card com ícone de relógio ou check/like.
 * - Estados: ativo (verde), disponível (branco com hover), indisponível (cinza).
 * - Suporte a grupos: mostra contador de vagas.
 * - Scroll automático ao selecionar horário.
 * - Variantes de cor (default ou black).
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <CardTime
 *   id="10:00"
 *   time="10:00"
 *   active={false}
 *   available={true}
 *   setStartTime={setTime}
 *   group={3}
 *   is_group_meetings_enabled={true}
 *   variant="default"
 *   groupLimit={5}
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
export const CardTime: FunctionComponent<Props> = ({id, time, active, available, setStartTime, group, is_group_meetings_enabled, variant = 'default', groupLimit = 5}) => {

    const scrollToDivDestino = () => {
        const divDestino = document.getElementById('divDestino');
        if (divDestino) {
          divDestino.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleClickDiv = () => {
        setStartTime(time);
        scrollToDivDestino();
    };

    const groupCount = typeof group === 'number' ? groupLimit - group : null
    const isAvailable = is_group_meetings_enabled ? available && ( groupCount && groupCount > 0 ) : available
      
    return (
        <>
            <div className='border-[#1EFF9D]'></div>
            {active ? (
                <div className={`relative w-full text-left shadow-lg rounded-[10px] bg-gradient-to-r ${variant === 'black' ? 'from-[#000] to-[#222325]' : 'from-[#00FFA3] to-green-light'} p-[20px] md:p-[25px] flex gap-3 items-center border border-[#14E48A]`}>
                    <div className={`min-w-[40px] h-[40px] md:min-w-[45px] md:h-[45px] border border-${variant === 'black' ? '[#1EFF9D]' : 'black-light'} rounded-[7px] flex items-center justify-center`}>
                        <img src={variant === 'black' ? "/icon-like-green.svg" : "/icon-like.svg"} alt="" />
                    </div>
                    <div>
                        {variant === 'black' ? 
                            <>
                                <p className={`text-xl md:text-2xl leading-none text-[#1EFF9D] font-bold`}>{time}h</p>
                                <p className={`text-sm md:text-base text-[#1EFF9D]`}>Seu horário</p>
                            </>
                        : 
                            <>
                                <p className={`text-xl md:text-2xl leading-none text-black-light font-bold`}>{time}h</p>
                                <p className={`text-sm md:text-base text-black-light`}>Seu horário</p>
                            </>
                        }
                    </div>
                    {groupCount ? <div className="absolute right-0 top-0 m-[8px_15px] text-[#1EFF9D] p-0 bg-[#222325] rounded-full w-6 h-6 text-center flex justify-center items-center">{groupCount}</div> : <></>}
                </div>
            ) : isAvailable ? (
                <button className={`relative w-full text-left shadow-lg rounded-[10px] bg-[#FFF] p-[20px] md:p-[25px] flex gap-3 items-center transition-all border border-transparent group hover:border-[#14E48A] ${variant === 'black' ? 'hover:bg-opacity-50' : 'hover:bg-[#00FFA3]'}`}
                onClick={handleClickDiv}>
                    <div className="min-w-[40px] h-[40px] md:min-w-[45px] md:h-[45px] border-dashed border border-black-light rounded-[7px] flex items-center justify-center">
                        <img src="/icon-clock.svg" alt="" />
                    </div>
                    <div>
                        <p className="text-xl md:text-2xl leading-none text-black-light font-bold">{time}h</p>
                        <p className="text-sm md:text-base text-black-light">Disponível</p>
                    </div>
                    {groupCount ? <div className="absolute right-0 top-0 m-[8px_15px] p-0 group-hover:bg-[#222325] group-hover:text-[#1EFF9D] bg-[#00FFA3] rounded-full w-6 h-6 text-center flex justify-center items-center">{groupCount}</div> : <></>}
                </button>
            ) : (
                <div className="w-full text-left shadow-lg rounded-[10px] bg-[#6E707A] p-[20px] md:p-[25px] flex gap-3 items-center">
                    <div className="min-w-[40px] h-[40px] md:min-w-[45px] md:h-[45px] border border-[#B7B7BD] rounded-[7px] flex items-center justify-center">
                        <img src="/icon-blocked.svg" alt="" />
                    </div>
                    <div>
                        <p className="text-xl md:text-2xl leading-none text-[#B7B7BD] font-bold">{time}h</p>
                        <p className="text-sm md:text-base text-[#B7B7BD]">Indisponível</p>
                    </div>
                </div>
            )}
        </>
        
    );
};