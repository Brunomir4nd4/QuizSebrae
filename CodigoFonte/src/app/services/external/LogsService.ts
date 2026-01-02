import { wpRequest } from "../api";

export const sendLog = (
  token: string,
  logData: {
    subscriber_id: string;
    action: string;
  }
) => {
  const dataToSend = {
    subscriber_id: logData.subscriber_id, 
    action: logData.action,               
  };

  return wpRequest(`/dhedalos/v1/logs`, token, "POST", {}, dataToSend);
};