import React, { useState, useEffect, useContext } from 'react'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Radio from 'components/atomic/Radio'
import TextInput from 'components/atomic/TextInput'
import ImageUpload from 'pageComponents/commerce/common/ImageUpload'
import DatePicker from 'react-datepicker'
import ko from 'date-fns/locale/ko'
import { StringUtils } from 'modules/utils/StringUtils'
import { MktContext } from 'modules/common/MktContext'
import { getBannerDetailApi, saveBannerApiV2 } from 'modules/consts/MktApi'
import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import * as commonFn from 'modules/fns/commonFn'
import moment from 'moment'
import { loader } from 'modules/utils/CommonAxios'

const Registration = (props) => {
  const maintype = 'eventBanner'
  const id = props.match.params.id
  const mktContext = useContext(MktContext)
  const history = useHistory()
  const [data, setData] = useState({
    oppbYn: 'N',
    ttl: '',
    link: '',
    fileId: '',
    stdy: '',
    fnda: '',
    con: '',
    stdyTs: null,
    fndaTs: null,
    imgFileInfo: {},
    webYn: mktContext.state.currType
  })

  const typeRadioList = [
    { id: 'Y', value: '공개', name: 'public' },
    { id: 'N', value: '비공개', name: 'public' }
  ]

  const handleSetData = (type, value) => {
    setData({
      ...data,
      [type]: value
    })
  }

  // ===== 파일 삭제
  const handleImageDelete = (id) => {
    StringUtils.hasLength(id)
      ? setData({
          ...data,
          imgUrl: '',
          fileId: '',
          imgFileInfo: {}
        })
      : setData({
          ...data,
          imgFileInfo: {}
        })
  }

  // ===== datepicker
  const onChangeDate = (currentDate, type) => {
    if (type === 'start') {
      setData({
        ...data,
        stdy: moment(currentDate).format('yyyy-MM-DD').toString(),
        stdyTs: currentDate
      })
    } else if (type === 'end') {
      setData({
        ...data,
        fnda: moment(currentDate).format('yyyy-MM-DD 23:59:59').toString(),
        fndaTs: currentDate
      })
    }
  }

  const handleRequiredCheck = () => {
    if (
      StringUtils.hasLength(data.oppbYn) &&
      StringUtils.hasLength(data.ttl) &&
      StringUtils.hasLength(data.fileId) &&
      StringUtils.hasLength(data.stdy) &&
      StringUtils.hasLength(data.fnda)
    ) {
      return true
    }
    return false
  }

  const handleDataCheck = () => {
    if (
      data.oppbYn === 'Y' ||
      StringUtils.hasLength(data.ttl) ||
      StringUtils.hasLength(data.fileId) ||
      StringUtils.hasLength(data.stdy) ||
      StringUtils.hasLength(data.fnda)
    ) {
      return true
    }
    return false
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

    if (StringUtils.hasLength(data.link) && !commonFn.handleUrlValidate(data.link)) {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '유효하지 않는 url 입니다.'
      })
      return false
    }

    let newData = {
      ...data
    }
    saveBannerApiV2(maintype, newData, handleSaveCb, handleSaveErrCb)
  }

  const handleSaveCb = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'function1Btn',
      active: true,
      msg: '저장되었습니다.',
      action: () => {
        history.push(`${ROUTER_NAMES.COMMERCE_MAIN_EVENT}`, { webYn: mktContext.state.currType })
      }
    })
  }

  const handleSaveErrCb = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  const handleCancel = () => {
    if (handleDataCheck()) {
      mktContext.actions.setCommonAlertInfo({
        type: 'function',
        active: true,
        msg: '입력한 정보가 저장되지 않습니다.',
        btnMsg: '취소',
        btnMsg2: '확인',
        action2: () => {
          history.push(`${ROUTER_NAMES.COMMERCE_MAIN_EVENT}`, { webYn: mktContext.state.currType })
        }
      })
      return false
    }

    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_EVENT}`, { webYn: mktContext.state.currType })
  }

  // ===== 수정
  const handleUpdateDataSet = async () => {
    loader(true, 'Uploading...')
    let res = await getBannerDetailApi(maintype, id)
    if (res.data.code === '200') {
      let data = res.data.data
      setData({
        banInfId: data.banInfId,
        oppbYn: data.oppbYn,
        ttl: data.ttl,
        link: data.link,
        stdy: data.stdy,
        stdyTs: new Date(data.stdy),
        fnda: data.fnda,
        fndaTs: new Date(data.fnda),
        imgFileInfo: data.imgFileInfo,
        fileId: data.imgFileId,
        imgUrl: data.imgUrl,
        con: data.con,
        webYn: mktContext.state.currType
      })
      await loader()
    }
  }

  useEffect(() => {
    id && handleUpdateDataSet()
  }, [id])

  if (id && !data?.banInfId) {
    return null
  }

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'eventList'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">{`이벤트 메인 (${
            mktContext.state.currType === 'webMain' ? '웹' : '모바일'
          })배너 관리`}</h4>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table form_table bg_none border_none">
            <caption>공개여부, 제목, 링크, 기간선택, 이미지 등록가능한 입력 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left th_length'}>
                  <span className="require" aria-label="필수 요소" />
                  제목
                </th>
                <td>
                  <TextInput
                    title="제목"
                    placeholder="제목을 입력하세요."
                    length={15}
                    value={data.ttl || ''}
                    onChange={(v) => {
                      handleSetData('ttl', v)
                    }}
                  />
                </td>
              </tr>
              <tr className="tr_radio">
                <th className={'ta_left bg_light_grey'}>
                  <span className="require" aria-label="필수 요소" />
                  공개
                </th>

                <td>
                  {typeRadioList.map((radio) => (
                    <Radio
                      key={radio.id}
                      radio={radio}
                      name={radio.name}
                      defaultChecked={radio.id == (data.oppbYn || 'N')}
                      onChange={(e) => {
                        handleSetData('oppbYn', e.target.id)
                      }}
                    />
                  ))}
                </td>
              </tr>
              <tr>
                <th className={'ta_left th_length'}>설명</th>
                <td>
                  <TextInput
                    title="배너 설명"
                    placeholder="설명을 입력하세요."
                    value={data.con || ''}
                    length={30}
                    onChange={(v) => {
                      handleSetData('con', v)
                    }}
                  />
                </td>
              </tr>

              <tr>
                <th className={'ta_left'}>링크</th>
                <td>
                  <TextInput
                    title="링크"
                    placeholder="링크를 입력하세요."
                    value={data.link || ''}
                    onChange={(v) => {
                      handleSetData('link', v)
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
              <tr>
                <th className={'ta_left th_length'}>
                  <span className="require" aria-label="필수 요소" />
                  이미지 등록
                </th>
                <td>
                  <div className="img_info_wrap">
                    <div className="img_wrap">
                      <ImageUpload
                        id="mkt_main_banner_file_input"
                        images={
                          data.imgFileInfo?.imgUrl ? [data.imgFileInfo?.imgUrl] : data.imgUrl ? [data.imgUrl] : []
                        }
                        // images={data.imgUrl ? [data.imgUrl] : []}
                        maxImageCount={1}
                        onDeleteImageFile={handleImageDelete}
                        form={data}
                        setForm={setData}
                        subText="첨부 이미지 권장 사이즈는 가로 1410 x 세로 555px(픽셀)입니다. JPG, PNG 첨부 가능 합니다"
                      />
                      {/* 1. case 메인 ,기업, 이벤트 웹 PC 사이즈 문구 */}
                      {/* subText="첨부 이미지 권장 사이즈는 가로 1410 x 세로 555px(픽셀)입니다. JPG, PNG 첨부 가능 합니다" */}

                      {/* 2. case 메인 ,기업, 이벤트 모바일 사이즈 문구 */}
                      {/* subText="첨부 이미지 권장 사이즈는 가로 300 x 세로 400px(픽셀)입니다. JPG, PNG 첨부 가능 합니다" */}
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

export default Registration
