import { createTheme } from '@mui/material/styles';

export const muiTheme = (fontFamily: string[]) => createTheme({
    typography: {
      fontFamily: fontFamily.join(','),
    },
});