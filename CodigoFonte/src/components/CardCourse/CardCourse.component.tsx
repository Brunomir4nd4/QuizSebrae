'use client'
import * as React from 'react';
import type { FunctionComponent } from 'react';
import type { Props } from './CardCourse.interface';
import { CardHeader, CardText, StyledCard, CardCheck } from './CardCourse.styles';
import Image from 'next/image';

/**
 * **CardCourse**
 * 
 * Card interativo para seleção de curso/turma com indicador visual de seleção.
 * 
 * Usado na modal de seleção de cursos para permitir que o usuário
 * escolha entre os diferentes cursos/turmas disponíveis.
 * 
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza botão com imagem, título e texto.
 * - Indicador de seleção (check verde) quando ativo.
 * - Efeitos de hover (escala e translação).
 * - ID automático baseado no classId.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <CardCourse
 *   title="Curso A"
 *   text="Descrição do curso"
 *   onClick={handleSelect}
 *   image="/course-image.svg"
 *   width={200}
 *   height={150}
 *   active={true}
 *   classId="123"
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: CardCourse.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const CardCourse: FunctionComponent<Props> = ({title, text, onClick, image, width, height, active, classId}) => {
    return (
        <button id={"course_" + classId} className="w-full" onClick={onClick}>
            <StyledCard className={`${active ? 'active' : ''} max-w-[180px] md:max-w-[300px] 3xl:max-w-[350px] m-[auto] transition ease-in-out hover:-translate-y-1 hover:scale-105`}>
                <CardHeader>
                    <Image className="h-[80px] md:h-[115px] mb-[43px] w-auto" src={image} width={width} height={height} alt="" />
                    <h1 className="hidden md:block text-lg 3xl:text-2xl text-black-light font-bold">{title}</h1>
                </CardHeader>
                <CardText>
                    <img src="/card-dot.svg" alt="" />
                    <h2 className="text-sm md:text-lg 3xl:text-2xl text-black-light font-bold">• &nbsp;&nbsp; {text} &nbsp;&nbsp; •</h2>
                </CardText>
                <CardCheck className={`${active ? 'active' : ''} `}>
                    <div><img src="/icon-check-green.svg" alt="" /></div>
                </CardCheck>
            </StyledCard>
        </button>
    );
};