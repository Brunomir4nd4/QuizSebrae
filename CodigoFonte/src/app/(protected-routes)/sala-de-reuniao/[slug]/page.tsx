import { getRoomByClassId } from "@/app/services/external/ClassService";
import { MeetingRoom } from "@/components/MeetingRoom";
import { nextAuthOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { FunctionComponent } from "react";

interface SalaDeReuniaoProps {
  params: {
    slug: string;
  };
}

const SalaDeReuniao: FunctionComponent<SalaDeReuniaoProps> = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    return <></>;
  }

  const credentials = await getRoomByClassId(
    params.slug,
    session.user.token,
    session.user.role[0],
  );

  return (
    <div style={{ width: "100dvw", height: "100dvh" }}>
      <MeetingRoom
        credentials={{
          updRootToken: credentials?.token,
          updRoomName: credentials?.room_name,
          updRoomTitle: credentials?.room_title,
          jitsiServerUrl: credentials?.jitsi_server_url || credentials?.jitsiServerUrl || credentials?.jitsi_url,
        }}
        token={session.user.token}
        role={session.user.role[0]}
        classId={params.slug}
        roomType='ClassRoom'
      />
    </div>
  );
};

export default SalaDeReuniao;
