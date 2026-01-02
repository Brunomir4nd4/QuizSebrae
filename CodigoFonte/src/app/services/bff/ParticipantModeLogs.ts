import { proxyRequest } from "../api";

export const sendParticipantModeLogBff = (
  supervisor_id: string,
  supervisor_cpf: string,
  participant_id: string,
  participant_cpf: string,
  action: string,
) => {
  return proxyRequest(`/participant-mode-log`, "POST", {
    supervisor_id,
    supervisor_cpf,
    participant_id,
    participant_cpf,
    action
  });
};