import { FunctionComponent } from "react";
import type { Props } from "./ConsultancyConfirmed.interface";
import React from "react";
import { getDateObject } from "@/hooks";
import Link from "next/link";
import { useSession } from "next-auth/react";

/**
 * **ConsultancyConfirmed**
 *
 * Exibe a confirmação de agendamento de consultoria, mostrando o dia, horário e link para acessar a sala (individual ou em grupo).
 * O botão "Entrar" direciona o usuário para a sala correta conforme o tipo de consultoria.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza data e horário confirmados.
 * - Link para sala individual ou grupo.
 * - Usa session para obter client_id.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ConsultancyConfirmed
 *   start_datetime="2023-10-01T10:00:00"
 *   classId="123"
 *   is_group_meetings_enabled={false}
 *   meeting_id="456"
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
export const ConsultancyConfirmed: FunctionComponent<Props> = ({
  start_datetime,
  classId,
  is_group_meetings_enabled,
  meeting_id
}) => {
  const { dayName, dayNumber, hour } = getDateObject(start_datetime);

  const session = useSession();
  const client_id = session?.data?.user?.id

  return (
    <>
      <div className="flex flex-col items-center justify-center min-w-[100px] h-[100px] bg-[#000] rounded-[10px] shadow-sm">
        <div className="items-center uppercase justify-center text-sm text-[#909192]">
          {dayName}
        </div>
        <div className="items-center justify-center text-32 text-green-light">
          {dayNumber}
        </div>
      </div>

      {client_id && <Link
        href={is_group_meetings_enabled && meeting_id ? `/grupo/${classId}-${meeting_id}` : `/consultoria/${classId}-${client_id}`}
        className="group relative cursor-pointer w-[100%] rounded-[10px] bg-[#000] p-[20px] flex flex-wrap gap-3 items-center justify-between"
      >
        <div className="flex gap-3 items-center">
          <div className="hidden md:flex min-w-[45px] h-[45px] border border-green-light rounded-[7px] items-center justify-center">
            <img src="/icon-like-green.svg" alt="" />
          </div>
          <div>
            <p className="text-2xl text-green-light font-bold">{hour}h</p>
            <p className="text-green-light">Seu horário</p>
          </div>
        </div>
        <p className="text-xl transition-all text-green-light font-bold right-7 top-9">
          Entrar
        </p>
      </Link>}
    </>
  );
};
