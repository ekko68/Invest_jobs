import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

//modules
import { NoImage02 } from 'modules/consts/Img'
import { UserContext } from 'modules/common/UserContext'
import { deleteBanner, getBannerDetail } from 'modules/consts/MainApi'
import { fileDownloadMain } from 'modules/utils/CommonUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'

//components
import PopupConfirm from 'components/PopupConfirm'
import PopupAlert from 'components/PopupAlert'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'

const View = () => {


  const { id } = useParams()
  const history = useHistory()
  const userContext = useContext(UserContext)

  const [bannerData, setBannerData] = useState({
    imgUrl: "",
    bnnrSqn: "",
    bnnrLnknUrl: "",
    bnnrImgFileId: "",
    expuYn: "Y",
    fileNm: "",
    fileSize: ""
  });

  const [popup, setPopup] = useState({active: false, type: null});

  useEffect(async () => {
    if(id) {
      let res = await getBannerDetail({bnnrComCdId: "BNR00001", bnnrSqn: id}); //배너코드(더보기)
      if(res.data.code === "200"){
        setBannerData(res.data.data)
      } else {
        setPopup({active: true, type: "error"});
      }
    }
  }, [id])

  const handleDelete = async() => {
    let res = await deleteBanner({
      bnnrComCdId: "BNR00001", //배너코드(더보기)
      bnnrSqn: bannerData.bnnrSqn, //배너 순번
      userId: userContext.state?.userInfo?.mngrId //수정자 ID
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

  const handleFileDownload = async () => {
    let item = {
      fileId: bannerData.bnnrImgFileId,
      fileNm: bannerData.bnnrImgFileId
    }
    await fileDownloadMain(item)
  }

  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainBanner'} currentPage={'mainBannerMore'}>
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
        <PopupAlert msg={'해당 배너가 삭제되었습니다.'}
                    handlePopup={() => navigatePage(`${ROUTER_NAMES.MAIN_BANNER_MORE_LIST}`)} />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={'오류가 발생했습니다.'}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

      <div className='content_inner page_books_main'>
        <h4 className='page_title'>더보기(중간) 배너 상세</h4>

        <div className="table_wrap">
          <table className="table_type02">
            <caption>더보기(중간) 배너 상세 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
            <tr>
              <th className={'ta_left'}>
                <p>링크</p>
              </th>
              <td>
                <p className="link highlight_blue">
                  <a href={bannerData.bnnrLnknUrl} target={'_blank'} rel="noopener noreferrer">
                    {bannerData.bnnrLnknUrl}
                  </a>
                </p>
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>
                <p>이미지 등록</p>
              </th>
              <td>
                {/*attach_content start*/}
                <div className="attach_content">
                  <div className="img_info_wrap">
                    <div className="img_wrap">
                      {
                        bannerData.imgUrl?.length > 0 ? (
                          <button>
                            <img src={bannerData.imgUrl} alt={bannerData.fileNm} />
                            <figcaption className={'highlight_blue'} onClick={handleFileDownload}>
                              {bannerData.fileNm}
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
                {/*attach_content end*/}
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>공개여부</th>
              <td>{bannerData.expuYn === "Y" ? "공개" : "비공개"}</td>
            </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => navigatePage(`${ROUTER_NAMES.MAIN_BANNER_MORE_LIST}`)}>
            목록
          </Button>
          <Button className={'full_blue'} onClick={() => navigatePage(`${ROUTER_NAMES.MAIN_BANNER_MORE_WRITE}/${bannerData.bnnrSqn}`)}>
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
