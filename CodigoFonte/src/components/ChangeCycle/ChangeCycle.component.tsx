'use client';
import * as React from 'react';
import { useState, useEffect, FunctionComponent } from 'react';
import { getCyclesByYear } from '@/app/services/bff/CycleService';
import type { ChangeCycleProps } from './ChangeCycle.interface';
import { Divider, Grid } from '@mui/material';
import { ButtonClass } from '@/components/ButtonClass';
import { useUserContext } from '@/app/providers/UserProvider';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { getClassesByCycle } from '@/app/services/bff/ClassService';
import { ClassByClycleResponse, Cycle } from '@/types/ICycles';
import { Loader } from '../Loader';
import { CardCycle } from './components';
import { NotifyModal } from '../NotifyModal';
import { Dropdown } from '../Dropdown';
import { useSubmissionNotifications } from '@/hooks/useSubmissionsNotification';
import { useSession } from 'next-auth/react';
import { GlobalThis } from 'global-this';

type GridColumn = {
	[key: number]: number;
};

const GRID: GridColumn = {
	0: 4,
	1: 6,
	2: 12,
};

interface ClassesByTurno {
	noturno: ClassByClycleResponse[];
	diurno: ClassByClycleResponse[];
	vespertino: ClassByClycleResponse[];
	unica: ClassByClycleResponse[];
	[key: string]: ClassByClycleResponse[];
}

/**
 * **ChangeCycle**
 * 
 * Interface completa para seleção de ciclo e turma, permitindo navegação entre diferentes
 * períodos e turmas do curso.
 * 
 * O componente é dividido em duas seções principais:
 * 1. Seleção de Ciclo: Exibe cards com os ciclos disponíveis, filtrados por ano (supervisores podem mudar o ano)
 * 2. Seleção de Turma: Após selecionar um ciclo, exibe as turmas organizadas por turno (Manhã, Tarde, Noite, Turma Única)
 * 
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Busca ciclos por ano.
 * - Filtra turmas por turno.
 * - Navegação entre ciclos e turmas.
 * - Tratamento de loading e notificações.
 * - Suporte a redirecionamento e query strings.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <ChangeCycle
 *   redirect="/turma"
 *   cycles={cyclesData}
 *   token="authToken"
 *   role="student"
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (estilos inline e componentes filhos).
 *
 * ---
 *
 * @component
 */
