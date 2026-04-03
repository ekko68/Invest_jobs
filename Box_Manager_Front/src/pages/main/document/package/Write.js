import React, { useContext, useEffect, useRef, useState } from 'react'
import PageLayout from "components/PageLayout";
import Button from "components/atomic/Button";
import Radio from "components/atomic/Radio";
import PopupConfirm from 'components/PopupConfirm'
import PopupAlert from 'components/PopupAlert'
import {
  getDocumentPackageDetail,
  saveDocumentPackage,
  updateDocumentPackage
} from '../../../../modules/consts/MainApi'
import { useHistory, useParams } from 'react-router-dom'
import { UserContext } from '../../../../modules/common/UserContext'
import ROUTER_NAMES from '../../../../modules/consts/RouterConst'

const Write = () => {

  const { id } = useParams()
  const history = useHistory()
  const userContext = useContext(UserContext)
  const fileRef = useRef(null)

  const [save, setSave] = useState(false)
  const [saveReg, setSaveReg] = useState(false)
  const [regist, setReigst] = useState(false)
  const [confirmReg, setConfirmReg] = useState(false)

  const [showInput, setShowInput] = useState(false)
  const [value, setValue] = useState("")

  // radio
  const [publicRadioList, setPublicRadioList] = useState({
    selected: 'public',
    radioList: [
      { id: 'public', value: '공개' },
      { id: 'private', value: '비공개' }
    ]
  })

  const [documentPackageForm, setDocumentPackageForm] = useState({
    id: "",
    name: "",
    desc: "",
    public_access: "",
    item_names: ""
  });

  const [popup, setPopup] = useState({ active: false, type: null });
  const [saveData, setSaveData] = useState({});

  useEffect(async () => {
    if (id) {
      let res = await getDocumentPackageDetail({ id: id });
      if (res.status === 200) {
        const documentPackageData = res.data

        setDocumentPackageForm({
          ...documentPackageData,
          // item_names: itemNames
        });
      } else {
        setPopup({ active: true, type: "error" });
      }
    }
  }, [id])

  // ===== 공개여부 checkbox 헨들러
  const handlePublicRadio = async (e) => {
    let status = true
    // if (e.target.id === 'public' && e.target.checked) {
    //   let maximumValidate = await mainFn.handleMaximumCheck(type, handleMaximunAlert)
    //   status = maximumValidate
    // }
    if (!status) return
    setPublicRadioList({
      ...publicRadioList,
      selected: e.target.id
    })
    // setForm({
    //   ...form,
    //   oppbYn: e.target.id === 'public' ? 'Y' : 'N'
    // })
  }

  const handleValidate = () => {
    let params = documentPackageForm;

    if (params?.name?.length < 1) {
      return alert("타이틀을 입력해주세요.");
    }


    setPopup({ active: true, type: "check", text: id ? "수정된 내역을 저장하시겠습니까?" : "등록하시겠습니까?" });
  }

  const handleSave = async () => {
    let params = documentPackageForm;

    let itemNames;
    itemNames = documentPackageForm?.items?.map((data, i) => {
      return data.name
    })
    if (id) {
      params["userId"] = userContext.state?.userInfo?.mngrId; //수정자 ID

      let res = await updateDocumentPackage({
        ...params,
        item_names: itemNames
      });
      if (res.status === 200) {
        setSaveData(res.data);
        setPopup({ active: true, type: "confirm", text: "수정된 내역이 저장되었습니다." });
      } else {
        setPopup({ active: true, type: "error" });
      }
    } else {
      params["userId"] = userContext.state?.userInfo?.mngrId; //등록자 ID
      let res = await saveDocumentPackage({
        ...params,
        item_names: itemNames
      });
      if (res.status === 201) {
        setSaveData(res.data);
        setPopup({ active: true, type: "confirm", text: "등록되었습니다." });
      } else {
        setPopup({ active: true, type: "error" });
      }
    }
  }

  const handleText = (type, value) => {
    setDocumentPackageForm({
      ...documentPackageForm,
      [type]: value.replace(/[^A-Za-z0-9ㄱ-ㅎ가-힣\s`~!?@#$%*-_=+^&*()<>[\]{};:'",.\\/|]/g, "")
    })
  }

  const handleRemoveItem = (item_id) => () => {
    let clone = { ...documentPackageForm };
    clone.items = clone.items.filter(ele => ele.item_id !== item_id);
    setDocumentPackageForm(clone)
  }

  const handleAddItem = () => {
    let clone = { ...documentPackageForm };
    if (!clone.items) {
      clone.items = [{
        name: value,
        package_id: clone.id,
        deleted: false
      }]
    }
    else {
      clone.items.push({
        name: value,
        package_id: clone.id,
        deleted: false
      })
    }
    setDocumentPackageForm(clone)

    setValue('')
    setShowInput(false)
  }

  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainDocument'} currentPage={'mainDocPackage'}>
      {popup.active && popup.type === "check" && (
        <PopupConfirm msg={popup.text}>
          <Button className={'full_grey'} onClick={() => setPopup({ active: false, type: null })}>
            취소
          </Button>
          <Button
            className={'full_blue'} onClick={handleSave}>
            확인
          </Button>
        </PopupConfirm>
      )}

      {popup.active && popup.type === "confirm" && (
        <PopupAlert msg={popup.text}
          handlePopup={() => history.push(`${ROUTER_NAMES.MAIN_DOCUMENT_PACKAGE_LIST}`)} />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={'오류가 발생했습니다.'}
          handlePopup={() => setPopup({ active: false, type: null })} />
      )}

      <div className='content_inner page_main'>
        <h4 className='page_title'>전송꾸러미 {id ? "수정" : "등록"}</h4>


        <div className="table_wrap">
          <table className="table form_table bg_none border_none main_more_document_package_write">
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
                  <input
                    value={documentPackageForm.name}
                    maxLength={15}
                    onChange={(e) => handleText("name", e.target.value)}
                    type="text"
                    className="input"
                    name={'link'}
                    title={'링크'}
                  />
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  <p className="">부가설명</p>
                </th>
                <td>
                  <textarea
                    value={documentPackageForm.desc}
                    onChange={(e) => handleText("desc", e.target.value)}
                    maxLength={50}
                    className={'textarea h100'}
                    name={'con'}
                    title={'부가설명'}
                  />
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  <p className="">구성목록</p>
                </th>
                <td>
                  {/*attach_content start*/}
                  <div className="attach_content">
                    <div className="add_file">
                      <div className="upload_file">
                        <input
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          className={'input require input_file'}
                          hidden
                          id={'mkt_main_banner_file_input'}
                          title={'파일업로드'}
                        />
                        <Button className={'linear linear_blue'} onClick={() => setShowInput(true)}>문서추가</Button>
                      </div>
                      {
                        showInput &&
                        <div >
                          <div style={{
                            display: 'flex'
                          }}  >
                            <input
                              value={value}
                              maxLength={15}
                              onChange={(e) => setValue(e.target.value)}
                              type="text"
                              className="input"
                              name={'item'}
                              title={'new_item'}
                            />
                            <Button className='full_blue w80' style={{ height: 40 }} onClick={handleAddItem}>등록</Button>
                          </div>

                        </div>
                      }
                      {
                        documentPackageForm.items?.filter(el => (
                          el.deleted === false
                        )).
                          map(ele => (
                            <div className="file_list" >
                              <div className="text">{ele.name}</div>
                              <Button onClick={handleRemoveItem(ele.item_id)} />
                            </div>
                          ))
                      }

                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>공개여부</th>
                <td>
                  <Radio radio={{ id: "Y", value: "공개" }}
                    onChange={() => setDocumentPackageForm({ ...documentPackageForm, public_access: true })}
                    checked={documentPackageForm.public_access === true} />
                  <Radio radio={{ id: "N", value: "비공개" }}
                    onChange={() => setDocumentPackageForm({ ...documentPackageForm, public_access: false })}
                    checked={documentPackageForm.public_access === false} />

                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="warning_wrap">
          <p className=" warning mkt_main_banner_required">&nbsp;</p>
        </div>
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => history.goBack()}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleValidate}>
            {id ? "수정" : "등록"}
          </Button>
        </div>


      </div>
    </PageLayout>
  )
}

export default Write
