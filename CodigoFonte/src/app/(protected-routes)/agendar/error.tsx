'use client';

import { useState, useEffect } from 'react';
import { NotifyModal } from '@/components/NotifyModal';
import { useUserContext } from '@/app/providers/UserProvider';
import { GlobalThis } from 'global-this';

export default function ErrorBoundary({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const [supportName, setSupportName] = useState('o suporte da plataforma');

	useEffect(() => {
		const name = (globalThis as GlobalThis).projectName ?? '';

		if (name === 'sebrae') {
			setSupportName('o Sebrae');
		} else if (name === 'essencia') {
			setSupportName('o suporte da Essência');
		}
	}, []);

	useEffect(() => {
		console.error(error);
	}, [error]);

	const { error: clientErrors } = useUserContext();

	if (clientErrors) {
		return (
			<NotifyModal
				title={clientErrors.title}
				message={clientErrors.message}
				logout={clientErrors.logout}
			/>
		);
	}

	const callbackReload = () => {
		if (window) {
			window?.location?.reload();
		}
	};

	return (
		<NotifyModal
			title={'Atenção'}
			message={
				'Não foi possível obter os dados da agenda. <br> <strong> Entre em contato com ' +
				supportName +
				'.</strong>'
			}
			logout={false}
			whats={false}
			callback={() => callbackReload()}
		/>
	);
}
