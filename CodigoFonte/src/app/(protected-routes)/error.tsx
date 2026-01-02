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

  return (
    <NotifyModal
      title={""}
      highlight={"Atenção"}
      message={
        "Ocorreu um erro ao obter as informações. Faça o login novamente."
      }
      // subtitle={'Ausência de turmas'}
      logout={true}
      whats={false}
      reload={true}
    />
  );
}
