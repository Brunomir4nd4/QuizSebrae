import { wpRequest } from "../api";

export const sendParticipantModeLog = (
  token: string,
  logData: {
    supervisor_id: string;
    supervisor_cpf: string;
    participant_id: string;
    participant_cpf: string;
    action: string;
  }
) => {
  const dataToSend = {
    supervisor_id: logData.supervisor_id,
    supervisor_cpf: logData.supervisor_cpf,
    participant_id: logData.participant_id,
    participant_cpf: logData.participant_cpf, 
    action: logData.action,               
  };

  return wpRequest(`/dhedalos/v1/participant-mode-log`, token, "POST", {}, dataToSend);
};