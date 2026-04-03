import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

// modules
import { UserContext } from 'modules/common/UserContext'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import {saveCsFaq, getCsFaqCategoryList, getCsFaqDetail} from 'modules/consts/MainApi'

//components
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import PopupAlert from 'components/PopupAlert'
import Select from 'components/atomic/Select'

const Write = () => {

  const { id } = useParams()
  const history = useHistory()
  const userContext = useContext(UserContext)
  const categoryRef = useRef(null)

  const [faqForm, setFaqForm] = useState({
    faqInfId: "", //faq id
    faqCtgyId: "", //카테고리 id
    faqTtl: "", //제목
    faqCon: "", //내용
  })
  const [categorySelectList, setCategorySelectList] = useState({
    active: "",
    list: [{
      lnpSqn: 0,
      id: "",
      label: "카테고리설정",
    }]
  });
  const [popup, setPopup] = useState({active: false, type: null, text: null})
  const [saveData, setSaveData] = useState({});


  useEffect(async () => {
    if(id) {
      let res = await getCsFaqDetail({id: id});
      if(res.data?.code === "200"){
        setFaqForm({
          ...faqForm,
          ...res.data.data
        });
      } else {
        setPopup({active: true, type: "error"});
      }
    }

    await apiGetBoxFaqCategoryList();

  }, [id])

  useEffect(() => {
    if(faqForm.faqCtgyId.length > 0 && categorySelectList.list.length > 1){
      let activeId = categorySelectList.list.filter((el) => el.id === faqForm.faqCtgyId)?.[0].id;
      setCategorySelectList({...categorySelectList, active: activeId});
    }
  }, [id, categorySelectList.list.length])


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

  const handleText = (e) => {
    setFaqForm({
      ...faqForm,
      [e.target.id]: e.target.value.replace(/[^A-Za-z0-9ㄱ-ㅎ가-힣\s`~!?@#$%*-_=+^&*()<>[\]{};:'",.\\/|]/g, "")
    })
  }

  const handleSelectCategory = async (faqCtgyId) => {
    setFaqForm({
      ...faqForm,
      faqCtgyId: faqCtgyId
    })
  }

  const handleValidate = () => {
    let params = faqForm;
    if(params?.faqTtl?.length < 1) {
      return alert("제목을 입력해주세요.");
    }

    if(params?.faqCon?.length < 1) {
      return alert("내용을 입력해주세요.");
    }

    if(params?.faqCtgyId?.length < 1) {
      return alert("카테고리를 선택해주세요.");
    }

    setPopup({active: true, type: "check", text: id ? "수정된 내역을 저장하시겠습니까?" : "등록하시겠습니까?"});
  }

  const handleSave = async () => {
    let params = faqForm;

    params["amnnUserId"] = userContext.state?.userInfo?.mngrId; //계정 ID

    let res = await saveCsFaq(params);
    if(res.data.code === "200"){
      setSaveData(res.data.data);
      setPopup({active: true, type: "confirm", text: id ? "수정된 내역이 저장되었습니다." : "게시글이 등록되었습니다."});
    } else {
      setPopup({active: true, type: "error"});
    }
  }

  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainCs'} currentPage={'mainCsFaq'}>
      {popup.active && popup.type === "check" && (
        <PopupConfirm msg={popup.text}>
          <Button className={'full_grey'} onClick={() => setPopup({active: false, type: null})}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleSave} >
            확인
          </Button>
        </PopupConfirm>
      )}

      {popup.active && popup.type === "confirm" && (
        <PopupAlert msg={popup.text}
                    handlePopup={() => history.push(`${ROUTER_NAMES.MAIN_CS_FAQ_VIEW}/${saveData?.faqInfId}`)} />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={'오류가 발생했습니다.'}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

      <div className='content_inner page_main_notice'>
        <div className='page_header'>
          <h4 className='page_title'>FAQ(자주하는질문) 등록</h4>
        </div>

        <div className="board_write_wrap">
          <div className="board_title">
            <input
              type="text"
              className="input"
              placeholder={'제목을 입력해주세요.'}
              id={"faqTtl"}
              value={faqForm.faqTtl}
              title={'제목'}
              onChange={handleText}
            />
          </div>
          <div className="board_content">
            <textarea
              className="textarea"
              placeholder={'내용을 입력하세요.'}
              id={"faqCon"}
              value={faqForm.faqCon}
              title={'내용'}
              onChange={handleText}
            />
          </div>
          <div className="attach_content">
            <div className="title">카테고리 설정</div>
            <div className="add_file">
              <div className='select_cover'>
                <Select
                  width={'170px'}
                  optionList={categorySelectList}
                  ref={categoryRef}
                  handleSelectActive={handleSelectCategory}
                />
              </div>
            </div>
          </div>

          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={() => history.goBack()}>
              취소
            </Button>
            <Button className={'full_blue'} onClick={handleValidate}>
              등록
            </Button>
          </div>
        </div>

      </div>
    </PageLayout>
  )
}

export default Write
