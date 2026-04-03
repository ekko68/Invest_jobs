import AxiosAdmin from './AxiosAdmin'
import AxiosCommerce from './AxiosCommerce'
import AxiosInvest from './AxiosInvest'
import AxiosGlobalBiz from './AxiosGlobalBiz'
import AxiosBooks from './AxiosBooks'
import AxiosMain from './AxiosMain'

import React from 'react'

/** IVT(투자박스), MKT(커머스), BKB(수금관리), ADM(관리자) */
const CommonAxiosV2 = (cate, config, callback, errorCallback) => {
  if (cate === 'MKT') {
    AxiosCommerce(config)
      .then((res) => {
        if (res.status === 200) {
          typeof callback === 'function' && callback(res)
        } else {
          typeof errorCallback === 'function' && errorCallback(res)
        }
      })
      .catch((e) => {
        if (typeof errorCallback === 'function') {
          errorCallback(e)
        }
      })
  }
}

export default CommonAxiosV2
