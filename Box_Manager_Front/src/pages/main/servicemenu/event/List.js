import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import moment from "moment/moment";

// components
import PageLayout from 'components/PageLayout'
import Button from "components/atomic/Button";
import PopupConfirm from 'components/PopupConfirm'
import PopupAlert from 'components/PopupAlert'
import NoResult from 'components/NoResult'
import Pagination from "components/Pagination";

// modules
import { UserContext } from 'modules/common/UserContext'
import {deleteServiceEvent, getServiceEventList} from 'modules/consts/MainApi'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import {MainContext} from "modules/common/MainContext";

const List = () => {

  const history = useHistory()
  const userContext = useContext(UserContext)
  const mainContext = useContext(MainContext);

  const [eventList, setEventList] = useState([])
  const [popup, setPopup] = useState({active: false, type: null});
  const [delParam, setDelParam] = useState({});
  const [paging, setPaging] = useState(null);


  useEffect(() => {
    apiGetEventList();

    return () => {
      mainContext.actions.setServiceListParams();
    }
  }, [])

  const apiGetEventList = async () => {
    let res = await getServiceEventList(mainContext.state.serviceListParam); // 서비스(이벤트)
    if(res.data?.code === "200"){
      let data = res.data.data;
      setEventList(data.list);
      setPaging({
        endPage: data.endPage,
        next: data.next,
        page: data.page,
        prev: data.prev,
        record: data.record,
        startPage: data.startPage,
        total: data.total,
        totalPage: data.totalPage
      });
    } else {
      setPopup({active: true, type: "error"});
    }
  }

  const handleButtons = (type, item) => {
    switch (type){
      case "add":
        navigatePage(`${ROUTER_NAMES.MAIN_SERVICEMENU_EVENT_WRITE}`);
        break;
      case "edit":
        navigatePage(`${ROUTER_NAMES.MAIN_SERVICEMENU_EVENT_WRITE}/${item.evntSvcId}`);
        break;
      case "delete":
        setPopup({active: true, type: "delete"});
        setDelParam(item);
        break;
      default:
    }
  }

  const handleDelete = async() => {
    let res = await deleteServiceEvent({
      updateItem: delParam?.evntSvcId, //id
      amnnUserId: userContext.state?.userInfo?.mngrId, //수정자 ID
    });

    if(res.data.code === "200") {
      setPopup({active: true, type: "confirm"});
    } else {
      setPopup({active: true, type: "error"});
    }
  }

  // 페이징
  const handlePaging = async (param) => {
    mainContext.actions.setServiceListParams({
      ...mainContext.state.serviceListParam,
      ...param
    });
  }

  const navigatePage = (url) => {
    history.push(url)
  }

  const layoutState = (item) => {
    if(moment.duration(moment().diff(item?.bltSttgYmd)).asDays() < 0){
      return <div className="t_cell ta_center status_ready">대기</div>;
    } else if(moment.duration(moment().diff(item?.bltFnshYmd)).asDays() > 1){
      return <div className="t_cell ta_center status_close">종료</div>;
    } else if(item?.oppbYn === "Y") {
      return <div className="t_cell ta_center status_public">공개</div>;
    } else if(item?.oppbYn === "N"){
      return <div className="t_cell ta_center status_private">비공개</div>;
    } else {
      return "-"
    }
  }


  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainServiceMenu'} currentPage={'mainServiceEvent'}>
      {popup.active && popup.type === "delete" && (
        <PopupConfirm msg={'해당 게시글을 삭제하시겠습니까?'}>
          <Button className={'full_grey'} onClick={() => {
            setPopup({active: false, type: null});
            setDelParam({});
          }}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleDelete}>
            확인
          </Button>
        </PopupConfirm>
      )}

      {popup.active && popup.type === "confirm" && (
        <PopupAlert
          msg={'해당 게시글이 삭제되었습니다.'}
          handlePopup={async () => {
          setPopup({active: false, type: null});
          apiGetEventList();
        }} />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert
          msg={'오류가 발생했습니다.'}
          handlePopup={() => setPopup({active: false, type: null})}
        />
      )}

      <div className='content_inner page_main'>
        <div className="page_header">
          <h4 className="page_title">이벤트</h4>
          <div className='btn_group'>
            <Button className={'full_blue w65'} onClick={() => handleButtons("add")}>
              등록
            </Button>
          </div>
        </div>


        <div className={'section banner_main_section'}>
          {
            eventList && eventList.length > 0 ? (
              <div className="table_wrap border_bottom_none table_th_border document_service_list scroll">
                <div className="custom_table apply_prod_table">
                  <div className="t_header">
                    <div className="t_row header">
                      <div className="t_cell">순서</div>
                      <div className="t_cell">이미지</div>
                      <div className="t_cell">메인타이틀</div>
                      <div className="t_cell">기간</div>
                      <div className="t_cell">상태</div>
                      <div className="t_cell">&nbsp;</div>
                    </div>
                  </div>
                  <div className="t_body">
                    {
                      eventList.map((item) => (
                        <div className="item-container" key={item.evntSvcId}
                             onClick={() => navigatePage(`${ROUTER_NAMES.MAIN_SERVICEMENU_EVENT_VIEW}/${item.evntSvcId}`)}>
                          <div className="t_row">
                            <div className="t_cell">
                              {item.rnum}
                            </div>
                            <div className="t_cell">
                              <div className="img_title_wrap">
                                <div className="img_wrap">
                                  {
                                    item.bltImgUrl && item.bltImgUrl.length > 0 ? (
                                      <img src={item.bltImgUrl} alt={`이벤트_${item.rnum}`} />
                                    ) : (
                                      <div className="no_img">
                                        <img src={require('assets/images/no_img.jpg').default} alt="이미지 없음" />
                                      </div>
                                    )
                                  }
                                </div>
                                <div className="flex_row" />
                              </div>
                            </div>
                            <div className="t_cell">
                              <div className="ellipsis2">{item?.evntSvcTtl || "-"}</div>
                            </div>
                            <div className='t_cell ta_center'>
                              {item?.bltPeriodStr || "-"}
                            </div>
                            {layoutState(item)}
                            <div className="t_cell">
                              <Button className={'basic w80'}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleButtons("edit", item);
                                      }}>
                                수정
                              </Button>
                              <Button className={'basic w80'}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleButtons("delete", item);
                                      }}>
                                삭제
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            ) : (
              <div className="table_no_result">
                <NoResult msg={'등록된 내용이 없습니다.'} />
              </div>
            )
          }

          <div className={'paging_wrap'}>
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default List
