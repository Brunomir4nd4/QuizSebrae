'use client'

import * as React from 'react';
import type { FunctionComponent } from 'react';
import type { Props } from './CardHighlight.interface';
import { CardHeader, CardText, Circle, StyledCard } from './CardHighlight.styles';
import Link from 'next/link';

/**
 * **CardHighlight**
 * 
 * Card visual destacado usado para acesso rápido à sala de reunião/mentoria ao vivo.
 * 
 * Usado principalmente na página inicial para dar destaque ao acesso
 * da mentoria/reunião que está acontecendo no momento.
 * 
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza Link com imagem de reunião, título, texto e ícone de câmera.
 * - Suporte a turno (diurno, noturno, etc.) para exibir horário.
 * - Estilos com fundo destacado e elementos verdes.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <CardHighlight
 *   title="Reunião"
 *   text="Entrar na reunião ao vivo"
 *   href="/reuniao"
 *   image="/icon-reuniao.svg"
 *   turno="diurno"
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: CardHighlight.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const CardHighlight: FunctionComponent<Props> = ({ title, text, href, image, turno }) => {

  const horario = {
    diurno: '10h',
    noturno: '19h',
    vespertino: '14h',
    unica: 'Turma Única'
  }

  return (
    <Link href={href}>
      <StyledCard>
        <CardHeader>
          <img
            src="/reuniao.svg"
            className="label-reuniao"
            width="100%"
            alt=""
          />
          <Circle>
            <img className="h-[80px] 3xl:h-[100px]" src={image} alt="" />
            {turno && (
              <h1 className="text-black-light uppercase font-bold">
                {title} {horario[turno]}
              </h1>
            )}
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#222325"
              >
                <path d="M11.9999 17C15.6623 17 18.8649 18.5751 20.607 20.9247L18.765 21.796C17.3473 20.1157 14.8473 19 11.9999 19C9.15248 19 6.65252 20.1157 5.23479 21.796L3.39355 20.9238C5.13576 18.5747 8.33796 17 11.9999 17ZM11.9999 2C14.7613 2 16.9999 4.23858 16.9999 7V10C16.9999 12.6888 14.8776 14.8818 12.2168 14.9954L11.9999 15C9.23847 15 6.9999 12.7614 6.9999 10V7C6.9999 4.31125 9.1222 2.11818 11.783 2.00462L11.9999 2ZM11.9999 4C10.4022 4 9.09623 5.24892 9.00499 6.82373L8.9999 7V10C8.9999 11.6569 10.343 13 11.9999 13C13.5976 13 14.9036 11.7511 14.9948 10.1763L14.9999 10V7C14.9999 5.34315 13.6567 4 11.9999 4Z"></path>
              </svg>
            </span>
          </Circle>
        </CardHeader>
        <CardText>
          <img src="/card-dot-green.svg" alt="" />
          <h2 className="text-lg 3xl:text-2xl text-[#02F4A7] font-bold">
            • &nbsp;&nbsp; {text} &nbsp;&nbsp; •
          </h2>
        </CardText>
      </StyledCard>
    </Link>
  );
};