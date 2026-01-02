'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ParticipantModeHandlerProps {
	onModeChange?: (isParticipantMode: boolean) => void;
}

/**
 * Componente para lidar com a lógica do participantMode de forma segura no SSR
 */
export function ParticipantModeHandler({ onModeChange }: ParticipantModeHandlerProps) {
	const { data: session } = useSession();

	useEffect(() => {
		if (!session) return;

		// Se o usuário for facilitator, remove o modo participante
		if (session.user?.role?.includes('facilitator')) {
			localStorage.removeItem('isParticipantMode');
			onModeChange?.(false);
			return;
		}

		// Verifica o estado atual do modo participante
		const flag = localStorage.getItem('isParticipantMode');
		const isParticipantMode = flag === 'true';
		onModeChange?.(isParticipantMode);
	}, [session, onModeChange]);

	// Este componente não renderiza nada
	return null;
}