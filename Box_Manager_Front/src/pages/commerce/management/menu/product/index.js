import PageLayout from 'components/PageLayout'
import { MktContext } from 'modules/common/MktContext'
import { getProductMenuListApiV2 } from 'modules/consts/MktApi'
import MenuManager from 'pageComponents/commerce/management/menu/MenuManager'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

const ProductMenu = () => {
  const mktContext = useContext(MktContext)
  const isMounted = useRef(true)
  const [param, setParam] = useState({
    tms2ClsfCd: '',
    tms3ClsfCd: ''
  })

  const [productData, setProductData] = useState({
    isLoading: true,
    depth1: [],
    depth2: [],
    depth3: []
  })

  const handleReset = () => {
    setParam({
      tms2ClsfCd: '',
      tms3ClsfCd: ''
    })
  }

  const getProductMenuList = useCallback((params) => {
    getProductMenuListApiV2(params, handleProductMenuListCallback, handleProductMenuListErrorCallback)
  }, [])

  const handleProductMenuListCallback = (res) => {
    if (res.data.code === '200' && isMounted.current) {
      const data = res.data.data
      setProductData({
        isLoading: false,
        depth1: data.depth1,
        depth2: data.depth2,
        depth3: data.depth3
      })
    }
  }

  const handleProductMenuListErrorCallback = () => {
    setProductData({
      isLoading: false,
      depth1: [],
      depth2: [],
      depth3: []
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  const handleDepthClick = (depth, value1, value2) => {
    setParam((prevParam) => {
      if (depth === 1) {
        return {
          ...prevParam,
          tms2ClsfCd: value1,
          tms3ClsfCd: ''
        }
      } else if (depth === 2) {
        return {
          ...prevParam,
          tms2ClsfCd: value1,
          tms3ClsfCd: value2
        }
      }
      return prevParam
    })
  }

  useEffect(() => {
    isMounted.current = true
    getProductMenuList(param)
  }, [param])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'menu'} currentPage={'productMenu'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">상품 메뉴 관리</h4>
        </div>

        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="highlight_grey highlight">* 상품의 메뉴 순서와 이름을 변경할 수 있습니다</p>
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

          <MenuManager dataList={productData} setDataList={setProductData} onClickDepth={handleDepthClick} />
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default ProductMenu
