import React, { useContext, useEffect, useState } from 'react'
import {useHistory, useParams} from "react-router-dom";

//modules
import {deleteBannerMain} from 'modules/consts/BooksApi'
import { UserContext } from 'modules/common/UserContext'
import {getBannerMainDetail} from 'modules/consts/BooksApi'
import { NoImage02 } from 'modules/consts/Img'
import ROUTER_NAMES from "modules/consts/RouterConst";
import {fileDownloadBooks} from "modules/utils/CommonUtils";

//components
import PageLayout from 'components/PageLayout'
import PopupConfirm from 'components/PopupConfirm'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'

const View = () => {

  const { id } = useParams()
  const history = useHistory()
  const userContext = useContext(UserContext)

  const [bannerData, setBannerData] = useState({
    imgUrl: "",
    bnnrComCdId: "",
    bnnrSqn: "",
    bnnrPhrsCon: "",
    lrrnPhrsCon: "",
    bnnrImgFileId: "", //배너ID(PC)
    mblBanImgFileId: "",  //배너ID(MO)
    expuYn: "Y",
    fileNm: "",
    fileSize: ""
  });
  const [popup, setPopup] = useState({active: false, type: null});

  useEffect(async () => {
    if(id) {
      let res = await getBannerMainDetail(id);
      if(res.data.code === "200"){
        setBannerData(res.data.data)
      }
    } else {
      history.goBack();
    }
  }, [id])

  const handleDelete = async() => {
    let res = await deleteBannerMain({
      bnnrSqn: bannerData.bnnrSqn, //배너 순번
      amnnUserId: userContext.state?.userInfo?.mngrId //수정자 ID
    });

    if(res.data.code === "200") {
      setPopup({active: true, type: "confirm"});
    } else {
      setPopup({active: true, type: "error"});
    }
  }

  const navigatePage = (url) => {
    history.push(url)
  }

  const handleFileDownload = async (item) => {
    await fileDownloadBooks(item)
  }

  return (
    <PageLayout currentMenu={'books'} currentCate={'booksBanner'} currentPage={'booksBannerMain'}>

      {popup.active && popup.type === "delete" && (
        <PopupConfirm msg={'해당 배너를 삭제하시겠습니까?'}>
          <Button className={'full_grey'} onClick={() => setPopup({active: false, type: null})}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleDelete}>
            확인
          </Button>
        </PopupConfirm>
      )}

      {popup.active && popup.type === "confirm" && (
        <PopupAlert msg={'배너가 삭제되었습니다.'}
                    handlePopup={() => navigatePage(`${ROUTER_NAMES.BOOKS_BANNER_MAIN_LIST}`)} />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={'에러가 발생했습니다.'}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

      <div className='content_inner page_books_main'>
        <h4 className='page_title'>메인배너 상세</h4>
        <div className="table_wrap">
          <table className="table_type02">
            <caption>메인배너 상세 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
            <tr>
              <th className={'ta_left'}>메인타이틀</th>
              <td>
                <div className="date_input_wrap">
                  {bannerData.bnnrPhrsCon}
                </div>
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>서브타이틀</th>
              <td>
                <div className="date_input_wrap">
                  {bannerData.lrrnPhrsCon}
                </div>
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>
                <p>이미지 등록</p>
              </th>
              <td>
                <div className="attach_content">
                  <div className="img_info_wrap">
                    <div className="img_wrap">
                      <p>PC 이미지</p>
                      {
                        bannerData.imgUrl?.length > 0 ? (
                          <button>
                            <img src={bannerData.imgUrl} alt={bannerData.pcFileNm} />
                            <figcaption className={'highlight_blue'} onClick={() => handleFileDownload({fileId: bannerData.bnnrImgFileId, fileNm: bannerData.pcFileNm})}>
                              {bannerData.pcFileNm}
                            </figcaption>
                          </button>
                        ) : (
                          <div className="no_img">
                            <img src={NoImage02} alt="이미지 없음" />
                          </div>
                        )
                      }

                      <p style={{marginTop: 30}}>Mobile 이미지</p>
                      {
                        bannerData.mblImgUrl?.length > 0 ? (
                          <button>
                            <img src={bannerData.mblImgUrl} alt={bannerData.mblFileNm} />
                            <figcaption className={'highlight_blue'} onClick={() => handleFileDownload({fileId: bannerData.mblBanImgFileId, fileNm: bannerData.mblFileNm})}>
                              {bannerData.mblFileNm}
                            </figcaption>
                          </button>
                        ) : (
                          <div className="no_img">
                            <img src={NoImage02} alt="이미지 없음" />
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>공개여부</th>
              <td>{bannerData.expuYn === "Y" ? "공개" : "비공개"}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => navigatePage(`${ROUTER_NAMES.BOOKS_BANNER_MAIN_LIST}`)}>
            목록
          </Button>
          <Button className={'full_blue'} onClick={() => navigatePage(`${ROUTER_NAMES.BOOKS_BANNER_MAIN_EDIT}/${bannerData.bnnrSqn}`)}>
            수정
          </Button>
          <Button className={'full_red'} onClick={() => setPopup({active: true, type: "delete"})}>
            삭제
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

export default View
