'use client';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Divider, IconButton, Link, Tooltip } from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';
import { ButtonIcon } from '@/components/ButtonIcon';
import UploadButton from './UploadButton.component';
import { BaseModal } from '@/components/BaseModal';
import Slider from 'react-slick';
import { ModalButton } from '@/components/NotifyModal/NotifyModal.styles';
import { CarouselModal } from '@/components/CarouselModal';
import { DeleteButton } from './DeleteButton.styles';
import { NextButton, PrevButton } from './ArrowsButton.styles';
import { useUserContext } from '@/app/providers/UserProvider';
import { useSession } from 'next-auth/react';
import { createSubmission } from '@/app/services/bff/SubmissionService';
import { useSubmissions } from '@/app/providers/SubmissionsProvider';
import { transformSubmissionsToItems } from '@/utils/transformSubmissionsToItems';
import { SubmissionResponse } from '@/types/ISubmission';
import { NotifyModal } from '@/components/NotifyModal';
import { allowedSubmitionTypes } from '@/constants/fileTypes';
import { renderFile, renderFileThumbnail } from '@/utils/renderFile';
import { sendLog } from '@/utils/sendLog';

export type FileItem = {
	id: string;
	name: string;
	type: string;
	url: string;
	file?: File;
};

interface FileUploadProps {
	/**
	 * Identificador da submissão da atividade.
	 */
	submissionId: number;
	/**
	 * Indica se esta é a última submissão permitida.
	 */
	islastSubmition: boolean;
}

/**
 * **FileUpload**
 *
 * ### 🧩 Funcionalidade
 * - Gerencia envio de arquivos para atividades, com seleção múltipla.
 * - Permite visualizar, remover arquivos e enviar submissão.
 * - Valida tipos de arquivo permitidos e tamanho.
 * - Exibe modais de confirmação, erro e sucesso.
 * - Integra com backend para criação de submissões e logs.
 * - Atualiza estado global de submissões após envio.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <FileUpload
 *   submissionId={123}
 *   islastSubmition={false}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Layout com Grid e botões customizados.
 * - Carrossel com react-slick para preview de arquivos.
 * - Modais (BaseModal, NotifyModal) para feedback.
 * - Ícones do Material-UI para ações (Delete, Visibility).
 * - Estilos customizados para botões de upload e delete.
 *
 * @component
 */
