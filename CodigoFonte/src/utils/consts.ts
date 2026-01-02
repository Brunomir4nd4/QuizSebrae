export const baseUrl = process.env.API_URL || 'https://dhedalos-backend.sv.teste404.com.br'
export const calendar_url =
  process.env.SCHEDULE_URL ||
  "https://dhedalos-agenda.sv.teste404.com.br/api";
export const app_key = process.env.SCHEDULE_APP_KEY;
export const globalHeaders = {'Authorization': 'Basic ' + btoa('dhedalos:57oJXG5CgDCe')};

export const submissions_url = process.env.SUBMISSIONS_URL || "";
export const submissions_app_key = process.env.SUBMISSIONS_APP_KEY