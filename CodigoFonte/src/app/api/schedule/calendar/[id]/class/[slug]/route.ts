import { nextAuthOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from "next/server";
import { getCalendar } from "@/app/services/external/ScheduleService";
import { getFacilitatorByClass } from '@/app/services/external/ClassService';

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
  const { id, slug: class_id } = context.params;

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


    const data = await getCalendar(id, facilitador.cpf);

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
};


