import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import { useState, useContext, useEffect, useCallback } from 'react'
import TextInput from 'components/atomic/TextInput'
import DatePicker, { registerLocale } from 'react-datepicker'
import ko from 'date-fns/locale/ko'
import ImageUpload from 'pageComponents/commerce/common/ImageUpload'
import moment from 'moment'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { MktContext } from 'modules/common/MktContext'
import { useParams, useHistory } from 'react-router-dom'
import { StringUtils } from 'modules/utils/StringUtils'
import { saveEventApiV2, getEventDetailApi } from 'modules/consts/MktApi'

const EventRegistration = () => {
  const { id } = useParams()

  const mktContext = useContext(MktContext)
  const history = useHistory()

  const [data, setData] = useState({
    evntTtl: '',
    evntBrf: '',
    evntCon: '',
    fileId: '',
    evntStdyTs: '',
    evntFndaTs: '',
    enlsSldyTs: '',
    enlsCldyTs: '',
    stdyTs: null,
    fndaTs: null,
    sldyTs: null,
    cldyTs: null,
    imgFileInfo: {}
  })

  // ===== datepicker 기간
  const onChangeDate = (currentDate, type) => {
    if (type === 'start') {
      setData({
        ...data,
        evntStdyTs: moment(currentDate).format('yyyy-MM-DD 00:00:00').toString(),
        stdyTs: currentDate,
        enlsSldyTs: moment(currentDate).format('yyyy-MM-DD 00:00:00').toString()
      })
    } else if (type === 'end') {
      setData({
        ...data,
        evntFndaTs: moment(currentDate).format('yyyy-MM-DD 23:59:59').toString(),
        fndaTs: currentDate,
        enlsCldyTs: moment(currentDate).format('yyyy-MM-DD 00:00:00').toString()
      })
    }
  }

  // ===== datepicker 모집기간
  const onChangeEnlsDate = (currentDate, type) => {
    if (type === 'start') {
      setData({
        ...data,
        enlsSldyTs: moment(currentDate).format('yyyy-MM-DD 00:00:00').toString(),
        sldyTs: currentDate
      })
    } else if (type === 'end') {
      setData({
        ...data,
        enlsCldyTs: moment(currentDate).format('yyyy-MM-DD 23:59:59').toString(),
        cldyTs: currentDate
      })
    }
  }

  const handleSetData = (type, value) => {
    setData({
      ...data,
      [type]: value
    })
  }
  const handleImageDelete = (id) => {
    setData({
      ...data,
      imgFileInfo: {},
      fileId: ''
    })
  }
  const handleDataCheck = () => {
    if (
      StringUtils.hasLength(data.evntTtl) ||
      StringUtils.hasLength(data.evntBrf) ||
      StringUtils.hasLength(data.evntStdyTs) ||
      StringUtils.hasLength(data.evntFndaTs) ||
      StringUtils.hasLength(data.enlsSldyTs) ||
      StringUtils.hasLength(data.enlsCldyTs)
    ) {
      return true
    }
    return false
  }

  const handleCancel = () => {
    if (handleDataCheck()) {
      mktContext.actions.setCommonAlertInfo({
        type: 'function',
        active: true,
        msg: '입력한 정보가 저장되지 않습니다',
        btnMsg: '취소',
        btnMsg2: '확인',
        action2: () => {
          history.push(`${ROUTER_NAMES.COMMERCE_MANAGEMENT_EVENT}`)
        }
      })
      return false
    }
    history.push(`${ROUTER_NAMES.COMMERCE_MANAGEMENT_EVENT}`)
  }

  const handleSave = () => {
    if (!handleRequiredCheck()) {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '필수 정보를 모두 입력해주세요.'
      })
      return false
    }
    saveEventApiV2(data, handleSaveCb, handleSaveErrCb)
  }
  const handleRequiredCheck = () => {
    if (
      StringUtils.hasLength(data.evntTtl) &&
      StringUtils.hasLength(data.evntBrf) &&
      StringUtils.hasLength(data.fileId) &&
      StringUtils.hasLength(data.evntStdyTs) &&
      StringUtils.hasLength(data.evntFndaTs) &&
      StringUtils.hasLength(data.enlsSldyTs) &&
      StringUtils.hasLength(data.enlsCldyTs)
    ) {
      return true
    }
    return false
  }

  const handleSaveCb = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'function1Btn',
      active: true,
      msg: '저장되었습니다.',
      action: () => {
        history.push(`${ROUTER_NAMES.COMMERCE_MANAGEMENT_EVENT}`)
      }
    })
  }

  const handleSaveErrCb = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true,
      msg: '저장에 실패했습니다.'
    })
  }

  const handleTexteditorChange = (content) => {
    setData({
      ...data,
      evntCon: content,
      stplCon: content
    })
  }

  const getEventDetail = useCallback(
    async (params) => {
      const res = await getEventDetailApi(params)

      if (res.data.code === '200') {
        const data = res.data.data

        setData({
          ...data,
          evntInfId: id,
          evntTtl: data.evntTtl || '',
          evntBrf: data.evntBrf || '',
          evntCon: data.evntCon || '',
          stplCon: data.evntCon || '',
          fileId: data.imgFileId,
          evntStdyTs: moment(data.evntStdyTs).format('yyyy-MM-DD 00:00:00').toString(),
          evntFndaTs: moment(data.evntFndaTs).format('yyyy-MM-DD 23:59:59').toString(),
          stdyTs: new Date(data.evntStdyTs),
          fndaTs: new Date(data.evntFndaTs),
          enlsSldyTs: moment(data.enlsSldyTs).format('yyyy-MM-DD 00:00:00').toString(),
          enlsCldyTs: moment(data.enlsCldyTs).format('yyyy-MM-DD 23:59:59').toString(),
          sldyTs: new Date(data.enlsSldyTs),
          cldyTs: new Date(data.enlsCldyTs),
          imgFileInfo: {
            ...data.imgFileInfo,
            imgUrl: data.imgUrl
          }
        })
      } else {
        mktContext.actions.setCommonAlertInfo({
          type: 'error',
          active: true
        })
      }
    },
    [data]
  )

  useEffect(() => {
    if (StringUtils.hasLength(id)) {
      // id존재시 디테일 조회
      getEventDetail({ evntInfId: id })
    }
  }, [])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'event'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">이벤트 관리</h4>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table form_table bg_none border_none">
            <caption>이벤트명, 이벤트요약, 기간선택, 이벤트 대표 이미지 등록, 설명 입력 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left th_length'}>
                  <span className="require" aria-label="필수 요소" />
                  이벤트명
                </th>
                <td>
                  <TextInput
                    title="이벤트명"
                    placeholder="이벤트명을 입력하세요."
                    length={20}
                    value={data.evntTtl}
                    onChange={(v) => {
                      handleSetData('evntTtl', v)
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  이벤트 요약
                </th>
                <td>
                  <TextInput
                    title="이벤트 요약"
                    placeholder="이벤트 요약을 입력하세요."
                    length={20}
                    value={data.evntBrf}
                    onChange={(v) => {
                      handleSetData('evntBrf', v)
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  기간
                </th>
                <td>
                  <div className="period_calendar">
                    <DatePicker
                      selected={data.stdyTs ? data.stdyTs : null}
                      onChange={(currentDate) => onChangeDate(currentDate, 'start')}
                      locale={ko}
                      dateFormat={'yyyy-MM-dd'}
                      maxDate={data.fndaTs ? data.fndaTs : null}
                      title={'기간조회'}
                    />
                    <span className="datepicker_dash">~</span>
                    <DatePicker
                      selected={data.fndaTs ? data.fndaTs : null}
                      onChange={(currentDate) => onChangeDate(currentDate, 'end')}
                      locale={ko}
                      dateFormat={'yyyy-MM-dd'}
                      minDate={data.stdyTs ? data.stdyTs : null}
                      title={'기간조회'}
                    />
                  </div>
                </td>
              </tr>
              {/* <tr>
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  모집기간
                </th>
                <td>
                  <div className="period_calendar">
                    <DatePicker
                      selected={data.sldyTs ? data.sldyTs : null}
                      onChange={(currentDate) => onChangeEnlsDate(currentDate, 'start')}
                      locale={ko}
                      dateFormat={'yyyy-MM-dd'}
                      maxDate={data.cldyTs ? data.cldyTs : null}
                      title={'기간조회'}
                    />
                    <span className="datepicker_dash">~</span>
                    <DatePicker
                      selected={data.cldyTs ? data.cldyTs : null}
                      onChange={(currentDate) => onChangeEnlsDate(currentDate, 'end')}
                      locale={ko}
                      dateFormat={'yyyy-MM-dd'}
                      minDate={data.sldyTs ? data.sldyTs : null}
                      title={'기간조회'}
                    />
                  </div>
                </td>
              </tr> */}
              <tr>
                <th className={'ta_left th_length'}>
                  <span className="require" aria-label="필수 요소" />
                  이벤트 대표 이미지
                </th>
                <td>
                  <div className="img_info_wrap">
                    <div className="img_wrap img_wrap_event">
                      <ImageUpload
                        id="mkt_main_banner_file_input"
                        images={data.imgFileInfo?.imgUrl ? [data.imgFileInfo?.imgUrl] : []}
                        maxImageCount={1}
                        onDeleteImageFile={handleImageDelete}
                        form={data}
                        setForm={setData}
                        subText="첨부 이미지 권장 사이즈는 가로 1200 x 세로 1200 px(픽셀) 입니다. JPG, PNG 첨부 가능 합니다."
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={handleCancel}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleSave}>
            {StringUtils.hasLength(id) ? '수정' : '등록'}
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

export default EventRegistration
