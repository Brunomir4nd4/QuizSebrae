'use client'
import { FunctionComponent } from "react";
import React from "react";
import { useRouter } from 'next/navigation'
import { useUserContext } from "@/app/providers/UserProvider";

const PageAgendar: FunctionComponent = () => {
  const { classId } = useUserContext()
  const router = useRouter()

  if(!classId){
    return (<></>);
  }

  router.push(`/agendar/${classId}`)

  return (<></>);
};

export default PageAgendar;
