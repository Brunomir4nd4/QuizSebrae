import { nextAuthOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { blockScheduleTimePoc } from "@/app/services/external/ScheduleService";

export async function POST(request: Request, context: any) {
  const session = await getServerSession(nextAuthOptions);
  const res = await request.json();

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

  const body = {
    employee_id: cpf,
    comments: "Horário Bloqueado",
    additional_fields: null,
    type_id: 1,
    class_id: class_id,
    ...res,
  };

  try {
    const data = await blockScheduleTimePoc(body);

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
