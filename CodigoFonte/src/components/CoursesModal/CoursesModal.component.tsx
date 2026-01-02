'use client';

import React, { useEffect } from 'react';
import { FunctionComponent } from 'react';
import { Grid, Modal } from '@mui/material';
import type { Props } from './CoursesModal.interface';
import { ModalContent } from './CoursesModal.styles';
import { CardCourse } from '../CardCourse';
import { useUserContext } from '@/app/providers/UserProvider';
import { Loader } from '../Loader';
import { NotifyModal } from '../NotifyModal';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { GlobalThis } from 'global-this';

const pageTitle = (pathname: string) => {
	if (pathname.includes('agendar')) {
		return '/agendar/';
	}
	if (pathname.includes('participacao')) {
		return '/participacao/';
	}
	return pathname;
};

/**
 * **CoursesModal**
 *
 * ### 🧩 Funcionalidade
 * - Exibe um modal para seleção de cursos disponíveis.
 * - Lista cursos em cards, permitindo alternância entre eles.
 * - Gerencia seleção de curso, persistência no localStorage e navegação contextual.
 * - Mostra mensagens de erro se dados da turma não estiverem disponíveis.
 * - Adapta nome do suporte baseado no projeto (Sebrae, Essência, etc.).
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <CoursesModal
 *   open={isModalOpen}
 *   onClose={handleClose}
 *   session={session}
 *   sidebar={coursesList}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Utiliza Modal do Material-UI com backdrop escuro (rgba(0,0,0,0.9)).
 * - Estilização customizada via ModalContent para layout responsivo.
 * - Cards de cursos com CardCourse component.
 *
 * @component
 */
export const CoursesModal: FunctionComponent<Props> = ({
	open,
	onClose,
	session,
	sidebar,
}) => {
	const { classesData, classId, setClassId, setClassesData, setCourseLoading } =
		useUserContext();
	const router = useRouter();
	const pathname = usePathname();
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
		const course_id = localStorage.getItem('course_id');
		if (sidebar && sidebar.length === 1) {
			changeCourse(`${sidebar[0].class_id}`);
		}
		if (course_id && sidebar && sidebar.length) {
			const course = sidebar.find(
				(course) => course.course_id?.toString() == course_id,
			);
			if (course) {
				changeCourse(course?.class_id?.toString());
			}
		}
	}, []);

	if (!classesData) {
		return <Loader />;
	}

	const changeCourse = async (turma_id: string) => {
		if (!classesData.hasOwnProperty(turma_id)) {
			//TO-DO: LEVAR O MODAL PARA O LAYOUT DA APLICAÇÃO
			return (
				<NotifyModal
					title={'Atenção'}
					message={`Não conseguimos obter os dados para essa turma. Entre em contato com ${supportName} para mais informações.`}
					logout={false}
				/>
			);
		}

		const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
		const expirationDate = new Date().getTime() + expirationTime;

		localStorage.setItem('class_id', turma_id);
		localStorage.setItem('class_id_expiration', expirationDate.toString());

		if (classesData[turma_id]) {
			setClassId(turma_id);
			console.log('turma definida: ' + turma_id);
			onClose();
			return pageTitle(pathname) !== pathname
				? router.push(pageTitle(pathname) + turma_id)
				: null;
		}

		onClose();

		return pageTitle(pathname) !== pathname
			? router.push(pageTitle(pathname) + turma_id)
			: null;
	};

	return (
		<>
			<Modal
				open={open}
				onClose={() => onClose()}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
				sx={{
					'&.MuiModal-root': {
						height: '100vh',
						overflow: 'auto',
					},
					'.MuiModal-backdrop': {
						background: 'rgba(0,0,0,0.9)',
					},
					'.MuiBox-root': {
						maxHeight: '100vh',
					},
				}}>
				<>
					{/* <CloseButton className="close group" onClick={() => onClose()}>
            <p className="text-lg text-white font-bold group-hover:text-black-light">
              Fechar
            </p>
            <div>
              <img src="/icon-close.svg" alt="Fechar" />
            </div>
          </CloseButton> */}
					<ModalContent>
						<h2 className='hidden md:block text-5xl text-green-light font-extralight mb-[58px] text-center'>
							<strong className='font-bold'>Escolha</strong> um de seus cursos
						</h2>
						<h2 className='block md:hidden text-4xl text-green-light font-extralight mb-[58px] text-center'>
							<strong className='font-bold'>Escolha</strong> um curso
						</h2>
						<Grid container spacing={3} justifyContent='center'>
							{sidebar.map((item) => {
								return (
									item?.logo_b && (
										<Grid
											item
											xs={6}
											md={3}
											key={`class_${item.class_id}_button`}>
											<CardCourse
												title={item.course_name}
												text='Entrar'
												onClick={() => changeCourse(`${item.class_id}`)}
												image={item.logo_b.url}
												height={item.logo_b.height}
												width={item.logo_b.width}
												active={classId == `${item.class_id}`}
												classId={item.class_id}
											/>
										</Grid>
									)
								);
							})}
						</Grid>
					</ModalContent>
				</>
			</Modal>
		</>
	);
};
