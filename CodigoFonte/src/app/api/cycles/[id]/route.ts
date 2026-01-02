import { nextAuthOptions } from '@/utils/authOptions';
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { getClassesByCycleId } from "@/app/services/external/ClassService";


export async function GET (request: NextRequest, context: any) {

    const session = await getServerSession(nextAuthOptions)
    
    if (!session) {
      return NextResponse.json({ 
        message: 'Erro ao obter os dados do Usuário.',
        error: 'You must be logged in.',
        status: 401
      }, { status: 401 });
    }

    const { id } = context.params

    try {
      const data = await getClassesByCycleId(id, session.user.token);

      return NextResponse.json(data, { status: 200 });
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


