const BoxUrl = {
  /**
   * 보안점검 처리를 위해 설정한 url constant
   */

  getMainBoxUrl: (profile) => {
    switch (profile) {
      case 'DEV':
        return 'https://devwww.ibkbox.net'
      case 'PROD':
        return 'https://www.ibkbox.net'
      case 'STAGE':
        return 'https://devwww.ibkbox.net'
      default:
        return ''
    }
  },

  getManagerPortalUrl: (profile) => {
    switch (profile) {
      case 'DEV':
        return 'https://localhost:7501'
      case 'PROD':
        return 'https://adm.ibkbox.net'
      case 'STAGE':
        return 'https://devadm.ibkbox.net'
      default:
        return ''
    }
  },

  getInvestBoxUrl: (profile) => {
    switch (profile) {
      case 'DEV':
        return 'https://localhost:7301'
      case 'PROD':
        return 'https://invest.ibkbox.net'
      case 'STAGE':
        return 'https://devinvest.ibkbox.net'
      default:
        return ''
    }
  },

  getMarketBoxUrl: (profile) => {
    switch (profile) {
      case 'DEV':
        return 'https://localhost:7401'
      case 'PROD':
        return 'https://commerce.ibkbox.net'
      case 'STAGE':
        return 'https://devcommerce.ibkbox.net'
      default:
        return ''
    }
  }
}

export default BoxUrl
