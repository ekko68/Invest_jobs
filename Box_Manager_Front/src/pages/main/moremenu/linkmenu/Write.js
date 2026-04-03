import React, {useContext, useEffect, useState} from 'react'
import {useHistory, useParams} from "react-router-dom";

//modules
import { UserContext } from 'modules/common/UserContext'
import {getMoreLinkDetail, saveMoreLink} from 'modules/consts/MainApi'
import ROUTER_NAMES from "modules/consts/RouterConst";

//components
import PageLayout from 'components/PageLayout'
import Button from "components/atomic/Button";
import Radio from "components/atomic/Radio";
import PopupConfirm from 'components/PopupConfirm'
import PopupAlert from 'components/PopupAlert'

const Write = () => {

  const { id } = useParams()
  const history = useHistory()
  const userContext = useContext(UserContext)

  const [linkForm, setLinkForm] = useState({
    boxLinkTtl: "", //타이틀
    linkUrl: "", //링크 url
    oppbYn: "Y", //공개여부
  })
  const [popup, setPopup] = useState({active: false, type: null, text: null});


  useEffect(async () => {
    if(id) {
      let res = await getMoreLinkDetail(id);
      if(res.data.code === "200"){
        setLinkForm({
          ...linkForm,
          ...res.data.data
        })
      } else {
        setPopup({active: true, type: "error"});
      }
    }
  }, [id])

  const handleText = (e) => {
    setLinkForm({
      ...linkForm,
      [e.target.id]: e.target.value.replace(/[^A-Za-z0-9ㄱ-ㅎ가-힣\s`~!?@#$%•*-_=+^&*()<>[\]{};:'",.\\/|]/g, "")
    })
  }

  const handleValidate = () => {
    let params = linkForm;
    if(params?.boxLinkTtl?.length < 1) {
      return alert("타이틀을 입력해주세요.");
    }

    if(params?.linkUrl?.linkUrl < 1) {
      return alert("링크 url을 입력해주세요.");
    }

    let RegExp = /^(((http(s?)):\/\/)?)([0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}(:[0-9]+)?(\/\S*)?/;
    if(!RegExp.test(params?.linkUrl)){
      return alert("링크 url을 재확인해주세요.");
    }

    setPopup({active: true, type: "check", text: "수정된 내역을 저장하시겠습니까?"});
  }

  const handleSave = async () => {
    let params = linkForm;
    params["amnnUserId"] = userContext.state?.userInfo?.mngrId; //수정자 ID

    let res = await saveMoreLink(params);
    if(res.data.code === "200"){
      setPopup({active: true, type: "confirm", text: "수정된 내역이 저장되었습니다."});
    } else {
      setPopup({active: true, type: "error"});
    }
  }

  const handlePublicRadio = async (e) => {
    setLinkForm({
      ...linkForm,
      oppbYn: e.target.id
    })
  }

  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainMoreMenu'} currentPage={'mainMoreLinkMenu'}>
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
                    handlePopup={() => history.push(`${ROUTER_NAMES.MAIN_MOREMENU_LINKMENU_LIST}`)} />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={'에러가 발생했습니다.'}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

      <div className='content_inner page_main'>
        <h4 className='page_title'>링크메뉴 수정</h4>

        <div className="table_wrap mar_t30">
          <table className="table form_table bg_none border_none">
            <caption>기본 정보 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
            <tr>
              <th className={'ta_left'}>
                <p className="">타이틀</p>
              </th>
              <td>
                <input type="text" className="input" name={'title'} title={'타이틀'}
                       id={"boxLinkTtl"}
                       value={linkForm.boxLinkTtl}
                       maxLength={1000}
                       onChange={handleText} />
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>
                <p className="">링크url</p>
              </th>
              <td>
                <input type="text" className="input" name={'link'} title={'링크'}
                       id={"linkUrl"}
                       value={linkForm.linkUrl}
                       maxLength={1000}
                       onChange={handleText} />
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>공개여부</th>
              <td>
                <Radio radio={{ id: 'Y', value: '공개' }}
                       id={"Y"}
                       onChange={handlePublicRadio}
                       checked={linkForm.oppbYn === "Y"} />
                <Radio radio={{ id: 'N', value: '비공개' }}
                       id={"N"}
                       onChange={handlePublicRadio}
                       checked={linkForm.oppbYn === "N"} />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className="warning_wrap">
          <p className=" warning mkt_main_banner_required">&nbsp;</p>
        </div>
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => history.goBack()}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleValidate}>
            저장
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Write
