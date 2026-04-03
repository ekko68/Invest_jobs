import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import moment from "moment";

// modules
import { UserContext } from 'modules/common/UserContext'
import { deleteServiceEvent, getServiceEventDetail} from 'modules/consts/MainApi'
import { fileDownloadMain } from 'modules/utils/CommonUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'

//components
import PageLayout from 'components/PageLayout'
import Button from "components/atomic/Button";
import PopupConfirm from 'components/PopupConfirm'
import PopupAlert from 'components/PopupAlert'

const View = () => {

  const { id } = useParams()
  const history = useHistory()
  const userContext = useContext(UserContext)

  const [serviceData, setServiceData] = useState({})
  const [popup, setPopup] = useState({ active: false, type: null})

  useEffect(async() => {
    if(id) {
      let res = await getServiceEventDetail({id: id});
      if(res.data.code === '200') {
        setServiceData(res.data.data)
      } else {
        setPopup({active: true, type: "error"});
      }
    }
  }, [id])

  const handleDelete = async() => {
    let res = await deleteServiceEvent({
      updateItem: id, //서비스 id
      amnnUserId: userContext.state?.userInfo?.mngrId //수정자 ID
    })

    if(res.data.code === '200'){
      setPopup({active: true, type: 'confirm'})
    } else {
      setPopup({active: true, type: "error"});
    }
  }

  const navigatePage = (url) => {
    history.push(url)
  }

  const handleFileDownload = async () => {
    let item = {
      fileId: serviceData?.bltImgId,
      fileNm: serviceData?.fileNm
    }
    await fileDownloadMain(item)
  }

  const layoutState = () => {
    if(moment.duration(moment().diff(serviceData?.bltSttgYmd)).asDays() < 0){
      return <div className="status_ready">대기</div>;
    } else if(moment.duration(moment().diff(serviceData?.bltFnshYmd)).asDays() > 1){
      return <div className="status_close">종료</div>;
    } else if(serviceData?.oppbYn === "Y") {
      return <div className="status_public">공개</div>;
    } else if(serviceData?.oppbYn === "N"){
      return <div className="status_private">비공개</div>;
    } else {
      return "-"
    }
  }


  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainServiceMenu'} currentPage={'mainServiceEvent'}>

      {popup.active && popup.type === "delete" && (
        <PopupConfirm msg={'해당 게시글을 삭제하시겠습니까?'}>
          <Button className={'full_grey'} onClick={() => setPopup({active: false, type: null})}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleDelete}>
            확인
          </Button>
        </PopupConfirm>
      )}

      {popup.active && popup.type === "confirm" && (
        <PopupAlert msg={'해당 게시글이 삭제되었습니다.'}
                    handlePopup={() => navigatePage(`${ROUTER_NAMES.MAIN_SERVICEMENU_EVENT_LIST}`)} />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={'오류가 발생했습니다.'}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

      <div className='content_inner page_main service_view'>
        <h4 className='page_title'>이벤트 상세</h4>

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
              <td>{serviceData?.evntSvcTtl || "-"}</td>
            </tr>
            <tr>
              <th className={'ta_left'}>이미지</th>
              <td>
                <div className="img_wrap_service">
                  {serviceData?.bltImgUrl && <img src={serviceData.bltImgUrl} alt={serviceData?.evntSvcTtl} />}
                </div>
                <figcaption className={'highlight_blue'} onClick={handleFileDownload}>
                  {serviceData?.fileNm}
                </figcaption>
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>링크</th>
              <td>
                {serviceData?.linkUrl ? (
                  <a className="text_url" href={serviceData.linkUrl} target={"_blank"}  rel="noreferrer">
                    {serviceData.linkUrl}
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>기간</th>
              <td>
                {`${serviceData?.bltSttgYmd && moment(serviceData.bltSttgYmd).format("YYYY.MM.DD")}-${serviceData?.bltFnshYmd && moment(serviceData.bltFnshYmd).format("YYYY.MM.DD")}`}
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>상태</th>
              <td>{layoutState()}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => navigatePage(`${ROUTER_NAMES.MAIN_SERVICEMENU_EVENT_LIST}`)}>
            목록
          </Button>
          <Button className={'full_blue'} onClick={() => navigatePage(`${ROUTER_NAMES.MAIN_SERVICEMENU_EVENT_WRITE}/${id}`)}>
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
