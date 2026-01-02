'use client'
import { FunctionComponent, useEffect, useState } from 'react'
import type { Props } from './DetailModal.interface';
import { Divider, Grid } from "@mui/material";
import React from "react";
import {
  ModalButton,
  ModalInfo,
  ModalLink,
} from "./DetailModal.styles";
import { CancelModal } from "../CancelModal";
import { useUserContext } from "@/app/providers/UserProvider";
import { Loader } from "../Loader";
import { getUserByEmail } from '@/app/services/bff/ClassService';
import { BaseModal } from '../BaseModal';
import { getUserByCPFOnly } from '@/app/services/external/ClassService';

/**
 * **DetailModal**
 *
 * ### 🧩 Funcionalidade
 * - Exibe modal com detalhes de mentoria agendada (participante, horário, assunto).
 * - Permite entrar na sala virtual ou cancelar a mentoria.
 * - Busca dados do cliente por CPF ou email para validação.
 * - Restringe cancelamento para supervisores.
 * - Integra com contexto do usuário e loader para estados de carregamento.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <DetailModal
 *   open={isOpen}
 *   onClose={handleClose}
 *   title="Detalhes da Mentoria"
 *   name="João Silva"
 *   start={new Date()}
 *   end={new Date()}
 *   subject="Assunto da Mentoria"
 *   client_email="joao@email.com"
 *   booking_id="123"
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Utiliza BaseModal com header, footer e corpo customizados.
 * - Layout responsivo com Grid do Material-UI.
 * - Botões estilizados (ModalButton, ModalLink) para ações.
 * - Dividers para separação de seções.
 *
 * @component
 */
export const DetailModal: FunctionComponent<Props> = ({
  open,
  onClose,
  title,
  name,
  start,
  end,
  interval,
  subject,
  social,
  client_email,
  client_cpf,
	token,
  booking_id,
  className,
  description,
  role
}) => {
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);
  const [clientId, setClientId] = useState<string | null>(null);

  const { classesData, classId } = useUserContext();

  useEffect(() => {
    const getClientData = async () => {
      if (!client_cpf && !client_email) return;
  
      try {
        if (client_cpf) {
          const clientByCPF = await getUserByCPFOnly(client_cpf, token);
          if (clientByCPF?.ID) {
            setClientId(clientByCPF.ID);
            return;
          }
        }
  
        if (client_email) {
          const client = await getUserByEmail(client_email);
          if (client?.ID) {
            setClientId(client.ID);
          }
        }
      } catch (error) {
        console.error("Failed to fetch client data:", error);
      }
    };
  
    getClientData();
  }, [client_cpf, client_email, token]);  

  if (!classesData && !classId) {
    return <Loader />;
  }

  return (
    <>
      <BaseModal
        open={open}
        onClose={onClose}
        header={
          <h3 className="text-black-light text-2xl md:text-40 font-bold">{title}</h3>
        }
        footer={
          <div className="flex items-center justify-center gap-0 md:gap-5 flex-col md:flex-row">
            {(clientId && className) && (
              <ModalLink href={`/consultoria/${className}-${clientId}`}>
                <div>
                  <img src="/online.svg" alt="" />
                </div>
                <p className="text-lg text-green-light font-bold">
                  Entrar na sala
                </p>
              </ModalLink>
            )}
            {role !== 'supervisor' &&
              <ModalButton onClick={handleOpenConfirm}>
                <div>
                  <img src="/icon-cancel.svg" alt="" />
                </div>
                <p className="text-lg text-green-light font-bold">
                  Cancelar mentoria
                </p>
              </ModalButton>
            }
          </div>
        }
      >
        <div>
          <ModalInfo>
            <div>
              <p className="flex text-md md:text-2xl mb-4 md:mb-0 text-black-light font-bold">
                <img src="/icon-user.svg" alt="" />
                {name}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <p className="flex text-md md:text-2xl text-black-light">
                <img src="/icon-clock.svg" alt="" />
                {start} - {end}
              </p>
              <p className="flex text-md md:text-2xl text-black-light">
                <img src="/icon-interval.svg" alt="" />
                {interval}min
              </p>
            </div>
          </ModalInfo>
          <Grid container spacing={2} className="pb-6">
            <Grid item md={7}>
              <label className="text-black-light font-bold">
                Qual o principal assunto?
              </label>
              <p className="text-black-light text-md md:text-xl">{subject}</p>
            </Grid>
            <Grid item md={5}>
              <label className="text-black-light font-bold">
                Redes sociais
              </label>
              <p className="text-black-light text-md md:text-xl">{social}</p>
            </Grid>
          </Grid>
          <Divider />
          <Grid container spacing={2} className="pt-6 pb-6">
            <Grid item md={7}>
              <label className="text-black-light font-bold">
                Deseja saber mais sobre...
              </label>
              <p className="text-black-light text-md md:text-xl">{description}</p>
            </Grid>
            {className && (
              <Grid item md={5}>
                <label className="text-black-light font-bold">Turma</label>
                <p className="text-black-light text-md md:text-xl">
                  {classesData?.[className]?.title ?? className}
                </p>
              </Grid>
            )}
          </Grid>
          <Divider />
        </div>
      </BaseModal>

      {classId && booking_id && (
        <CancelModal
          open={openConfirm}
          onClose={handleCloseConfirm}
          mainModalClose={onClose}
          class_id={classId}
          booking_id={booking_id}
        />
      )}
    </>
  );
};