'use client'

import { ThemeProvider } from "@mui/material/styles"
import { FunctionComponent } from "react"
import { createTheme } from '@mui/material/styles';

export const muiTheme = (fontFamily: string[]) => createTheme({
    typography: {
        allVariants: {fontFamily: fontFamily.join(',')},
    },
});

interface MyProps {
    children?: React.ReactNode;
    fontFamily: string[];
}

export const Provider: FunctionComponent<MyProps> = ({
    children,
    fontFamily
  }) => {
    return (
        <ThemeProvider theme={muiTheme(fontFamily)}>
            {children}
        </ThemeProvider>
    )
}