'use client';
import { FunctionComponent } from 'react';
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';
import React from 'react';
import { FilterType } from '@/utils/shouldIncludeStudent';

/**
 * Propriedades para o componente Filter
 */
interface FilterProps {
	/** Valor do filtro selecionado */
	filter: string;
	/** Função chamada ao alterar o filtro */
	onChange: (value: FilterType) => void;
}

/**
 * **Filter**
 *
 * Componente que exibe um select para filtrar participantes por status de atividade.
 * Permite selecionar filtros como "todas", "não recebida", "recebida" ou "avaliada" para visualizar apenas participantes que atendem ao critério.
 *
 * ---
 *
 * ### 🧩 Funcionalidade
 * - Select dropdown com opções de filtro baseadas em FilterType.
 * - Chama callback onChange ao alterar a seleção.
 * - Estilizado com Material-UI para consistência.
 *
 * ---
 *
 * ### 💡 Exemplo de uso
 *
 * ```tsx
 * <Filter
 *   filter="todas"
 *   onChange={handleFilterChange}
 * />
 * ```
 *
 * ---
 *
 * ### 🎨 Estilização
 * Arquivo de estilos: (usa estilos inline e Material-UI).
 *
 * ---
 *
 * @component
 */
export const Filter: FunctionComponent<FilterProps> = ({
	filter,
	onChange,
}: FilterProps) => {
	const handleChange = (event: SelectChangeEvent) => {
		onChange(event.target.value as FilterType);
	};

	return (
		<FormControl
			fullWidth
			sx={{ maxWidth: 530, fontSize: 20 }}
			className='text-2xl'>
			<InputLabel sx={{ fontSize: 20 }} id='demo-simple-select-label'>
				Listar todos os participantes
			</InputLabel>
			<Select
				labelId='demo-simple-select-label'
				id='demo-simple-select'
				value={filter}
				label='Listar todos os participantes'
				onChange={handleChange}
				sx={{ borderRadius: '15px', textAlign: 'left', fontSize: 20 }}>
				<MenuItem value={'todas'}>Listar todos os participantes</MenuItem>
				<MenuItem value={'não recebida'}>
					Listar atividades não recebidas
				</MenuItem>
				<MenuItem value={'recebida'}>
					Listar atividades pendentes de avaliação
				</MenuItem>
				<MenuItem value={'avaliada'}>Listar atividades concluídas</MenuItem>
			</Select>
		</FormControl>
	);
};
