import { sendParticipantModeLog } from "@/app/services/external/ParticipantModeLogs";
import { nextAuthOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    return NextResponse.json(
      {
        message: "Erro ao enviar os logs.",
        error: "Você deve estar logado.",
        status: 401,
      },
      { status: 401 },
    );
  }

  try {
    const logData = await request.json();
    if (!logData.supervisor_id || !logData.supervisor_cpf || !logData.participant_id || !logData.participant_cpf || !logData.action) {
      return NextResponse.json(
        {
          message: "Erro ao enviar os logs.",
          error: "Dados inválidos.",
          status: 400,
        },
        { status: 400 },
      );
    }

    await sendParticipantModeLog(session.user.token, logData);

    return NextResponse.json(
      { 
        message: "Ação registrada com sucesso.",
        status: 201 
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Erro ao enviar os logs.",
        error: error.message,
        status: 500,
      },
      { status: 500 },
    );
  }
}