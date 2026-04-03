const UserUtils = {
  getUserInfo: async (userContext, loading = true) => {
    let res = null
    const token = sessionStorage.getItem('token')
    if (token) {
      if (userContext.state.userInfo === null) {
        res = await userContext.actions.getUserInfo(loading)
      }
    }
    return res
  },
  getIsLogin: (userContext) => {
    let r = true
    const token = sessionStorage.getItem('token')
    if (token) {
      if (userContext.state.userInfo === null) {
        r = false
      }
    } else {
      r = false
    }
    return r
  }
}

export default UserUtils
