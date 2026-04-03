import React, { lazy, Suspense, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import BALayout from 'layouts/BALayout'
import Loading from 'components/common/Loading'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { ThemeProvider, createTheme } from "@mui/material/styles";

const BA10101 = lazy(() => import('pages/ba/BA10101').then((c) => c))
const BA10102 = lazy(() => import('pages/ba/BA10102').then((c) => c))
const BA10202 = lazy(() => import('pages/ba/BA10202').then((c) => c))
const BA10301 = lazy(() => import('pages/ba/BA10301').then((c) => c))
const BA10302 = lazy(() => import('pages/ba/BA10302').then((c) => c))
const BA10303 = lazy(() => import('pages/ba/BA10303').then((c) => c))
const BA10304 = lazy(() => import('pages/ba/BA10304').then((c) => c))
const BA10305 = lazy(() => import('pages/ba/BA10305').then((c) => c))
const BA10306 = lazy(() => import('pages/ba/BA10306').then((c) => c))
const BA10307 = lazy(() => import('pages/ba/BA10307').then((c) => c))
const BA10401 = lazy(() => import('pages/ba/BA10401').then((c) => c))
const BA10402 = lazy(() => import('pages/ba/BA10402').then((c) => c))
const BA10403 = lazy(() => import('pages/ba/BA10403').then((c) => c))
const BA10501 = lazy(() => import('pages/ba/BA10501').then((c) => c))
const BA10502 = lazy(() => import('pages/ba/BA10502').then((c) => c))
const BA10503 = lazy(() => import('pages/ba/BA10503').then((c) => c))
const BA10601 = lazy(() => import('pages/ba/BA10601').then((c) => c))
const BA10701 = lazy(() => import('pages/ba/BA10701').then((c) => c))
const BA10801 = lazy(() => import('pages/ba/BA10801').then((c) => c))
const BA10802 = lazy(() => import('pages/ba/BA10802').then((c) => c))
const BA10803 = lazy(() => import('pages/ba/BA10803').then((c) => c))

// IBK 제안센터 CSS
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

const BARouter = (props) => {

  return (
    <BALayout {...props}>
      <Suspense fallback={<Loading />}>
        <Switch>
            <ThemeProvider theme={theme}>
                <Route exact path={ROUTER_NAMES.BA10101} component={() => <BA10101 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10102} component={() => <BA10102 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10202} component={() => <BA10202 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10301} component={() => <BA10301 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10302} component={() => <BA10302 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10303} component={() => <BA10303 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10304} component={() => <BA10304 {...props} />} /> 
                <Route exact path={ROUTER_NAMES.BA10305} component={() => <BA10305 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10306} component={() => <BA10306 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10307} component={() => <BA10307 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10401} component={() => <BA10401 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10402} component={() => <BA10402 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10403} component={() => <BA10403 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10501} component={() => <BA10501 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10502} component={() => <BA10502 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10503} component={() => <BA10503 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10601} component={() => <BA10601 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10701} component={() => <BA10701 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10801} component={() => <BA10801 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10802} component={() => <BA10802 {...props} />} />
                <Route exact path={ROUTER_NAMES.BA10803} component={() => <BA10803 {...props} />} />
            </ThemeProvider> 
        </Switch>
      </Suspense>
    </BALayout>
  )
}
export default BARouter
