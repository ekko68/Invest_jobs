import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import BannerViewInfo from 'pageComponents/commerce/main/BannerViewInfo'
import { loader } from 'modules/utils/CommonAxios'
import { deletePopupApi, getPopupDetailApi } from 'modules/consts/MktApi'

const PopupView = (props) => {
  const history = useHistory()
  const id = props.match.params.id
  const [data, setData] = useState(null)

  // ===== 정보 조회
  const getDetailInfo = async () => {
    loader(true, 'Uploading...')
    let res = await getPopupDetailApi(id)
    if (res.data.code === '200') {
      loader()
      setData(res.data.data)
    }
  }

  // ===== 페이지 이동
  // 수정
  const linkToWrite = () => {
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_POPUP_WRITE}/${id}`)
  }
  // 목록
  const linkToList = () => {
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_POPUP_LIST}`)
  }

  // ===== 삭제 API
  const handleDelete = async () => {
    loader(true, 'Uploading...')
    let res = await deletePopupApi(id)
    if (res.data.code === '200') {
      linkToList()
    }
  }

  useEffect(async () => {
    await getDetailInfo()
  }, [])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'popupList'}>
      <div className="content_inner page_main">
        <h4 className="page_title">팝업&nbsp;상세</h4>
        {data && (
          <BannerViewInfo
            type={'popup'}
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

export default PopupView
