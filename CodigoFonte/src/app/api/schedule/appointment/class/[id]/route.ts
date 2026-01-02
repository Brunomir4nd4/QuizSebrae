import { nextAuthOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import {
  createAppointment,
  deleteBookingById,
  getAppointmentByClassAndCpf,
} from "@/app/services/external/ScheduleService";

export async function GET(request: NextRequest, context: any) {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    return NextResponse.json(
      {
        message: "Erro ao obter os dados do Usuário.",
        error: "You must be logged in.",
        status: 401,
      },
      { status: 401 },
    );
  }

  const { cpf } = session.user;
  const { id: class_id } = context.params;

  try {
    const data = await getAppointmentByClassAndCpf(class_id, cpf);
    if (data) {
      return NextResponse.json(data, { status: data?.status ?? 200 });
    }
    return NextResponse.json(
      {
        message: "Erro ao obter os dados do Usuário.",
        data: data,
        status: 500,
      },
      { status: 500 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Erro ao obter os dados do Usuário.",
        error: error.message,
        status: 500,
      },
      { status: 500 },
    );
  }
}