const FileUpload: FunctionComponent<FileUploadProps> = ({
  submissionId,
  islastSubmition,
}) => {
	const [error, setError] = useState(false);
	const [messageError, setMessageError] = useState<{
		message: string;
		title: string;
	}>({ message: '', title: '' });
	const [loading, setLoading] = useState(false);
	const [files, setFiles] = useState<FileItem[]>([]);
	const [open, setOpen] = useState<boolean>(false);
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const { classId, classesData } = useUserContext();
	const { data: session } = useSession();
	const modalShouldStayOpen = useRef(false);
	const { submissions, addSubmissions } = useSubmissions();
	const [submission, setSubmission] = useState<SubmissionResponse>();

	const carouselSettings = {
		dots: false,
		arrows: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		nextArrow: (
			<NextButton>
				<div>
					<img src='/icon-arrow-next.svg' alt='Próximo' />
				</div>
			</NextButton>
		),
		prevArrow: (
			<PrevButton>
				<div>
					<img src='/icon-arrow-prev.svg' alt='Anterior' />
				</div>
			</PrevButton>
		),
	};

	useEffect(() => {
		if (modalShouldStayOpen.current) {
			setOpen(true); // mantém aberto mesmo após re-render
			modalShouldStayOpen.current = false; // reseta para não abrir indevidamente depois
		}
	}, [submissions]);

	const handleOpen = () => {
		modalShouldStayOpen.current = true;
		setOpen(true);
	};
	const handleClose = () => {
		if (submission) addSubmissions(transformSubmissionsToItems([submission]));
		setOpen(false);
	};
	const handleModalOpen = (index: number) => {
		setActiveIndex(index);
		setModalOpen(true);
	};
	const handleCloseCarousel = () => {
		setModalOpen(false);
	};
	const handleUploadActivity = async (submissionId: number) => {
		// if (submissions[submissionId - 2].sent === false) {
		// 	alert('Você precisa enviar a atividade anterior antes de continuar.');
		// 	return;
		// }

		const now = new Date();
		const pad = (n: number) => n.toString().padStart(2, '0');
		const date = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;

		if (classesData && classId && session?.user) {
			setLoading(true);

			const title = `${session.user.user_display_name}_ATIVIDADE ESTRATEGICA ${submissionId}_${date}`;

			const submissionData = new FormData();
			submissionData.append('participant_email', session.user.user_email);
			submissionData.append('participant_name', session.user.user_display_name);
			submissionData.append('course_name', classesData[classId].courses.name);
			submissionData.append('class_id', String(classesData[classId].id));
			submissionData.append('class_name', classesData[classId].title);
			submissionData.append('participant_id', String(session.user.id));
			submissionData.append('activity_id', String(submissionId));
			submissionData.append('title', title);
			submissionData.append(
				'course_id',
				String(classesData[classId].courses.id),
			);
			submissionData.append('cycle_id', String(classesData[classId].ciclos.id));
			submissionData.append(
				'facilitator_id',
				String(classesData[classId].facilitator),
			);
			submissionData.append(
				'facilitator_name',
				classesData[classId].facilitator_name,
			);
			submissionData.append(
				'facilitator_email',
				classesData[classId].facilitator_email,
			);
			submissionData.append('status', 'submitted');

			files.forEach((fileObj, index) => {
				if (fileObj.file)
					submissionData.append(`files[${index}]`, fileObj.file);
			});

			try {
				const res = await createSubmission(submissionData);
				setSubmission(res);
				sendLog(
					classesData[classId].enroll_id,
					'Enviou',
					`ATIVIDADE ESTRATEGICA ${submissionId}`,
				);
				handleOpen();
			} catch (e) {
				console.error(e);
				setError(true);
				setMessageError({
					message: `Houve um problema ao enviar o arquivo selecionado! Por favor, tente novamente.`,
					title: 'Erro ao enviar o arquivo',
				});
			} finally {
				setLoading(false);
			}
		}
	};

	const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const selectedFiles = Array.from(e.target.files);

		const validFiles = selectedFiles.filter((file) => {
			if (!allowedSubmitionTypes.includes(file.type)) {
				setError(true);
				setMessageError({
					message: `O arquivo "${file.name}" não é de um tipo permitido. Tipos permitidos: PDF, imagem, Excel ou Word.`,
					title: 'Erro ao enviar o arquivo',
				});
				return false;
			}
			return true;
		});

		const newFileObjects = validFiles.map((file, i) => ({
			id: `${file.name}-${file.size}-${Date.now()}-${i}`,
			name: file.name,
			type: file.type,
			url: URL.createObjectURL(file),
			file,
		}));

		setFiles((prev) => [...prev, ...newFileObjects]);
	};

	const handleDeleteCurrent = () => {
		setFiles((prevFiles) => {
			URL.revokeObjectURL(prevFiles[activeIndex].url);

			const updatedFiles = prevFiles.filter((_, i) => i !== activeIndex);

			if (activeIndex >= updatedFiles.length) {
				setActiveIndex(Math.max(0, updatedFiles.length - 1));
			}

			if (updatedFiles.length === 0) {
				setModalOpen(false);
			}

			return updatedFiles;
		});
	};

	const handleDeleteByIndex = (index: number) => {
		setFiles((prevFiles) => {
			URL.revokeObjectURL(prevFiles[index].url);

			const updatedFiles = prevFiles.filter((_, i) => i !== index);

			return updatedFiles;
		});
	};

	return (
		<>
			<h2 className='text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-[#070D26] font-light mb-2'>
				<strong className='font-bold'>Envio</strong> de atividade
			</h2>
			<p className='text-lg text-[#6E707A] font-regular mb-9'>
				Envie para a gente a atividade direcionada pela facilitadora. Selecione
				vários arquivos, se precisar!
			</p>

			<div className='space-y-12'>
				<UploadButton action={handleFilesChange} items={files} />
				<div className='bg-white rounded-2xl border border-color-[rgba(0, 0, 0, 0.15)]'>
					<div className='px-6 py-5 border-b border-color-[rgba(110, 112, 122, 0.15)] flex justify-between'>
						<h2 className='text-xl lg:text-2xl text-[#070D26] font-bold'>
							{files.length === 0
								? 'Nenhum arquivo selecionado ainda'
								: 'Arquivos selecionados'}
						</h2>
						<h2 className='text-xl lg:text-2xl text-[#070D26] font-regular'>
							{files.length > 0 ? files.length : null}
						</h2>
					</div>

					{files.length === 0 ? (
						<div className='p-6'>
							<p className='text-lg text-[#070D26] font-regular'>
								Compartilhe sua atividade do seu jeito!
								<br />
								<br />
								Escolha um arquivo preenchido no computador ou tire uma foto do
								seu trabalho feito à mão. Aceitamos PDF, imagens, documentos de
								texto – escolha o formato que preferir.
								<br />O mais importante é você ter feito a atividade com
								dedicação.
							</p>
						</div>
					) : (
						<div className='grid grid-cols-3 md:grid-cols-5 gap-4 p-6'>
							{files.map((file, index) => {
								return (
									<div key={index} className='h-[130px] relative group'>
										<div className='w-full flex items-center justify-center  h-[130px] bg-[rgba(7,13,38,0.6)]'>
											{renderFileThumbnail(file)}
										</div>
										<div className='w-full h-[130px] bg-[rgba(7,13,38,0.6)] flex items-center justify-center opacity-0 absolute top-0 left-0 transition-all group-hover:opacity-100'>
											<h2 className='text-xl text-white font-regular'>
												<Tooltip title='Expandir'>
													<IconButton
														size='medium'
														color='inherit'
														onClick={() => handleModalOpen(index)}>
														<Visibility fontSize='medium' />
													</IconButton>
												</Tooltip>
												<Tooltip title='Remover'>
													<IconButton
														size='medium'
														color='inherit'
														onClick={() => handleDeleteByIndex(index)}>
														<Delete fontSize='medium' />
													</IconButton>
												</Tooltip>
											</h2>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				<CarouselModal
					width='80%'
					open={modalOpen}
					onClose={handleCloseCarousel}>
					<Slider
						{...carouselSettings}
						initialSlide={activeIndex}
						beforeChange={(_, next) => setActiveIndex(next)}>
						{files.map((file) => (
							<div
								key={file.id}
								className='w-full flex flex-col justify-center text-center'>
								{renderFile(file)}
							</div>
						))}
					</Slider>

					<DeleteButton
						sx={{ margin: 0 }}
						onClick={() => handleDeleteCurrent()}>
						<div>
							<img src='/icon-lixeira-branco.svg' alt='' className='w-[20px]' />
						</div>
					</DeleteButton>
				</CarouselModal>

				{files.length > 0 ? (
					<div className='flex justify-end mt-9'>
						<ButtonIcon
							disabled={loading}
							onClick={() => {
								handleUploadActivity(submissionId);
							}}
							text={loading ? 'Enviando...' : 'Enviar atividade'}
							icon='/icon-arrow-right.svg'
						/>

						{islastSubmition && (
							<BaseModal
								width='700px'
								open={open}
								onClose={handleClose}
								header={
									<h3 className='text-black-light text-3xl sm:text-32 lg:text-40 font-light mb-6 sm:text-center'>
										<strong className='font-bold'>Atividade</strong> enviada!
									</h3>
								}
								footer={
									<ModalButton>
										<Link href='/agenda' target='_blank'>
											<div>
												<img src='/icon-agenda-preto.svg' alt='' />
											</div>
											<p className='text-base sm:text-lg text-green-light font-bold'>
												Agendar consultoria
											</p>
										</Link>
									</ModalButton>
								}>
								<Divider />
								<div className='sm:text-center mt-6 mb-6'>
									<p className='text-black-light text-lg md:text-2xl sm:text-base'>
										Sua atividade foi registrada e você receberá um retorno
										sobre suas respostas.
									</p>
									<p>
										<br />
										<br />
									</p>
									<p className='text-black-light text-lg md:text-2xl sm:text-base'>
										E na consultoria, vocês poderão aprofundar a discussão sobre
										o tema!{' '}
										<strong>Já agendou a sua próxima consultoria?</strong>
									</p>
								</div>
								<Divider />
							</BaseModal>
						)}

						{!islastSubmition && (
							<BaseModal
								width='700px'
								open={open}
								onClose={handleClose}
								header={
									<h3 className='text-black-light text-3xl sm:text-32 lg:text-40 font-light mb-6 sm:text-center'>
										<strong className='font-bold'>Atividade</strong> enviada!
									</h3>
								}>
								<Divider />
								<div className='sm:text-center mt-6 mb-6'>
									<p className='text-black-light text-lg md:text-2xl sm:text-base'>
										Sua atividade foi registrada e você receberá um retorno
										sobre suas respostas. Aproveite para compartilhar com a
										turma para enriquecer a discussão em cima do tema!
									</p>
								</div>
							</BaseModal>
						)}
					</div>
				) : null}
			</div>

			{error && (
				<NotifyModal
					title={messageError.title}
					message={messageError.message}
					logout={false}
					callback={() => setError(false)}
				/>
			)}
		</>
	);
};

export default FileUpload;
