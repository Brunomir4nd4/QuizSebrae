import { nextAuthOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import {
  getClassDataById,
  getClasses,
  getRoomByClassId,
} from "@/app/services/external/ClassService";

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

  const { id } = context.params;
  let data: { [index: number]: any } = {};

  try {
    const userType = session.user.role[0];
    const classById = await getClassDataById(id, session.user.token, userType);

    if (classById) {
      return NextResponse.json(classById, { status: 200 });
    }

    return NextResponse.json(
      {
        message: "Erro ao obter os dados da turma.",
        data: classById,
        status: 404,
      },
      { status: 404 },
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
