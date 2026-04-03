import React, {useContext, useEffect, useState} from 'react'

//components
import Button from 'components/atomic/Button'
import ReorderCategory from 'pageComponents/main/faq/ReorderCategory';
import NoResult from 'components/NoResult'
import PopupConfirm from 'components/PopupConfirm'
import PopupAlert from "components/PopupAlert";
import PopupTextarea from 'components/PopupTextarea'

// modules
import {
  deleteMultiCsNotice,
  getCsFaqCategoryEditList,
  reorderCsFaqCategory, saveCsFaqCategory
} from 'modules/consts/MainApi'
import { UserContext } from 'modules/common/UserContext'
import {MainContext} from "modules/common/MainContext";

//const
const textPopupInit = {faqCtgyId: "", faqCtgyNm: ""};

const PopupCategoryEdit = (props) => {

  const {setCatogoryEditPopup, refreshCategoryList} = props;

  const userContext = useContext(UserContext)
  const mainContext = useContext(MainContext)

  const [checkAll, setCheckAll] = useState({ id: 'user_chk_all', value: '', status: false })
  const [categoryList, setCategoryList] = useState([])

  const [popup, setPopup] = useState({active: false, type: null, text: ""});
  const [textPopup, setTextPopup] = useState({active: false, type: null, data: textPopupInit});
  const [delParam, setDelParam] = useState([]);

  useEffect(async () => {
    await apiGetBoxFaqCategoryEditList();

    return () => {
      mainContext.actions.setNoticeListParams();
    }
  }, [])

  //편집 카테고리 목록 api
  const apiGetBoxFaqCategoryEditList = async (reset = false) => {
    let res = await getCsFaqCategoryEditList();
    if (res.data.code === '200') {
      handleSetCheckBox(res.data.data.list)
    } else {
      setPopup({active: true, type: "error", text: "오류가 발생했습니다."});
    }

    setCheckAll({...checkAll, status: false});
  }

  //편집 카테고리 정렬 저장 api
  const apiGetBoxFaqCategoryOrder = async () => {
    let params = {
      amnnUserId: userContext.state?.userInfo?.mngrId, //계정 ID
      updateList: categoryList //목록
    }
    let res = await reorderCsFaqCategory(params);
    if (res.data.code === '200') {
      setPopup({active: false, type: null, text: ""});
      setCatogoryEditPopup(false);
      refreshCategoryList();
    } else {
      setPopup({active: true, type: "error", text: "오류가 발생했습니다."});
    }

    setCheckAll({...checkAll, status: false});
  }

  //편집 카테고리 추가/수정 api
  const apiGetBoxFaqCategorySave = async (item) => {
    let params = {
      amnnUserId: userContext.state?.userInfo?.mngrId, //계정 ID
      faqCtgyId: item?.faqCtgyId ? item.faqCtgyId : "", //카테고리 id
      faqCtgyNm: item?.faqCtgyNm //카테고리명
    }
    let res = await saveCsFaqCategory(params);
    if (res.data.code === '200') {
      setPopup({active: false, type: null, text: ""});
      setTextPopup({active: false, type: null, data: {}})
      refreshCategoryList();

      await apiGetBoxFaqCategoryEditList();

    } else {
      setPopup({active: true, type: "error", text: "오류가 발생했습니다."});
    }

    setCheckAll({...checkAll, status: false});
  }

  const handleSetCheckBox = (list) => {
    const tempList = list.map((item) => ({ ...item, checkbox: { id: item.faqCtgyId, value: '', status: false } }))
    setCategoryList(tempList)
  }

  // ===== checkbox
  const handleCheckbox = (e, id) => {
    let newList = []
    if (id === 'user_chk_all') {
      newList = categoryList.map(
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
      newList = categoryList.map((list) =>
        list.checkbox.id === e.target.id ? { ...list, checkbox: { ...list.checkbox, status: e.target.checked } } : list
      )
    }
    handleCheckAll(newList)
    setCategoryList(newList)
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

  const handleButtons = (type, item) => {
    switch (type){
      case "add":
        setTextPopup({...textPopup, active: true, type: "add"});
        break;
      case "edit":
        var checkedList = categoryList.filter((item) => item.checkbox.status === true) || [];
        if(checkedList.length === 0){
          setPopup({active: true, type: "error", text: "수정할 내용을 선택해주세요."});
        } else if(checkedList.length === 1){
          setTextPopup({active: true, type: "edit", data: checkedList[0]})
        } else {
          setPopup({active: true, type: "error", text: "수정은 하나씩 가능합니다."});
        }
        break;
      case "delete":
        var countChecked = categoryList.filter((el) => el.checkbox.status === true);
        if(countChecked.length < 1) {
          return setPopup({active: true, type: "error", text: "삭제할 카테고리를 선택해주세요."});
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
      updateList: delParam.map((item) => item.faqCtgyId) //삭제할 아이템
    });

    if(res.data.code === "200") {
      setPopup({active: true, type: "confirm", text: ""});
    } else {
      setPopup({active: true, type: "error", text: "오류가 발생했습니다."});
    }
  }

  const handleSave = (item) => {
    if(item?.faqCtgyNm?.length < 1){
      return setPopup({active: true, type: "error", text: "카테고리명을 입력해주세요."});
    }

    apiGetBoxFaqCategorySave(item)
  }


  return (
    <>
      <div className="popup_wrap popup_main">
        <div className='layer'>&nbsp;</div>
        <div className='popup_container'>
          <div className='popup_content scroll'>

            <div className='popup_main_header'>
              <div className='title'>카테고리 편집</div>
              <div className='btns_wrap'>
                <Button className="linear linear_sky_blue" onClick={() => handleButtons("edit")}>
                  수정
                </Button>
                <Button className="full_blue" onClick={() => handleButtons("delete")}>
                  삭제
                </Button>
                <Button className="full_blue" onClick={() => handleButtons("add")}>
                  추가
                </Button>
              </div>
            </div>

            <div className="table_wrap border_bottom_none table_th_border scroll">
              {
                categoryList && categoryList.length > 0 ? (
                  <div className="custom_table">
                    <div className="t_header">
                      <div className="t_row header">
                        <div className="t_cell">선택</div>
                        <div className="t_cell">순서</div>
                        <div className="t_cell">카테고리명</div>
                      </div>
                    </div>
                    <ReorderCategory list={categoryList} setList={setCategoryList}
                                     handleButtons={handleButtons}
                                     handleCheckbox={handleCheckbox} />
                  </div>
                ): (
                  <div className="table_no_result">
                    <NoResult msg={'등록된 카테고리가 없습니다'} />
                  </div>
                )
              }
            </div>

            <div className='etc_text'>
              * 순서변경의 ≡ 아이콘을 마우스 좌클릭으로 드래그하여 순서를 조정할 수 있습니다. 가장 상단에 위치한 것이 첫번째로 노출됩니다.
            </div>

            <div className="rounded_btn_group">
              <Button className={'basic'} onClick={() => setCatogoryEditPopup(false)}>
                취소
              </Button>
              <Button className={'full_blue'} onClick={() => setPopup({active: true, type: "order", text: "수정 내용을 저장하시겠습니까?"})}>
                확인
              </Button>
            </div>

          </div>
        </div>
      </div>

      {textPopup.active && (
        <PopupTextarea data={textPopup.type === "edit" && categoryList.filter((el) => el.checkbox.status === true)?.[0] || {}}
                       setPopup={setPopup}
                       setTextPopup={setTextPopup}
                       handleSave={handleSave}/>
      )}

      {popup.active && popup.type === "order" && (
        <PopupConfirm msg={popup.text}>
          <Button className={'full_grey'} onClick={() => setPopup({active: false, type: null, text: ""})}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={apiGetBoxFaqCategoryOrder} >
            확인
          </Button>
        </PopupConfirm>
      )}

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
          msg={'해당 카테고리가 삭제되었습니다.'}
          handlePopup={() => {
            setPopup({ active: false, type: null, text: "" });
            apiGetBoxFaqCategoryEditList();
          }}
        />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={popup.text}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

    </>
  )
}

export default PopupCategoryEdit
