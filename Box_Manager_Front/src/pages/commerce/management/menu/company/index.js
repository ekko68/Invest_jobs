import PageLayout from 'components/PageLayout'
import { MktContext } from 'modules/common/MktContext'
import { getCompanyMenuListApiV2 } from 'modules/consts/MktApi'
import MenuManagerEnterprise from 'pageComponents/commerce/management/menu/MenuManagerEnterprise'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

const CompanyMenu = (props) => {
  const mktContext = useContext(MktContext)
  const isMounted = useRef(true)
  const [param, setParam] = useState({
    tms1ClsfCd: ''
  })

  const [companyData, setCompanyData] = useState({
    isLoading: true,
    depth1: [],
    depth2: []
  })

  const handleReset = () => {
    setParam({
      tms1ClsfCd: ''
    })
  }

  const getCompanyMenuList = useCallback((params) => {
    getCompanyMenuListApiV2(params, handlecompanyMenuListCallback, handlecompanyMenuListErrorCallback)
  }, [])

  const handlecompanyMenuListCallback = (res) => {
    if (res.data.code === '200' && isMounted.current) {
      const data = res.data.data
      setCompanyData({
        isLoading: false,
        depth1: data.depth1,
        depth2: data.depth2
      })
    }
  }

  const handlecompanyMenuListErrorCallback = () => {
    setCompanyData({
      isLoading: false,
      depth1: [],
      depth2: []
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  const handleDepthClick = (depth, value1) => {
    setParam((prevParam) => {
      if (depth === 1) {
        return {
          ...prevParam,
          tms1ClsfCd: value1
        }
      }
      O
      return prevParam
    })
  }

  useEffect(() => {
    isMounted.current = true
    getCompanyMenuList(param)
  }, [param])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'menu'} currentPage={'companyMenu'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">기업 메뉴 관리</h4>
        </div>

        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="highlight_grey highlight">* 기업의 메뉴 순서와 이름을 변경할 수 있습니다.</p>
          </div>

          {/*tab_header start*/}
          <div className="tab_header">
            <div className="page_header_right">
              <div className="btn_group">
                <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>

          <MenuManagerEnterprise dataList={companyData} setDataList={setCompanyData} onClickDepth={handleDepthClick} />
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default CompanyMenu
