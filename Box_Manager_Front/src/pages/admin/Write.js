import React, { useContext, useEffect, useState, useCallback } from 'react'
import { isArray } from 'chart.js/helpers'
import Checkbox from 'components/atomic/Checkbox'
import PageLayout from 'components/PageLayout'
import * as adminFn from 'modules/fns/admin/adminFn'
import * as commonFn from 'modules/fns/commonFn'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { useHistory } from 'react-router-dom'
import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import {
  getUserDetail,
  setUserInfo,
  getUserMenu,
  getUserAthrMenu,
  setUserAthrMenu
} from 'modules/consts/AdminApi'
import { UserContext } from 'modules/common/UserContext'
import PopupAlert from "components/PopupAlert";
import {StringUtils} from "modules/utils/StringUtils";

const Write = (props) => {
  const id = props.match.params.id
  const history = useHistory()
  const userContext = useContext(UserContext)

  const [msgAlert, setMsgAlert] = useState({
    state : false,
    message : ""
  })

  const [userDetail, setUserDetail] = useState({
    mngrId: '',
    mngrNm: '',
    mngrEmlAdr: '',
    mngrTpn: '',
    mngrClphNo: '',
    mngrPswd: '',
    mngrPswdCheck: '',
  })
  const [menuList, setMenuList] = useState([]) // 전체메뉴
  const [ui, setUi] = useState([]) // rendering 할 table ui 목록
  const [confirm, setConfirm] = useState({
    status: false,
    msg: ''
  })

  // ===== get Detail
  const getData = async (params) => {
    const res = await getUserDetail(params)
    if (res.data.code === '200') {
      setUserDetail({
        ...res.data.data
      })
    } else {
      console.log('조회 실패')
    }
  }

  // ===== 권한설정 체크박스
  /** 재귀함수로 list를 순회 하면서 Object를 만나면 fn으로 설정값을 적용함. */
  const _recursiveFn = (iter, val, id, fn) => {
    // iter가 Array인 경우
    if (isArray(iter)) iter.forEach((el) => _recursiveFn(el, val, id, fn))
    // Object의 id요소가 change로 넘어온 id와 같은 경우 사용자 함수(fn)로 처리함.
    fn(iter, val, id)
    // Object 요소중 리스트가 포함된 경우
    for (const [key, value] of Object.entries(iter)) {
      if (isArray(value)) _recursiveFn(value, val, id, fn)
    }
  }

  /** 권한 > 메뉴권한 > 체크박스: 전체 메뉴중 하나라도 체크되지 않은것이 있다면 체크해지 / 모두 체크되어 있다면 체크함으로 표시 */
  const handleAllCheckBox = () => {
    const checkboxList = document.querySelectorAll('[name="menuCheckBox"]')
    let res = true
    for (const checkbox of checkboxList) {
      if (!checkbox.checked) res = false
    }
    document.querySelector('#menuAllCheckBox').checked = res
  }

  /** 권한 > 메뉴권한 > 중분류 또는 소분류의 체크박스에서 checked 변동값이 발생시 */
  const handleChange = (e, id) => {
    const tempMenuList = menuList
    _recursiveFn(tempMenuList, e.target.checked, id, (iter, val, id) => {
      if (iter.menuId === id) {
        iter['checked'] = val
        return
      }
    })
    handleAllCheckBox()
    setMenuList([...tempMenuList])
  }

  /** 권한 > 메뉴권한 > 권한체크박스(전체 체크/해지) 클릭시 */
  const handleAllChecked = (e) => {
    const tempMenuList = menuList
    _recursiveFn(tempMenuList, e.target.checked, null, (iter, val) => (iter['checked'] = val))
    setMenuList([...tempMenuList])
  }

  const handleSave = async() => {

    //
    handleConfirm('close');

    //
    let validResponse = adminFn.adminWriteValidCheck("idCheck", userDetail.mngrId);
    if(!validResponse.state){
      setMsgAlert({ state : true, message : validResponse.msg })
      commonFn.handleScrollTop()
      return
    }

    validResponse = adminFn.adminWriteValidCheck("nameCheck", userDetail.mngrNm);
    if(!validResponse.state){
      setMsgAlert({ state : true, message : validResponse.msg })
      commonFn.handleScrollTop()
      return
    }

    validResponse = adminFn.adminWriteValidCheck("emailCheck", userDetail.mngrEmlAdr);
    if(!validResponse.state){
      setMsgAlert({ state : true, message : validResponse.msg })
      commonFn.handleScrollTop()
      return
    }

    // if((!id || userContext.state.userInfo?.mngrId === id)) {
    if((!id || StringUtils.hasLength(userDetail.mngrPswd))) {
      validResponse = adminFn.adminWriteValidCheck("pwdCheck", userDetail.mngrPswd);
      if (!validResponse.state) {
        setMsgAlert({state: true, message: validResponse.msg})
        commonFn.handleScrollTop()
        return
      }

      if (userDetail.mngrPswd != userDetail.mngrPswdCheck) {
        setMsgAlert({state: true, message: '비밀번호 정보가 다릅니다.\n비밀번호 항목을 확인해주세요.'})
        commonFn.handleScrollTop()
        return
      }
    }

    // if(userDetail.mngrClphNo != ""){
    if(StringUtils.hasLength(userDetail.mngrClphNo)){
      validResponse = adminFn.adminWriteValidCheck("phoneCheck", userDetail.mngrClphNo);
      if(!validResponse.state){
        setMsgAlert({ state : true, message : validResponse.msg })
        commonFn.handleScrollTop()
        return
      }
    }

    // if(userDetail.mngrTpn != ""){
    if(StringUtils.hasLength(userDetail.mngrTpn)){
      validResponse = adminFn.adminWriteValidCheck("telCheck", userDetail.mngrTpn);
      if(!validResponse.state){
        setMsgAlert({ state : true, message : validResponse.msg })
        commonFn.handleScrollTop()
        return
      }
    }

    //사용자 등록
    const res = await setUserInfo(userDetail)
    if (res.data.code === '200') {
      let checkMenu = [];
      menuList?.map((lnb1, idx1)=>{
        lnb1?.lnbList.map((lnb2, idx2)=>{
          if(lnb2.checked == true){
            checkMenu.push({
              menuId : lnb2.menuId
            });
          }
          lnb2?.subList.map((lnb3, idx3)=> {
            if(lnb3.checked == true){
              checkMenu.push({
                menuId : lnb3.menuId
              });
            }
          })
        })
      });

      //id가 있으면 등록, 없으면 등록
      const setUserId = id != undefined ? id : userDetail.mngrId;

      let isMenuUpdate = false;
      if(userContext.state.userInfo?.supMngrYn == "Y") {
        const resMenu = await setUserAthrMenu({mngrId: setUserId, menuIdList: checkMenu});
        if(resMenu.data.code === '200') isMenuUpdate = true;
      } else {
        isMenuUpdate = true;
      }

      if (isMenuUpdate) {
        setMsgAlert({state: true, message: '정보 수정이 완료되었습니다.'})
      } else {
        setMsgAlert({state: true, message: '정보 수정 중 오류가 발생하였습니다.'})
      }

    } else {
      setMsgAlert({ state : true, message : '사용자 정보 등록 중 오류가 발생하였습니다.' })
    }
  }

  // ===== confirm
  const handleConfirm = useCallback((type) => {
    if (type == 'close') {
      setConfirm({
        status: false,
        msg: ''
      })
    }else if (type === 'valid') {
      setConfirm({
        status: true,
        msg: "저장 하시겠습니까?"
      })
    }
  },[])

  // ===== 권한설정 테이블 ui
  const handleMakeUi = () => {
    const tableUI = adminFn.makeUi(menuList, handleChange, id ? 'update' : 'create')
    setUi(tableUI)
  }

  // ==== link to
  const linkToList = () => {
    history.push(`${ROUTER_NAMES.ADMIN_LIST}`)
  }

  // 2023.11.14 일반관리자 계정 진입시 메뉴 권한 목록 조회 제거 ====================================

  // useEffect(async () => {
  //   if(id) {
  //     const res = await getUserAthrMenu({mngrId: id})
  //     if (res.data.code === '200') {
  //       setMenuList(res.data.data.list);
  //     } else {
  //       setMsgAlert({ state : true, message : '메뉴 정보 확인 중 오류가 발생하였습니다.' })
  //     }
  //   }else{
  //     const res = await getUserMenu()
  //     if (res.data.code === '200') {
  //       setMenuList(res.data.data.list);
  //     } else {
  //       setMsgAlert({ state : true, message : '메뉴 정보 확인 중 오류가 발생하였습니다.' })
  //     }
  //   }
  // }, [])

  const getMenu = async () => {
      if(id) {
        const res = await getUserAthrMenu({mngrId: id})
        if (res.data.code === '200') {
          setMenuList(res.data.data.list);
        } else {
          setMsgAlert({ state : true, message : '메뉴 정보 확인 중 오류가 발생하였습니다.' })
        }
      }else{
        const res = await getUserMenu()
        if (res.data.code === '200') {
          setMenuList(res.data.data.list);
        } else {
          setMsgAlert({ state : true, message : '메뉴 정보 확인 중 오류가 발생하였습니다.' })
        }
      }
  }

  useEffect(() => {
    if (userContext.state.userInfo?.supMngrYn == "Y") getMenu();
  }, [userContext.state.userInfo]);

  // ==================================== 2023.11.14 일반관리자 계정 진입시 메뉴 권한 목록 조회 제거

  useEffect(() => {
    if (menuList) {
      handleMakeUi()
    }
  }, [menuList])

  useEffect(async () => {
    id && (await getData({ mngrId: id }))
  }, [id])

  return (
      <PageLayout currentMenu={'admin'} currentCate={'account'}>
        {(msgAlert.state && msgAlert.message) && <PopupAlert msg={msgAlert.message} handlePopup={() => setMsgAlert(!msgAlert.state)} />}

        {confirm.status && (
            <PopupConfirm msg={confirm.msg}>
              <Button className={'full_grey'} onClick={() => handleConfirm('close')}>
                취소
              </Button>
              <Button className={'full_blue'} onClick={() => handleSave()}>
                확인
              </Button>
            </PopupConfirm>
        )}

        <div className="content_inner page_authority">
          <div className="page_header page_title" style={{ borderColor: '#e5e5e5' }}>
            <h4>관리자계정 관리</h4>

            {
                // 일반 관리자는 본인 계정관리 페이지만 진입 가능하므로 목록 버튼 제거
                (userContext?.state?.userInfo?.supMngrYn === "Y") &&
                <Button
                    className={'basic'}
                    onClick={()=>linkToList()}
                    style={{ width: '80px', fontSize: '14px', height: '31px' }}
                >
                  목록
                </Button>
            }
          </div>

          {/* basic info start */}
          <div className="section mb45">
            {/*section_header start*/}
            <div className="section_header">
              <p className="section_title">기본 정보</p>
              <p className="notice">
                <span className={'highlight_red'}>*</span>이 필드는 필수 필드 입니다.
              </p>
            </div>
            {/*section_header end*/}
            {/*table_wrap start*/}
            <form>
              <div className="table_wrap">
                <table className="table form_table bg_none border_none">
                  <caption>기본 정보 테이블</caption>
                  <colgroup>
                    <col width={'13%'} />
                    <col width={'35%'} />
                    <col width={'*'} />
                  </colgroup>
                  <tbody>
                  <tr>
                    <th className={'ta_left'}>
                      <p className="require">아이디</p>
                    </th>
                    <td>
                      {
                        id ?
                            <input
                                name={'mngrId'}
                                type="text"
                                className="input"
                                value={userDetail?.mngrId}
                                disabled={ true }
                                title={'아이디'}
                                placeholder={'아이디를 입력해주세요.'}
                            />
                            :
                            <input
                                name={'mngrId'}
                                type="text"
                                className="input"
                                value={userDetail?.mngrId}
                                onInput={(e)=>setUserDetail({...userDetail, mngrId: e.target.value})}
                                title={'아이디'}
                                placeholder={'아이디를 입력해주세요.'}
                            />
                      }
                    </td>
                    <td className={'padding_none'}>
                      <p className="info">
                        3자리 이상으로 작성해주세요.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <th className={'ta_left'}>
                      <p className="require">이름</p>
                    </th>
                    <td>
                      <input
                          name={'mngrNm'}
                          type="text"
                          className="input"
                          value={userDetail?.mngrNm}
                          onInput={(e)=>setUserDetail({...userDetail, mngrNm: e.target.value})}
                          title={'이름'}
                          placeholder={'이름을 입력해주세요.'}
                      />
                    </td>
                    <td className={'padding_none'}>
                      <p className="info">
                        2자리 이상으로 작성해주세요.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <th className={'ta_left'}>
                      <p className="require">이메일</p>
                    </th>
                    <td>
                      <input
                          name="mngrEmlAdr"
                          type="email"
                          className="input"
                          value={userDetail?.mngrEmlAdr}
                          onInput={(e)=>setUserDetail({...userDetail, mngrEmlAdr: e.target.value})}
                          title={'이메일'}
                          placeholder={'이메일를 입력해주세요.'}
                      />
                    </td>
                    <td>&nbsp;</td>
                  </tr>
                  {/*@todo 패스워드 확인*/}
                  {/*1. 슈퍼관리자 - 등록 : 패스워드 있음*/}
                  {/*2. 슈퍼관리자 - 수정 : 패스워드 없음 - 없어도 수정 가능 */}
                  {/*3. 일반관리자 - 수정 : 패스워드 있음 - 패스워드가 맞아야 수정 가능 */}
                  {(!id || userContext.state.userInfo?.mngrId === id || userContext.state.userInfo?.supMngrYn == 'Y') && (
                      <>
                        <tr>
                          <th className={'ta_left'}>
                            {(!id) && (<p className="require"></p>)}
                            비밀번호
                          </th>
                          <td>
                            <input
                                name="mngrPswd"
                                id="mngrPswd"
                                type="password"
                                className="input"
                                onInput={(e)=>setUserDetail({...userDetail, mngrPswd: e.target.value})}
                                autoComplete={'off'}
                                title={'비밀번호'}
                                placeholder={'비밀번호를 입력해주세요.'}
                            />
                          </td>
                          <td className={'padding_none'}>
                            <p className="info">
                              비밀번호는 8~20자 이내로 영문 대소문자,숫자,특수문자, 중 3가지 이상 혼용하여 입력해 주세요.
                              연속된 숫자 또는 4자 이상의 동일 문자는 비밀번호로 사용할 수 없습니다.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <th className={'ta_left'}>
                            {(!id) && (<p className="require"></p>)}
                            비밀번호 확인
                          </th>
                          <td>
                            <input
                                id="mngrPswdCheck"
                                type="password"
                                className="input"
                                onInput={(e)=>setUserDetail({...userDetail, mngrPswdCheck: e.target.value})}
                                autoComplete={'off'}
                                title={'비밀번호 확인'}
                                placeholder={'비밀번호를 입력해주세요.'}
                            />
                          </td>
                          <td>&nbsp;</td>
                        </tr>
                      </>
                  )}
                  <tr className={'border_top'}>
                    <th className={'ta_left'}>휴대폰번호</th>
                    <td>
                      <input
                          name="mngrClphNo"
                          type="input"
                          className="input input_number"
                          defaultValue={userDetail?.mngrClphNo}
                          onInput={(e)=>setUserDetail({...userDetail, mngrClphNo: e.target.value})}
                          title={'연락처'}
                          placeholder={'연락처를 입력해주세요.'}
                      />
                    </td>
                    <td className={'padding_none'}>
                      <p className="info">
                        ex) 010-111-1234
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <th className={'ta_left'}>전화번호</th>
                    <td>
                      <input
                          name="mngrTpn"
                          type="input"
                          className="input input_number"
                          defaultValue={userDetail?.mngrTpn}
                          onInput={(e)=>setUserDetail({...userDetail, mngrTpn: e.target.value})}
                          title={'전화번호'}
                          placeholder={'전화번호를 입력해주세요.'}
                      />
                    </td>
                    <td className={'padding_none'}>
                      <p className="info">
                        ex) 031-111-1234
                      </p>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </form>
            {/*table_wrap end*/}
          </div>
          {/* basic info end */}


          {/* authority start */}
          {
              // 2023.11.14 --> 관리자계정 관리 화면 : 본인 계정인 경우 수퍼관리자가 아니더라도 조회 가능하도록 변경 (일부 기능 제한)
              // 메뉴 권한은 슈퍼 관리자만 가능
              (userContext?.state?.userInfo?.supMngrYn === "Y") &&
              <div className="section">
                <div className="section">
                  <div className="section_header mb20">
                    <p className="section_title">권한</p>
                  </div>
                </div>
                <div className="authority_wrap">
                  <div className="authority_section">
                    <div className="authority_table table_type02_wrap" style={{ borderBottom: 'none' }}>
                      <table className="table_type02">
                        <caption>권한 테이블</caption>
                        <colgroup>
                          <col width={'20%'} />
                          <col width={'20%'} />
                          <col width={'35%'} />
                          <col width={'*'} />
                        </colgroup>
                        <thead style={{ borderBottom: '1px solid #ddd' }}>
                        <tr>
                          <th>대분류</th>
                          <th>중분류</th>
                          <th>소분류</th>
                          <th>
                            <Checkbox
                                className={'type02'}
                                checkbox={{ id: 'menuAllCheckBox', value: '메뉴권한' }}
                                type="reverse"
                                defaultChecked={true}
                                onChange={(e) =>handleAllChecked(e)}
                            />
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        {ui &&
                            ui.map((tds, idx) => {
                              return <tr key={`tr_${idx}`}>{tds.map((td, td_idx) => td)}</tr>
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
          }
          {/*authority end */}

        </div>
        <div className={'rounded_btn_group'}>
          <button className={'button full_red'} onClick={async ()=>{
            // 수퍼 관리자가 아닌 경우 로그인 시 첫 화면으로 이동
            (userContext?.state?.userInfo?.supMngrYn === "Y") ? linkToList() : await userContext.actions.redirectFirstMenu(history);
          }}>
            취소
          </button>
          <button className={'button full_blue'} onClick={()=>handleConfirm('valid')}>
            저장
          </button>
        </div>
      </PageLayout>
  )
}
export default Write
