'use client';
import { ButtonIcon } from "@/components/ButtonIcon";
import { BlipChat } from "blip-chat-widget";
import { useEffect, useState } from "react";
interface Props {
  /** Texto exibido no botão */
  text: string,
  /** Alinhamento do botão (flex) */
  align?: "justify-start" | "justify-center" | "justify-end",
  /** Desabilita o botão */
  disabled?: boolean
  /** Função chamada ao clicar no botão */
  onClick?: () => void
}



/**
 * **AtendimentoButton**
 *
 * Botão para abrir o chat de atendimento (BlipChat) customizado.
 * Inicializa o widget BlipChat com configurações específicas e permite alternar a visibilidade do chat.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Busca chave da API BlipChat via endpoint.
 * - Configura o widget com URL customizada, autenticação e estilos.
 * - Permite abrir/fechar o chat ao clicar.
 * - Suporte a estados desabilitados e alinhamento.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <AtendimentoButton
 *   text="Falar com Atendimento"
 *   align="justify-center"
 *   disabled={false}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (usa ButtonIcon estilizado).
 *
 * ---
 *
 * @component
 */
export const AtendimentoButton: React.FC<Props> = ({ text, align = "justify-start", disabled = false }) => {
  const [blipChat, setBlipChat] = useState<any>(null)

  useEffect(() => {
    fetch('/api/blip/config')
      .then(res => res.json())
      .then(({ appKey }) => {
        if (!appKey) return;
        setBlipChat(new BlipChat()
          .withAppKey(appKey || '')
          .withCustomCommonUrl('https://weconcept.chat.blip.ai/')
          .withAuth({
            authType: BlipChat.DEV_AUTH,
            userIdentity: `anon-${Date.now()}`,
            userPassword: '123456'
          })
          .withButton({ "color": "#222325" })
          .withEventHandler(BlipChat.LOAD_EVENT, function () {
          })
          .withCustomStyle(`
            #app {
              font-family: Arial, sans-serif;
            }
            #blip-chat-header {
              background-color: #222325 !important;
            }
            #blip-chat-container {
              width: 600px !important
            }
          `))
      });

  }, [])

  useEffect(() => {
    if (blipChat) {
      blipChat.build();
    }
  }, [blipChat])
  const toggle = () => {
    if (blipChat) {
      blipChat.toogleChat()
    }
  }
  return (
    <div className={`w-full flex ${align}`}>
      <ButtonIcon
        icon='/icon-arrow-next.svg'
        text={text}
        onClick={toggle}
        size='medium'
        iconSize="50px"
        disabled={disabled}
        mobile={true}
      />
    </div>
  );
};
