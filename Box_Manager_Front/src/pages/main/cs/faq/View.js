import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import moment from "moment";

// modules
import { UserContext } from 'modules/common/UserContext'
import {deleteEachCsFaq, getCsFaqDetail} from 'modules/consts/MainApi'
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

  const [faqData, setFaqData] = useState({})
  const [popup, setPopup] = useState({ active: false, type: null})

  useEffect(async() => {
    if(id) {
      let res = await getCsFaqDetail({id: id});
      if(res.data.code === '200') {
        setFaqData(res.data.data)
      } else {
        setPopup({active: true, type: "error"});
      }
    }
  }, [id])

  const handleDelete = async() => {
    let res = await deleteEachCsFaq({
      updateItem: id, //faq id
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


  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainCs'} currentPage={'mainCsFaq'}>
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
                    handlePopup={() => navigatePage(`${ROUTER_NAMES.MAIN_CS_FAQ_LIST}`)} />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={'오류가 발생했습니다.'}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

      <div className='content_inner page_main_notice'>
        <div className='page_header'>
          <h4 className='page_title'>FAQ(자주하는질문) 상세</h4>
        </div>

        <div className="board_view_wrap">
          <div className="board_title">
            <div>{faqData?.faqTtl}</div>
            <div className='status_public'>{faqData?.faqCtgyNm}</div>
          </div>
          <div className='board_info'>
            <div>작성자 {faqData?.rgsnUserNm}</div>
            <div>작성일 {faqData?.rgsnTsStr && moment(faqData.rgsnTsStr).format("YYYY-MM-DD hh:mm")}</div>
          </div>
          <div className="board_content">{faqData?.faqCon}</div>
          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={() => navigatePage(`${ROUTER_NAMES.MAIN_CS_FAQ_LIST}`)}>
              목록
            </Button>
            <Button className={'full_blue'} onClick={() => navigatePage(`${ROUTER_NAMES.MAIN_CS_FAQ_WRITE}/${faqData?.faqInfId}`)}>
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
