import { nextAuthOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import {
  createAppointment,
  deleteBookingById,
} from "@/app/services/external/ScheduleService";
import { getFacilitatorByClass } from "@/app/services/external/ClassService";

export async function POST(request: NextRequest, context: any) {
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
  const res = await request.json();

  if (!res.class_id) {
    return NextResponse.json(
      {
        message: "Erro ao obter dados da turma.",
        error: "You must be provide a class_id.",
        status: 401,
      },
      { status: 401 },
    );
  }

  const facilitador = await getFacilitatorByClass(
    res.class_id,
    session.user.token,
  );

  if (!facilitador) {
    return NextResponse.json(
      {
        message: "Erro ao obter dados da turma.",
        error: "This class doesn't have a facilitator.",
        status: 401,
      },
      { status: 401 },
    );
  }

  const appointment = {
    ...res,
    client_id: cpf,
    employee_id: facilitador.cpf,
    class_id: res.class_id,
    course_name: res.course_name,
    additional_fields: JSON.stringify(res.additional_fields)
  };

  try {
    const data = await createAppointment(appointment);

    return NextResponse.json(data, { status: data.status });
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
