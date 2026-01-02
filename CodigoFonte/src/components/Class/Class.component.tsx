'use client'

import { FunctionComponent } from 'react';
import type { Props } from './Class.interface';
import { ClassBox, ClassButton } from './Class.styles';
import { useUserContext } from '@/app/providers/UserProvider';
import { Loader } from '../Loader';

/**
 * **Class**
 * 
 * Exibe informações de uma classe/turma com botão de navegação.
 * 
 * Busca dados da turma através do contexto do usuário (UserProvider),
 * exibindo título da classe e botão com ícone para navegar.
 * 
 * Suporta modo compacto (small) e adição de query string para navegação.
 * Responsivo, ocultando texto do botão em dispositivos móveis.
 * 
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza título da turma e botão de navegação.
 * - Suporte a modo small (layout compacto).
 * - Query string opcional para navegação.
 * - Responsivo: oculta texto em mobile.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <Class
 *   name="Turma A"
 *   href="/turma"
 *   buttonText="Ir para Turma"
 *   small={false}
 *   query="prev"
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: Class.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const Class: FunctionComponent<Props> = ({name = '', href, buttonText, small, query}) => {
    const { classesData, classId } = useUserContext();

    if (!classesData || !classId) {
        return <Loader />
    }

    const link = query ? `${href}?prev=${query}` : href

    return (
        <ClassBox className={small ? 'small' : 'large'}>
            <p className="text-md md:text-xl text-black-light">{classesData[classId]?.title || name }</p>
            <ClassButton href={link}>
                <img className="w-[24px] 3xl:w-[30px]" src="/icon-change-green.svg"/>
                <span className="text-xl 3xl:text-2xl text-green-light hidden md:block">{buttonText}</span>
            </ClassButton>
        </ClassBox>
    );
};