import { proxyRequest } from "../api";

export const sendLogBff = (
  subscriber_id: string,
  action: string,
) => {
  return proxyRequest(`/logs`, "POST", {
    subscriber_id,
    action
  });
};