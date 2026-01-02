'use client';
import { FunctionComponent, useRef, useState } from 'react';
import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useRouter } from 'next/navigation';
import {
	ActionButton,
	CloseButton,
	MeetingWrapper,
	OpenButton,
	StyledDrawer,
} from './MeetingRoom.styles';
import { NotifyModal } from '../NotifyModal';
import { useUserContext } from '@/app/providers/UserProvider';
import { Alert, Snackbar } from '@mui/material';
import { Questions } from '../Consultorias';
import useRunOnce from '@/hooks/useRunOnce';
import { setAutoPresenceByClassId } from '@/app/services/bff/ClassService';
import { userIsAdmin } from '@/utils/userIsAdmin';
import { DrawerContent } from './components';
import { ActivitiesSlider } from '../ActivityManagement/components/ActivitiesSlider';
import { useEffect } from 'react';
import { GlobalThis } from 'global-this';
import { useJitsiConfig } from '@/hooks/useJitsiConfig';

interface MeetingRoomProps {
	/**
	 * Credenciais para acesso à sala de reunião (Jitsi).
	 */
	credentials: {
		updRootToken?: string;
		updRoomName?: string;
		updRoomTitle?: string;
		jitsiServerUrl?: string; // URL do servidor Jitsi on-premises
	};
	/**
	 * Papel do usuário na reunião (ex: facilitator, subscriber).
	 */
	role: string;
	/**
	 * Token de autenticação do usuário.
	 */
	token: string;
	/**
	 * ID da turma associada à reunião.
	 */
	classId: string;
	/**
	 * Tipo da sala (ex: ClassRoom).
	 */
	roomType?: 'ClassRoom';
}

/**
 * **MeetingRoom**
 *
 * ### 🧩 Funcionalidade
 * - Exibe interface da sala de reunião virtual com Jitsi.
 * - Integra controles de presença automática, atividades e agendamento.
 * - Gerencia drawers laterais para participantes/atividades (admin) ou agendamento (aluno).
 * - Lida com credenciais Jitsi, permissões e suporte customizado.
 * - Mostra snackbars para validação de formulários.
 * 
 * ###### Para melhor vizualização acesse a aba With credentials ou Facilitador
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <MeetingRoom
 *   credentials={{
 *     updRootToken: "token",
 *     updRoomName: "room/name",
 *     updRoomTitle: "Sala Exemplo"
 *   }}
 *   role="facilitator"
 *   token="authToken"
 *   classId="123"
 *   roomType="ClassRoom"
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - MeetingWrapper com JaaSMeeting integrado.
 * - Drawers estilizados com StyledDrawer.
 * - Botões flutuantes (OpenButton, CloseButton, ActionButton).
 * - Snackbar para alertas.
 * - Configurações Jitsi customizadas (toolbar, etc.).
 *
 * @component
 */
