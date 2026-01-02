'use client'
import { FunctionComponent } from 'react'
import type { Props } from './ConfirmModal.interface';
import React from 'react';
import { ModalInfo } from './ConfirmModal.styles';
import { BaseModal } from '../BaseModal';

/**
 * **ConfirmModal**
 * 
 * Componente modal de confirmação de agendamento de mentoria.
 * Exibe uma mensagem de sucesso após o agendamento ser realizado, mostrando a data e horário confirmados.
 * 
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza modal com BaseModal.
 * - Exibe data, dia e horário confirmados.
 * - Aviso de pontualidade e não remarcação.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ConfirmModal
 *   open={true}
 *   onClose={handleClose}
 *   week="Segunda"
 *   start="10h"
 *   number={15}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: ConfirmModal.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const ConfirmModal: FunctionComponent<Props> = ({
    open,
    onClose,
    week,
    start,
    number }) => {
    return (
        <>
            <BaseModal
                open={open}
                onClose={onClose}
                header={
                    <h3 className="text-black-light text-3xl md:text-40 font-bold">Mentoria <span className="font-thin">confirmada</span></h3>
                }
            >
                <ModalInfo className="gap-3">
                    <div className='flex flex-col items-center justify-center min-w-[100px] h-[100px] bg-[#000] rounded-[10px] shadow-sm'>
                        <div className="items-center uppercase justify-center text-sm text-[#909192]">
                            {week}
                        </div>
                        <div className="items-center justify-center text-32 text-green-light">
                            {number}
                        </div>
                    </div>

                    <div className="w-[100%] rounded-[10px] bg-[#000] p-[20px] flex gap-3 items-center">
                        <div className="min-w-[45px] h-[45px] border border-green-light rounded-[7px] flex items-center justify-center">
                            <img src="/icon-like-green.svg" alt="" />
                        </div>
                        <div>
                            <p className="text-base sm:text-xl md:text-2xl text-green-light font-bold">{start}h</p>
                            <p className="text-sm md:text-base text-green-light">Seu horário</p>
                        </div>
                    </div>
                </ModalInfo>
                <div className="text-center mt-6 mb-6">
                    <p className="text-sm md:text-base text-black-light">
                        <strong>Atenção</strong> para comparecer no horário agendado.
                        <br />Não será possível remarcar.
                        <br />
                        <br /><strong>Contamos com a sua consideração.</strong>
                    </p>
                </div>
            </BaseModal>
        </>
    );
};