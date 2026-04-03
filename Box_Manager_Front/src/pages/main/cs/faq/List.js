import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import moment from "moment/moment";

// components
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import NoResult from 'components/NoResult'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import Select from 'components/atomic/Select'
import PopupCategoryEdit from 'pageComponents/main/faq/PopupCategoryEdit'
import Checkbox from 'components/atomic/Checkbox'
import PopupConfirm from 'components/PopupConfirm'
import PopupAlert from 'components/PopupAlert'

// modules
import { UserContext } from 'modules/common/UserContext'
import { MainContext } from 'modules/common/MainContext'
import {deleteMultiCsFaq, getCsFaqCategoryList, getCsFaqList} from 'modules/consts/MainApi'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import * as commonFn from 'modules/fns/commonFn'
import { getTotalNumberBoard } from 'modules/common'

const List = () => {

  const userContext = useContext(UserContext)
  const mainContext = useContext(MainContext)
  const history = useHistory()
  const categoryRef = useRef(null)

  const [checkAll, setCheckAll] = useState({ id: 'user_chk_all', value: '', status: false })
  const [faqList, setFaqList] = useState([])
  const [paging,setPaging] = useState(null)

  const [popup, setPopup] = useState({active: false, type: null, text: ""});
  const [delParam, setDelParam] = useState({});

  const [catogoryEditPopup, setCatogoryEditPopup] = useState(false);
  const [categorySelectList, setCategorySelectList] = useState({
    active: "",
    list: [{
      lnpSqn: 0,
      id: "",
      label: "카테고리설정",
    }]
  });


  useEffect(async () => {
    await apiGetBoxFaqCategoryList();

    return () => {
      mainContext.actions.setFaqListParams();
    }
  }, [])

  useEffect(async () => {
    await apiGetBoxFaqList();
  }, [mainContext.state.faqListParam?.page]);

  //FAQ 목록 api
  const apiGetBoxFaqList = async (reset = false, faqCtgyId = null) => {
    let params = mainContext.state.faqListParam;
    if(reset) params = mainContext.state.faqInitListParams;
    if(faqCtgyId) {
      params = {...mainContext.state.faqListParam, faqCtgyId: faqCtgyId};
      mainContext.actions.setFaqListParams({faqCtgyId: faqCtgyId});
    }
    let res = await getCsFaqList(params)
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

  //카테고리 목록 api
  const apiGetBoxFaqCategoryList = async () => {
    let res = await getCsFaqCategoryList();
    if (res.data.code === '200') {
      let newList = categorySelectList.list;

      if(newList.length > 1){
        newList = [{
          lnpSqn: 0,
          id: "",
          label: "카테고리설정",
        }]
      }

      res.data.data?.list && res.data.data.list.map((item) => {
        newList.push({
          lnpSqn: item.lnpSqn,
          id: item.faqCtgyId,
          label: item.faqCtgyNm
        })
      })

      setCategorySelectList({...categorySelectList, list: newList});
    } else {
      setPopup({active: true, type: "error", text: "오류가 발생했습니다."});
    }
  }

  const handleSelectCategory = async (faqCtgyId) => {
    mainContext.actions.setFaqListParams({faqCtgyId: faqCtgyId});
    await apiGetBoxFaqList(false, faqCtgyId);
  }

  const blurSelect = () => {
    const classList = categoryRef.current?.classList
    if (classList.contains('active')) classList.remove('active')
  }

  const handleButtons = (type, item) => {
    blurSelect();

    switch (type){
      case "add":
        navigatePage(`${ROUTER_NAMES.MAIN_CS_FAQ_WRITE}`);
        break;
      case "edit":
        navigatePage(`${ROUTER_NAMES.MAIN_CS_FAQ_WRITE}/${item?.faqInfId}`);
        break;
      case "delete":
        var countChecked = faqList.filter((el) => el.checkbox.status === true);
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
    let res = await deleteMultiCsFaq({
      amnnUserId: userContext.state?.userInfo?.mngrId, //수정자 ID
      updateList: delParam.map((item) => item.faqInfId) //삭제할 아이템
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
    const tempList = list.map((item) => ({ ...item, checkbox: { id: item.faqInfId, value: '', status: false } }))
    setFaqList(tempList)
  }

  // ===== checkbox
  const handleCheckbox = (e, id) => {
    let newList = []
    if (id === 'user_chk_all') {
      newList = faqList.map(
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
      newList = faqList.map((list) =>
        list.checkbox.id === e.target.id ? { ...list, checkbox: { ...list.checkbox, status: e.target.checked } } : list
      )
    }
    handleCheckAll(newList)
    setFaqList(newList)
  }

  // 목록에서 체크박스가 전체 체크되었는지 확인
  const handleCheckAll = (list) => {
    blurSelect();

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
    blurSelect();

    mainContext.actions.setFaqListParams({
      ...mainContext.state.faqListParam,
      ...param
    });
  }

  //초기화
  const handleRefresh = async () => {
    blurSelect();

    mainContext.actions.setFaqListParams();
    setCategorySelectList({...categorySelectList, active: ""});
    await apiGetBoxFaqList(true);
  }

  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainCs'} currentPage={'mainCsFaq'}>
      {popup.active && popup.type === "delete" && (
        <PopupConfirm msg={'해당 게시글을 삭제하시겠습니까?'}>
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
          msg={'해당 게시글이 삭제되었습니다.'}
          handlePopup={() => {
            setPopup({ active: false, type: null, text: "" });
            apiGetBoxFaqList();
          }}
        />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={popup.text}
                    handlePopup={() => {
                      setPopup({active: false, type: null, text: ""})
                    }} />
      )}

      {
        //카테고리 편집 팝업
        catogoryEditPopup && (
          <PopupCategoryEdit setCatogoryEditPopup={setCatogoryEditPopup}
                             refreshCategoryList={async () => await apiGetBoxFaqCategoryList()}/>
        )
      }

      <div className='content_inner page_main_notice faq'>
        <div className='page_header'>
          <h4 className='page_title'>FAQ(자주하는질문)</h4>
          <div className='btn_group'>
            <p className='total'>{paging ? commonFn.krwFormatter(paging.total) : 0}건</p>
            <Button className={'full_blue w80'} onClick={() => handleButtons("delete")}>
              삭제
            </Button>
            <Button className={'full_blue w80'} onClick={() => handleButtons("add")}>
              등록
            </Button>
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleRefresh}>
              <span className="hide">새로고침</span>
            </button>
          </div>
        </div>

        <div className='btn_wrap'>
          <Button className="linear linear_sky_blue" onClick={() => {
            blurSelect();
            setCatogoryEditPopup(!catogoryEditPopup);
          }}>
            카테고리 추가/수정
          </Button>
          <Select
            width={'170px'}
            optionList={categorySelectList}
            ref={categoryRef}
            handleSelectActive={handleSelectCategory}
          />
        </div>

        <div className="table_wrap">
          <table className="table">
            <caption>공지사항 테이블</caption>
            <colgroup>
              <col width={'4%'} />
              <col width={'5%'} />
              <col width={'15%'} />
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
              <th>카테고리</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
            </thead>

            <tbody>
            {
              faqList && faqList.length > 0 ? (
                faqList.map((item, idx) => {
                  return (
                    <tr
                      key={item?.faqInfId}
                      onClick={(e) => history.push(`${ROUTER_NAMES.MAIN_CS_FAQ_VIEW}/${item?.faqInfId}`)}>
                      <td onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          key={item.checkbox.faqInfId}
                          checkbox={item.checkbox}
                          onChange={(e) => handleCheckbox(e, item.checkbox.faqInfId)}
                          checked={item.checkbox.status}
                        />
                      </td>
                      <td className={'ta_center'}>
                        {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                      </td>
                      <td>{item?.faqCtgyNm}</td>
                      <td>
                        <p className="notice_title text_ellipsis">
                          {item?.faqTtl}
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
                  <td colSpan={6}>
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
          selectList={mainContext.state.faqSearchFilter}
          searchInput={mainContext.state.faqListParam?.[mainContext.state.faqSearchFilter?.active] || ""}
          setSearchInput={(text) => {
            blurSelect();
            mainContext.actions.setFaqSearchInputText(text);
          }}
          onSelectActive={(selected) => {
            blurSelect();
            mainContext.actions.setFaqSearchType(selected);
          }}
          handleSearch={apiGetBoxFaqList}
        />

      </div>
    </PageLayout>
  )
}

export default List
