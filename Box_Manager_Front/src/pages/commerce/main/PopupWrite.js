import { useEffect, useState } from 'react'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { useHistory } from 'react-router-dom'
import { loader } from 'modules/utils/CommonAxios'
import { getPopupDetailApi, savePopupApi } from 'modules/consts/MktApi'
import PageLayout from 'components/PageLayout'
import BannerForm from 'pageComponents/commerce/main/BannerForm'

const PopupWrite = (props) => {
  const history = useHistory()
  const id = props.match.params.id
  const [data, setData] = useState(null)

  // ====== 등록
  const handleReg = async (data) => {
    let _data = data
    delete _data.con
    delete _data.oppbYn
    loader(true, 'Uploading...')
    const res = await savePopupApi(_data)
    if (res.data.code === '200') {
      loader()
      history.push(`${ROUTER_NAMES.COMMERCE_MAIN_POPUP_LIST}`)
    } else {
      console.log('Error')
    }
  }

  // ===== 수정
  const handleUpdateDataSet = async () => {
    loader(true, 'Uploading...')
    let res = await getPopupDetailApi(id)
    if (res.data.code === '200') {
      let data = res.data.data
      setData({
        popupInfId: data.popupInfId,
        ttl: data.ttl,
        link: data.link,
        stdy: data.stdy,
        fnda: data.fnda,
        imgFileInfo: data.imgFileInfo
      })
      await loader()
    }
  }

  useEffect(() => {
    id && handleUpdateDataSet()
  }, [id])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'popupList'}>
      <div className="content_inner page_main">
        <h4 className="page_title">팝업 등록</h4>
        <BannerForm
          data={data}
          type={'popup'}
          id={id}
          url={`${ROUTER_NAMES.COMMERCE_MAIN_POPUP_LIST}`}
          handleReg={handleReg}
        />
      </div>
    </PageLayout>
  )
}

export default PopupWrite
