'use client';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import React from 'react';
import Slider from 'react-slick';
import {
	SliderArrow,
	SliderArrows,
	SliderHeader,
} from './StrategicActivitiesSlider.styles';
import EnvioDeAtividades from '../EnvioDeAtividades/EnvioDeAtividades.component';
import { useUserContext } from '@/app/providers/UserProvider';
import { useSubmissions } from '@/app/providers/SubmissionsProvider';
import { getAllSubmissions } from '@/app/services/bff/SubmissionService';
import { transformSubmissionsToItems } from '@/utils/transformSubmissionsToItems';
import { NotifyModal } from '../NotifyModal';
import { useActivityTemplates } from '@/hooks/useActivityTemplates';

interface Props {
	/**
	 * ID do usuário para buscar as atividades estratégicas.
	 */
	userId: number;
}

/**
 * **StrategicActivitiesSlider**
 *
 * ### 🧩 Funcionalidade
 * - Carrossel de atividades estratégicas do usuário.
 * - Busca e transforma submissões, integra contexto.
 * - Navegação entre submissões, feedback de erro.
 * - Usa react-slick para slider.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <StrategicActivitiesSlider userId={123} />
 * ```
 *
 * ### 🎨 Estilização
 * - Section com bg-gray-100.
 * - SliderHeader com arrows.
 * - Slider container.
 * - NotifyModal para erro.
 *
 * @component
 */
export const StrategicActivitiesSlider: FunctionComponent<Props> = ({
	userId,
}) => {
	const [error, setError] = useState(false);
	const [currentSlide, setCurrentSlide] = useState(0);
	const sliderRef = useRef<Slider>(null);
	const { classId, classesData } = useUserContext();
	const { submissions, addSubmissions, clearSubmissions } = useSubmissions();

	const classIdNumber = Number(classId);
	const { templates, loading: loadingTemplate } = useActivityTemplates({
		classId: Number(classId),
		courseId: classesData?.[classIdNumber]?.courses?.id || null,
		cycleId: classesData?.[classIdNumber]?.ciclos?.id || null,
	});

	useEffect(() => {
		const fetchSubmissions = async () => {
			try {
				setError(false);
				if (classId && classesData) {
					const totalSubmissions =
						classesData[classId].strategic_activities_number;

					const result = await getAllSubmissions({
						participant_id: userId,
						course_id: classesData[classId].courses.id,
						class_id: classesData[classId].id,
					});
					clearSubmissions();
					const transformed = transformSubmissionsToItems(result);

					const remaining = totalSubmissions - transformed.length;
					const pendingSubmissions = Array.from(
						{ length: remaining },
						(_, i) => ({
							sent: false,
							id: transformed.length + i + 1,
						}),
					);

					addSubmissions([...transformed, ...pendingSubmissions]);
				}
			} catch (e) {
				console.error(e);
				setError(true);
			}
		};

		fetchSubmissions();
	}, [userId, classId]);

	const goToPrevSlide = () => {
		sliderRef.current?.slickPrev();
	};
	const goToNextSlide = () => {
		sliderRef.current?.slickNext();
	};

	const settings = {
		dots: false,
		arrows: false,
		infinite: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: false,
		draggable: false,
		beforeChange: (oldIndex: number, newIndex: number) =>
			setCurrentSlide(newIndex),
	};

	return (
		<section className='flex justify-center w-full py-[40px] px-[20px] md:px-[70px] md:pl-[150px] 3xl:pl-[190px] min-h-screen bg-gray-100'>
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
						{submissions &&
							submissions.map((activity, index) => {
								const islastSubmition = index === submissions.length - 1;

								return (
									<div key={'activity_' + activity.id}>
										<EnvioDeAtividades
											id={activity.id}
											template={templates[activity.id]}
											islastSubmition={islastSubmition}
											sent={activity.sent}
											items={activity.items}
											feedback={activity.feedback}
										/>
									</div>
								);
							})}
					</Slider>
				</div>
				{error && (
					<NotifyModal
						title='Erro ao Buscar Atividades Estratégicas'
						message='Não foi possível carregar as atividades estratégicas no momento. Por favor, verifique sua conexão com a internet ou tente novamente mais tarde. Se o problema persistir, entre em contato com o suporte.'
						logout={false}
						callback={() => setError(false)}
					/>
				)}
			</div>
		</section>
	);
};
