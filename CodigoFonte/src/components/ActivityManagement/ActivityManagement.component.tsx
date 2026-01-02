'use client';
import { FunctionComponent } from 'react';
import { useUserContext } from '@/app/providers/UserProvider';
import { Loader, LoaderOverlay } from '../Loader';
import {
	BootstrapTooltip,
	WhatsAppButton,
} from '../ParticipacaoTable/components';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SummaryOfActivities } from './components/SummaryOfActivities.component';
import { Filter } from './components/Filter.component';
import { Box, Menu, MenuItem } from '@mui/material';
import { ActivitiesSlider } from './components/ActivitiesSlider';
import { NotifyModal } from '../NotifyModal';
import { useSession } from 'next-auth/react';
import {
	createSubmission,
	getSubmissionFiles,
} from '@/app/services/bff/SubmissionService';
import useSubmissions from '@/hooks/useSubmissions';
import { updateActivityToExternalUtil } from '@/utils/updateActivityToExternalUtil';
import { FilterType, shouldIncludeStudent } from '@/utils/shouldIncludeStudent';
import { ButtonDownload } from '../ButtonDownload';
import { downloadFile } from '@/utils/downloadFile';
import { isDateWithinLimit } from '@/utils/dateUtils';
import { BaseModal } from '../BaseModal';
import { FileTemplateInput } from '../FileTemplateInput';
import { useActivityTemplates } from '@/hooks/useActivityTemplates';

/**
 * Status possíveis de uma atividade
 */
export type ActivityStatus =
	| 'avaliada'
	| 'recebida'
	| 'não recebida'
	| 'enviada por outra plataforma';

/**
 * Representa um estudante e suas atividades
 */
export type Student = {
	/** Identificador do estudante */
	id: string;
	/** Nome do estudante */
	name: string;
	/** CPF do estudante */
	cpf: string;
	/** Telefone do estudante */
	phone: string;
	/** Lista de atividades do estudante */
	activities: { status: ActivityStatus }[];
};

/**
 * Representa uma turma com atividades e estudantes
 */
export type Turma = {
	/** Quantidade de atividades na turma */
	activities: number;
	/** Lista de estudantes da turma */
	students: Student[];
};

/**
 * **ActivityManagement**
 *
 * Tela principal de gestão de atividades, exibindo participantes, status das atividades,
 * filtros, downloads e ações de avaliação. Permite visualizar e gerenciar o progresso das atividades estratégicas da turma.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Exibe tabela/desktop com participantes e status de cada atividade.
 * - Slider/mobile para navegação em dispositivos menores.
 * - Filtros para visualizar participantes por status de atividade.
 * - Resumo visual das atividades da turma.
 * - Ações como alterar status, redirecionar para avaliação, download de arquivos.
 * - Menu contextual para alterar status de atividades.
 * - Tratamento de loading e erros.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ActivityManagement />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (estilos inline e componentes estilizados).
 *
 * ---
 *
 * @component
 */
