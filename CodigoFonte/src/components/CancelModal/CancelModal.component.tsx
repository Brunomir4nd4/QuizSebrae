'use client'
import { FunctionComponent } from 'react'
import type { Props } from './CancelModal.interface';
import { Box, Divider } from '@mui/material';
import React from 'react';
import { ModalButton } from './CancelModal.styles';
import { deleteBookingById } from "@/app/services/bff/ScheduleService";
import { useScheduleContext } from '@/app/providers/ScheduleProvider';
import { BaseModal } from '../BaseModal';

/**
 * **CancelModal**
 * 
 * Modal de confirmação para cancelamento de mentorias individuais ou agendamentos.
 * 
 * Exibe um aviso destacado alertando que a ação não pode ser desfeita e lembra o usuário
 * de avisar o participante sobre o cancelamento. Suporta cancelamento de um ou múltiplos
 * agendamentos simultaneamente.
 * 
 * Após a confirmação, os agendamentos são removidos do sistema e do contexto de schedule,
 * atualizando automaticamente a interface.
 * 
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza modal com BaseModal.
 * - Suporte a cancelamento único ou múltiplo.
 * - Remove agendamentos do contexto após confirmação.
 * - Aviso de ação irreversível.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <CancelModal
 *   open={true}
 *   onClose={handleClose}
 *   booking_id="123"
 *   mainModalClose={closeMainModal}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: CancelModal.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const CancelModal: FunctionComponent<Props> = ({
  open,
  onClose,
  booking_id,
  mainModalClose
}) => {
  const { setSchedule } = useScheduleContext();
  const deleteBooking = async () => {
    if (Array.isArray(booking_id)) {
      booking_id.map(async (id) => {
        const deletion = await deleteBookingById(id);
        if (deletion && deletion.status === 200) {
          setSchedule(prevState => {
            if (!prevState) {
              return null
            }
            const key = `${deletion.data.start_time}${deletion.data.finish_time}${deletion.data.class_id}${deletion.data.employee_id}`.match(/\d+/g);
            const groupId = key ? key.join('') : '1'
            return prevState.filter(appointment => appointment.id.toString() != groupId)
          });
        }
      })
    } else {
      const deletion = await deleteBookingById(booking_id);
      if (deletion && deletion.status === 200) {
        setSchedule(prevState => {
          if (!prevState) {
            return null
          }
          return prevState.filter(appointment => appointment.id.toString() != deletion.data.id.toString())
        });
      }
    }
    //TO-DO: ABRIR MODAL CASO NÃO RETORNE 200, COM MENSAGEM DE ERRO "NÃO FOI POSSIVEL DELETAR AGENDAMENTO"
    onClose();
    mainModalClose();

  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      header={
        <h3 className="text-black-light text-3xl sm:text-32 lg:text-40 font-bold mb-6">
          Confirmar <span className="font-thin">cancelamento</span>
        </h3>
      }
      footer={
        <Box className="text-center">
          <ModalButton onClick={deleteBooking}>
            <div>
              <img src="/icon-confirm.svg" alt="" />
            </div>
            <p className="text-lg text-green-light font-bold">Confirmar</p>
          </ModalButton>
        </Box>
      }
    >
      <Divider />
      <div className="text-center mt-6 mb-6">
        <h4 className="text-2xl font-bold text-black-light mb-6">Atenção</h4>
        <p className="text-sm sm:text-base text-black-light">
          Tem certeza de que deseja cancelar essa mentoria individual?{" "}
          <strong>Essa ação não poderá ser desfeita</strong>.
          <br />
          (Não se esqueça de avisar o participante.)
        </p>
      </div>
      <Divider />
    </BaseModal>
  );
};