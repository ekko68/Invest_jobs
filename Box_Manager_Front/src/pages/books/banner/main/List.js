import React, { useContext, useEffect, useState } from 'react'
import {useHistory} from "react-router-dom";

//modules
import { UserContext } from 'modules/common/UserContext'
import ROUTER_NAMES from "modules/consts/RouterConst"
import {getBannerMainList, saveBannerMainOrder, deleteBannerMain, getBannerAdList} from 'modules/consts/BooksApi'

//components
import PageLayout from 'components/PageLayout'
import PopupConfirm from 'components/PopupConfirm'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'
import NoResult from 'components/NoResult'
import ReorderBanner from 'pageComponents/books/ReorderBanner'

const List = () => {

  const history = useHistory()
  const userContext = useContext(UserContext)

  const [bannerList, setBannerList] = useState([]);
  const [popup, setPopup] = useState({active: false, type: null});
  const [delParam, setDelParam] = useState({});

  useEffect(() => {
    getBannerList();
  }, [])

  useEffect(async() => {
    //리스트 정렬 순서 바뀔때마다 저장
    await saveBannerMainOrder(bannerList);
  }, [bannerList])

  const getBannerList = async () => {
    let res = await getBannerMainList();
    if(res.data.code === "200"){
      setBannerList(res.data.data.list);
    }
  }

  const handleButtons = (type, item) => {
    switch (type){
      case "add":
        if(bannerList && bannerList.length >= 6){
          setPopup({active: true, type: "over"});
          return;
        }
        navigatePage(`${ROUTER_NAMES.BOOKS_BANNER_MAIN_EDIT}`);
        break;
      case "edit":
        navigatePage(`${ROUTER_NAMES.BOOKS_BANNER_MAIN_EDIT}/${item.bnnrSqn}`);
        break;
      case "delete":
        setPopup({active: true, type: "delete"});
        setDelParam(item);
        break;
      default:
    }
  }

  const handleDelete = async() => {
    let res = await deleteBannerMain({
      bnnrSqn: delParam.bnnrSqn, //배너 순번
      amnnUserId: userContext.state?.userInfo?.mngrId //수정자 ID
    });

    if(res.data.code === "200") {
      setPopup({active: true, type: "confirm"});
    }
  }

  const navigatePage = (url) => {
    history.push(url)
  }

  return (
    <PageLayout currentMenu={'books'} currentCate={'booksBanner'} currentPage={'booksBannerMain'}>
      {popup.active && popup.type === "delete" && (
        <PopupConfirm msg={'해당 배너를 삭제하시겠습니까?'}>
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
        <PopupAlert msg={'배너가 삭제되었습니다.'}
                    handlePopup={() => {
                      setPopup({active: false, type: null});
                      getBannerList();
                    }} />
      )}

      {popup.active && popup.type === "over" && (
        <PopupAlert msg={'배너는 최대 6개까지 등록가능합니다.'}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

      <div className='content_inner page_books'>
        <div className="page_header">
          <h4 className="page_title">메인배너</h4>
          <div className='btn_group'>
            <Button className={'full_blue w65'} onClick={() => handleButtons("add")}>
              등록
            </Button>
          </div>
        </div>

        <div className={'section banner_main_section'}>
          {
            bannerList && bannerList.length > 0 ? (
              <div className="table_wrap border_bottom_none table_th_border banner_main_list_table scroll">
                <div className="custom_table apply_prod_table">
                  <div className="t_header">
                    <div className="t_row header">
                      <div className="t_cell">순서</div>
                      <div className="t_cell">배너이미지</div>
                      <div className="t_cell">메인타이틀</div>
                      <div className="t_cell">상태</div>
                      <div className="t_cell">&nbsp;</div>
                    </div>
                  </div>
                  <ReorderBanner type={"main"}
                                 list={bannerList} setList={setBannerList}
                                 handleButtons={handleButtons}
                                 handleMoveDetail={(item) => navigatePage(`${ROUTER_NAMES.BOOKS_BANNER_MAIN_VIEW}/${item.bnnrSqn}`)}/>
                </div>
              </div>
            ) : (
              <div className="table_no_result">
                <NoResult msg={'등록된 배너가 없습니다. 배너는 최대 6개까지 등록 가능합니다.\n(등록된 배너가 없는 경우 기본 이미지, 텍스트로 노출됩니다.)'} />
              </div>
            )
          }
        </div>
        <div className='etc_text'>
          * 순서변경의 ≡ 아이콘을 마우스 좌클릭으로 드래그하여 순서를 조정할 수 있습니다. 가장 상단에 위치한 것이 첫번째로 노출됩니다.
        </div>
      </div>
    </PageLayout>
  )
}

export default List
