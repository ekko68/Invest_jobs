import React, { useContext, useEffect, useState } from 'react'


// modules
import { UserContext } from 'modules/common/UserContext'
import { getBannerList, saveBannerOrder, deleteBanner } from 'modules/consts/MainApi'
import ROUTER_NAMES from 'modules/consts/RouterConst'


// components
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import NoResult from 'components/NoResult'
import PopupAlert from 'components/PopupAlert'
import PopupConfirm from 'components/PopupConfirm'
import { useHistory } from 'react-router-dom'
import ReorderBanner from 'pageComponents/main/banner/ReorderBanner'

const List = () => {

  const history = useHistory()
  const userContext = useContext(UserContext)


  const [bannerList, setBannerList] = useState([])
  const [popup, setPopup] = useState({active: false, type: null})
  const [delParam, setDelParam] = useState({})

  useEffect(() => {
    apiGetBannerList()
  },[])

  useEffect(async() => {
    //리스트 정렬 순서 바뀔때마다 저장
    await saveBannerOrder(bannerList);
  }, [bannerList])


  const apiGetBannerList = async () => {
    let res = await getBannerList({bnnrComCdId: "BNR00001"}); //배너코드(더보기)
    if (res.data?.code === '200') {
      let setBannerListForm = res.data.data?.list?.map((item) => {
        return {...item, bnnrComCdId: "BNR00001"}; //배너코드(더보기)
      })
      setBannerList(setBannerListForm);
    } else {
      setPopup({active: true, type: "error"});
    }
  }

  const handleButtons = (type, item) => {
    switch (type){
      case "add":
        if(bannerList && bannerList.length >= 5){
          setPopup({active: true, type: "over"});
          return;
        }
        navigatePage(`${ROUTER_NAMES.MAIN_BANNER_MORE_WRITE}`);
        break;
      case "edit":
        navigatePage(`${ROUTER_NAMES.MAIN_BANNER_MORE_WRITE}/${item.bnnrSqn}`);
        break;
      case "delete":
        setPopup({active: true, type: "delete"});
        setDelParam(item);
        break;
      default:
    }
  }

  const handleDelete = async() => {
    let res = await deleteBanner({
      bnnrComCdId: "BNR00001", //배너코드(더보기)
      bnnrSqn: delParam.bnnrSqn, //배너 순번
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

  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainBanner'} currentPage={'mainBannerMore'}>
      {popup.active && popup.type === "over" && (
        <PopupAlert
          msg={'배너는 최대 5개까지 등록이 가능합니다.'}
          handlePopup={() => setPopup({active: false, type: null})}
        />
      )}
      {popup.active && popup.type === "delete" && (
        <PopupConfirm msg={'해당 배너를 삭제하시겠습니까?'}>
          <Button className={'full_grey'} onClick={() => {
            setPopup({active: false, type: null});
            setDelParam({});
          }}>
            취소
          </Button>
          <Button
            className={'full_blue'}
            onClick={handleDelete}
          >
            확인
          </Button>
        </PopupConfirm>
      )}

      {popup.active && popup.type === "confirm" && (
        <PopupAlert
          msg={'해당 배너가 삭제되었습니다.'}
          handlePopup={() => {
            setPopup({ active: false, type: null });
            apiGetBannerList();
          }}
        />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={'오류가 발생했습니다.'}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

      <div className='content_inner main_banner_list'>
        <div className="page_header">
          <h4 className="page_title">더보기(중간)</h4>
          <div className='btn_group'>
            <Button className={'full_blue w65'}  onClick={() => handleButtons("add")}>
              등록
            </Button>
          </div>
        </div>


        <div className={'section main_banner_section'}>
          {
            bannerList && bannerList.length > 0 ? (
              <div className="table_wrap border_bottom_none table_th_border biz_list_table scroll">
                {/*custom_table start*/}
                <div className="custom_table apply_prod_table">
                  <div className="t_header">
                    <div className="t_row header">
                      <div className="t_cell">순서</div>
                      <div className="t_cell">배너이미지</div>
                      <div className="t_cell">링크url</div>
                      <div className="t_cell">상태</div>
                      <div className="t_cell">&nbsp;</div>
                    </div>
                  </div>
                  <ReorderBanner
                    list={bannerList}
                    setList={setBannerList}
                    handleButtons={handleButtons}
                    handleMoveDetail={(item) => navigatePage(`${ROUTER_NAMES.MAIN_BANNER_MORE_VIEW}/${item.bnnrSqn}`)}/>
                </div>
              </div>
            ) : (
              <div className="table_no_result">
                <NoResult msg={'등록된 배너가 없습니다. 배너는 최대 5개까지 등록 가능합니다.\n(등록된 배너가 없는 경우 기본 이미지, 텍스트로 노출됩니다.)'} />
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
