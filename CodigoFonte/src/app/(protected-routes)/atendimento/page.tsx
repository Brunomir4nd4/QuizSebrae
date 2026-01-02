import './page.css'
import { AtendimentoButton } from "@/components/AttendanceButton/AttendanceButton.component";
import { CancelRegistrationButton } from "@/components/CancelRegistrationButton/CancelRegistrationButton.component";
import { nextAuthOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { FunctionComponent } from "react";
import {
  getClassesByUser,
} from '../../services/external/ClassService';
import React from "react";

const PageAtendimento: FunctionComponent = async () => {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    return <></>;
  }


  const classData = await getClassesByUser(
    session?.user?.role[0],
    session?.user?.token,
  );


  return (
    <>
      <section className="flex justify-center w-full py-[40px] px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] min-h-screen bg-gray-100">
        <div className="max-w-[1640px] w-full">
          <div className="w-full bg-white rounded-lg p-6 sm:p-8 md:p-10">
            <div className="flex flex-col lg:flex-row w-full items-center justify-center gap-6 lg:gap-10 mt-4">
              <img src="/atendimento-banner.svg" alt="Banner" className="w-full max-w-md lg:w-2/3" />
              <div className="flex flex-col gap-2 w-full lg:w-[22%]">
                <span style={{
                  color: "#000",
                  fontSize: "32px",
                  fontStyle: "normal",
                  fontWeight: "400",
                  lineHeight: "100%",
                }} className="text-center lg:text-left">Vem aí uma central de respostas novinha para você</span>
                <p style={{
                  color: "#000",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "400",
                  lineHeight: "150%",
                }} className="mt-3 text-center lg:text-left">Ainda estamos trabalhando nela. Enquanto isso, você pode encontrar a ajuda que precisa nas opções abaixo.</p>
              </div>
            </div>
            <hr className="w-full my-10" />
            <div className="flex flex-col md:flex-row w-full gap-6">
              <div className="w-full md:w-1/2 rounded-[12px] border border-[#E5E5E5] p-6 relative" style={{ minHeight: 240 }}>
                <div className="flex flex-col gap-6 mb-3">
                  <div className="flex items-center gap-3">
                    <img src="/icon-whats.svg" alt="Icone" className="w-6 h-6" />
                    <span className="text-[20px] md:text-[24px] font-normal leading-[100%]">Peça ajuda no nosso chat</span>
                  </div>
                  <div>
                    <span>Precisa de ajuda? Envie uma mensagem para nossa equipe de suporte e responderemos o quanto antes!</span>
                  </div>
                </div>
                <div className="flex w-full mt-4 button-card">
                  <AtendimentoButton text="FALAR COM UM ESPECIALISTA"></AtendimentoButton>
                </div>
              </div>
              <div className="w-full md:w-1/2 rounded-[12px] border border-[#E5E5E5] p-6 relative" style={{ minHeight: 240 }}>
                <div className="flex flex-col gap-6 mb-3">
                  <div className="flex items-center gap-3">
                    <img src="/document-icon.svg" alt="Icone" className="w-9 h-9" />
                    <span className="text-[20px] md:text-[24px] font-normal leading-[100%]">Cancelar matrícula</span>
                  </div>
                  <div>
                    <span>
                      Sentimos muito que precise cancelar sua matrícula. Lembre-se: após o cancelamento, não será possível desfazer o processo.
                    </span>
                  </div>
                </div>
                <div className="flex w-full mt-4 button-card">
                  <CancelRegistrationButton enrollId={classData.data[0].enroll_id} text="CANCELAR MATRÍCULA" token={session?.user?.token}></CancelRegistrationButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};
export default PageAtendimento;
