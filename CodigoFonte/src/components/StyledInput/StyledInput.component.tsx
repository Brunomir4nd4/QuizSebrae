'use client'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import FormControl from '@mui/material/FormControl';
import { Props } from './StyledInput.interface';

const CustomInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        backgroundColor: 'none',
        border: 'none',
        fontSize: '20px',
        color: '#6E707A',
        '&:focus': {
          outline: 'none'
        },
        '&::placeholder': {
          color: 'black'
        }
    },
    '&::placeholder': {
      color: 'black'
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
        '&::placeholder': {
          color: 'black'
        }
    },
    '&::placeholder': {
      color: 'black'
    },
    [theme.breakpoints.down('sm')]: {
      '& .MuiInputBase-input': {
        fontSize: '16px', 
      }
    }
}));

/**
 * **StyledInput**
 *
 * ### 🧩 Funcionalidade
 * - Campo de entrada estilizado com Material-UI InputBase.
 * - Suporta variantes de estilo (cor de texto).
 * - Placeholder, valor controlado via setValue.
 * - Responsivo para mobile.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <StyledInput
 *   placeholder="Digite aqui"
 *   value={inputValue}
 *   setValue={setInputValue}
 *   name="input"
 *   variant={true}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - CustomInput/CustomInputVariant styled.
 * - Font size 20px, focus outline none.
 * - Placeholder color black.
 * - Mobile font 16px.
 *
 * @component
 */
export const StyledInput: React.FunctionComponent<Props> = ({placeholder, value, setValue, name, variant = true}) => {
  return (
      <FormControl fullWidth>
        {variant 
          ? <CustomInputVariant name={name} onChange={(e) => setValue(e)} value={value} placeholder={placeholder} /> 
          : <CustomInput name={name} onChange={(e) => setValue(e)} value={value} placeholder={placeholder} /> 
        }
      </FormControl>
  );
}