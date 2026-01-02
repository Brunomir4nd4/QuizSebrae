import { nextAuthOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { getAvailableSlotByDate } from "@/app/services/external/ScheduleService";
import { getFacilitatorByClass } from "@/app/services/external/ClassService";

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
  const { id: class_id, slug: date } = context.params;

  try {
    const facilitador = await getFacilitatorByClass(
      class_id,
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

    const data = await getAvailableSlotByDate(date, facilitador.cpf, cpf);

    if (data) {
      return NextResponse.json(data, { status: data?.status });
    }

    return NextResponse.json(
      {
        status: 500,
        data: [],
        message: "Não foi possivel obter as vagas disponiveis.",
      },
      { status: 500 },
    );

  } catch (error: any) {
    console.error("Error in GET request:", error);
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
