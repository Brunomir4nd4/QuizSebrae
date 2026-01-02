'use client';

import * as React from 'react';
import { type FunctionComponent } from 'react';
import type { Props } from './Card.interface';
import { CardHeader, CardText, Circle, StyledCard } from './Card.styles';
import Link from 'next/link';
import { useUserContext } from '@/app/providers/UserProvider';
import { Loader } from '../Loader';
import { Grid } from '@mui/material';
import NotifyDot from '../NotifyDot';

/**
 * **Card**
 *
 * Card genérico de navegação usado principalmente na página inicial para
 * acesso rápido às principais funcionalidades da aplicação.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Renderiza Link com imagem circular, título e texto.
 * - Suporte a target _self ou _blank.
 * - Estilos com círculos e pontos decorativos.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <Card
 *   title="Turmas"
 *   text="Acesse suas turmas"
 *   href="/turmas"
 *   image="/icon-turmas.svg"
 *   target="_self"
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: Card.styles.tsx.
 *
 * ---
 *
 * @component
 */
export const Card: FunctionComponent<Props> = ({
	title,
	text,
	href,
	image,
	target,
	notify = false,
}) => {
	return (
		<Link href={href} target={target}>
			<StyledCard>
				<CardHeader>
					{notify && <NotifyDot position='top-right-lg' size='lg' />}
					<Circle>
						<img className='h-[80px] 3xl:h-[100px]' src={image} alt='' />
						<h1 className='text-lg 3xl:text-2xl text-green-light font-bold'>
							{title}
						</h1>
					</Circle>
				</CardHeader>
				<CardText>
					<img src='/card-dot.svg' alt='' />
					<h2 className='text-lg 3xl:text-2xl text-black-light font-bold'>
						• &nbsp;&nbsp; {text} &nbsp;&nbsp; •
					</h2>
				</CardText>
			</StyledCard>
		</Link>
	);
};
