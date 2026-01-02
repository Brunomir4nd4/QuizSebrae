'use client';
import { FunctionComponent, useRef, useState } from 'react';
import { Section } from './MeetRoom.styles';
import React from 'react';
import { useUserContext } from '@/app/providers/UserProvider';
import Cookies from 'js-cookie';
import { Session } from 'next-auth';
import { MeetingRoom } from '../MeetingRoom';
import { Loader } from '../Loader';
import { NotifyModal } from '../NotifyModal';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GlobalThis } from 'global-this';

interface Props {
	type: 'OneOnOne' | 'ClassRoom';
	session: Session;
}

function getStoredCredentials(type: 'OneOnOne' | 'ClassRoom') {
	// Try cookie first
	const cookieKey = type === 'OneOnOne' ? 'updRoom1on1Credentials' : 'updRoomCredentials';
	const credentialsStringCookie = Cookies.get(cookieKey);

	if (credentialsStringCookie) {
		try {
			const credentials = JSON.parse(credentialsStringCookie);
			const { updRootToken, updRoomName, updRoomTitle, jitsiServerUrl } = credentials;
			return { updRootToken, updRoomName, updRoomTitle, jitsiServerUrl };
		} catch (e) {
			console.error('Failed to parse credentials from cookie:', e);
		}
	}

	// Fallback: check sessionStorage (some flows use sessionStorage)
	try {
		const storageString = sessionStorage.getItem(cookieKey) || sessionStorage.getItem('updRoomCredentials');
		if (storageString) {
			const credentials = JSON.parse(storageString);
			const { updRootToken, updRoomName, updRoomTitle, jitsiServerUrl } = credentials;
			return { updRootToken, updRoomName, updRoomTitle, jitsiServerUrl };
		}
	} catch (e) {
		console.error('Failed to read credentials from sessionStorage:', e);
	}

	console.error('Credentials not found in cookie or session storage.');
	return null;
}

/**
 * **MeetRoom**
 *
 * ### 🧩 Funcionalidade
 * - Wrapper para MeetingRoom, gerencia credenciais de cookies.
 * - Busca credenciais armazenadas para OneOnOne ou ClassRoom.
 * - Redireciona para sala específica se ClassRoom.
 * - Mostra loader ou erro se dados insuficientes.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <MeetRoom type="ClassRoom" session={session} />
 * ```
 *
 * ### 🎨 Estilização
 * - Section wrapper simples.
 * - Renderiza MeetingRoom com credenciais.
 *
 * @component
 */
const MeetRoom: FunctionComponent<Props> = ({ type, session }) => {
	const router = useRouter();
	const { classesData, classId } = useUserContext();
	const [error, setError] = useState(false);
	const [credentials, setCredentials] = useState<null | {
		updRootToken: string;
		updRoomName: string;
		updRoomTitle: string;
	}>(null);
	const [supportName, setSupportName] = useState('o suporte da plataforma');

	useEffect(() => {
		const name = (globalThis as GlobalThis).projectName ?? '';

		if (name === 'sebrae') {
			setSupportName('o Sebrae');
		} else if (name === 'essencia') {
			setSupportName('o suporte da Essência');
		}
	}, []);

	const drawerRef = useRef<HTMLButtonElement | null>(null);

	const currentClass = classesData && classId ? classesData[classId] : null;

	useEffect(() => {
		if (!currentClass || !classId) {
			return;
		}

		if (classId && type === 'ClassRoom') {
			router.push(`/sala-de-reuniao/${classId}`);
		} else {
			const oneOnOne = getStoredCredentials(type);
			setCredentials(oneOnOne);
			setError(!oneOnOne);
		}
	}, [type, classId, currentClass, router]);

	if (!currentClass) {
		return <Loader />;
	}

	if (!classId) {
		return <Loader />;
	}

	if (error) {
		return (
			<NotifyModal
				title={'Atenção'}
				message={`Não foi possível obter suas credenciais de acesso a sala de reunião. Entre na sala novamente ou entre contato com ${supportName}.`}
				logout={false}
				callback={() => router.back()}
			/>
		);
	}

	return (
		<Section ref={drawerRef}>
			{credentials && (
				<MeetingRoom
					credentials={credentials}
					role={session.user.role[0]}
					token={session.user.token}
					classId={classId}
				/>
			)}
		</Section>
	);
};

export default MeetRoom;
