'use client'
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import type { Props } from './StyledSelect.interface';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FunctionComponent, useState } from 'react';
import { InputBase, styled } from '@mui/material';

const CustomInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
      backgroundColor: 'none',
      border: 'none',
      fontSize: '20px',
      color: '#000',
      '&:focus': {
        outline: 'none'
      },
      '&::placeholder': {
        color: 'black'
      }
    },
    [theme.breakpoints.down('sm')]: {
        '& .MuiInputBase-input': {
          fontSize: '16px', 
        }
    }
}));

const CustomInputVariant = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
      backgroundColor: 'none',
      border: 'none',
      fontSize: '20px',
      color: '#222325',
      '&:focus': {
        outline: 'none'
      },
    },
    [theme.breakpoints.down('sm')]: {
        '& .MuiInputBase-input': {
          fontSize: '16px', 
        }
    }
}));


/**
 * **StyledSelect**
 *
 * ### 🧩 Funcionalidade
 * - Campo de seleção estilizado com Material-UI Select.
 * - Seleção múltipla (retorna array).
 * - Placeholder, itens lista, valor controlado.
 * - Suporta variantes de estilo.
 * - Responsivo para mobile.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <StyledSelect
 *   placeholder="Selecione"
 *   items={["Op1", "Op2"]}
 *   name="select"
 *   setValue={setValue}
 *   value={value}
 *   variant={true}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - CustomInput/CustomInputVariant.
 * - MenuItem para opções.
 * - Font size 20px, mobile 16px.
 *
 * @component
 */
export const StyledSelect: FunctionComponent<Props> = ({placeholder, items, name, setValue, value, variant}) => {
    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const {
          target: { value },
        } = event;
        setValue(event as React.ChangeEvent<HTMLInputElement>);
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
  
    };

    const [personName, setPersonName] = useState<string[]>([]);

    return (
        <FormControl fullWidth>
            <Select
                name={name}
                displayEmpty
                value={personName}
                onChange={handleChange}
                renderValue={(selected) => {
                if (selected.length === 0) {
                    return <>{placeholder}</>;
                }
                return selected.join(', ');
                }}
                input={variant ? <CustomInputVariant /> : <CustomInput />}
            >
            <MenuItem disabled value="">
                {placeholder}
            </MenuItem>
            {items.map((item, index) => (
                <MenuItem
                    key={index}
                    value={item}
                >
                    {item}
                </MenuItem>
            ))}
            </Select>
        </FormControl>
    );
};