export const ChangeCycle: FunctionComponent<ChangeCycleProps> = ({
	redirect,
	cycles,
	token,
	role,
}) => {
	const currentYear = new Date().getFullYear().toString();
	const [classes, setClasses] = useState<ClassesByTurno | null>(null);
	const [currentCycle, setCurrentCycle] = useState<string | number>('');
	const [selectedYear, setSelectedYear] = useState(currentYear);
	const { push } = useRouter();
	const searchParams = useSearchParams();
	const prev = searchParams.get('prev');
	const { data: session } = useSession();
	const { setClassId, classesData, classId } = useUserContext();
	const [filteredCycles, setFilteredCycles] = useState<Cycle[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [supportName, setSupportName] = useState('o suporte da plataforma');

	useEffect(() => {
		const name = (globalThis as GlobalThis).projectName ?? '';

		if (name === 'sebrae') {
			setSupportName('o Sebrae');
		} else if (name === 'essencia') {
			setSupportName('o suporte da Essência');
		}
	}, []);

	const changeCycle = async (year: string) => {
		setIsLoading(true);
		cycles = await getCyclesByYear(year);

		if (classesData && classId) {
			const filtered = cycles.filter(
				(cycle) => classesData[classId].courses.id === cycle.course_id,
			);

			setFilteredCycles(filtered);
			setClasses(null);
		}

		setIsLoading(false);
	};

	useEffect(() => {
		if (classId && classesData?.[classId]) {
			const filtered = cycles.filter(
				(cycle) => classesData[classId].courses.id === cycle.course_id,
			);
			setFilteredCycles(filtered);
		}
	}, [cycles, classesData, classId]);

	useEffect(() => {
		changeCycle(currentYear);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentYear]);

	const getClassByCycle = async (cycle_id: string | number, token: string) => {
		if (isLoading) return;

		const classes = await getClassesByCycle(cycle_id, token);
		const classesByTurno = filterByTurno(classes);

		setCurrentCycle(cycle_id);

		setClasses(classesByTurno);
		return classes;
	};

	const emptyArraysCount = classes
		? ['noturno', 'diurno', 'vespertino', 'unica'].filter(
				(index) => classes[index].length === 0,
			).length
		: 0;

	const filterByTurno = (data: ClassByClycleResponse[]) => {
		const noturno = data.filter((item) => item.turno.value === 'noturno');
		const diurno = data.filter((item) => item.turno.value === 'diurno');
		const vespertino = data.filter((item) => item.turno.value === 'vespertino');
		const unica = data.filter((item) => item.turno.value === 'unica');

		return { noturno, diurno, vespertino, unica };
	};

	const { submissionNotifications } = useSubmissionNotifications({
		facilitador_id: session?.user.id,
	});

	const getLastYears = () => {
		const currentYear = new Date().getFullYear();
		return Array.from({ length: 3 }, (_, i) => (currentYear - i).toString());
	};

	if (!classesData || !classId) {
		return <Loader />;
	}

	const changeClass = async (turma_id: string) => {
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
			return push(prev ? `/${prev}` : redirect);
		}

		return push(prev ? `/${prev}` : redirect);
	};

	return (
		<>
			{isLoading && <Loader />}

			<Grid container spacing={3} sx={{ minWidth: '100%' }}>
				<Grid item xs={12}>
					<h2 className='text-2xl md:text-3xl 3xl:text-4xl text-[#070D26] font-extralight mb-[30px] md:mb-[0px] flex justify-between items-center'>
						<span className='flex'>
							<strong className='font-bold'>Selecione </strong>&nbsp;
							<span>o ciclo</span>
						</span>
						{role === 'supervisor' && (
							<Dropdown
								startItem={selectedYear}
								years={getLastYears()}
								onClick={(year) => {
									setSelectedYear(year);
									changeCycle(year);
								}}
							/>
						)}
					</h2>
					<div className='min-w-[100%] rounded-[20px] bg-[#E0E3E8] border border-[#D0D1D4] p-3 md:p-6 mt-[17px] grid grid-cols-4 gap-2 md:gap-3'>
						{filteredCycles && filteredCycles.length > 0 ? (
							filteredCycles.map((item) => (
								<div key={`cycle_${item.id}`}>
									<CardCycle
										title='Ciclo'
										numberDay={item.name}
										active={currentCycle == item.id}
										id={item.id.toString()}
										setConsultancyDate={() => getClassByCycle(item.id, token)}
										notify={
											submissionNotifications?.[item.id]?.hasSubmittedActivities
										}
									/>
								</div>
							))
						) : (
							<p className='text-2xl 3xl:text-32 text-black-light font-light'>
								Não há ciclos disponíveis.
							</p>
						)}
					</div>
				</Grid>
			</Grid>
			<div className='block md:hidden'>
				<Divider sx={{ marginTop: '30px' }} />
			</div>

			{classes && (
				<>
					{' '}
					<h2 className='text-2xl md:text-3xl 3xl:text-4xl text-[#070D26] font-extralight mt-[30px] md:mt-[60px] mb-[10px] md:mb-[0px]'>
						<strong className='font-bold'>Selecione </strong>uma turma
					</h2>
					<Grid container spacing={3}>
						{classes.diurno && classes.diurno.length > 0 ? (
							<Grid item xs={12} md={GRID[emptyArraysCount]}>
								<div className='rounded-[20px] w-[100%] bg-[#E0E3E8] border border-[#D0D1D4] mt-[17px] overflow-hidden'>
									<div className='py-[20px] px-[20px] md:px-[40px] flex justify-between'>
										<h3 className='text-2xl 3xl:text-32 text-black-light font-bold'>
											Manhã
										</h3>
										<p className='text-2xl 3xl:text-32 text-black-light font-light'>
											10h
										</p>
									</div>
									<Divider />
									{classes.diurno.map((classItem) => (
										<div
											key={classItem.id}
											onClick={() => changeClass(`${classItem.id}`)}>
											<ButtonClass
												classId={classItem.id.toString()}
												text={classItem.name}
												notify={
													submissionNotifications?.[classItem.cycle_id]
														?.classes?.[classItem.id]?.hasSubmittedActivities ??
													false
												}
											/>
										</div>
									))}
								</div>
							</Grid>
						) : (
							<></>
						)}
						{classes.vespertino && classes.vespertino.length > 0 ? (
							<Grid item xs={12} md={GRID[emptyArraysCount]}>
								<div className='rounded-[20px] w-[100%] bg-[#E0E3E8] border border-[#D0D1D4] mt-[17px] overflow-hidden'>
									<div className='py-[20px] px-[20px] md:px-[40px] flex justify-between'>
										<h3 className='text-2xl 3xl:text-32 text-black-light font-bold'>
											Tarde
										</h3>
										<p className='text-2xl 3xl:text-32 text-black-light font-light'>
											14h
										</p>
									</div>
									<Divider />
									{classes.vespertino.map((classItem) => (
										<div
											key={classItem.id}
											onClick={() => changeClass(`${classItem.id}`)}>
											<ButtonClass
												classId={classItem.id.toString()}
												text={classItem.name}
												notify={
													submissionNotifications?.[classItem.cycle_id]
														?.classes?.[classItem.id]?.hasSubmittedActivities ??
													false
												}
											/>
										</div>
									))}
								</div>
							</Grid>
						) : (
							<></>
						)}
						{classes.noturno && classes.noturno.length > 0 ? (
							<Grid item xs={12} md={GRID[emptyArraysCount]}>
								<div className='rounded-[20px] w-[100%] bg-[#E0E3E8] border border-[#D0D1D4] mt-[17px] overflow-hidden'>
									<div className='py-[20px] px-[20px] md:px-[40px] flex justify-between'>
										<h3 className='text-2xl 3xl:text-32 text-black-light font-bold'>
											Noite
										</h3>
										<p className='text-2xl 3xl:text-32 text-black-light font-light'>
											19h
										</p>
									</div>
									<Divider />
									{classes.noturno.map((classItem) => (
										<div
											key={classItem.id}
											onClick={() => changeClass(`${classItem.id}`)}>
											<ButtonClass
												classId={classItem.id.toString()}
												text={classItem.name}
												notify={
													submissionNotifications?.[classItem.cycle_id]
														?.classes?.[classItem.id]?.hasSubmittedActivities ??
													false
												}
											/>
										</div>
									))}
								</div>
							</Grid>
						) : (
							<></>
						)}
						{classes.unica && classes.unica.length > 0 ? (
							<Grid item xs={12} md={GRID[emptyArraysCount]}>
								<div className='rounded-[20px] w-[100%] bg-[#E0E3E8] border border-[#D0D1D4] mt-[17px] overflow-hidden'>
									<div className='py-[20px] px-[20px] md:px-[40px] flex justify-between'>
										<h3 className='text-2xl 3xl:text-32 text-black-light font-bold'>
											Turma Única
										</h3>
									</div>
									<Divider />
									{classes.unica.map((classItem) => (
										<div
											key={classItem.id}
											onClick={() => changeClass(`${classItem.id}`)}>
											<ButtonClass
												classId={classItem.id.toString()}
												text={classItem.name}
												notify={
													submissionNotifications?.[classItem.cycle_id]
														?.classes?.[classItem.id]?.hasSubmittedActivities ??
													false
												}
											/>
										</div>
									))}
								</div>
							</Grid>
						) : (
							<></>
						)}
					</Grid>{' '}
				</>
			)}
		</>
	);
};
