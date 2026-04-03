import React from 'react'
import Button from 'components/atomic/Button'
import { useEffect, useContext, useState, useCallback } from 'react'
import { getEventJoinListApiV2 } from 'modules/consts/MktApi'
import { MktContext } from 'modules/common/MktContext'
import CompanyProfile from 'pageComponents/commerce/common/CompanyPofile'

const JoinCompany = (props) => {
  const { evntInfId, setPopupCompany } = props
  const mktContext = useContext(MktContext)
  const [products, setProducts] = useState([])

  const close = () => {
    setPopupCompany({
      active: false,
      evntInfId: ''
    })
  }

  const getList = useCallback((params) => {
    getEventJoinListApiV2(params, handleCallback, handleErrorCallback)
  }, [])

  const handleCallback = (res) => {
    if (res.data.code === '200') {
      setProducts(res.data.data?.list)
    }
  }

  const handleErrorCallback = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  useEffect(() => {
    getList({ evntInfId })
  }, [])

  return (
    <div className="popup_wrap popup_corporate">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">이벤트 참여 기업</div>
            <Button
              className="popup_close_button"
              aria-label="팝업 닫기"
              onClick={() => {
                close()
              }}
            />
          </div>

          {products.map((product, index) => (
            <CompanyProfile key={'joinCompany' + index} selrUsisId={product.selrUsisId} stateCode={product.stateCode} />
          ))}

          <div className="rounded_btn_group">
            <Button
              className={'basic'}
              onClick={() => {
                close()
              }}
            >
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinCompany
