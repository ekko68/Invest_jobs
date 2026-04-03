import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

// components
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Checkbox from 'components/atomic/Checkbox'
import NoResult from 'components/NoResult'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import { MainContext } from 'modules/common/MainContext'
import PopupAlert from 'components/PopupAlert'
import PopupConfirm from 'components/PopupConfirm'

// modules
import { getCsNoticeList, deleteMultiCsNotice } from 'modules/consts/MainApi'
import { UserContext } from 'modules/common/UserContext'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { getTotalNumberBoard } from 'modules/common'
import * as commonFn from 'modules/fns/commonFn'

const List = () => {

  const userContext = useContext(UserContext)
  const mainContext = useContext(MainContext)
  const history = useHistory()

  const [checkAll, setCheckAll] = useState({ id: 'user_chk_all', value: '', status: false })
  const [noticeList, setNoticeList] = useState([])
  const [paging,setPaging] = useState(null)

  const [popup, setPopup] = useState({active: false, type: null, text: ""});
  const [delParam, setDelParam] = useState([]);

  useEffect(() => {
    return () => {
      mainContext.actions.setNoticeListParams();
    }
  }, [])

  useEffect(async () => {
    await apiGetBoxNoticeList();
  }, [mainContext.state.noticeListParam?.page]);

  const apiGetBoxNoticeList = async (reset = false) => {
    let params = mainContext.state.noticeListParam;
    if(reset) params = mainContext.state.noticeInitListParams;
    let res = await getCsNoticeList(params);
    if (res.data.code === '200') {
      let data = res.data.data;
      handleSetCheckBox(data.list)
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
      setPopup({active: true, type: "error", text: "오류가 발생했습니다."});
    }

    setCheckAll({...checkAll, status: false});
  }

  const handleButtons = (type, item) => {
    switch (type){
      case "add":
        navigatePage(`${ROUTER_NAMES.MAIN_CS_NOTICE_WRITE}`);
        break;
      case "edit":
        navigatePage(`${ROUTER_NAMES.MAIN_CS_NOTICE_WRITE}/${item?.pbnsId}`);
        break;
      case "delete":
        var countChecked = noticeList.filter((el) => el.checkbox.status === true);
        if(countChecked.length < 1) {
          return setPopup({active: true, type: "error", text: "삭제할 게시글을 선택해주세요."});
        } else {
          setPopup({active: true, type: "delete", text: ""});
          setDelParam(countChecked);
        }
        break;
      default:
    }
  }

  const handleDelete = async() => {
    let res = await deleteMultiCsNotice({
      amnnUserId: userContext.state?.userInfo?.mngrId, //수정자 ID
      updateList: delParam.map((item) => item.pbnsId) //삭제할 아이템
    });

    if(res.data.code === "200") {
      setPopup({active: true, type: "confirm", text: ""});
    } else {
      setPopup({active: true, type: "error", text: "오류가 발생했습니다."});
    }
  }

  const navigatePage = (url) => {
    history.push(url)
  }

  const handleSetCheckBox = (list) => {
    const tempList = list.map((item) => ({ ...item, checkbox: { id: item.pbnsId, value: '', status: false } }))
    setNoticeList(tempList)
  }

  // ===== checkbox
  const handleCheckbox = (e, id) => {
    let newList = []
    if (id === 'user_chk_all') {
      newList = noticeList.map(
        (list) =>
          e.target.id === 'user_chk_all' && { ...list, checkbox: { ...list.checkbox, status: e.target.checked } }
      )
      setCheckAll({
        ...checkAll,
        status: e.target.checked
      })
    } else {
      if (e.target.id === false) {
        setCheckAll({
          ...checkAll,
          status: false
        })
      }
      newList = noticeList.map((list) =>
        list.checkbox.id === e.target.id ? { ...list, checkbox: { ...list.checkbox, status: e.target.checked } } : list
      )
    }
    handleCheckAll(newList)
    setNoticeList(newList)
  }

  // 목록에서 체크박스가 전체 체크되었는지 확인
  const handleCheckAll = (list) => {
    let cnt = 0
    for (let i = 0; i < list.length; i++) {
      if (list[i].checkbox.status) {
        cnt++
      }
    }
    cnt === list.length
      ? setCheckAll({
        ...checkAll,
        status: true
      })
      : setCheckAll({
        ...checkAll,
        status: false
      })
  }

  // 페이징
  const handlePaging = async (param) => {
    mainContext.actions.setNoticeListParams({
      ...mainContext.state.noticeListParam,
      ...param
    });
  }

  //초기화
  const handleReset = async () => {
    mainContext.actions.setNoticeListParams();
    await apiGetBoxNoticeList(true);
  }

  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainCs'} currentPage={'mainCsNotice'}>
      {popup.active && popup.type === "delete" && (
        <PopupConfirm msg={'해당 게시글을 삭제하시겠습니까?'}>
          <Button className={'full_grey'} onClick={() => {
            setPopup({active: false, type: null});
            setDelParam([]);
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
          msg={'해당 게시글이 삭제되었습니다.'}
          handlePopup={() => {
            setPopup({ active: false, type: null, text: "" });
            apiGetBoxNoticeList();
          }}
        />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={popup.text}
                    handlePopup={() => {
                      setPopup({active: false, type: null, text: ""})
                    }} />
      )}

      <div className='content_inner page_main_notice'>
        <div className='page_header'>
          <h4 className='page_title'>공지사항</h4>
          <div className='btn_group'>
            <p className='total'>{paging ? commonFn.krwFormatter(paging.total) : 0}건</p>
            <Button className={'full_blue w80'} onClick={() => handleButtons("delete")}>
              삭제
            </Button>
            <Button className={'full_blue w80'} onClick={() => handleButtons("add")}>
              등록
            </Button>
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
              <span className="hide">새로고침</span>
            </button>
          </div>
        </div>

        <div className="table_wrap">
          <table className="table">
            <caption>공지사항 테이블</caption>
            <colgroup>
              <col width={'4%'} />
              <col width={'5%'} />
              <col width={'*'} />
              <col width={'10%'} />
              <col width={'25%'} />
            </colgroup>
            <thead>
            <tr>
              <th>
                <Checkbox
                  key={checkAll.id}
                  checkbox={checkAll}
                  onChange={(e) => handleCheckbox(e, checkAll.id)}
                  checked={checkAll.status}
                />
              </th>
              <th>NO</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
            </thead>

            <tbody>
              {
                noticeList && noticeList.length > 0 ? (
                  noticeList.map((item, idx) => {
                    return (
                      <tr key={item?.pbnsId}
                          onClick={(e) => history.push(`${ROUTER_NAMES.MAIN_CS_NOTICE_VIEW}/${item?.pbnsId}`)}>
                        <td onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            key={item.checkbox.pbnsId}
                            checkbox={item.checkbox}
                            onChange={(e) => handleCheckbox(e, item.checkbox.pbnsId)}
                            checked={item.checkbox.status}
                          />
                        </td>
                        <td className={'ta_center'}>
                          {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                        </td>
                        <td>
                          <p className="notice_title text_ellipsis">
                            {item?.pbnsTtl}
                          </p>
                        </td>
                        <td className={'ta_center'}>{item?.rgsnUserNm}</td>
                        <td className={'ta_center'}>
                          {item?.rgsnTsStr && moment(item.rgsnTsStr).format("YYYY-MM-DD hh:mm")}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <NoResult />
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
        <div className={'paging_wrap'}>
          {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
        </div>
        <SearchForm
          selectList={mainContext.state.noticeSearchFilter}
          searchInput={mainContext.state.noticeListParam?.[mainContext.state.noticeSearchFilter?.active] || ""}
          setSearchInput={(text) => mainContext.actions.setNoticeSearchInputText(text)}
          onSelectActive={(selected) => mainContext.actions.setNoticeSearchType(selected)}
          handleSearch={apiGetBoxNoticeList}
        />

      </div>
    </PageLayout>
  )
}

export default List
