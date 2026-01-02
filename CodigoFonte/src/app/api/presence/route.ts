import { nextAuthOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { setParticipacaoById } from "@/app/services/external/ClassService";

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

  try {
    const data = await setParticipacaoById(
      res.class_id,
      res.student_id,
      res.activity_id,
      session.user.token,
    );

    return NextResponse.json(data, { status: 201 });
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
