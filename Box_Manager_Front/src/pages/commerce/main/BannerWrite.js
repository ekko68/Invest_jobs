import { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import PageLayout from 'components/PageLayout'
import BannerForm from 'pageComponents/commerce/main/BannerForm'
import { loader } from 'modules/utils/CommonAxios'
import { getBannerDetailApi, saveBannerApi } from 'modules/consts/MktApi'
import PopupAlert from 'components/PopupAlert'
import { MktContext } from 'modules/common/MktContext'
import * as mainFn from 'modules/fns/mkt/mainFn'

const BannerWrite = (props) => {
  const mktContext = useContext(MktContext)
  const history = useHistory()
  const id = props.match.params.id
  const type = props.match.params.type

  const [data, setData] = useState(null)
  const [maximumAlert, setMaximumAlert] = useState(false)

  // ====== 등록
  const handleReg = async (data, isUpdate) => {
    if (isUpdate) {
      await handleRegApi(data)
    } else {
      let maximumValidate = await mainFn.handleMaximumCheck(mktContext.state.currType, handleMaximunAlert)
      if (maximumValidate || data.oppbYn === 'N') {
        await handleRegApi(data)
      }
    }
  }

  const handleRegApi = async (data) => {
    loader(true, 'Uploading...')
    const res = await saveBannerApi(mktContext.state.currType, data)
    if (res.data.code === '200') {
      loader()
      history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_LIST}`)
    } else {
      setMaximumAlert(!maximumAlert)
    }
  }

  // ===== 수정
  const handleUpdateDataSet = async () => {
    loader(true, 'Uploading...')
    let res = await getBannerDetailApi(mktContext.state.currType, id)
    if (res.data.code === '200') {
      let data = res.data.data
      setData({
        banInfId: data.banInfId,
        ttl: data.ttl,
        con: data.con,
        link: data.link,
        stdy: data.stdy,
        fnda: data.fnda,
        imgFileInfo: data.imgFileInfo,
        oppbYn: data.oppbYn
      })
      await loader()
    }
  }

  // ===== maximunAlert
  const handleMaximunAlert = () => {
    setMaximumAlert(!maximumAlert)
  }

  useEffect(() => {
    type && mktContext.actions.handleSetBannerCurrType(type)
    mktContext.actions.handleSetBannerParam({
      statusCode: 'filter_all', // 상태
      page: 1
    })
    id && handleUpdateDataSet()
  }, [])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      {maximumAlert && (
        <PopupAlert
          msg={`게시중인 배너가 ${
            mainFn.maximumCnt[`${mktContext.state.currType}`]
          }개를 초과하여\n등록및 공개할 수 없습니다.\n${
            mktContext.state.currType === 'mainBanner'
              ? '메인배너'
              : mktContext.state.currType === 'subBanner'
              ? '서브배너'
              : mktContext.state.currType === 'prodBanner'
              ? '상품배너'
              : '이벤트배너'
          } 목록을 확인해주세요.`}
          handlePopup={handleMaximunAlert}
        />
      )}
      <div className="content_inner page_main">
        <h4 className="page_title">
          {mktContext.state.currType === 'mainBanner'
            ? '메인배너'
            : mktContext.state.currType === 'subBanner'
            ? '서브배너'
            : mktContext.state.currType === 'prodBanner'
            ? '상품배너'
            : '이벤트배너'}
          &nbsp;등록
        </h4>
        <BannerForm
          data={data}
          type={mktContext.state.currType}
          id={id}
          url={`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_LIST}`}
          handleReg={handleReg}
          handleMaximunAlert={handleMaximunAlert}
        />
      </div>
    </PageLayout>
  )
}

export default BannerWrite
