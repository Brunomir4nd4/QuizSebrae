interface Consultoria {
  id: string;
  date: string;
  slots: any[]; // You can replace 'any' with a more specific type if needed
}

interface DadosConsultoria {
  dadosConsultoria: Consultoria[],
  facilitador: any
  providerId: number
}