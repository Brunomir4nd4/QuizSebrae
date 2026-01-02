import { nextAuthOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import {
  getClassesByUser,
} from "@/app/services/external/ClassService";

export async function GET(request: NextRequest) {
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

  let data: { [index: number]: any } = {};

  try {
    const userType = session.user.role[0];
    const classes = await getClassesByUser(userType, session.user.token);

    if (!classes) {
      return NextResponse.json({
        data: [],
        message: 'Não foi possível buscar os seus dados.',
        status: 500
      }, { status: 500 });
    }

    if(classes?.status === 404){
      return NextResponse.json({
        data: data,
        message: classes.message,
        status: classes.status
      }, { status: classes?.status });
    }

    return NextResponse.json({
      data: classes.data,
      message: classes?.message,
      status: classes?.status
    }, { status: classes?.status });
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
