import AxiosAdmin from './AxiosAdmin'
import AxiosCommerce from './AxiosCommerce'
import AxiosInvest from './AxiosInvest'
import AxiosGlobalBiz from './AxiosGlobalBiz'
import AxiosBooks from './AxiosBooks'
import AxiosMain from './AxiosMain'

/** IVT(투자박스), MKT(커머스), BKB(수금관리), ADM(관리자) */
const CommonAxios = async (cate, config, loading = true, userInfo) => {
  if (loading) loader(loading)
  if (cate === 'IVT') {
    return await AxiosInvest(config)
      .then((res) => {
        // if (loading) loader()
        return res
      })
      .catch((error) => {
        if (loading) loader()
        return error
      })
  } else if (cate === 'MKT') {
    return await AxiosCommerce(config)
      .then((res) => {
        // if (loading) loader()
        return res
      })
      .catch((error) => {
        if (loading) loader()
        return error
      })
  } else if (cate === 'BKB') {
    return await AxiosBooks(config)
      .then((res) => {
        // if (loading) loader()
        return res
      })
      .catch((error) => {
        if (loading) loader()
        return error
      })
  } else if (cate === 'MNB') {
    return await AxiosMain(config)
      .then((res) => {
        // if (loading) loader()
        return res
      })
      .catch((error) => {
        if (loading) loader()
        return error
      })
  } else if (cate === 'GLB') {
    return await AxiosGlobalBiz(config)
      .then((res) => {
        // if (loading) loader()
        return res
      })
      .catch((error) => {
        if (loading) loader()
        return error
      })
  } else {
    return await AxiosAdmin(config)
      .then((res) => {
        // if (loading) loader()
        return res
      })
      .catch((error) => {
        if (loading) loader()
        return error
      })
  }
}
export default CommonAxios
const loader = (loading = false) => {
  document.querySelector('#loadingstate').style.display = loading ? 'flex' : 'none'
}
export { loader }
