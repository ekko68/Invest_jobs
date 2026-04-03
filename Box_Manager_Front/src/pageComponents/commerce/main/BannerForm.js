import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import { getTotalFileSize } from 'modules/common'
import * as mainFn from 'modules/fns/mkt/mainFn'
import * as commonFn from 'modules/fns/commonFn'
import Radio from 'components/atomic/Radio'
import ko from 'date-fns/locale/ko'
import DatePicker from 'react-datepicker'
import moment from 'moment'

const initData = {
  ttl: '', // 제목
  con: '', // 내용
  link: '', // 링크
  stdy: '', // 시작일
  fnda: '', // 종료일
  imgFileInfo: null, // 이미지 파일 정보
  oppbYn: 'N' // 공개 여부
}

const BannerForm = (props) => {
  const history = useHistory()
  /**
   * type must be : mainBanner | subBanner | prodBanner | eventBanner
   * */
  const { data, type = '', id, url = '', handleReg, handleMaximunAlert } = props
  const [form, setForm] = useState(initData)
  const [dates, setDates] = useState({ startDate: null, endDate: null })
  const [confirmReg, setConfirmReg] = useState(false)
  // radio
  const [publicRadioList, setPublicRadioList] = useState({
    selected: 'private',
    radioList: [
      { id: 'public', value: '공개' },
      { id: 'private', value: '비공개' }
    ]
  })

  // ===== 수정시 정보 세팅
  const handleSetForm = async () => {
    await setForm(data)
    await setDates({
      startDate: new Date(data.stdy),
      endDate: new Date(data.fnda)
    })
    await setPublicRadioList({
      ...publicRadioList,
      selected: data.oppbYn === 'Y' ? 'public' : 'private'
    })
  }

  // ===== 등록 Confirm 팝업
  const handleRegConfirm = (param) => {
    // param <- from PopupConfirm Component
    if (param === 'confirm') {
      // id가 있으면 수정 이므로 maxCount 를 체크하지 않기 위해 parameter전달
      handleReg(form, id ? true : false)
    }
    setConfirmReg(!confirmReg)
  }

  const handleRegister = () => {
    let requireText = document.querySelector('.mkt_main_banner_required')
    if (mainFn.handleRequiredCheck(form, type)) {
      // 필수값 체크
      requireText.classList.remove('require')
      requireText.innerHTML = ''
      if (commonFn.handleUrlValidate(form.link)) {
        handleRegConfirm() // 컨펌 팝업
      } else {
        // alert('유효하지 않는 url 입니다.')
        requireText.classList.add('require')
        requireText.innerHTML = '유효하지 않는 url 입니다.'
      }
    } else {
      requireText.classList.add('require')
      requireText.innerHTML = '필수값을 입력하세요.'
      return false
    }
  }

  // ===== 파일 삭제
  const handleDelete = (id) => {
    setForm({
      ...form,
      imgFileInfo: null
    })
  }

  // ===== input, textarea 핸들러
  const handleText = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }
  // ===== 기간 datepicker 핸들러
  const onChangeDate = (currentDate, item) => {
    item === 'start'
      ? (setDates({
          ...dates,
          startDate: currentDate
        }),
        setForm({
          ...form,
          stdy: moment(currentDate).format('YYYY-MM-DD')
        }))
      : (setDates({
          ...dates,
          endDate: currentDate
        }),
        setForm({
          ...form,
          fnda: moment(currentDate).format('YYYY-MM-DD')
        }))
  }
  // ===== 공개여부 checkbox 헨들러
  const handlePublicRadio = async (e) => {
    let status = true
    if (e.target.id === 'public' && e.target.checked) {
      let maximumValidate = await mainFn.handleMaximumCheck(type, handleMaximunAlert)
      status = maximumValidate
    }
    if (!status) return
    setPublicRadioList({
      ...publicRadioList,
      selected: e.target.id
    })
    setForm({
      ...form,
      oppbYn: e.target.id === 'public' ? 'Y' : 'N'
    })
  }

  // ===== 페이지 이동
  const linkToList = () => {
    history.push(url)
  }

  // ===== 적정사이즈 표시
  const handleSetImgSize = () => {
    let imgSizeNotice = ''
    // type must be : mainBanner | subBanner | prodBanner | eventBanner
    if (type === 'mainBanner') {
      imgSizeNotice = '메인배너 적정사이즈는 가로 768px / 세로 684px 입니다.'
    } else if (type === 'subBanner') {
      imgSizeNotice = '서브배너 적정사이즈는 가로 738px / 세로 191px 입니다.'
    } else if (type === 'prodBanner') {
      imgSizeNotice = '상품배너 적정사이즈는 가로 768px / 세로 360px 입니다.'
    } else if (type === 'eventBanner') {
      imgSizeNotice = '이벤트배너 적정사이즈는 가로 768px / 세로 300px 입니다.'
    }

    return imgSizeNotice
  }

  useEffect(() => {
    handleSetImgSize()
    data && handleSetForm()
  }, [data])

  return (
    <>
      {confirmReg && <PopupConfirm msg={'등록하시겠습니까?'} handlePopup={handleRegConfirm} />}
      {/*table_wrap start*/}
      <div className="table_wrap">
        <table className="table form_table bg_none border_none">
          <caption>기본 정보 테이블</caption>
          <colgroup>
            <col width={'13%'} />
            <col width={'*'} />
          </colgroup>
          <tbody>
            <tr>
              <th className={'ta_left'}>
                <p className="require">제목</p>
              </th>
              <td>
                <input
                  type="text"
                  className="input"
                  name={'ttl'}
                  value={form.ttl ? form.ttl : ''}
                  onChange={handleText}
                  title={'제목'}
                />
              </td>
            </tr>
            {type === 'mainBanner' && (
              <tr>
                <th className={'ta_left'}>
                  <p className="require">부가설명</p>
                </th>
                <td>
                  <textarea
                    className={'textarea h100'}
                    name={'con'}
                    value={form.con ? form.con : ''}
                    onChange={handleText}
                    title={'부가설명'}
                  />
                </td>
              </tr>
            )}
            <tr>
              <th className={'ta_left'}>
                <p className="require">링크</p>
              </th>
              <td>
                <input
                  type="text"
                  className="input"
                  name={'link'}
                  value={form.link ? form.link : ''}
                  onChange={handleText}
                  title={'링크'}
                />
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>
                <p className="require">기간</p>
              </th>
              <td>
                <div className="date_input_wrap ico_type02">
                  <div className="date_inputs">
                    <DatePicker
                      selected={dates.startDate ? dates.startDate : null}
                      onChange={(currentDate) => onChangeDate(currentDate, 'start')}
                      locale={ko}
                      dateFormat={'yyyy-MM-dd'}
                      maxDate={dates.endDate ? dates.endDate : null}
                      title={'기간조회'}
                    />
                    <span> ~ </span>
                    <DatePicker
                      selected={dates.endDate ? dates.endDate : null}
                      onChange={(currentDate) => onChangeDate(currentDate, 'end')}
                      locale={ko}
                      dateFormat={'yyyy-MM-dd'}
                      minDate={dates.startDate ? dates.startDate : null}
                      title={'기간조회'}
                    />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>
                <p className="require">이미지 등록</p>
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
                        onChange={(e) => mainFn.handleGetImageFileInfo(e, form, setForm)}
                        title={'파일업로드'}
                      />
                      <Button
                        className={'linear linear_blue'}
                        onClick={() => mainFn.clickToFileExistCheck(form?.imgFileInfo)}
                      >
                        업로드 추가
                      </Button>
                      <p className="file_size">
                        [파일 : {form && form?.imgFileInfo ? 1 : 0} / 1] [용량 :{' '}
                        {form.imgFileInfo ? getTotalFileSize([form.imgFileInfo]) : 0} MB / 100 MB]
                      </p>
                    </div>
                    {form.imgFileInfo && (
                      <div className="file_list" key={form.imgFileInfo.fileId}>
                        <div className="text">{form.imgFileInfo.fileNm}</div>
                        <Button onClick={() => handleDelete(form.imgFileInfo.fileId)} />
                      </div>
                    )}
                  </div>
                </div>
                {/*attach_content end*/}
                {handleSetImgSize() ? (
                  <p className="notice highlight_red require" style={{ margin: '10px 0 10px 10px', fontSize: '13px' }}>
                    {handleSetImgSize()}
                  </p>
                ) : (
                  ''
                )}
              </td>
            </tr>
            {type !== 'popup' && (
              <tr>
                <th className={'ta_left'}>공개여부</th>
                <td>
                  {publicRadioList.radioList.map((radio) => (
                    <Radio
                      key={radio.id}
                      radio={radio}
                      onChange={(e) => handlePublicRadio(e)}
                      checked={radio.id === publicRadioList.selected}
                    />
                  ))}
                </td>
              </tr>
            )}
            {/*@todo 업데이트 필요*/}
            {/*{type === 'popup' && (*/}
            {/*  <tr>*/}
            {/*    <th className={'ta_left'}>위치</th>*/}
            {/*    <td>*/}
            {/*      <div className="input_group">*/}
            {/*        <span className={'label'}>top: </span>*/}
            {/*        <input className={'input'} type="text" defaultValue={'0'} title={'상단 위치'} />*/}
            {/*        &nbsp;*/}
            {/*        <span className={'label'}>left: </span>*/}
            {/*        <input className={'input'} type="text" defaultValue={'0'} title={'왼쪽 위치'} />*/}
            {/*      </div>*/}
            {/*    </td>*/}
            {/*  </tr>*/}
            {/*)}*/}
          </tbody>
        </table>
      </div>
      {/*table_wrap end*/}
      <div className="warning_wrap">
        <p className=" warning mkt_main_banner_required">&nbsp;</p>
      </div>
      <div className="rounded_btn_group">
        <Button className={'basic'} onClick={linkToList}>
          취소
        </Button>
        <Button className={'full_blue'} onClick={handleRegister}>
          {id ? '수정' : '등록'}
        </Button>
      </div>
    </>
  )
}

export default BannerForm
