import { getGroupRoom } from "@/app/services/external/ClassService";
import { MeetingRoom } from "@/components/MeetingRoom";
import { nextAuthOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FunctionComponent } from "react";

interface GrupoProps {
  params: {
    id: number;
    slug: string;
  };
}

const Grupo: FunctionComponent<GrupoProps> = async ({ params }) => {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    redirect("/");
  }

  const { slug } = params;
  const ids = slug.split("-");

  const credentials = await getGroupRoom(
    ids[0],
    session.user.id,
    ids[1],
    session.user.token,
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

export default Grupo;
