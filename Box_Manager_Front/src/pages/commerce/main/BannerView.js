import { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import BannerViewInfo from 'pageComponents/commerce/main/BannerViewInfo'
import { deleteBannerApi, getBannerDetailApi } from 'modules/consts/MktApi'
import { loader } from 'modules/utils/CommonAxios'
import { MktContext } from 'modules/common/MktContext'

const BannerView = (props) => {
  const mktContext = useContext(MktContext)
  const history = useHistory()
  const id = props.match.params.id
  const [data, setData] = useState(null)

  // ===== 정보 조회
  const getDetailInfo = async () => {
    loader(true, 'Uploading...')
    let res = await getBannerDetailApi(mktContext.state.currType, id)
    if (res.data.code === '200') {
      loader()
      setData(res.data.data)
    }
  }

  // ===== 페이지 이동
  // 수정
  const linkToWrite = () => {
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_WRITE}/${mktContext.state.currType}/${id}`)
  }
  // 목록
  const linkToList = () => {
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_LIST}`)
  }

  // ===== 삭제 API
  const handleDelete = async () => {
    loader(true, 'Uploading...')
    let res = await deleteBannerApi(mktContext.state.currType, id)
    if (res.data.code === '200') {
      linkToList()
    }
  }

  useEffect(async () => {
    await getDetailInfo()
  }, [])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      <div className="content_inner page_main">
        <h4 className="page_title">
          {mktContext.state.currType === 'mainBanner'
            ? '메인배너'
            : mktContext.state.currType === 'subBanner'
            ? '서브배너'
            : mktContext.state.currType === 'prodBanner'
            ? '상품배너'
            : '이벤트배너'}
          &nbsp;상세
        </h4>
        {data && (
          <BannerViewInfo
            type={mktContext.state.currType}
            data={data}
            linkToList={linkToList}
            linkToWrite={linkToWrite}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </PageLayout>
  )
}

export default BannerView
