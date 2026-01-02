'use client';
import { ButtonIcon } from "@/components/ButtonIcon";
import { useState } from "react";
import { CancelRegistrationModal } from "../CancelRegistrationModal";

export interface Props {
  /** Texto exibido no botão */
  text: string,
  /** Alinhamento do botão (flex) */
  align?: "justify-start" | "justify-center" | "justify-end",
  /** Desabilita o botão */
  disabled?: boolean
  /** Função chamada ao clicar no botão */
  onClick?: () => void;
  /** Id da matrícula a ser cancelada */
  enrollId: string;
  /** Token de autenticação para o cancelamento */
  token: string
}

/**
 * **CancelRegistrationButton**
 *
 * Botão para acionar o modal de cancelamento de matrícula.
 * Usa ButtonIcon e controla a visibilidade do CancelRegistrationModal.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza ButtonIcon com texto e ícone.
 * - Abre modal ao clicar.
 * - Passa enrollId e token para o modal.
 * - Suporte a alinhamento e estados desabilitados.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <CancelRegistrationButton
 *   text="Cancelar Matrícula"
 *   align="justify-center"
 *   disabled={false}
 *   enrollId="123"
 *   token="abc123"
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (usa ButtonIcon).
 *
 * ---
 *
 * @component
 */
export const CancelRegistrationButton: React.FC<Props> = ({ text, align = "justify-start", disabled = false, enrollId, token }) => {

  const [open, setOpen] = useState(false);
  const changeStatusModal = () => {
    setOpen(!open);
  }

  return (
    <>
      {
        open && (
          <CancelRegistrationModal
            callback={() => { setOpen(false) }}
            enrollId={enrollId}
            token={token}
          />
        )
      }

      <div className={`w-full flex ${align}`}>
        <ButtonIcon
          icon='/icon-arrow-next.svg'
          text={text}
          onClick={changeStatusModal}
          size='medium'
          iconSize="50px"
          disabled={disabled}
          mobile={true}
        />
      </div>
    </>
  );
};
