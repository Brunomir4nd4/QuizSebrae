'use client'
import * as React from 'react';
import { FunctionComponent } from 'react';
import { ErrorBoundaryComponentProps } from './ErrorBoundaryComponent.interface';
import { useUserContext } from '@/app/providers/UserProvider';
import { NotifyModal } from '../NotifyModal';


/**
 * **ErrorBoundaryComponent**
 *
 * ### 🧩 Funcionalidade
 * - Exibe modal de notificação quando ocorre erro global na aplicação.
 * - Utiliza contexto do usuário para detectar erros.
 * - Apresenta mensagens amigáveis ao usuário.
 * - Não renderiza nada se não houver erro.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <ErrorBoundaryComponent />
 * ```
 *
 * ### 🎨 Estilização
 * - Renderiza NotifyModal com título e mensagem customizados.
 * - Sem estilização própria, delega para NotifyModal.
 *
 * @component
 */
export const ErrorBoundaryComponent: FunctionComponent<ErrorBoundaryComponentProps> = () => {

  const { error } = useUserContext();

  if (error){
    return (
      <NotifyModal {...error} title={error?.title || ''} message={error?.message || ''} logout={error?.logout || false} />
    )
  }

  return <></>
};