'use client'
import { FunctionComponent } from 'react'
import { Box, Divider } from '@mui/material';
import React from 'react';
import { ModalButton } from './ModalBlockTime.styles';
import { Props } from './ModalBlockTime.interface';
import { BOOKING_TYPE } from '../Schedule';
import { DateTime } from 'luxon';
import { useScheduleContext } from '@/app/providers/ScheduleProvider';
import { ScheduleEvent } from "../Schedule/models/ScheduleEvent";
import { useSession } from 'next-auth/react';
import { BaseModal } from '../BaseModal';

/**
 * **ModalBlockTime**
 *
 * ### 🧩 Funcionalidade
 * - Exibe modal para bloquear/desbloquear horários na agenda do facilitador.
 * - Confirma ação, executa callbacks e atualiza contexto de agendamento.
 * - Restringe supervisores de realizar ação.
 * - Usa Luxon para formatação de datas.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <ModalBlockTime
 *   blockTime={timeData}
 *   open={true}
 *   onClose={handleClose}
 *   blockCallback={async () => response}
 *   type="block"
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - BaseModal com header, footer e corpo.
 * - ModalButton para confirmação.
 * - Divider para separação.
 * - Texto centralizado.
 *
 * @component
 */
export const ModalBlockTime: FunctionComponent<Props> = ({
  blockTime,
  open,
  onClose,
  blockCallback,
  type = "block",
}) => {
  const { setSchedule } = useScheduleContext();

  const handleClose = () => {
    onClose();
  };

  const session = useSession()

  if (session?.data?.user?.role[0] === 'supervisor') {
    return (
      <BaseModal
        open={open}
        onClose={handleClose}
        header={
          <h3 className="text-black-light text-3xl sm:text-32 lg:text-40 font-bold mb-6 sm:text-center">{`Atenção`}</h3>
        }
      >
        <Divider />
        <div className="text-center mt-6 mb-6">
          {/* <h4 className="text-2xl font-bold text-black-light mb-6">Ausência de turmas</h4> */}
          <p className="text-black-light">{`Você não pode realizar está ação`}</p>
        </div>
        <Divider />
        <Box className="text-center">
        </Box>
      </BaseModal>
    );
  }

  const handleBlockTime = async () => {
    const resp = await blockCallback();

    if (resp.status == 201 || resp.status == 200) {
      const startTime = DateTime.fromFormat(
        resp.data.start_time,
        "yyyy-MM-dd HH:mm:ss",
      );
      const startDateString = startTime.toISO({
        suppressMilliseconds: false,
      });
      const endTime = DateTime.fromFormat(
        resp.data.finish_time,
        "yyyy-MM-dd HH:mm:ss",
      );
      const endDateString = endTime.toISO({ suppressMilliseconds: false });
      const time_blocked = resp.status == 201;

      const blockObject: ScheduleEvent = {
        id: resp.data.id.toString(),
        client_name: "Bloqueado",
        end: endDateString
          ? DateTime.fromISO(endDateString).toJSDate()
          : new Date(),
        start: startDateString
          ? DateTime.fromISO(startDateString).toJSDate()
          : new Date(),
        title: resp.data.comments,
        type: BOOKING_TYPE[1],
        additional_fields: {
          main_topic: "",
          social_network: "",
          specific_questions: "",
        },
        client: {
          cpf: "",
          email: null,
          phone_number: null,
          name: "",
          id: 0,
        },
        employee: {
          cpf: "",
          email: null,
          phone_number: null,
          name: "",
          id: resp.data.employee_id,
        },
        class_id: "",
      };

      setSchedule((prevSchedule) => {
        if (time_blocked) {
          return prevSchedule ? [...prevSchedule, blockObject] : [blockObject];
        } else {
          return prevSchedule
            ? prevSchedule.filter(
              (entry) => entry.id != resp.data.id.toString(),
            )
            : [];
        }
      });
    }

    onClose();
  };

  const message = type === "block" ? "Bloquear" : "Desbloquear";

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      header={
        <h3 className="text-black-light text-3xl sm:text-32 lg:text-40 font-bold mb-6 sm:text-center">{`${message} Horário`}</h3>
      }
      footer={
        <Box className="text-center">
          <ModalButton onClick={handleBlockTime}>
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
        {/* <h4 className="text-2xl font-bold text-black-light mb-6">Ausência de turmas</h4> */}
        <p className="text-black-light">{`Deseja ${message} esse horário?`}</p>
      </div>
      <Divider />
    </BaseModal>
  );
};