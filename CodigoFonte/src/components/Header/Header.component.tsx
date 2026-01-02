'use client';

import * as React from 'react';
import type { FunctionComponent } from 'react';
import type { Props } from './Header.interface';
import { Avatar } from './Header.styles';
import { usePathname } from 'next/navigation';
import { titles } from './utils/titles';
import { userIsAdmin } from '@/utils/userIsAdmin';
import { datadogRum } from '@datadog/browser-rum';

const pageTitle = (pathname: string) => {
	// 1) rota com slug numérico ou alfanumérico
	if (/^\/gestao-de-atividades\/[^/]+$/.test(pathname)) {
		return 'avaliaratividade';           // ⇐ mapear p/ Avaliar Atividade
	}
	// 2) demais rotas fixas
	if (pathname.includes('agendar')) return 'agendar';
	if (pathname.includes('participacao')) return 'participacao';
	if (pathname.includes('gestao-de-atividades'))
		return 'gestaodeatividades';
	return pathname;
};

/**
 * **Header**
 *
 * ### 🧩 Funcionalidade
 * - Cabeçalho principal e contextual, adaptando-se à página e tipo de usuário.
 * - Exibe título baseado em rota e papel (facilitador/aluno).
 * - Mostra avatar, nome e papel do usuário.
 * - Integra Datadog RUM para tracking.
 * - Oculta em certas rotas (sala de reunião, etc.).
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <Header
 *   cap="Turma A"
 *   session={session}
 *   isTransparent={false}
 *   showCap={true}
 *   customMessage="Bem-vindo!"
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Layout flex com sombra e borda.
 * - Responsivo com classes Tailwind.
 * - Avatar customizado.
 * - Tipografia grande para títulos.
 *
 * @component
 */
export const Header: FunctionComponent<Props> = ({ cap, session, isTransparent = false, showCap = true, customMessage }) => {
	const pathname = usePathname();
	if (!session) {
		return <></>;
	}
	const { user } = session;

	const path =
		pathname !== pageTitle(pathname)
			? pageTitle(pathname)
			: pathname.replace(/\//g, '').replace(/-/g, '');

	if (
		path.includes('saladereuniao') ||
		path.includes('atividades-estrategicas') ||
		path.includes('gestao-de-atividades') ||
		path.includes('avaliar-atividade') ||
		path.includes('consultoria') ||
		path.includes('grupo')
	) {
		return <></>;
	}

	const role = userIsAdmin(user.role);
	const roleTitle = role
		? user.role[0] === 'supervisor'
			? 'Supervisor'
			: 'Facilitador'
		: 'Participante';

	const prepareTitle = () => {
		const roleKey = role ? 'facilitador' : 'aluno';
		const rawTitle = titles[roleKey][path] ?? 'Página';

		const [firstPart, ...rest] = rawTitle.split(' ');
		return {
			firstPart,
			secondPart: rest.join(' '),
		};
	};

	const { firstPart, secondPart } = prepareTitle();

	const username = user.user_first_name
		? `${user.user_first_name} ${user.user_last_name}`
		: user.user_display_name;

	datadogRum.setUser({
		id: user.cpf,
		name: username,
		email: user.user_email,
		role: user.role[0] ?? 'participante',
	});

	return (
		<section
			className={`
            3xl:pl-[200px]
            md:pl-[150px]
            md:pr-[70px]
            pl-[20px]
            pr-[20px]
            py-[15px]
            mt-[66px]
            w-full
            md:mt-0
            shadow-[0_2px_20px_0px_rgba(0, 0, 0, 0.08)]
            border-[rgba(0,0,0,0.05)]
            border-b
            `} style={{ background: isTransparent ? '#f3f4f6' : '#fff' }}>
			<div className='flex justify-between items-center'>
				<div className='flex gap-[16px] items-center'>
					<div className='md:hidden'>
						<Avatar>
							<img className='inline-block' src='/icon-user-green.svg' alt='' />
						</Avatar>
					</div>
					<div>
						{
							showCap && (<p className='text-xl 3xl:text-2xl text-[#6E707A]'>{cap}</p>)
						}
						{
							customMessage ? (
								<h1 className='text-2xl md:text-5xl 3xl:text-[60px] text-[#070D26] '>{customMessage}</h1>
							) : (
								<h1 className='text-2xl md:text-5xl 3xl:text-[60px] text-[#070D26] '>{firstPart} <span className='font-extralight'> {secondPart}</span></h1>
							)
						}



					</div>
				</div>
				<div className='items-center hidden md:flex'>
					<div className='text-right mr-4'>
						<p className='text-[#AAA] text-sm 3xl:text-lg'>{roleTitle}</p>
						<p className='font-semibold text-xl 3xl:text-2xl capitalize'>
							{username}
						</p>
					</div>
					<div className='md:flex'>
						<Avatar>
							<img className='inline-block' src='/icon-user-green.svg' alt='' />
						</Avatar>
					</div>
				</div>
			</div>
		</section>
	);
};
