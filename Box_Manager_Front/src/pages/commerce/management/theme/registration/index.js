import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import { useEffect, useRef, useState, useContext, useCallback, useInsertionEffect } from 'react'
import Radio from 'components/atomic/Radio'
import TextInput from 'components/atomic/TextInput'
import ThemeCompanyPofile from 'pageComponents/commerce/common/ThemeCompanyPofile'
import CompanySrhPop from 'pageComponents/commerce/management/theme/registration/CompanySrhPop'
import DatePicker, { registerLocale } from 'react-datepicker'
import { StringUtils } from 'modules/utils/StringUtils'
import { MktContext } from 'modules/common/MktContext'
import ko from 'date-fns/locale/ko'
import * as commonFn from 'modules/fns/commonFn'
import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import moment from 'moment'
import { getThemeDetailApi, saveThemeApi, getCtgyClass } from 'modules/consts/MktApi'
import { loader } from 'modules/utils/CommonAxios'

const Registration = (props) => {
  const { items = [] } = props
  const id = props.match.params.id
  const mktContext = useContext(MktContext)
  const history = useHistory()
  const [lClass, setLClass] = useState([])
  const [mClass, setMClass] = useState([])
  const [lClassSel, setLClassSel] = useState([])
  const [mClassSel, setMClassSel] = useState([])
  const typeRadioList = [
    { id: 'Y', value: '공개', name: 'public' },
    { id: 'N', value: '비공개', name: 'public' }
  ]
  const [data, setData] = useState({
    oppbYn: 'N',
    grpNm: '',
    grpCon: '',
    stdy: '',
    fnda: '',
    stdyTs: null,
    fndaTs: null,
    compInfo: []
  })
  const [popFlag, setPopFlag] = useState(false)
  const handleSetData = (type, value) => {
    setData({
      ...data,
      [type]: value
    })
  }
  const [delId, setDelId] = useState([])
  /////////////////////////기업검색 팝업 관련/////////////////////////////////
  //기업검색 팝업
  const handelSrhPop = () => {
    setPopFlag(true)
  }

  //기업정보 컴포넌트
  const [companyInfo, setCompanyInfo] = useState([])
  const [companyItemList, setCompanyItemList] = useState([])
  useEffect(() => {
    if (!popFlag && companyInfo.length > 0) {
      setCompanyItemList(companyInfo)
      setData({
        ...data,
        compInfo: companyInfo
      })
    }
  }, [popFlag])

  /////////////////////////저장 및 수정 값 세팅/////////////////////////////////
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
      StringUtils.hasLength(data.grpNm) &&
      StringUtils.hasLength(data.grpCon) &&
      StringUtils.hasLength(data.stdy) &&
      StringUtils.hasLength(data.fnda) &&
      data.compInfo.length > 0
    ) {
      return true
    }
    return false
  }

  const handleDataCheck = () => {
    if (
      data.oppbYn === 'Y' ||
      StringUtils.hasLength(data.grpNm) ||
      StringUtils.hasLength(data.grpCon) ||
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

    saveThemeApi(data, handleSaveCb, handleSaveErrCb)
  }

  const handleSaveCb = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'function1Btn',
      active: true,
      msg: '저장되었습니다.',
      action: () => {
        history.push(`${ROUTER_NAMES.COMMERCE_MANAGEMENT_THEME}`)
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
          history.push(`${ROUTER_NAMES.COMMERCE_MANAGEMENT_THEME}`)
        }
      })
      return false
    }

    history.push(`${ROUTER_NAMES.COMMERCE_MANAGEMENT_THEME}`)
  }

  // ===== 수정
  const handleUpdateDataSet = async () => {
    loader(true, 'Uploading...')
    let res = await getThemeDetailApi(id)
    if (res.data.code === '200') {
      let data = res.data.data
      setData({
        ffpcGrpId: data.ffpcGrpId,
        grpCon: data.grpCon,
        grpNm: data.grpNm,
        oppbYn: data.oppbYn,
        stdy: data.stdy,
        stdyTs: new Date(data.stdy),
        fnda: data.fnda,
        fndaTs: new Date(data.fnda),
        compInfo: data.compInfo
      })

      await loader()
    }
  }

  const handelCompDel = () => {
    if (delId.length > 0) {
      mktContext.actions.setCommonAlertInfo({
        type: 'function',
        active: true,
        msg: '삭제 하시겠습니까?',
        btnMsg: '취소',
        btnMsg2: '확인',
        action2: () => {
          // let newInfo = [...data.compInfo]
          let newInfo = data.compInfo.filter((_item) => !delId.includes(_item.utlinsttId))
          setData({
            ...data,
            compInfo: newInfo
          })
          setCompanyInfo(newInfo)
          setDelId([])
        }
      })
    } else {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '선택된 기업이 없습니다.'
      })
    }
  }

  useEffect(() => {
    id && handleUpdateDataSet()
  }, [id])

  useEffect(() => {
    getCtgyClass(ctgyListCallback, handleSaveErrCb)
  }, [])

  const ctgyListCallback = (res) => {
    if (res.data.code === '200') {
      let data = res.data.data
      setLClass(data.depthOne)
      setMClass(data.depthTwo)
    }
  }

  useEffect(() => {
    let lClassList = lClass?.map((item) => ({
      id: item.ctgyCd,
      value: item.ctgyCd,
      label: item.ctgyNm
    }))
    let mClassList = mClass?.map((item) => ({
      id: item.ctgyCd,
      value: item.ctgyCd,
      label: item.ctgyNm,
      parentId: item.ctgyParentCd
    }))

    if (lClassList.length > 0) {
      setLClassSel(lClassList)
    }
    if (mClassList.length > 0) {
      setMClassSel(mClassList)
    }
  }, [mClass])

  ///////////////////////////////////////////
  return (
    <PageLayout currentMenu={'commerce'} currentCate={'theme'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">테마기업관리</h4>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table form_table bg_none border_none">
            <caption>공개여부, 테마명, 설명, 기간선택, 기업검색 및 삭제 입력 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
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
                      checked={radio.id == (data.oppbYn || 'N')}
                      onChange={(e) => {
                        handleSetData('oppbYn', e.target.id)
                      }}
                    />
                  ))}
                </td>
              </tr>

              <tr>
                <th className={'ta_left th_length'}>
                  <span className="require" aria-label="필수 요소" />
                  테마명
                </th>
                <td>
                  <TextInput
                    title="테마명"
                    placeholder="테마명을 입력하세요."
                    length={20}
                    value={data.grpNm}
                    onChange={(v) => {
                      handleSetData('grpNm', v)
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th className={'ta_left th_length'}>
                  <span className="require" aria-label="필수 요소" />
                  설명
                </th>
                <td>
                  <TextInput
                    title="테마설명"
                    placeholder="테마에 대한 설명을 입력하세요."
                    length={50}
                    value={data.grpCon}
                    onChange={(v) => {
                      handleSetData('grpCon', v)
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
                  기업
                </th>
                <td>
                  <div className="enterprise_box">
                    <div className="enterprise_box_button_group">
                      <Button className={'full_grey_dark'} onClick={handelCompDel} disabled={data.compInfo?.length < 1}>
                        삭제
                      </Button>

                      <Button className={'full_blue'} onClick={handelSrhPop}>
                        기업 검색
                      </Button>
                    </div>
                    {/* case1 테이터 없는 경우 */}
                    {/* <div className="no_data">테이터가 없습니다.</div> */}
                    {/* case2 테이터 있는 경우 */}
                    <ul className="enterpriseItem_list">
                      {data.compInfo.length > 0 ? (
                        data.compInfo?.map((_data, idx) => {
                          return (
                            <ThemeCompanyPofile
                              companyInfo={companyInfo}
                              setCompanyInfo={setCompanyInfo}
                              selrUsisId={_data.utlinsttId}
                              idx={idx}
                              checked={delId.includes(_data.utlinsttId)}
                              onChecked={(checked, id) => {
                                if (checked) {
                                  setDelId((prev) => [...prev, id])
                                } else {
                                  setDelId((prev) => [...prev.filter((_item) => _item !== id)])
                                }
                              }}
                              key={_data.utlinsttId}
                            />
                          )
                        })
                      ) : (
                        <div className="no_data">데이터가 없습니다.</div>
                      )}
                    </ul>
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
            등록
          </Button>
        </div>
        {popFlag && (
          <div className={popFlag ? '' : 'hide'}>
            <CompanySrhPop
              popFlag={popFlag}
              setPopFlag={setPopFlag}
              companyInfo={companyInfo}
              setCompanyInfo={setCompanyInfo}
              lClass={lClassSel}
              mClass={mClassSel}
            />
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default Registration
