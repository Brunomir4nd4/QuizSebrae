import { nextAuthOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import {
  getClassDataById,
  getClasses,
  getRoomByClassId,
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
    const classes = await getClasses(session.user.token, userType);

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

    const classesData = classes.data

    if(classes?.status === 200){
      for (let i = 0; i < classesData.length; i++) {
        const _class = classesData[i];
        let agendamentos = null;
        let classById = null;
        let roomResponse = null;
  
        if (i === 0) {
          classById = await getClassDataById(
            _class.id,
            session.user.token,
            userType,
          );
        }
  
        data[_class.id] = {
          classData: classById,
          bookings: agendamentos,
          room: roomResponse,
          ..._class,
        };
      }
    }

    return NextResponse.json({
      data: data,
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
