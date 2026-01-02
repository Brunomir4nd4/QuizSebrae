'use client';

import React from 'react';
import { FunctionComponent, useState } from 'react';
import { Divider } from '@mui/material';
import { ModalButton } from './NotifyModal.styles';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { datadogRum } from '@datadog/browser-rum';
import { BaseModal } from '../BaseModal';
import { useUserContext } from '@/app/providers/UserProvider';

/**
 * Props do componente NotifyModal
 * 
 * Modal de notificação genérica para exibir mensagens de sucesso, erro ou informação ao usuário.
 */
interface NotifyModalProps {
	/**
	 * Título principal da notificação
	 */
	title: string;
	/**
	 * Subtítulo exibido abaixo do título principal (opcional)
	 */
	subtitle?: string;
	/**
	 * Texto destacado em negrito antes do título (ex: "Sucesso:", "Erro:")
	 */
	highlight?: string;
	/**
	 * Mensagem principal da notificação (suporta HTML)
	 */
	message: string;
	/**
	 * Se true, executa logout ao fechar a modal
	 */
	logout: boolean;
	/**
	 * Controla se a modal inicia aberta (padrão: true)
	 */
	modalOpen?: boolean;
	/**
	 * Se true, exibe botão "Chama no Whats" para suporte
	 */
	whats?: boolean;
	/**
	 * Link customizado do WhatsApp (sobrescreve o link de suporte padrão)
	 */
	whatsLink?: string;
	/**
	 * Função callback executada ao fechar a modal
	 */
	callback?: () => void;
	/**
	 * Se true, exibe botão "Tentar novamente" que recarrega a página
	 */
	reload?: boolean;
	/**
	 * Se true, navega para a página anterior ao fechar a modal
	 */
	backOnClose?: boolean;
}

/**
 * **NotifyModal**
 *
 * ### 🧩 Funcionalidade
 * - Modal genérica para notificações (sucesso, erro, info).
 * - Suporta logout, WhatsApp, reload, back navigation.
 * - Mensagem suporta HTML.
 * - Integra Datadog e contexto do usuário.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <NotifyModal
 *   title="Sucesso"
 *   message="Operação realizada!"
 *   logout={false}
 *   whats={true}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - BaseModal com header, footer customizados.
 * - ModalButton para ações.
 * - Divider para separação.
 * - Texto centralizado com dangerouslySetInnerHTML.
 *
 * @component
 */
export const NotifyModal: FunctionComponent<NotifyModalProps> = ({
	title,
	subtitle,
	highlight,
	message,
	logout,
	whats,
	whatsLink,
	callback,
	reload,
	backOnClose,
	modalOpen = true,
}) => {
	const [open, setOpen] = useState<boolean>(modalOpen);
	const router = useRouter();
	const { themeSettings } = useUserContext();
	const whatsSupportLink = themeSettings?.whatsapp_support_link;

	const logOut = () => {
		localStorage.removeItem('class_id');
		localStorage.removeItem('class_id_expiration');
		localStorage.removeItem('course_id');

		signOut({
			redirect: true,
		})
			.then(() => {
				datadogRum.clearUser();

				router.replace('/');
			})
			.catch((error) => {
				console.error('Error during logout:', error);
				// Handle the error as needed
			});
	};

	const handleClose = () => {
		setOpen(false);
		if (logout) {
			logOut();
		}
		if (callback) {
			callback();
		}
		if (backOnClose) {
			router.back();
		}
	};

	return (
		<BaseModal
			open={open}
			onClose={handleClose}
			header={
				<h3 className='text-black-light text-3xl sm:text-32 lg:text-40 font-light mb-6 sm:text-center'>
					<strong className='font-bold'>{highlight}</strong> {title}
				</h3>
			}
			footer={
				<>
					{whats && (
						<ModalButton>
							<Link
								href={
									whatsSupportLink ||
									whatsLink ||
									'https://sebraeingresse.com.br/suporte/'
								}
								target='_blank'>
								<div>
									<img src='/icon-whats.svg' alt='' />
								</div>
								<p className='text-base sm:text-lg text-green-light font-bold'>
									Chama no Whats
								</p>
							</Link>
						</ModalButton>
					)}
					{reload && (
						<ModalButton
							onClick={() => window?.location?.reload()}
							style={{ paddingRight: '0' }}>
							<a
								style={{
									display: 'flex',
									alignItems: 'center',
									flexDirection: 'row',
									position: 'relative',
									zIndex: '2',
									height: '42px',
									width: 'auto',
									margin: '0 21px',
								}}>
								<p className='text-base sm:text-lg text-green-light font-bold'>
									Tentar novamente
								</p>
							</a>
						</ModalButton>
					)}
				</>
			}>
			<Divider />
			<div className='sm:text-center mt-6 mb-6'>
				<h3 className='text-black-light'>{subtitle}</h3>
				<p
					className='text-black-light text-sm sm:text-base'
					dangerouslySetInnerHTML={{ __html: message }}
				/>
			</div>
			<Divider />
		</BaseModal>
	);
};
