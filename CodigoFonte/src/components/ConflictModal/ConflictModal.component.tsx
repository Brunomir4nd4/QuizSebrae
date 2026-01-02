'use client'
import { FunctionComponent } from 'react'
import type { Props } from './ConflictModal.interface';
import { Divider } from '@mui/material';
import React from 'react';
import { BaseModal } from '../BaseModal';

/**
 * **ConflictModal**
 * 
 * Componente modal de aviso de conflito de horário.
 * Exibe uma mensagem de atenção quando o usuário tenta agendar uma mentoria com menos de 1 hora de antecedência.
 * 
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza modal com BaseModal.
 * - Aviso de antecedência mínima.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ConflictModal
 *   open={true}
 *   onClose={handleClose}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (usa BaseModal).
 *
 * ---
 *
 * @component
 */
export const ConflictModal: FunctionComponent<Props> = ({
    open,
    onClose }) => {

    return (
        <>
            <BaseModal
                open={open}
                onClose={onClose}
                header={
                    <h3 className="text-black-light text-3xl sm:text-32 lg:text-40 font-bold mb-6 sm:text-center">
                        <strong className="font-bold">Atenção</strong>
                    </h3>
                }
            >
                <Divider />
                <div className="text-center mt-6 mb-6">
                    <p
                        className="text-black-light"
                        dangerouslySetInnerHTML={{ __html: 'Escolha um horário com no minímo 1 hora de antecedência.' }}
                    />
                </div>
            </BaseModal>
        </>
    );
};