export const ActivityManagement: FunctionComponent = () => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [selectedStudentId, setSelectedStudentId] = React.useState<
		string | null
	>(null);
	const [selectedStudentName, setSelectedStudentName] = React.useState<
		string | null
	>(null);
	const [selectedActivityIndex, setSelectedActivityIndex] = React.useState<
		number | null
	>(null);
	const [openModalTemplate, setOpenModalTemplate] = React.useState(false);
	const { data: session } = useSession();
	const router = useRouter();

	const open = Boolean(anchorEl);
	const [filter, setFilter] = React.useState<FilterType>('todas');
	const [loadingDowload, setLoadingDowload] = React.useState<{
		id: number;
		loading: boolean;
	}>({ id: 1, loading: false });

	const { classId, classesData, themeSettings } = useUserContext();

	//TODO: verificar se esta habilitado, se nao tiver volta pra home
	const { turma, loading, updateStudentActivity } = useSubmissions(classId);

	const classIdNumber = Number(classId);
	const {
		templates,
		uploadTemplate,
		loading: loadingTemplate,
		fetchTemplates,
		deleteTemplate,
	} = useActivityTemplates({
		classId: Number(classId),
		courseId: classesData?.[classIdNumber]?.courses?.id || null,
		cycleId: classesData?.[classIdNumber]?.ciclos?.id || null,
	});

	if (!classesData || !classId) {
		return <Loader />;
	}

	/**
	 * Manipula o clique em uma atividade para abrir o menu contextual.
	 * @param event - Evento do mouse.
	 * @param studentId - ID do estudante.
	 * @param studentName - Nome do estudante.
	 * @param activityIndex - Índice da atividade.
	 */
	const handleClick = (
		event: React.MouseEvent<HTMLButtonElement>,
		studentId: string,
		studentName: string,
		activityIndex: number,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedStudentId(studentId);
		setSelectedStudentName(studentName);
		setSelectedActivityIndex(activityIndex);
	};

	const handleUpdateActivityToExternal = () => {
		updateActivityToExternal();
	};

	const handleClickModalTemplate = async () => {
		await fetchTemplates();
		setOpenModalTemplate((prev) => !prev);
	};

	const updateActivityToExternal = async () => {
		if (
			selectedActivityIndex !== null &&
			selectedStudentId &&
			selectedStudentName &&
			classesData[classId] &&
			session
		) {
			updateActivityToExternalUtil({
				courseId: `${classesData[classId].courses.id}`,
				cycloId: `${classesData[classId].ciclos.id}`,
				classId,
				facilitador_id: `${session.user.id}`,
				selectedActivityIndex,
				selectedStudentId,
				selectedStudentName,
				createSubmission,
				updateStudentActivity,
				handleClose,
			});
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
		setSelectedStudentId(null);
		setSelectedActivityIndex(null);
		setSelectedActivityIndex(null);
	};

	/**
	 * Redireciona para a página de avaliação de uma atividade específica de um estudante.
	 * @param studentId - ID do estudante.
	 * @param activity - Número da atividade.
	 * @param name - Nome do estudante.
	 * @param cpf - CPF do estudante.
	 * @param phone - Telefone do estudante.
	 * @param email - Email do estudante.
	 */
	const handleRedirect = (
		studentId: string,
		activity: number,
		name: string,
		cpf: string,
		phone: string,
		email: string,
	) => {
		const participant = {
			id: studentId,
			name,
			cpf,
			email,
			phone,
		};
		sessionStorage.setItem('selectedParticipant', JSON.stringify(participant));
		sessionStorage.setItem('selectedActivity', activity.toString());

		router.push(`/gestao-de-atividades/${studentId}`);
	};

	const handleUploadTemplateFile = async (
		file: File,
		activityIndex: number,
	) => {
		try {
			const formData = new FormData();

			formData.append('course_id', String(classesData[classId].courses.id));
			formData.append('activity_id', String(activityIndex));
			formData.append('cycle_id', String(classesData[classId].ciclos.id));
			formData.append('class_id', classId);
			formData.append(
				'description',
				`Template de atividade ${activityIndex} - Turma: ${classId} : ${classesData[classId].ciclos.id}`,
			);
			formData.append('file', file);

			await uploadTemplate(formData);
		} catch (error) {
			console.error(error);
		}
	};

	const whatsAppMessage = themeSettings?.whatsapp_message_to_facilitator;

	const handleDownloadFile = async (activity_id: number) => {
		try {
			if (classId) {
				setLoadingDowload({ id: activity_id, loading: true });
				const blob = await getSubmissionFiles({
					activity_id,
					class_id: classId,
				});

				const url = URL.createObjectURL(blob);
				downloadFile(url, `ATIVIDADE ESTRATEGICA ${activity_id}`);
				URL.revokeObjectURL(url);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoadingDowload({ id: activity_id, loading: false });
		}
	};

	const setActivities = (activities?: number) => {
		if (!activities) {
			return <></>;
		}
		const rows = [];
		for (let i = 1; i <= activities; i++) {
			rows.push(
				<BootstrapTooltip
					key={'activity_header' + i}
					title={`${i}ª atividade`}
					arrow
					placement='top'>
					<th className='text-3xl text-left w-[100px] min-w-[100px] pt-10 p-[6px]'>{`${i}ª`}</th>
				</BootstrapTooltip>,
			);
		}
		return rows;
	};

	const setDownloadButtons = (activities?: number) => {
		if (
			!activities ||
			!turma?.students ||
			!isDateWithinLimit(classesData[classId].end_date)
		) {
			return <></>;
		}

		const rows = [];
		for (let i = 1; i <= activities; i++) {
			const hasReceived = turma.students
				.filter((student) => shouldIncludeStudent(student, filter))
				.some((student) =>
					student.activities?.some(
						(activity) =>
							Number(activity.activity_id) === i &&
							activity.status === 'recebida',
					),
				);

			rows.push(
				<td key={i}>
					{hasReceived ? (
						<ButtonDownload
							icon='/icon-download-preto.svg'
							text={
								loadingDowload.id === i && loadingDowload.loading
									? 'Baixando...'
									: 'Baixar atividade'
							}
							onClick={() => handleDownloadFile(i)}
						/>
					) : (
						<div className='flex items-center gap-2'>
							<div className='w-[33px] min-w-[33px] h-[33px] rounded-full bg-white flex items-center justify-center pl-[1px] pb-[1px]'>
								<img src='/icon-download-preto.svg' alt='' width={20} />
							</div>
							<span className='text-xs'>Nenhuma disponível</span>
						</div>
					)}
				</td>,
			);
		}
		return rows;
	};

	if (loading) return <Loader />;

	if (!turma) {
		return (
			<NotifyModal
				title='Não foi possível carregar a turma'
				message=' Algo inesperado aconteceu ao tentar buscar as informações da turma. 
					Por favor, tente novamente em instantes ou entre em contato com o 
					suporte caso o problema persista.'
				logout={false}
			/>
		);
	}

	const filteredStudents = turma.students.filter((student) =>
		shouldIncludeStudent(student, filter),
	);

	return (
		<>
			<div
				className={`hidden md:block transition-opacity duration-[500ms] ease-in-out w-full overflow-x-auto`}>
				<table className='table-fixed w-[100%] max-w-[100%]'>
					<thead>
						<tr className='border-b border-gray-300'>
							<th className='w-[430px] text-left'>
								<p className='text-4xl font-bold pb-10'>Participantes</p>
							</th>
							<th
								style={{
									width: `${turma.activities * 120}px`,
									minWidth: `${turma.activities * 120}px`,
								}}
								className='text-left'
								colSpan={turma.activities}>
								<p className='text-4xl font-bold pb-10'>Gestão de atividades</p>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr className='border-b border-gray-300'>
							<th colSpan={turma.activities + 1}>
								<div className='flex w-full justify-between items-center'>
									<SummaryOfActivities data={turma} />

									<div className='flex justify-between items-center gap-4 w-git'>
										<button
											className='group'
											onClick={handleClickModalTemplate}>
											<div className='flex items-center gap-2 p-[6px] pr-4 bg-[#222325] text-[#1EFF9D] hover:text-[#222325] hover:bg-[#1EFF9D] rounded-[40px] transition-all'>
												<div className='w-[32px] min-w-[32px] h-[32px] rounded-full bg-[#1EFF9D] flex items-center justify-center pl-[1px] pb-[1px]'>
													<img
														src='/icone-template-atividades.svg'
														alt='Template das atividades'
														width={20}
													/>
												</div>
												<span className='font-bold whitespace-nowrap'>
													Template das atividades
												</span>
											</div>
										</button>
										<Filter filter={filter} onChange={setFilter} />
									</div>
								</div>
							</th>
							{/* <th className='text-left py-10 flex justify-between' colSpan={turma.activities + 1}>

							</th> */}
						</tr>
						<tr>
							<td className='text-left text-3xl py-5 w-[430px] pt-10'></td>
							{setActivities(turma.activities)}
						</tr>
						{filteredStudents.map((student, index) => {
							if (student.id && student.activities) {
								return (
									<tr
										key={`student-${index}-${student.id}`}
										className='border-b text-center border-gray-300'>
										<td className='text-left text-2xl py-5 w-[585px] flex items-center content-center gap-4'>
											<WhatsAppButton
												whatsAppMessage={`Oi ${student.name}! ${whatsAppMessage ?? ''}`}
												phone={student.phone}
											/>
											{`${student.name} (${student.cpf ? student.cpf.slice(0, 3) : 'S/N'})`}
										</td>
										{student.activities.map((activity, index) => (
											<td
												key={`activity${index}`}
												className='w-[120px] min-w-[120px] p-[6px]'>
												{activity.status === 'não recebida' ? (
													<div>
														<button
															className='block'
															onClick={(e) =>
																handleClick(e, student.id, student.name, index)
															}>
															<div className='flex items-center gap-2'>
																<div className='w-[33px] min-w-[33px] h-[33px] rounded-full bg-[#6E707A] flex items-center justify-center pl-[1px] pb-[1px]'>
																	<img
																		src='/icon-relogio-branco.svg'
																		alt=''
																		width={20}
																	/>
																</div>
																<span className='text-xs'>Não Recebida</span>
															</div>
														</button>
													</div>
												) : activity.status === 'recebida' ||
												  activity.status === 'recebida em outro canal' ? (
													<button
														onClick={() =>
															handleRedirect(
																student.id,
																index + 1,
																student.name,
																student.cpf,
																student.phone,
																student.email,
															)
														}
														className='flex items-center gap-2 ml-[-6px] p-[6px] bg-transparent rounded-[40px] hover:bg-[#222325] hover:text-[#1EFF9D] transition-all'>
														<div className='w-[33px] min-w-[33px] h-[33px] rounded-full bg-[#EBD406] flex items-center justify-center pl-[1px] pb-[1px]'>
															<img
																src='/icon-relogio-preto.svg'
																alt=''
																width={20}
															/>
														</div>
														<span className='text-xs font-bold'>
															Fazer avaliação
														</span>
													</button>
												) : activity.status === 'avaliada' ? (
													<button
														onClick={() =>
															handleRedirect(
																student.id,
																index + 1,
																student.name,
																student.cpf,
																student.phone,
																student.email,
															)
														}
														className='flex items-center gap-2 ml-[-6px] p-[6px] bg-transparent rounded-[40px] hover:bg-[#222325] hover:text-[#1EFF9D] transition-all'>
														<div className='w-[33px] min-w-[33px] h-[33px] rounded-full bg-[#1EFF9D] flex items-center justify-center'>
															<img
																src='/icon-check-preto.svg'
																alt=''
																width={24}
															/>
														</div>
														<span className='text-xs font-bold'>
															Visualizar
														</span>
													</button>
												) : null}
											</td>
										))}
									</tr>
								);
							}

							return null;
						})}
					</tbody>
					<tfoot>
						<tr>
							<td className='text-left text-3xl py-5 w-[430px] pt-10'></td>
							{setDownloadButtons(turma.activities)}
						</tr>
					</tfoot>
				</table>
			</div>
			<div
				className={`block md:hidden transition-opacity duration-[500ms] ease-in-out`}>
				<ActivitiesSlider
					classData={classesData[classId]}
					whatsAppMessage={whatsAppMessage || ''}
					students={turma.students}
				/>
			</div>

			<Menu
				id='basic-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				sx={{
					'.MuiPaper-root': {
						boxShadow: 'none',
						paddingTop: '16px',
						paddingBottom: '12px',
						borderRadius: '15px',
						background: '#FFF',
						border: '1px solid #222325',
						marginTop: 1,
					},
				}}>
				<Box>
					<p className='text-xs font-bold px-4 mb-3'>
						Alterar o status da atividade:
					</p>
					<MenuItem onClick={handleClose}>
						<div className='flex items-center gap-2'>
							<div className='w-[33px] min-w-[33px] h-[33px] rounded-full bg-[#6E707A] flex items-center justify-center pl-[1px] pb-[1px]'>
								<img src='/icon-relogio-branco.svg' alt='' width={20} />
							</div>
							<span className='text-xs'>Não Recebida</span>
						</div>
					</MenuItem>
					<MenuItem onClick={handleUpdateActivityToExternal}>
						<div className='flex items-center gap-2'>
							<div className='w-[33px] min-w-[33px] h-[33px] rounded-full bg-[#EBD406] flex items-center justify-center pl-[1px] pb-[1px]'>
								<img src='/icon-relogio-preto.svg' alt='' width={20} />
							</div>
							<span className='text-xs'>Recebida em outro canal</span>
						</div>
					</MenuItem>
				</Box>
			</Menu>

			<BaseModal
				width='700px'
				open={openModalTemplate}
				onClose={handleClickModalTemplate}
				header={
					<h3 className='text-black-light text-left py-6 text-3xl sm:text-32 lg:text-40 font-light mb-6'>
						<strong className='font-bold'>Template</strong> das atividades!
					</h3>
				}>
				<table className='w-full text-left'>
					<thead className='border-b border-opacity-20 border-black'>
						<th className='font-normal text-2xl py-5'>Atividade</th>
						<th className='font-normal text-2xl py-5'>Template</th>
					</thead>
					<tbody>
						{Array.from({ length: turma.activities }, (_, index) => {
							const activityId = index + 1;
							const template = templates[activityId];

							return (
								<tr
									key={index}
									className='border-b border-opacity-20  border-black'>
									<td className='py-5 pr-5 text-sm'>{activityId}ª Atividade</td>
									<td className='py-5 pr-5 text-sm'>
										{loadingTemplate && <Loader />}
										<FileTemplateInput
											hasFile={!!template}
											fileName={template?.original_name}
											fileUrl={`/api/activity-template-files/${template?.file_path}`}
											onUpload={(file) =>
												handleUploadTemplateFile(file, activityId)
											}
											onRemove={() => deleteTemplate(activityId)}
										/>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</BaseModal>
		</>
	);
};
