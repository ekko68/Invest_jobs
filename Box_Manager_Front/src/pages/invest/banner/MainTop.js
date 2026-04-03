import { useLayoutEffect, useEffect, useState, useContext } from 'react'
// components
import Button from 'components/atomic/Button'
import PageLayout from 'components/PageLayout'
import PopupAlert from 'components/PopupAlert'
import PopupConfirm from 'components/PopupConfirm'
import Form from 'pageComponents/invest/banner/Form'
import PopupPreviewMain from 'pageComponents/invest/banner/PopupPreviewMain'
import { UserContext } from 'modules/common/UserContext'
// modules
import * as bannerFn from 'modules/fns/invest/bannerFn'
// apis
import { getBannerMainTopList, saveBannerMainTopList } from 'modules/consts/InvestApi'
import { useLocation } from 'react-router-dom'

const unitData = (idx = 0) => {
  return {
    bnnrSqn: idx,
    rgsnUserNm: null,
    amnnUserNm: null,
    bnnrPhrsCon: '',
    fileId: '',
    btnPhrsCon: '',
    bnnrLnknUrl: '',
    expuYn: 'N',
    fileInfo: {
      rgsnUserNm: null,
      amnnUserNm: null,
      rvsRnum: null,
      imgFileId: null,
      imgUrl: null,
      fileId: '',
      fileNm: '',
      filePath: '',
      filePtrn: '',
      fileEtns: '',
      fileSize: null
    }
  }
}

const totalUnitCnt = 3

const MainTop = () => {
  const userContext = useContext(UserContext)

  const location = useLocation()
  let path = location.pathname
  let page = path.split('/')[1]
  let category = path.split('/')[2]

  const [alert, setAlert] = useState({
    status: false,
    msg: ''
  })

  /** 공개활성화 일때 이미지만 필수고 나머지는 정보없는경우 투자박스에서 노출하지 않음 */
  const [bannerList, setBannerList] = useState([])

  // vo
  const bannerListVo = unitData();

  /** popup review */
  const [popupPreview, setPopupPreview] = useState(false)

  /** popup banner info delete confirm */
  const [confirmDelete, setConfirmDelete] = useState(null) // null or bannerList_0, bannerList_1, bannerList_2

  /** popup image file require alert */
  const [alertImg, setAlertImg] = useState(false)

  /** get BannerList */
  const getBannerList = async () => {
    const res = await getBannerMainTopList()
    const bannerList = res.data.data.list;

    const tmpList = [];
    for(let i=0; i < totalUnitCnt; i++) {
      if(bannerList?.length > i) {
        tmpList.push(bannerList[i]);
      } else {
        tmpList.push(unitData(i + 1))
      }
    }
    setBannerList(tmpList);
  }

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      userContext.actions.setCategory(category)
    }
  }, [userContext.state.category])

  useEffect(async () => {
    await getBannerList()
  }, [])

  return (
    <PageLayout currentMenu={'invest'} currentCate={'banner'} currentPage={'mainTop'}>
      {alert.status && <PopupAlert msg={alert.msg} handlePopup={() => setAlert({ status: false, msg: '' })} />}
      {popupPreview && (
        <PopupPreviewMain
          handlePopup={() => bannerFn.handlePopupPreview(setPopupPreview, popupPreview, bannerList, setAlertImg)}
          mainGallery={bannerList}
        />
      )}

      {confirmDelete && (
        <PopupConfirm msg={'정말로 삭제하시겠습니까?'}>
          <Button className={'full_grey'} onClick={() => setConfirmDelete(null)}>
            취소
          </Button>
          <Button
            className={'full_blue'}
            onClick={() =>
              bannerFn.handleDelete(confirmDelete, bannerList, bannerListVo, setBannerList, setConfirmDelete)
            }
          >
            확인
          </Button>
        </PopupConfirm>
      )}

      {alertImg && (
        <PopupAlert
          msg={'활성화된 배너중 등록된 이미지가 없습니다.'}
          handlePopup={() => bannerFn.handleAlertImg(setAlertImg, alertImg)}
        />
      )}

      <div className="content_inner page_banner">
        {bannerList &&
          bannerList.map((item, idx) => (
            <Form
              key={item.bnnrComCdId + '_' + idx}
              id={item.bnnrSqn}
              item={item}
              title={'투자메인 상단'}
              idx={idx}
              handleAddImage={bannerFn.handleAddImage}
              handleGetImageFileInfo={(e) => bannerFn.handleGetImageFileInfo(e, bannerList, setBannerList)}
              handleConfirmDelete={(id) => bannerFn.handleConfirmDelete(id, setConfirmDelete)} // confirm popup 활성화 확인 클릭시 -> handleDelete() 실제 삭제 함수.
              handleToggle={(e, id) => bannerFn.handleToggle(e, id, bannerList, setBannerList)}
              handleChangeInputTexts={(e, id, fn) =>
                bannerFn.handleChangeInputTexts(e, id, fn, bannerList, setBannerList)
              }
            />
          ))}
      </div>

      <div className={'rounded_btn_group'}>
        <button
          className={'button basic'}
          onClick={() => bannerFn.handlePopupPreview(setPopupPreview, popupPreview, bannerList, setAlertImg)}
        >
          미리보기
        </button>
        <button
          className={'button full_blue'}
          onClick={() => bannerFn.handleSave({list: bannerList, adminUser: userContext.actions.getIvtAdminUser()}, setAlertImg, saveBannerMainTopList, getBannerList, setAlert)}
        >
          저장
        </button>
      </div>
    </PageLayout>
  )
}

export default MainTop
