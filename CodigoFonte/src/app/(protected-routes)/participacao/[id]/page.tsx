export const dynamic = 'force-dynamic'

import { Class } from '@/components/Class'
import { Participacao } from '@/components/Participacao'
import { nextAuthOptions } from '@/utils/authOptions'
import { Divider } from '@mui/material'
import { getServerSession } from 'next-auth'
import { FunctionComponent } from 'react'

interface ParticipacaoProps {
    params: {
        id: number;
    };
}

const PageParticipacao: FunctionComponent<ParticipacaoProps> = async () => {

    const session = await getServerSession(nextAuthOptions)

    if (!session) {
        return <></>
    }

    return (
        <>
            <section className="flex justify-center w-full py-[40px] px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] min-h-screen bg-gray-100">
                <div className='max-w-[1640px] w-full block'>
                    <div className="hidden md:flex flex items-center justify-end mb-[60px]">
                        {/* <div className="w-[400px]">
                            <p className="text-4xl font-bold">Participantes</p>
                            </div>
                            <div className="">
                                <p className="text-4xl font-bold">Atividades </p>
                            </div>
                            <div className="min-w-[465px]">
                                <Class query='participacao' small href="/trocar-turma" buttonText="Trocar" />
                            </div>
                        </div>
                        <ParticipacaoTable students={
                            students
                                .filter(item => item.id)
                                .sort((a, b) => a.name.localeCompare(b.name))
                        } />
                        </div>
                        <div className="">
                            <p className="text-4xl font-bold">Atividades </p>
                        </div> */}
                        <div className="min-w-[465px]">
                            <Class query='participacao' small href="/trocar-turma" buttonText="Trocar" />
                        </div>
                    </div>
                    <div className='block md:hidden'>
                        <Class query='participacao' small href="/trocar-turma" buttonText="Trocar" />
                        <Divider sx={{ margin: '30px 0' }} />
                    </div>
                    <Participacao token={session.user.token} type={session.user.role[0]} />
                </div>
            </section>
        </>
    )
}

export default PageParticipacao;
