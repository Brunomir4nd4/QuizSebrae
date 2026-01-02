import React, { useEffect, useRef } from "react";

export type useRunOnceProps = {
  fn: () => any;
  sessionKey?: string;
};

/**
 * useRunOnce
 *
 * Este hook customizado permite a execução de uma função apenas uma vez, seja durante a sessão atual
 * (usando `sessionStorage` para persistência) ou durante a vida útil do componente.
 *
 * @param {useRunOnceProps} props - As propriedades aceitas pelo hook.
 * @param {() => any} props.fn - A função que deve ser executada apenas uma vez.
 * @param {string} [props.sessionKey] - (Opcional) A chave de sessão para armazenar o estado de execução
 *                                      da função no `sessionStorage`. Se fornecido, a função será executada
 *                                      uma vez por sessão, caso contrário, uma vez por montagem do componente.
 *
 * @returns {null} Este hook não retorna nada.
 *
 * @example
 * // Exemplo de uso:
 * const MyComponent = () => {
 *   useRunOnce({
 *     fn: () => {
 *       console.log('Esta mensagem aparecerá apenas uma vez por sessão ou por montagem do componente');
 *     },
 *     sessionKey: 'myUniqueKey' // Opcional
 *   });
 *
 *   return <div>Meu Componente</div>;
 * };
 */
const useRunOnce: React.FC<useRunOnceProps> = ({ fn, sessionKey }: useRunOnceProps): null => {
  const triggered = useRef<boolean>(false);

  useEffect(() => {
    const hasBeenTriggered = sessionKey
      ? sessionStorage.getItem(sessionKey)
      : triggered.current;

    if (!hasBeenTriggered) {
      fn();
      triggered.current = true;

      if (sessionKey) {
        sessionStorage.setItem(sessionKey, "true");
      }
    }
  }, [fn, sessionKey]);

  return null;
};

export default useRunOnce;
