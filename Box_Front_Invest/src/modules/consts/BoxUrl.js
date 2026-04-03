const BoxUrl = {
  REACT_APP_URL: {
    DEV: 'https://devinvest.ibkbox.net',
    PROD: 'https://invest.ibkbox.net', // TODO : 호스트 도메인 정해진 후 함께 수정
    STAGE: 'https://devinvest.ibkbox.net'
  },

  REACT_APP_MAIN_BOX_URL: {
    DEV: 'https://devwww.ibkbox.net',
    PROD: 'https://www.ibkbox.net',
    STAGE: 'https://devwww.ibkbox.net'
  }
}

Object.freeze([BoxUrl.REACT_APP_URL, BoxUrl.REACT_APP_MAIN_BOX_URL])

export default BoxUrl
