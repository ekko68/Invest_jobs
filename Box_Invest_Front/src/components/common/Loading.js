import { Spinner } from 'react-spinners-css'

const Loading = () => {
  let styles = {
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '10000000',
    // display: 'flex',
    display: 'none',
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.01)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }

  let stylesP = {
    display: 'inline-block',
    textAlign: 'center',
    marginTop: '10px'
  }

  return (
    <div style={styles} id="loadingstate">
      <Spinner color={'#123abc'} />
      <p style={stylesP} id={'loadingstatetext'}>
        Loading...
      </p>
    </div>
  )
}

export default Loading
