import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import moment from 'moment'
import ko from 'date-fns/locale/ko'
import DatePicker from "react-datepicker";


// components
import Radio from "components/atomic/Radio";
import PageLayout from 'components/PageLayout'
import Button from "components/atomic/Button";
import PopupConfirm from 'components/PopupConfirm'
import PopupAlert from 'components/PopupAlert'

// modules
import { UserContext } from 'modules/common/UserContext'
import {
  getBannerDetail,
  getServiceDetail,
  getServiceFinanceDetail,
  saveBanner,
  saveService, saveServiceFinance
} from 'modules/consts/MainApi'
import * as commonFn from 'modules/fns/commonFn'
import CommonAxios from 'modules/utils/CommonAxios'
import { getFileUploadConfigMain } from 'modules/utils/CommonUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { NoImage02 } from 'modules/consts/Img'
import { getTotalFileSize } from 'modules/common'


//const
const initUploadData = {fileId: "", imgFileInfo: {}};

const Write = () => {

  const { id } = useParams()
  const history = useHistory()
  const userContext = useContext(UserContext)
  const fileRef = useRef(null)

  const [serviceForm, setServiceForm] = useState({
    fnncSvcId: "", //서비스 id
    bltImgId: "", //이미지 id
    fnncSvcTtl: "", //메인타이틀
    bltSttgYmd: moment(), //시작일자
    bltFnshYmd: moment().add(7, "days"), // 종료일자
    linkUrl: "", //링크url
    oppbYn: "Y", //공개여부
    amnnUserId: "", //수정/등록자id
  })
  const [popup, setPopup] = useState({active: false, type: null, text: null})
  const [uploadData, setUploadData] = useState(initUploadData);
  const [saveData, setSaveData] = useState({});


  useEffect(async () => {
    if(id) {
      let res = await getServiceFinanceDetail({id: id});
      if(res.data.code === "200"){
        setServiceForm({
          ...serviceForm,
          ...res.data.data
        });
        setUploadData({
          ...uploadData,
          fileId:  res.data.data.bltImgId,
          imgFileInfo: {
            ...uploadData.imgFileInfo,
            fileNm:  res.data.data.fileNm,
            fileSize:  res.data.data.fileSize,
            imgUrl:  res.data.data.bltImgUrl,
          }
        })
      }
    }
  }, [id])

  const handleText = (type, value) => {
    setServiceForm({
      ...serviceForm,
      [type]: value.replace(/[^A-Za-z0-9ㄱ-ㅎ가-힣\s`~!?@#$%*-_=+^&*()<>[\]{};:'",.\\/|]/g, "")
    })
  }

  const handleUpload = () => {
    if(uploadData && uploadData.fileId?.length > 0){
      return alert("최대 업로드 이미지를 초과하였습니다.\n기존 이미지를 삭제하세요.");
    }

    fileRef.current.click()
  }


  const handleGetImageFileInfo = async (e) => {
    const { files, id } = e.target
    const input = document.querySelector(`#${id}`)
    if (commonFn.handleFileFormatCheck(e)) {
      if (!files[0]) return
      let object = null
      const formData = new FormData()
      formData.append('file', files[0])
      const res = await CommonAxios('MNB', getFileUploadConfigMain(formData))
      if (ResponseUtils.isValidateResponse(res)) {
        object = res.data.data
      }
      setUploadData({
        ...uploadData,
        fileId: object.fileId,
        imgFileInfo: object
      })
      setServiceForm({
        ...serviceForm,
        bltImgId: object.fileId
      })
    } else {
      alert('업로드할 수 없는 파일입니다.')
      input.value = ''
    }
    input.removeEventListener('change', handleGetImageFileInfo)
  }

  const handleValidate = () => {
    let params = serviceForm;
    if(params?.fnncSvcTtl?.length < 1) {
      return alert("메인 타이틀을 입력해주세요.");
    }

    if(params?.linkUrl?.length < 10) {
      return alert("링크 url을 입력해주세요.");
    }

    let RegExp = /^(((http(s?)):\/\/)?)([0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}(:[0-9]+)?(\/\S*)?/;
    if(!RegExp.test(params?.linkUrl)){
      return alert("링크 url을 재확인해주세요.");
    }


    if(uploadData.fileId?.length < 1) {
      return alert("이미지를 업로드 해주세요.")
    }

    setPopup({active: true, type: "check", text: id ? "수정된 내역을 저장하시겠습니까?" : "등록하시겠습니까?"});
  }

  const handleSave = async () => {
    let params = serviceForm;
    params["bltImgId"] = id? serviceForm.bltImgId : uploadData.fileId;
    params["bltSttgYmd"] = moment(serviceForm.bltSttgYmd).format("YYYYMMDD");
    params["bltFnshYmd"] = moment(serviceForm.bltFnshYmd).format("YYYYMMDD");

    if(id) {
      params["amnnUserId"] = userContext.state?.userInfo?.mngrId; //수정자 ID
    } else {
      params["amnnUserId"] = userContext.state?.userInfo?.mngrId; //등록자 ID
    }

    let res = await saveServiceFinance(params);
    if(res.data.code === "200"){
      setSaveData(res.data.data);
      setPopup({active: true, type: "confirm", text: id ? "수정된 내역이 저장되었습니다." : "게시글이 등록되었습니다."});
    } else {
      setPopup({active: true, type: "error"});
    }
  }


  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainServiceMenu'} currentPage={'mainServiceFinance'}>
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
        <PopupAlert
          msg={popup.text}
          handlePopup={() => history.push(`${ROUTER_NAMES.MAIN_SERVICEMENU_FINANCE_VIEW}/${saveData.fnncSvcId}`)}
        />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert
          msg={'오류가 발생했습니다.'}
          handlePopup={() => setPopup({active: false, type: null})}
        />
      )}

      <div className='content_inner page_main'>
        <h4 className='page_title'>금융서비스 {id ? "수정" : "등록"}</h4>
        <div className="table_wrap">
          <table className="table form_table bg_none border_none service_write">
            <caption>기본 정보 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
            <tr>
              <th className={'ta_left'}>
                <p className="">메인타이틀</p>
              </th>
              <td>
                <input
                  type="text" className="input"
                  title={'메인타이틀'}
                  value={serviceForm.fnncSvcTtl}
                  maxLength={38}
                  onChange={(e) => handleText("fnncSvcTtl", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>
                <p className="">이미지 등록</p>
              </th>
              <td>
                <div className='preview service'>
                  {
                    uploadData && Object.keys(uploadData.imgFileInfo).length && uploadData.imgFileInfo.imgUrl ? (
                      <img src={uploadData.imgFileInfo.imgUrl} alt={uploadData.imgFileInfo.fileNm} />
                    ) : (
                      <img src={NoImage02} alt="이미지 없음" />
                    )
                  }
                </div>

                <div className="attach_content">
                  <div className="add_file_wide">
                    <div className="file_list" >
                      <div className="text">{uploadData.imgFileInfo?.fileNm}</div>
                      {
                        uploadData && uploadData.fileId?.length > 0 && (
                          <Button onClick={() => setUploadData(initUploadData)}/>
                        )
                      }
                    </div>
                    <div className="upload_file">
                      <input
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        className={'input require input_file'}
                        hidden
                        id={'mkt_main_banner_file_input'}
                        ref={fileRef}
                        onChange={handleGetImageFileInfo}
                        title={'파일업로드'}
                      />
                      <div className="button_wrap">
                        <Button className={'linear linear_blue'} onClick={handleUpload}>
                          업로드 추가
                        </Button>
                        <p className="notice highlight_red require">
                          이벤트배너 적정사이즈는 가로 960px / 세로 360px 입니다.
                        </p>
                      </div>
                      <p className="file_size">
                        [파일 : {uploadData && uploadData?.imgFileInfo?.fileSize > 0 ? 1 : 0} / 1]
                        [용량 : {Object.keys(uploadData.imgFileInfo).length ? getTotalFileSize([uploadData?.imgFileInfo]) : 0} MB / 100 MB]
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>
                <p className="">링크</p>
              </th>
              <td>
                <input
                  type="text"
                  className="input"
                  name={'link'}
                  title={'링크'}
                  value={serviceForm.linkUrl}
                  maxLength={1000}
                  onChange={(e) => handleText("linkUrl", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>
                <p className="">기간</p>
              </th>
              <td>
                <div className="date_input_wrap ico_type02">
                  <div className="date_inputs">
                    <DatePicker
                      selected={serviceForm.bltSttgYmd ? moment(serviceForm.bltSttgYmd, "YYYYMMDD").valueOf() : null}
                      maxDate={serviceForm.bltFnshYmd ? moment(serviceForm.bltFnshYmd, "YYYYMMDD").valueOf() : null}
                      locale={ko}
                      dateFormat={'yyyy-MM-dd'}
                      title={'기간'}
                      onChange={(date) => setServiceForm({...serviceForm, bltSttgYmd: moment(date).format("YYYYMMDD")})}
                    />
                    <span> ~ </span>
                    <DatePicker
                      selected={serviceForm.bltFnshYmd ? moment(serviceForm.bltFnshYmd, "YYYYMMDD").valueOf() : null}
                      minDate={serviceForm.bltSttgYmd ? moment(serviceForm.bltSttgYmd, "YYYYMMDD").valueOf() : null}
                      locale={ko}
                      dateFormat={'yyyy-MM-dd'}
                      title={'기간'}
                      onChange={(date) => setServiceForm({...serviceForm, bltFnshYmd: moment(date).format("YYYYMMDD")})}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>공개여부</th>
              <td>
                <Radio radio={{id:"Y", value: "공개"}}
                       onChange={() => setServiceForm({...serviceForm, oppbYn: "Y"})}
                       checked={serviceForm.oppbYn === "Y"} />
                <Radio radio={{id:"N", value: "비공개"}}
                       onChange={() => setServiceForm({...serviceForm, oppbYn: "N"})}
                       checked={serviceForm.oppbYn === "N"} />
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
            {id ? "수정" : "등록"}
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Write
