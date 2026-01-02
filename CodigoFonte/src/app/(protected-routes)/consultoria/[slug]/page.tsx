import { getOneOnOneRoom } from "@/app/services/external/ClassService";
import { MeetingRoom } from "@/components/MeetingRoom";
import { nextAuthOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FunctionComponent } from "react";

interface ConsultoriaProps {
  params: {
    id: number;
    slug: string;
  };
}

const Consultoria: FunctionComponent<ConsultoriaProps> = async ({ params }) => {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    redirect("/");
  }

  const { slug } = params;
  const ids = slug.split("-");

  const credentials = await getOneOnOneRoom(
    ids[0],
    ids[1],
    session.user.token,
    session.user.role[0],
  );

  return (
    <MeetingRoom
      credentials={{
        updRootToken: credentials?.token,
        updRoomName: credentials?.room_name,
        updRoomTitle: credentials?.room_title,
        jitsiServerUrl: credentials?.jitsi_server_url || credentials?.jitsiServerUrl || credentials?.jitsi_url,
      }}
      role={session.user.role[0]}
      token={session.user.token}
      classId={ids[0]}
    />
  );
};

export default Consultoria;