export const MeetingRoom: FunctionComponent<MeetingRoomProps> = ({
	credentials,
	role,
	token,
	classId,
	roomType,
}) => {
	const { classesData, themeSettings } = useUserContext();
	const router = useRouter();
	const { config: jitsiConfig, isLoading: isLoadingJitsiConfig } =
		useJitsiConfig();
	const [openAttendanceDrawer, setOpenAttendanceDrawer] = useState(false);
	const [openActivityDrawer, setOpenOpenActivityDrawer] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [openModal, setOpenModal] = useState(false);
	const [drawerStep, setDrawerStep] = useState<0 | 1>(0);
	const [questions, setQuestions] = useState<Questions>({
		social_network: '',
		main_topic: '',
		specific_questions: '',
	});
	const [snackBar, setSnackBar] = useState(false);
	const [consultancyDate, setConsultancyDate] = useState<
		string | null | undefined
	>(null);
	const [startTime, setStartTime] = useState('');
	const handleDrawerOpen = () => {
		setOpenAttendanceDrawer(true);
	};
	const [supportName, setSupportName] = useState('o suporte da plataforma');

	useEffect(() => {
		const name = (globalThis as GlobalThis).projectName ?? '';

		if (name === 'sebrae') {
			setSupportName('o Sebrae');
		} else if (name === 'essencia') {
			setSupportName('o suporte da Essência');
		}
	}, []);

	// Função para obter a URL do servidor Jitsi
	const getJitsiServerUrl = () => {
		let serverUrl = '';

		// Prioridade 1: URL fornecida diretamente nas credenciais
		if (credentials.jitsiServerUrl) {
			serverUrl = credentials.jitsiServerUrl;
		}
		// Prioridade 2: URL obtida da API (configuração server-side)
		else if (jitsiConfig.serverUrl) {
			serverUrl = jitsiConfig.serverUrl;
		}
		// Fallback: servidor público do Jitsi
		else {
			serverUrl = 'meet.jit.si';
		}

		// Remove protocolo se presente (JitsiMeeting espera apenas o domínio)
		const cleanUrl = serverUrl.replace(/^https?:\/\//, '');

		console.log('🔧 Jitsi URL Debug:', {
			originalUrl: serverUrl,
			cleanUrl: cleanUrl,
			credentialsUrl: credentials.jitsiServerUrl,
			configUrl: jitsiConfig.serverUrl,
		});

		return cleanUrl;
	};

	// Função para obter o nome da sala (sem app_id se for Jitsi on-premises)
	const getRoomName = () => {
		let roomName = credentials.updRoomName || 'sala-de-reuniao';

		// Se estiver usando Jitsi on-premises (não 8x8), remover app_id da sala
		const serverUrl = getJitsiServerUrl();
		const isOnPremises =
			!serverUrl.includes('8x8.vc') && !serverUrl.includes('meet.jit.si');

		if (isOnPremises && roomName.includes('/')) {
			// Remove app_id (parte antes da barra) para Jitsi on-premises
			roomName = roomName.split('/').pop() || roomName;
		}

		console.log('🔧 Room Name Debug:', {
			originalRoomName: credentials.updRoomName,
			finalRoomName: roomName,
			isOnPremises: isOnPremises,
			serverUrl: serverUrl,
		});

		return roomName;
	};

	const showAttendanceButtons = openAttendanceDrawer;
	const showActivityButton =
		classesData?.[classId]?.enable_strategic_activities;
	const showActivityOpenButton =
		showActivityButton && !openAttendanceDrawer && !openActivityDrawer;
	const showActivityCloseButton =
		showActivityButton && !openAttendanceDrawer && openActivityDrawer;
	const showMainOpenButton = !openAttendanceDrawer && !openActivityDrawer;

	const handleDrawerClose = () => {
		setDrawerStep(0);
		setOpenAttendanceDrawer(false);
		setConsultancyDate(null);
		setStartTime('');
		setQuestions({
			social_network: '',
			main_topic: '',
			specific_questions: '',
		});
	};

	const autoPresence = (class_id: string) => {
		console.log('Pensença Automatica Iniciada');
		let minutesRemaining = 10;
		const intervalId = setInterval(async function () {
			minutesRemaining--;

			if (minutesRemaining <= 0) {
				clearInterval(intervalId); // Stop the interval after 10 minutes
				const resp = await setAutoPresenceByClassId(class_id);

				if (resp.status === 403) {
					autoPresence(class_id);
				}
			}
		}, 60 * 1000);
	};

	useRunOnce({
		fn: () => {
			if (classId && !userIsAdmin([role]) && roomType === 'ClassRoom') {
				autoPresence(classId);
			}
		},
	});

	if (!credentials?.updRoomName) {
		return (
			<NotifyModal
				title={'Atenção'}
				message={`Não foi possível obter suas credenciais de acesso a sala de reunião. Entre na sala novamente ou entre contato com ${supportName}.`}
				logout={false}
				callback={() => router.back()}
			/>
		);
	}

	// Aguarda o carregamento da configuração do Jitsi
	if (isLoadingJitsiConfig) {
		return (
			<MeetingWrapper>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100%',
						fontSize: '18px',
						color: '#666',
					}}>
					Carregando configuração da reunião...
				</div>
			</MeetingWrapper>
		);
	}

	const firstForwardButton = () => {
		if (consultancyDate && startTime) {
			setSnackBar(false);
			return setDrawerStep(1);
		}
		return setSnackBar(true);
	};

	const handleOpenAppointmentModal = () => {
		if (consultancyDate && startTime && areAttributesNotEmpty(questions)) {
			setOpenModal(true);
			return setSnackBar(false);
		}
		return setSnackBar(true);
	};

	function areAttributesNotEmpty(obj: Questions): boolean {
		for (const key in obj) {
			if (obj[key as keyof Questions] === '') {
				return false;
			}
		}
		return true;
	}

	return (
		<MeetingWrapper>
			<JitsiMeeting
				domain={getJitsiServerUrl()} // URL do servidor Jitsi (sem protocolo)
				roomName={getRoomName()} // Nome da sala (sem app_id se on-premises)
				jwt={credentials.updRootToken}
				configOverwrite={{
					'prejoinConfig.enabled': false,
					startWithAudioMuted: true,
					startWithVideoMuted: true,
					subject: credentials.updRoomTitle || 'Sala de Reunião',
					
					// Configurações JWT para reconhecer moderador
					enableUserRolesBasedOnToken: true,
					enableFeaturesBasedOnToken: true,
					moderatedRoomServiceUrl: null,
					tokenAuthUrl: null,
					
					conferenceInfo: {
						autoHide: [
							'subject',
							'conference-timer',
							'participants-count',
							'e2ee',
							'video-quality',
							'insecure-room',
							'top-panel-toggle',
						],
					},
					breakoutRooms: {
						hideAddRoomButton: true,
					},
					giphy: {
						enabled: false,
					},
					gravatar: {
						baseUrl: 'https://www.gravatar.com/avatar/',
						disabled: true,
					},
					disableChatSmileys: true,
					toolbarButtons: [
						'camera',
						'chat',
						'closedcaptions',
						'desktop',
						'download',
						'embedmeeting',
						'etherpad',
						'feedback',
						'filmstrip',
						'fullscreen',
						'hangup',
						'help',
						'highlight',
						// 'invite',
						'linktosalesforce',
						// 'livestreaming',
						'microphone',
						'noisesuppression',
						'participants-pane',
						'profile',
						'raisehand',
						'recording',
						// 'security',
						'select-background',
						'settings',
						'shareaudio',
						'sharedvideo',
						'shortcuts',
						'stats',
						'tileview',
						'toggle-camera',
						'videoquality',
						'whiteboard',
					],
				}}
				onReadyToClose={() => router.push('/home')}
				getIFrameRef={(iframeRef) => {
					iframeRef.style.height = '100%';
					iframeRef.style.width = '100%';
				}}
			/>
			<StyledDrawer
				anchor='right'
				open={openAttendanceDrawer}
				sx={{ '.MuiDrawer-paper': { overflow: role ? '' : 'hidden' } }}>
				<DrawerContent
					classId={classId}
					token={token}
					isAdmin={userIsAdmin([role])}
					themeSettings={themeSettings}
					classesData={classesData}
					openModal={openModal}
					setOpenModal={setOpenModal}
					drawerStep={drawerStep}
					setDrawerStep={setDrawerStep}
					consultancyDate={consultancyDate}
					setConsultancyDate={setConsultancyDate}
					startTime={startTime}
					setStartTime={setStartTime}
					setQuestions={setQuestions}
					questions={questions}
					handleDrawerClose={handleDrawerClose}
					type={role}
				/>
			</StyledDrawer>
			<StyledDrawer
				anchor='right'
				open={openActivityDrawer}
				sx={{ '.MuiDrawer-paper': { overflow: role ? '' : 'hidden' } }}>
				{classesData && (
					<ActivitiesSlider
						classData={classesData[classId]}
						whatsAppMessage={''}
					/>
				)}
			</StyledDrawer>

			{showAttendanceButtons && (
				<>
					<CloseButton className='group' onClick={handleDrawerClose}>
						<div>
							<img src='/icon-close.svg' alt='Fechar' />
						</div>
						<p className='text-lg text-white font-bold group-hover:text-black-light'>
							Fechar
						</p>
					</CloseButton>

					{drawerStep === 0 && consultancyDate && startTime && (
						<ActionButton
							ref={buttonRef}
							className='open group md:right-5'
							onClick={firstForwardButton}>
							<div>
								<img src='/icon-arrow-right.svg' alt='Avançar' />
							</div>
							<p className='text-lg text-white font-bold group-hover:text-black-light'>
								Avançar
							</p>
						</ActionButton>
					)}

					{drawerStep === 1 &&
						consultancyDate &&
						startTime &&
						areAttributesNotEmpty(questions) && (
							<ActionButton
								ref={buttonRef}
								className='open group md:right-5'
								onClick={handleOpenAppointmentModal}>
								<div>
									<img src='/icon-arrow-right.svg' alt='Concluir' />
								</div>
								<p className='text-lg text-white font-bold group-hover:text-black-light'>
									Concluir agendamento
								</p>
							</ActionButton>
						)}
				</>
			)}

			{showMainOpenButton && (
				<OpenButton
					positionIndex={0}
					ref={buttonRef}
					className='open group'
					onClick={handleDrawerOpen}>
					{role === 'facilitator' ? (
						<>
							<div>
								<img src='/icon-people-green.svg' alt='Participantes' />
							</div>
							<p className='text-lg text-black-light font-bold group-hover:text-green-light'>
								Participantes
							</p>
						</>
					) : (
						<>
							<div>
								<img src='/icon-agenda.svg' alt='Agendar' />
							</div>
							<p className='text-lg text-black-light font-bold group-hover:text-green-light'>
								Agendar
							</p>
						</>
					)}
				</OpenButton>
			)}

			{showActivityOpenButton && userIsAdmin([role]) && (
				<OpenButton
					positionIndex={1}
					ref={buttonRef}
					className='open group'
					onClick={() => setOpenOpenActivityDrawer(true)}>
					<div>
						<img src='/icon-agenda.svg' alt='Atividades' />
					</div>
					<p className='text-lg text-black-light font-bold group-hover:text-green-light'>
						Atividades
					</p>
				</OpenButton>
			)}

			{showActivityCloseButton && (
				<CloseButton
					className='group'
					onClick={() => setOpenOpenActivityDrawer(false)}>
					<div>
						<img src='/icon-close.svg' alt='Fechar atividades' />
					</div>
					<p className='text-lg text-white font-bold group-hover:text-black-light'>
						Fechar
					</p>
				</CloseButton>
			)}

			<Snackbar
				open={snackBar}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				sx={{ height: '64px' }}>
				<Alert
					severity='warning'
					variant='filled'
					style={{
						background: 'var(--light-black)',
						color: 'var(--primary-color)',
						fontSize: '16px',
					}}>
					Preencha todos os campos para avançar
				</Alert>
			</Snackbar>
		</MeetingWrapper>
	);
};
