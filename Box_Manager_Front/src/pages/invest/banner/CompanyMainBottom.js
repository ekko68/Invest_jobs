import Button from 'components/atomic/Button'
import PageLayout from 'components/PageLayout'
import PopupAlert from 'components/PopupAlert'
import PopupConfirm from 'components/PopupConfirm'
import Form from 'pageComponents/invest/banner/Form'
import PopupPreviewCompany from 'pageComponents/invest/banner/PopupPreviewCompany'
import * as bannerFn from 'modules/fns/invest/bannerFn'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { getBannerCompanyBottom, saveBannerCompanyBottomList } from 'modules/consts/InvestApi'
import { useLocation } from 'react-router-dom'
import { UserContext } from 'modules/common/UserContext'

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
      imgUrl: '',
      fileId: '',
      fileNm: '',
      filePath: '',
      filePtrn: '',
      fileEtns: '',
      fileSize: null
    }
  }
}

const totalUnitCnt = 1

const CompanyMainBottom = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[2]
  const userContext = useContext(UserContext)

  const [bannerList, setBannerList] = useState([])
  const [alert, setAlert] = useState({
    status: false,
    msg: ''
  })

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
    const res = await getBannerCompanyBottom()
    const bannerList = res.data.data.list
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

  useEffect(async () => {
    await getBannerList()
  }, [])

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      userContext.actions.setCategory(category)
    }
  }, [userContext.state.category])

  return (
    <PageLayout currentMenu={'invest'} currentCate={'banner'} currentPage={'companyMainBottom'}>
      {alert.status && <PopupAlert msg={alert.msg} handlePopup={() => setAlert({ status: false, msg: '' })} />}
      {popupPreview && (
        <PopupPreviewCompany
          handlePopup={() => bannerFn.handlePopupPreview(setPopupPreview, popupPreview, bannerList, setAlertImg)}
          bannerList={bannerList}
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
              contTxt={false}
              btnTxt={false}
              key={item.bnnrComCdId + '_' + idx}
              id={item.bnnrSqn}
              item={item}
              title={'기업정보메인 하단'}
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
          onClick={() =>
            bannerFn.handleSave({list:bannerList, adminUser: userContext.actions.getIvtAdminUser()}, setAlertImg, saveBannerCompanyBottomList, getBannerList, setAlert)
          }
        >
          저장
        </button>
      </div>
    </PageLayout>
  )
}

export default CompanyMainBottom
