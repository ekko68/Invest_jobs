import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'components/atomic/Button'
import ko from 'date-fns/locale/ko'
import DatePicker from 'react-datepicker'
import * as mainFn from 'modules/fns/mkt/mainFn'
import { getTotalFileSize } from 'modules/common'
import PopupConfirm from 'components/PopupConfirm'
import ROUTER_NAMES from 'modules/consts/RouterConst'

const EventForm = (props) => {
  const { id, handleReg, data } = props
  const history = useHistory()
  // 등록 confirm
  const [confirmReg, setConfirmReg] = useState(false)
  // 등록취소 confirm
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [form, setForm] = useState({
    evntInfId: '',
    fileId: '',
    evntTtl: '',
    evntCon: '',
    enlsSldyTs: '',
    enlsCldyTs: '',
    evntStdyTs: '',
    evntFndaTs: '',
    useYn: '',
    rgsnUserId: '',
    amnnUserId: '',
    imgFileInfo: null // 이미지 파일 정보
  })

  const [date1, setDate1] = useState({
    startDate: null,
    endDate: null
  })

  const [date2, setDate2] = useState({
    startDate: null,
    endDate: null
  })
  const handleDelete = () => {
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

  // ===== datepicker
  const onChangeDate = (currentDate, type, type2) => {
    // type: 신청기간인지 진행기간인지, type2: 시작일인지 종료일인지
    if (type === 'date1') {
      type2 === 'start'
        ? (setDate1({
            ...date1,
            startDate: currentDate
          }),
          setForm({
            ...form,
            enlsSldyTs: currentDate
          }))
        : (setDate1({
            ...date1,
            endDate: currentDate
          }),
          setForm({
            ...form,
            enlsCldyTs: currentDate
          }))
    } else {
      type2 === 'start'
        ? (setDate2({
            ...date2,
            startDate: currentDate
          }),
          setForm({
            ...form,
            evntStdyTs: currentDate
          }))
        : (setDate2({
            ...date2,
            endDate: currentDate
          }),
          setForm({
            ...form,
            evntFndaTs: currentDate
          }))
    }
  }

  // ===== 등록
  const handleRegister = () => {
    let requireText = document.querySelector('.mkt_main_event_required')

    // confirmList : 필수값체크하기위해 필수값이외 제거
    const confirmList = {
      evntInfId: form.evntInfId,
      evntTtl: form.evntTtl,
      evntCon: form.evntCon,
      enlsSldyTs: form.enlsSldyTs,
      enlsCldyTs: form.enlsCldyTs,
      evntStdyTs: form.evntStdyTs,
      evntFndaTs: form.evntFndaTs,
      imgFileInfo: form.imgFileInfo
    }

    if (form.evntInfId === '') delete confirmList.evntInfId

    if (mainFn.handleRequiredCheck(confirmList, null)) {
      // 필수값 체크 true
      requireText.classList.remove('require')
      requireText.innerHTML = ''
      handleRegConfirm()
    } else {
      // 필수값 체크 false
      requireText.classList.add('require')
      requireText.innerHTML = '필수값을 입력하세요.'
      return false
    }
  }

  // ===== 등록 Confirm 팝업
  const handleRegConfirm = () => {
    handleReg(form)
  }

  useEffect(() => {
    if (id) {
      setForm(data)
      setDate1({
        startDate: data?.enlsSldyTs && new Date(data.enlsSldyTs),
        endDate: data?.enlsCldyTs && new Date(data.enlsCldyTs)
      })
      setDate2({
        startDate: data?.evntStdyTs && new Date(data.evntStdyTs),
        endDate: data?.evntFndaTs && new Date(data.evntFndaTs)
      })
    }
  }, [data])

  return (
    <>
      {confirmCancel && (
        <PopupConfirm msg={'정말로 취소하시겠습니까?'}>
          <Button className={'full_grey_dark'} onClick={() => setConfirmCancel(false)}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={() => history.push(ROUTER_NAMES.COMMERCE_EVENT_LIST)}>
            확인
          </Button>
        </PopupConfirm>
      )}

      {confirmReg && (
        <PopupConfirm msg={'등록하시겠습니까?'}>
          <Button className={'full_grey_dark'} onClick={() => setConfirmReg(false)}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleRegConfirm}>
            확인
          </Button>
        </PopupConfirm>
      )}
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
                  name={'evntTtl'}
                  value={form?.evntTtl ?? ''}
                  onChange={handleText}
                  title={'제목'}
                />
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>
                <p className="require">이벤트 설명</p>
              </th>
              <td>
                <textarea
                  className={'textarea'}
                  name={'evntCon'}
                  value={form?.evntCon ?? ''}
                  onChange={handleText}
                  title={'이벤트설명'}
                />
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>
                <p className="require">기간</p>
              </th>
              <td>
                <div className="date_input_row">
                  <p className="label">신청기간</p>
                  <div className="date_input_wrap ico_type02">
                    <div className="date_inputs">
                      <DatePicker
                        selected={date1.startDate ? date1.startDate : null}
                        onChange={(currentDate) => onChangeDate(currentDate, 'date1', 'start')}
                        locale={ko}
                        dateFormat={'yyyy-MM-dd'}
                        maxDate={date1.endDate ? date1.endDate : null}
                        title={'기간조회'}
                      />
                      <span>~</span>
                      <DatePicker
                        selected={date1.endDate ? date1.endDate : null}
                        onChange={(currentDate) => onChangeDate(currentDate, 'date1', 'end')}
                        locale={ko}
                        dateFormat={'yyyy-MM-dd'}
                        minDate={date1.startDate ? date1.startDate : null}
                        title={'기간조회'}
                      />
                    </div>
                  </div>
                </div>
                <div className="date_input_row">
                  <p className="label">진행기간</p>
                  <div className="date_input_wrap ico_type02">
                    <div className="date_inputs">
                      <DatePicker
                        selected={date2.startDate ? date2.startDate : null}
                        onChange={(currentDate) => onChangeDate(currentDate, 'date2', 'start')}
                        locale={ko}
                        dateFormat={'yyyy-MM-dd'}
                        maxDate={date2.endDate ? date2.endDate : null}
                        title={'기간조회'}
                      />
                      <span>~</span>
                      <DatePicker
                        selected={date2.endDate ? date2.endDate : null}
                        onChange={(currentDate) => onChangeDate(currentDate, 'date2', 'end')}
                        locale={ko}
                        dateFormat={'yyyy-MM-dd'}
                        minDate={date2.startDate ? date2.startDate : null}
                        title={'기간조회'}
                      />
                    </div>
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
                        {form.imgFileInfo ? getTotalFileSize([form?.imgFileInfo]) : 0} MB / 100 MB]
                      </p>
                    </div>
                    {form?.imgFileInfo && (
                      <div className="file_list" key={form?.imgFileInfo.fileId}>
                        <div className="text">{form?.imgFileInfo.fileNm}</div>
                        <Button onClick={() => handleDelete(form?.imgFileInfo.fileId)} />
                      </div>
                    )}
                  </div>
                </div>
                {/*attach_content end*/}
                <p className="notice highlight_red require" style={{ margin: '10px 0 10px 10px', fontSize: '13px' }}>
                  이벤트상품 적정사이즈는 가로 350px / 세로 350px 입니다.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/*table_wrap end*/}
      <div className="warning_wrap">
        <p className=" warning mkt_main_event_required">&nbsp;</p>
      </div>
      <div className="rounded_btn_group">
        <Button className={'full_red'} onClick={() => setConfirmCancel(true)}>
          취소
        </Button>
        <Button className={'full_blue'} onClick={handleRegister}>
          {id ? '수정' : '등록'}
        </Button>
      </div>
    </>
  )
}

export default EventForm
