import { UserContext } from 'modules/common/UserContext'
import React, {useContext, useState, useRef, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'components/atomic/Button'
import Checkbox from 'components/atomic/Checkbox'
import PopupAlert from 'components/PopupAlert'
import {getUserInfo} from "modules/consts/AdminApi";
import { deleteBrowserCookie,getBrowserCookie,setBrowserCookie } from 'modules/utils/BrowserUtils'
import {StringUtils} from "modules/utils/StringUtils";
import CommonAxios from "modules/utils/CommonAxios";
import {getConfig} from "modules/utils/CommonUtils";
import RSAKey from "modules/rsa/rsa";


const Login = (props) => {
  // sessionStorage.removeItem('token')

  const idRef = useRef(null)
  const pwRef = useRef(null)
  const publicKey = useRef(new RSAKey());

  const [loginId, setLoginId] = useState("")
  const [msgAlert, setMsgAlert] = useState({
    state : false,
    message : ""
  })

  const [idSave, setIdSave] = useState({ id: 'save_id', value: '아이디저장', status: false })

  const handleCheckSaveLogin = (e) => {
    let loginId = document.querySelector('#id').value;
    if(e.target.checked){
      if(loginId != "") {
        setBrowserCookie('luid', loginId, 30);
      }
    }else{
      deleteBrowserCookie('luid');
    }
    setIdSave({
      ...idSave,
      status: e.target.checked
    })
  }

  // --->
  const history = useHistory()
  const userContext = useContext(UserContext)


  const loadPublicKey = async () => {
    const res = await CommonAxios("ADM", getConfig("/api/login/public/key"));
    if(res) {
      const n = res?.data?.data?.pubModules;
      const e = res?.data?.data?.pubExponent;

      publicKey.current.setPublic(n, e);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const id = document.querySelector('#id').value
    const pw = document.querySelector('#password').value
    
    // 로그인 시점에도 아이디 저장이 체크되어 있으면 최종 입력 아이디 값으로 쿠키 갱신처리
    if(idSave.status) setBrowserCookie('luid', id, 30);

    /**
     * 보안점검 수정
     * 빈 패스워드 필드 수정
     * -> params에 패스워드 필드를 초기화 하지 않고 id를 기준으로 직접 가져와서 체크 (ref가 설정되어 있으니 그쪽으로 가도 됨)
     */
    const params = { id: '' }
    for (const formNode of e.target) {
      if (formNode['name'] === 'id') params.id = formNode['value']
    }

    if ((params.id === '') || (params.id === undefined)) {
      setMsgAlert({
        state : true,
        message : "아이디를 입력하세요"
      })
      idRef.current.focus()
      return false
    }else{
      setLoginId(params.id);
    }

    if (pw === '' || pw === undefined) {
      setMsgAlert({
        state : true,
        message : "비밀번호를 입력하세요"
      })
      pwRef.current.focus()
      return false
    }

    const isPublicKey = StringUtils.hasLength(publicKey.current.getPublicString());
    const param = {
      id: isPublicKey ? publicKey.current.encrypt(id) : id,
      password: isPublicKey ? publicKey.current.encrypt(pw) : pw
    }

    const res = await userContext.actions.login(param);

    if (res.isLogin) {
      // 기존 리다이렉트 로직을 해당 context func 빼서 처리함
      await userContext.actions.redirectFirstMenu(history);
    }
    // 메뉴 권한 리스트를 불러오는 api 호출에 실패했을 경우
    else {
      setMsgAlert({
        state : true,
        message : res.response.data.message ? res.response.data.message : "로그인 확인 중 오류가 발생 하였습니다."
      })
    }
  }

  useEffect(async ()=>{

    // 토큰정보가 있는 경우 유저 확인을 한 뒤 리다이렉트 처리
    if(StringUtils.hasLength(sessionStorage.getItem("token"))) {
      const res = await getUserInfo();
      if (res.status === 200) {
        await userContext.actions.redirectFirstMenu(history);
        return;
      } else {
        sessionStorage.removeItem("token");
      }
    }

    await loadPublicKey();
    let cookieId = getBrowserCookie('luid');
    if(cookieId != "") {
      setIdSave({...idSave, status: true});
      setLoginId(cookieId);
    }
  },[])

  return (
    <>
      {msgAlert.state && <PopupAlert msg={msgAlert.message} handlePopup={() => setMsgAlert(!msgAlert.state)} />}

      <div className={'login_wrap'}>
        <div className="login_container">
          <h1 className="login_logo">
            <img src={require('assets/images/PT_logo_white.png').default} alt="" />
          </h1>
          {/*login_box start*/}
          <div className="login_box">
            <form onSubmit={handleSubmit} method="post">
              <div className="main_text">
                <strong className="highlight_blue">IBK BOX</strong>는 당신의 성공을 돕는
                <br /> 최고의 동반자 입니다.
              </div>
              <div className="form_wrap">
                <div className="form_row">
                  <label className={'label'} htmlFor="id">
                    아이디
                  </label>
                  <input className={'input'} name="id" id="id" type="text" ref={idRef} defaultValue={loginId}/>
                </div>
                <div className="form_row">
                  <label className={'label'} htmlFor="password">
                    비밀번호
                  </label>
                  <input
                    className={'input'}
                    name={'password'}
                    type="password"
                    id={'password'}
                    ref={pwRef}
                    autoComplete={'off'}
                  />
                </div>
              </div>
              <div className="login_bottom">
                <div className="checkbox_row">
                  <Checkbox
                    className={'type01'}
                    checkbox={idSave}
                    onChange={(e) => handleCheckSaveLogin(e)}
                    checked={idSave.status}
                  />
                </div>
                <div className="btn_row">
                  <Button className={'button_login full_blue'} type={'submit'}>
                    로그인
                  </Button>
                </div>
                <div className="info_text">
                  운영자포털은 아이디와 비밀번호로만 로그인이 가능합니다. <br />
                  문의사항은 운영자에게 문의해주시기 바랍니다.
                </div>
              </div>
            </form>
          </div>
          {/*login_box end*/}
          <p className="copyright">Copyright ⓒ IBK(INDUSTRIAL BANK OF KOREA). All right reserved.</p>
        </div>
      </div>
    </>
  )
}
export default Login
