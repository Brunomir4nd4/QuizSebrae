'use client';
import { FunctionComponent, useRef, useState } from 'react';
import React from 'react';
import Slider from 'react-slick';
import {
	CloseButton,
	OpenButton,
	SliderArrow,
	SliderArrows,
	SliderHeader,
	StyledDrawer,
} from './ActivityEvaluationSlider.styles';
import ActivityEvaluation, {
	ActivityEvaluationProps,
} from '../ActivityEvaluation/ ActivityEvaluation.component';
import { useUserContext } from '@/app/providers/UserProvider';
import { Loader } from '../Loader';
import { ActivitiesSlider } from '../ActivityManagement/components/ActivitiesSlider';
import useSubmissions from '@/hooks/useSubmissions';
import { NotifyModal } from '../NotifyModal';

/**
 * Propriedades para o componente ActivityEvaluationSlider
 */
export interface Props {
	/** Lista de atividades para avaliação */
	items: ActivityEvaluationProps[];
	/** Número da atividade atualmente selecionada */
	selectedActivity: number;
	/** Id do participante selecionado */
	selectedParticipant: number;
	/** Nome do participante selecionado */
	selectedStudentName: string;
	/** Email do participante selecionado */
	selectedStudentEmail: string;
	/** Callback chamado ao alterar alguma avaliação */
	onChange?: () => void;
}

/**
 * **ActivityEvaluationSlider**
 *
 * Componente que exibe um carrossel de avaliações de atividades para um participante, permitindo navegação entre atividades e avaliação individual.
 * Inclui um drawer lateral para visualizar a lista de participantes e suas atividades, facilitando a gestão durante a avaliação.
 * 
 * ###### Para melhor vizualização acesse a aba Default
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Slider/carrossel para navegar entre atividades de um participante.
 * - Renderiza o componente ActivityEvaluation para cada atividade.
 * - Drawer lateral com ActivitiesSlider para visualizar participantes.
 * - Botões para abrir/fechar o drawer de participantes.
 * - Tratamento de estados de loading e erro ao carregar dados da turma.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ActivityEvaluationSlider
 *   items={evaluationItems}
 *   selectedActivity={1}
 *   selectedParticipant={123}
 *   selectedStudentName="João Silva"
 *   selectedStudentEmail="joao@email.com"
 *   onChange={handleEvaluationChange}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: ActivityEvaluationSlider.styles.tsx.
 *
 * ---
 *
 * @component
 */

export const ActivityEvaluationSlider: FunctionComponent<Props> = ({
	items,
	selectedActivity,
	selectedParticipant,
	selectedStudentName,
	selectedStudentEmail,
	onChange,
}) => {
	const { classId, classesData, themeSettings } = useUserContext();
	const initialIndex = selectedActivity - 1;
	const [currentSlide, setCurrentSlide] = useState(initialIndex);
	const sliderRef = useRef<Slider>(null);
	const { turma, loading } = useSubmissions(classId)

	const [open, setOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	const goToPrevSlide = () => {
		sliderRef.current?.slickPrev();
	};
	const goToNextSlide = () => {
		sliderRef.current?.slickNext();
	};

	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};

	const settings = {
		dots: false,
		arrows: false,
		infinite: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: false,
		draggable: false,
		initialSlide: initialIndex,
		beforeChange: (oldIndex: number, newIndex: number) =>
			setCurrentSlide(newIndex),
	};

	if (!classesData || !classId || loading) {
		return <Loader />;
	}

	if (!turma) {
		return (
			<NotifyModal
				title="Não foi possível carregar a turma"
				message=" Algo inesperado aconteceu ao tentar buscar as informações da turma. 
					Por favor, tente novamente em instantes ou entre em contato com o 
					suporte caso o problema persista."
				logout={false}
			/>
		)
	}

	const whatsAppMessage = themeSettings?.whatsapp_message_to_facilitator;

	return (
		<section className='flex justify-center w-full pb-[40px] px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] min-h-screen bg-gray-100'>
			<div className='max-w-[1640px] w-full'>
				<SliderHeader>
					<SliderArrows>
						<SliderArrow onClick={goToPrevSlide}>
							<img src='/icon-arrow-prev.svg' alt='Anterior' />
						</SliderArrow>
						<p className='text-xl text-white font-bold'>
							{currentSlide + 1}ª atividade
						</p>
						<SliderArrow onClick={goToNextSlide}>
							<img src='/icon-arrow-next.svg' alt='Próximo' />
						</SliderArrow>
					</SliderArrows>
				</SliderHeader>
				<div className='slider-container'>
					<Slider ref={sliderRef} {...settings}>
						{items &&
							items.map((activity) => {
								return (
									<div key={'activity_' + activity.id}>
										<ActivityEvaluation
											id={activity.id}
											status={activity.status}
											items={activity.items}
											feedback={activity.feedback}
											selectedParticipant={selectedParticipant}
											selectedStudentName={selectedStudentName}
											selectedStudentEmail={selectedStudentEmail}
											selectedActivity={currentSlide + 1}
											onChange={onChange}
										/>
									</div>
								);
							})}
					</Slider>
				</div>

				<StyledDrawer anchor='right' open={open}>
					<ActivitiesSlider
						classData={classesData[classId]}
						whatsAppMessage={whatsAppMessage || ''}
						students={turma.students}
					/>
				</StyledDrawer>
				{open ? (
					<>
						<CloseButton className='group' onClick={() => handleDrawerClose()}>
							<div>
								<img src='/icon-close.svg' alt='Fechar' />
							</div>
							<p className='text-lg text-white font-bold group-hover:text-black-light'>
								Fechar
							</p>
						</CloseButton>
					</>
				) : (
					<OpenButton
						ref={buttonRef}
						className='open group'
						onClick={handleDrawerOpen}>
						<>
							<div>
								<img src='/icon-people-green.svg' alt='Fechar' />
							</div>
							<p className='text-lg text-black-light font-bold group-hover:text-green-light'>
								Participantes
							</p>
						</>
					</OpenButton>
				)}
			</div>
		</section>
	);
};
