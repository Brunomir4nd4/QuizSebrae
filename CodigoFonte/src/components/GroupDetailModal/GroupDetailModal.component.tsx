'use client'
import { FunctionComponent, useEffect, useState } from 'react'
import type { Props } from './GroupDetailModal.interface';
import { Divider, Grid, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import {
  ModalButton,
  ModalClient,
  ModalClientsWrapper,
  ModalClose,
  ModalContent,
  ModalInfo,
  ModalLink,
} from "./GroupDetailModal.styles";
import { CancelModal } from "../CancelModal";
import { useUserContext } from "@/app/providers/UserProvider";
import { Loader } from "../Loader";
import { DateTime } from 'luxon';
import { RemoveParticipantModal } from './components';
import { CloseButton } from './components/CloseButton';

/**
 * **GroupDetailModal**
 *
 * ### 🧩 Funcionalidade
 * - Exibe detalhes de roda de conversa (participantes, horários, ações).
 * - Permite acessar sala online, cancelar mentoria ou remover participantes.
 * - Integra com contexto do usuário e loader.
 * - Lida com permissões baseadas em papéis (supervisor, etc.).
 * - Usa DateTime do Luxon para formatação de horários.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <GroupDetailModal
 *   open={true}
 *   onClose={handleClose}
 *   appointment={appointmentData}
 *   role="facilitator"
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Modal customizado com ModalContent e estilos.
 * - Layout com ModalClientsWrapper para lista de participantes.
 * - Botões (ModalButton, ModalLink) para ações.
 * - CloseIcon e ModalClose para fechamento.
 *
 * @component
 */
export const GroupDetailModal: FunctionComponent<Props> = ({
  open,
  onClose,
  appointment,
  role
}) => {
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);
  const [participant, setParticipant] = useState("")

  const { classesData, classId } = useUserContext();


  if (!classesData && !classId) {
    return <Loader />;
  }

  const {
    title,
    start,
    end,
    id,
    group,
    class_id
  } = appointment

  const startHour = DateTime.fromJSDate(start).toFormat("HH:mm");
  const endHour = DateTime.fromJSDate(end).toFormat("HH:mm");

  const handleRemoveParticipant = (appointmentId: string | number) => {
    setParticipant(appointmentId.toString())
  }

  const handleCloneRemoveParticipant = () => {
    setParticipant('')
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalContent>
          <ModalClose onClick={onClose}>
            <CloseIcon />
          </ModalClose>
          <div className="flex flex-col justify-between min-h-[360px]">
            <div>
              <div className="flex flex-col sm:flex-row w-full justify-between mb-6">
                <h3 className="text-white text-2xl md:text-40 font-bold mb-4 sm:mb-0">Roda <span className='font-normal'>de conversa</span></h3>
                <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                  <p className="flex items-center text-md md:text-2xl text-white whitespace-nowrap">
                    <img className="mr-3" src="/icon-clock-white.svg" alt="" />
                    {startHour} - {endHour}
                  </p>
                  <p className="flex items-center text-md md:text-2xl text-white whitespace-nowrap">
                    <img className="mr-3" src="/icon-interval-white.svg" alt="" />
                    {15}min
                  </p>
                </div>
              </div>
              <ModalClientsWrapper>
                {
                  group && group.map(appointmentItem => {
                    if (appointmentItem.client) {
                      return (
                        <ModalClient
                          key={appointmentItem.id}
                        >
                          <div className='flex items-center w-full justify-between'>
                            <p className="flex text-md md:text-2xl md:m-0 text-white font-bold">
                              <img src="/icon-user-white.svg" alt="" />
                              {appointmentItem.client?.name} ({appointmentItem.client?.cpf ? appointmentItem.client.cpf.slice(0, 3) : 'S/N'})
                            </p>
                            <CloseButton removeParticipant={() => handleRemoveParticipant(appointmentItem.id)} />
                          </div>
                        </ModalClient>
                      )
                    }
                  })
                }
              </ModalClientsWrapper>
            </div>
            <div>
              <Divider sx={{ marginTop: '5rem !important' }} />
              <div className="flex items-center justify-center gap-0 md:gap-5 flex-col md:flex-row">
                {(class_id && id) && (
                  <ModalLink href={`/grupo/${class_id}-${id}`}>
                    <div>
                      <img src="/online.svg" alt="" />
                    </div>
                    <p className="text-lg text-[#FFFFFF] font-bold">
                      Entrar na sala
                    </p>
                  </ModalLink>
                )}
                {role !== 'supervisor' &&
                  <ModalButton onClick={handleOpenConfirm}>
                    <div>
                      <img src="/icon-cancel.svg" alt="" />
                    </div>
                    <p className="text-lg text-[#FFFFFF] font-bold">
                      Cancelar mentoria
                    </p>
                  </ModalButton>
                }
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {classId && group && (
        <CancelModal
          open={openConfirm}
          onClose={handleCloseConfirm}
          mainModalClose={onClose}
          class_id={classId}
          booking_id={group.map(item => item.id.toString())}
        />
      )}
      {classId && participant && (
        <RemoveParticipantModal
          open={participant ? true : false}
          onClose={handleCloneRemoveParticipant}
          mainModalClose={onClose}
          class_id={classId}
          booking_id={participant}
          group_id={id}
        />
      )}
    </>
  );
};