'use client';
import { Grid, IconButton, Rating, Tooltip } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import React from 'react';
import FileUpload from './components/Upload.component';
import { Visibility } from '@mui/icons-material';
import { CarouselModal } from '../CarouselModal';
import Slider from 'react-slick';
import { NextButton, PrevButton } from './components/ArrowsButton.styles';
import { renderFile, renderFileThumbnail } from '@/utils/renderFile';
import Link from 'next/link';

export interface EnvioDeAtividadesProps {
	/**
	 * Identificador único da submissão da atividade.
	 */
	id: number;
	/**
	 * Indica se esta é a última submissão permitida.
	 */
	islastSubmition: boolean;
	/**
	 * Indica se a atividade já foi enviada.
	 */
	sent: boolean;
	/**
	 * Feedback do facilitador, contendo nota e comentário.
	 */
	feedback?: {
		/**
		 * Nota atribuída pelo facilitador.
		 */
		note: number;
		/**
		 * Comentário do facilitador sobre a atividade.
		 */
		comment: string;
	};
	/**
	 * Template enviado pelo facilitador
	 */
	template?: {
		file_path: string;
	};

	/**
	 * Lista de arquivos enviados na submissão.
	 */
	items?: FileItem[];
}

export type FileItem = {
	id: string;
	name: string;
	type: string;
	url: string;
	file?: File;
};

/**
 * **EnvioDeAtividades**
 *
 * ### 🧩 Funcionalidade
 * - Gerencia envio, exibição e avaliação de atividades do usuário.
 * - Permite visualizar arquivos enviados, receber feedback do facilitador (nota e comentário).
 * - Exibe estados diferentes: enviada, avaliada ou pendente.
 * - Suporta múltiplos arquivos com carrossel para visualização.
 * - Integra FileUpload para novas submissões.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <EnvioDeAtividades
 *   id={1}
 *   islastSubmition={false}
 *   sent={true}
 *   feedback={{ note: 8, comment: "Bom trabalho!" }}
 *   items={[{ id: "1", name: "file.pdf", type: "application/pdf", url: "url" }]}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Layout responsivo com Grid do Material-UI.
 * - Carrossel com react-slick para arquivos.
 * - Cards brancos com bordas arredondadas e sombras.
 * - Rating component para exibir nota.
 * - Tooltips e ícones para interações.
 *
 * @component
 */
