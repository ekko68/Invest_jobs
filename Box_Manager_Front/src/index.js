import App from 'App'
import 'assets/style/exports.scss'
import 'core-js/stable'
import React from 'react'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/ie9'
import 'react-app-polyfill/stable'
import ReactDOM from 'react-dom'
import 'regenerator-runtime/runtime'
import reportWebVitals from 'reportWebVitals'
import packageJson from '../package.json'
console.log(packageJson.version)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
