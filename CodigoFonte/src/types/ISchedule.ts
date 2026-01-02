interface Booking {
  id: number;
  service_name: string;
  service_id: 1 | 2 | 3;
  provider_name: string;
  provider_color: string | null;
  provider_id: number;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  client_id: number | null;
  from: string; // Assuming the date-time is represented as a string
  to: string;   // Assuming the date-time is represented as a string
  status: string;
  invoice_id: number | null;
  invoice_status: string | null;
  invoice_payment_received: boolean;
  user_status: string | null;
  duration: number;
}

interface Column {
  id: number;
  name: string;
  date: string; // Assuming the date is represented as a string
  type: string;
  from: string; // Assuming the time is represented as a string
  to: string;   // Assuming the time is represented as a string
  breaktimes: any[]; // You may define a proper interface for breaktimes if needed
  blocked: any[];    // You may define a proper interface for blocked times if needed
  bookings: Booking[];
  notes: Note[];      // You may define a proper interface for notes if needed
  is_day_off: boolean;
  is_special_day: boolean;
}

interface Schedule {
  from: string; // Assuming the time is represented as a string
  to: string;   // Assuming the time is represented as a string
  columns: Column[];
  id: number | null;
}

interface Note {
  id: number;
  note: string;
  note_type: null | string;
  time_blocked: boolean;
  service_name: null | string;
  service_id: null | number;
  provider_name: string;
  provider_id: number;
  from: string;
  to: string;
}