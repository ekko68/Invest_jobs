import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import moment from "moment";

// modules
import { UserContext } from 'modules/common/UserContext'
import {deleteEachCsNotice, getCsNoticeDetail} from 'modules/consts/MainApi'
import { fileDownloadMain } from 'modules/utils/CommonUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'

//components
import PageLayout from 'components/PageLayout'
import PopupConfirm from 'components/PopupConfirm'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'

const View = () => {

  const { id } = useParams()
  const history = useHistory()
  const userContext = useContext(UserContext)

  const [noticeData, setNoticeData] = useState({})
  const [popup, setPopup] = useState({ active: false, type: null})

  useEffect(async() => {
    if(id) {
      let res = await getCsNoticeDetail({id: id});
      if(res.data.code === '200') {
        setNoticeData(res.data.data)
      } else {
        setPopup({active: true, type: "error"});
      }
    }
  }, [id])

  const handleDelete = async() => {
    let res = await deleteEachCsNotice({
      updateItem: id, //공지 id
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

  const handleFileDownload = async (file) => {
    let item = {
      fileId: file?.atchId,
      fileNm: file?.fileNm
    }
    await fileDownloadMain(item)
  }


  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainCs'} currentPage={'mainCsNotice'}>
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
                    handlePopup={() => navigatePage(`${ROUTER_NAMES.MAIN_CS_NOTICE_LIST}`)} />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={'오류가 발생했습니다.'}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

      <div className='content_inner page_main_notice'>
        <div className='page_header'>
          <h4 className='page_title'>공지사항 상세</h4>
        </div>

        <div className="board_view_wrap">
          <div className="board_title">{noticeData?.pbnsTtl}</div>
          <div className='board_info'>
            <div>작성자 {noticeData?.rgsnUserNm}</div>
            <div>작성일 {noticeData?.rgsnTsStr && moment(noticeData.rgsnTsStr).format("YYYY-MM-DD hh:mm")}</div>
          </div>
          <div className="board_content">{noticeData?.pbnsCon}</div>
          {
            noticeData?.attachedFileList && noticeData.attachedFileList.length > 0 && (
              <ul className="file_list">
                {
                  noticeData.attachedFileList.map((file, index) => (
                    <li className="file_item" key={file?.atchId}>
                      <span className="label">첨부 {index+1}</span>
                      <p className="file_content">
                        <button className="btn_download" onClick={() => handleFileDownload(file)}>
                          {file?.fileNm}
                        </button>
                      </p>
                    </li>
                  ))
                }
              </ul>
            )
          }
          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={() => navigatePage(`${ROUTER_NAMES.MAIN_CS_NOTICE_LIST}`)}>
              목록
            </Button>
            <Button className={'full_blue'} onClick={() => navigatePage(`${ROUTER_NAMES.MAIN_CS_NOTICE_WRITE}/${noticeData?.pbnsId}`)}>
              수정
            </Button>
            <Button className={'full_red'} onClick={() => setPopup({active: true, type: "delete"})}>
              삭제
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default View