const EnvioDeAtividades: FunctionComponent<EnvioDeAtividadesProps> = ({
	id,
	islastSubmition,
	sent,
	items,
	feedback,
	template,
}) => {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [modalOpen, setModalOpen] = useState<boolean>(false);

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

	const handleModalOpen = (index: number) => {
		setActiveIndex(index);
		setModalOpen(true);
	};
	const handleCloseCarousel = () => {
		setModalOpen(false);
	};

	return (
		<>
			{sent ? (
				<>
					<Grid container spacing={7}>
						<Grid item xs={12} lg={8}>
							{feedback ? (
								<>
									<h2 className='text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-[#070D26] font-light mb-2'>
										<strong className='font-bold'>Atividade</strong> realizada
									</h2>
									<p className='text-lg text-[#6E707A] font-regular mb-9'>
										Nesta área você encontra sua atividade avaliada pelo
										facilitador. Os arquivos que você enviou estão disponíveis
										para visualização, junto com os comentários e a nota
										recebida.
									</p>
								</>
							) : (
								<h2 className='text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-[#070D26] font-light mb-9'>
									<strong className='font-bold'>Atividade enviada</strong> com
									sucesso
								</h2>
							)}
						</Grid>
					</Grid>
					<Grid container spacing={7} sx={{ marginBottom: 5 }}>
						{items?.length ? (
							<Grid item xs={12} lg={8}>
								<div className='bg-white rounded-2xl border border-color-[rgba(0, 0, 0, 0.15)]'>
									<div className='px-6 py-5 border-b border-color-[rgba(110, 112, 122, 0.15)] flex justify-between'>
										<h2 className='text-xl lg:text-2xl text-[#070D26] font-bold'>
											Seus arquivos enviados
										</h2>
										<h2 className='text-xl lg:text-2xl text-[#070D26] font-regular'>
											{items?.length}
										</h2>
									</div>
									<div className='grid grid-cols-3 md:grid-cols-5 gap-4 p-6'>
										{items?.map((item, index) => {
											return (
												<div key={index} className='h-[130px] relative group'>
													<div className='w-full flex items-center justify-center  h-[130px] bg-[rgba(7,13,38,0.6)]'>
														{renderFileThumbnail(item)}
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
														</h2>
													</div>
												</div>
											);
										})}
									</div>
								</div>

								<CarouselModal
									width='80%'
									open={modalOpen}
									onClose={handleCloseCarousel}>
									<Slider
										{...carouselSettings}
										initialSlide={activeIndex}
										beforeChange={(_, next) => setActiveIndex(next)}>
										{items?.map((file) => (
											<div
												key={file.id}
												className='w-full flex flex-col justify-center text-center'>
												{renderFile(file)}
											</div>
										))}
									</Slider>
								</CarouselModal>
							</Grid>
						) : (
							<Grid item xs={12} lg={8}>
								<div className='py-5 px-14 bg-[#222325] rounded-2xl text-white text-xl font-bold'>
									Atividade recebida em outro canal.
								</div>
							</Grid>
						)}
						<Grid item xs={12} lg={4}>
							{sent ? (
								<div className='bg-white rounded-2xl p-10'>
									{feedback ? (
										<>
											<h2 className='text-2xl lg:text-3xl mb-4 text-[#070D26] font-bold'>
												Avaliação
											</h2>
											<div className='border border-color-[#F5F6F9] rounded-2xl p-5 mb-4 flex flex-col items-center'>
												<Rating
													size='large'
													name='simple-controlled'
													value={feedback.note}
													readOnly
													className='!text-5xl !text-[#1EFF9D]'
												/>
												<div className='w-full flex justify-between items-center mt-2'>
													<span className='text-sm text-[#070D26] font-regular'>
														Precisa melhorar
													</span>
													<span className='text-sm text-[#070D26] font-regular'>
														Está perfeito
													</span>
												</div>
											</div>
											<div className='border border-color-[#F5F6F9] rounded-2xl p-6'>
												<p className='text-lg lg:text-xl text-[#070D26] font-bold mb-4'>
													Comentário:
												</p>
												<p className='text-lg lg:text-xl text-[#070D26] font-regular'>
													{feedback.comment}
												</p>
											</div>
										</>
									) : (
										<>
											<h2 className='text-2xl lg:text-3xl mb-4 text-[#070D26] font-bold'>
												Avaliação em andamento
											</h2>
											<p className='text-lg lg:text-xl text-[#070D26] font-regular'>
												Em breve você verá aqui o retorno do facilitador sobre a
												sua atividade. <br /> Parabéns pela participação ativa!
											</p>
										</>
									)}
								</div>
							) : null}
						</Grid>
					</Grid>
				</>
			) : (
				<Grid container spacing={7} sx={{ marginBottom: 5 }}>
					<Grid item xs={12} lg={8}>
						{template && (
							<div className='flex flex-col w-ful gap-5 mb-12'>
								<div>
									<h2 className='text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-[#070D26] font-light mb-2'>
										<strong className='font-bold'>Material</strong> da atividade
									</h2>
									<p className='text-lg text-[#6E707A] font-regular'>
										Para começar, faça o download do material que a facilitadora
										disponibilizou para esta atividade
									</p>
								</div>
								<Link
									href={`${process.env.NEXT_PUBLIC_SUBMISSIONS_STORAGE_URL}/${template?.file_path}`}
									target='_blank'>
									<button className='group w-fit'>
										<div className='flex items-center gap-2 p-[6px] pr-4 bg-[#222325] text-[#F3C80F] hover:text-[#222325] hover:bg-[linear-gradient(166deg,#EBD406_-3.37%,#FFB21E_104.04%)] rounded-[40px] transition-all'>
											<div className='w-[32px] min-w-[32px] h-[32px] rounded-full bg-[linear-gradient(166deg,#EBD406_-3.37%,#FFB21E_104.04%)] flex items-center justify-center pl-[1px] pb-[1px]'>
												<img
													src='/icon-download-preto.svg'
													alt='download'
													width={20}
												/>
											</div>
											<span className='font-bold whitespace-nowrap'>
												Template das atividades
											</span>
										</div>
									</button>
								</Link>
							</div>
						)}
						<FileUpload submissionId={id} islastSubmition={islastSubmition} />
					</Grid>
				</Grid>
			)}
		</>
	);
};

export default EnvioDeAtividades;
