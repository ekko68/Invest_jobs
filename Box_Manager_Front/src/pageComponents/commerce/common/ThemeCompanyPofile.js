import React, { Fragment, useEffect, useState, useContext, useLayoutEffect, useCallback } from 'react'
import { StringUtils } from 'modules/utils/StringUtils'
import { MktContext } from 'modules/common/MktContext'
import Checkbox from 'components/atomic/Checkbox'
import BoxUrl from 'modules/consts/BoxUrl'
import { getMyInfoV2 } from 'modules/consts/MktApi'
import { generateKey } from './../../../modules/utils/CommonUtils'

const ThemeCompanyPofile = (props) => {
  const { companyInfo, checked, setDelId, idx, onChecked } = props
  const mktContext = useContext(MktContext)
  const [selrUsisId, setSelrUsisId] = useState(props.selrUsisId)
  const [info, setInfo] = useState({
    isLoading: true,
    info: {}
  })

  useEffect(() => {
    getMyInfo(selrUsisId)
  }, [])

  // 기업 정보 조회를 위한 함수
  const getMyInfo = (param) => {
    var params = {
      selrUsisId: param
    }

    getMyInfoV2(params, handleMyInfoCallback, handleMyInfoErrorCallback)
  }

  const handleMyInfoCallback = (res) => {
    if (res.data.code === '200') {
      const data = res.data.data
      setInfo({
        isLoading: false,
        info: data
      })
    }
  }
  const handleMyInfoErrorCallback = () => {
    setInfo({
      isLoading: false,
      info: {}
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  const handleCompanyChk = (e, id) => {
    const checked = e.target.checked
    onChecked(checked, id)
  }
  return (
    <li>
      <div className="enterpriseItem">
        <div className="enterpriseItem_name">
          <div className="enterpriseItem_name_text">{info.info.bplcNm}</div>
          {info.certYn === 'Y' && <div className="enterpriseItem_certify" title="인증기관" />}
          {info.bsacYn === 'Y' && <div className="enterpriseItem_client" title="거래처" />}
          {/* 해당 노출 아이콘 정보 입력 부분 확인
                  <div className="enterpriseItem_certify ico" title="인증기관" />
                  <div className="enterpriseItem_client ico" title="거래처" />
                  <div className="enterpriseItem_ceo ico" title="최고 경영자" />
                  <div className="enterpriseItem_future ico" title="미래 경영자" />
                  <div className="enterpriseItem_female ico" title="여성 경영자" />
                  <div className="enterpriseItem_fame ico" title="명예의 전당" />
                  */}
        </div>
        <div className="enterpriseItem_detail">
          <div className="enterpriseItem_old">설립 {info.info.yearCnt}년차</div>
          <div className="enterpriseItem_scale">
            {info.info.useEntrprsSe} {info.info.fondDe ? info.info.fondDe.substr(0, 4) : ''}
          </div>
          {info.info?.salamt > 0 && <div className="enterpriseItem_type">수출입 {info.info.salamt}</div>}
        </div>
        <Checkbox
          key={'check_id' + selrUsisId}
          checkbox={{ id: 'check_id' + selrUsisId, value: '' }}
          // status={false}
          checked={checked}
          onChange={(e) => {
            handleCompanyChk(e, selrUsisId)
          }}
        />
        <div
          className="enterpriseItem_more"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            window.open(
              `${BoxUrl.getMarketBoxUrl(process.env.REACT_APP_PROFILE)}/company/detail/${selrUsisId}`,
              '_blank'
            )
          }}
        >
          기업 홍보관 바로가기
        </div>
      </div>
    </li>
  )
}

export default ThemeCompanyPofile
