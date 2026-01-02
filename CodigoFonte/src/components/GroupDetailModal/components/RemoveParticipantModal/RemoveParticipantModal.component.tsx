'use client'
import { FunctionComponent } from 'react'
import type { Props } from './RemoveParticipantModal.interface';
import { Box, Divider } from '@mui/material';
import React from 'react';
import { ModalButton } from './RemoveParticipantModal.styles';
import { deleteBookingById } from "@/app/services/bff/ScheduleService";
import { useScheduleContext } from '@/app/providers/ScheduleProvider';
import { BaseModal } from '@/components/BaseModal';

/**
 * **RemoveParticipantModal**
 *
 * ### 🧩 Funcionalidade
 * - Exibe modal de confirmação para remoção de participante de mentoria em grupo.
 * - Remove um participante mantendo grupo ativo, ou exclui grupo se último.
 * - Atualiza contexto de agendamento após confirmação.
 * - Fecha modais relacionados.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <RemoveParticipantModal
 *   open={true}
 *   onClose={handleClose}
 *   booking_id="123"
 *   group_id="456"
 *   mainModalClose={closeMainModal}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Utiliza BaseModal com header, footer e corpo.
 * - ModalButton para confirmação.
 * - Divider para separação.
 * - Texto centralizado com aviso de irreversibilidade.
 *
 * @component
 */
export const RemoveParticipantModal: FunctionComponent<Props> = ({
  open,
  onClose,
  booking_id,
  group_id,
  mainModalClose
}) => {
  const { schedule, setSchedule } = useScheduleContext();
  const deleteBooking = async () => {

    const deletion = await deleteBookingById(booking_id);
    if (deletion && deletion.status === 200) {
      setSchedule(prevState => {
        if (!prevState) {
          return null
        }
        return prevState.map(appointment => {
          if (
            (appointment.id == group_id) &&
            (appointment.group && appointment.group.length)
          ) {
            const groups = appointment.group.filter((group) => deletion.data.id != group.id)
            appointment.group = groups
          }
          return appointment
        }).filter(appointment => {
          if (
            (appointment.id == group_id) &&
            appointment.type === 'group' &&
            appointment.group?.length === 0
          ) {
            return false
          }
          return true
        })
      });
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
          Confirmar <span className="font-thin">remoção</span>
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
        <p className="text-black-light text-sm sm:text-base">
          Tem certeza de que deseja remover esse participante?{" "}
          <strong>Essa ação não poderá ser desfeita</strong>.
          <br />
          (Não se esqueça de avisar o participante.)
        </p>
      </div>
      <Divider />
    </BaseModal>
  );
};