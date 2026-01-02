import MeetRoom from '@/components/MeetRoom/MeetRoom.component';
import { nextAuthOptions } from '@/utils/authOptions';
import { userIsAdmin } from "@/utils/userIsAdmin";
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { FunctionComponent } from 'react'

const Consultoria: FunctionComponent = async () => {
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
        redirect('/')
    }

    userIsAdmin(session.user.role) ? redirect("/agenda") : redirect("/agendar");
    return (
        <MeetRoom type='OneOnOne' session={session} />
    )
}

export default Consultoria;
