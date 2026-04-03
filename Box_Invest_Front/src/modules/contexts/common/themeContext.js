import { ThemeProvider, createTheme } from "@mui/material/styles";
/**
 * @todo 사용처 수정
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      lighter:'#ECF5FF',
      main: '#3882D8',
      contrastText: '#ffffff',

    },
    secondary: {

      light: '#3882D8',
      main: '#0055a2',
    },
    tertiary:{
      main: '#0099da',
    },
    inProgress:{
      main: '#BEBBC9',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f15c21',
      light: '#FF8081',
    },
    warning: {
      main: '#ffd800',
      dark: '#ff8400',
      light: '#FDFB03'
    },
    info: {
      main: '#1e2f3f',
    },
    text: {
      primary: '#333333',
      sub: '#666666',
      contrastText: '#fff',
    },
    background: {
      default: '#f8f8f8',
      white: '#fff',
      tableOddRow: '#F9FBFE',
    },
    disabled:{
      main: '#bbbbbb',
      light: '#EAE9F1',
      lighter: '#F8F8F8',
    },
    divider: 'rgba(41,41,45,0.2)',
  },
  overrides: {
    MuiButton: {
      raisedPrimary: {
        color: 'white',
      },
      raisedSecondary: {
        color: 'white',
      },
    },

  },

  typography: {
    fontFamily:[
      'Source Han Sans K',
      'sans-serif',
    ].join(','),
    h1:{
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2:{
      fontSize: '1.25rem',
    },
    h3:{
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h4:{
      fontSize: '1.125rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
  },

});

const ThemeComProvider = ({ children }) => {
// IBK 제안센터 CSS
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export { ThemeComProvider };

