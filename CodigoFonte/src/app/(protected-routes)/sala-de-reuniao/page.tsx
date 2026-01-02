import MeetRoom from '@/components/MeetRoom/MeetRoom.component';
import { nextAuthOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { FunctionComponent } from 'react'

const SalaDeReuniao: FunctionComponent = async () => {
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
        return <></>
    }
    
    return (
        <MeetRoom type='ClassRoom' session={session} />
    )
}

export default SalaDeReuniao;
