"use client";

import { NotifyModal } from "@/components/NotifyModal";
import { useEffect } from "react";
import { useUserContext } from "@/app/providers/UserProvider";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const { error: clientErrors } = useUserContext();

  if (clientErrors) {
    return (
      <NotifyModal
        title={clientErrors.title}
        message={clientErrors.message}
        logout={clientErrors.logout}
        whats={true}
        callback={() => reset()}
      />
    );
  }

  const callbackReload = () => {
    if(window){
      window?.location?.reload()
    }
  }

  return (
    <NotifyModal
      title={""}
      highlight={"Atenção"}
      message={
        "Falha ao obter as credenciais de acesso a sala de mentoria. Faça o login novamente."
      }
      // subtitle={'Ausência de turmas'}
      logout={false}
      whats={false}
      callback={() => callbackReload()}
    />
  );
}
