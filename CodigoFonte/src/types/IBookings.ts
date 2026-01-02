interface Provider {
  id: number;
  name: string;
  email: string;
  description: string;
}

interface Service {
  id: number;
  name: string;
  duration: number;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Appointment {
  provider: Provider;
  service: Service;
  client: Client;
  status: string;
  start_datetime: string;
  end_datetime: string;
  id: number;
  code: string;
  duration: number;
  client_id: number;
}

export interface Bookings {
  data: Appointment[];
  metadata: {
      items_count: number;
      pages_count: number;
      page: number;
      on_page: number;
  };
}

export interface BookingResponse {
  questions: {
    social_network: string;
    main_topic: string;
    specific_questions: string;
  };
  provider_id: number;
  service_id: number;
  client_name: string;
  client_id: number;
  id: number;
  code: string;
  start_datetime: string; // You may want to use a Date type if you plan to work with dates in a more structured way
  end_datetime: string;   // Same here, consider using Date type
  status: string;
  duration: number;
  class_name: string;
  class_id: number;
}

export interface IndividualBookingResponse {
  id: number;
  code: string;
  start_datetime: string;
  end_datetime: string;
  location_id: number | null;
  category_id: number | null;
  service_id: number;
  provider_id: number;
  client_id: number;
  duration: number;
}