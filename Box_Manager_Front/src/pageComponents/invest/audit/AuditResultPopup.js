import { useState, useRef, useEffect, useContext } from 'react'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import {getPostConfig} from '../../../modules/utils/CommonUtils'
import CommonAxios from '../../../modules/utils/CommonAxios'
import { UserContext } from '../../../modules/common/UserContext'
import Api from '../../../modules/consts/Api'
import PopupAlert from 'components/PopupAlert'
import { BtaSelect_copy } from '../../../components/BtaSelect/BtaSelect_copy'
import MenuItem from '@mui/material/MenuItem'

const AuditResultPopup = (props) => {
  const { params, amnnTs, activeOption, close } = props
  const disabledChk = useRef(false)
  const [isOpen, setIsOpen] = useState(false)
  const [auditResultText, setAuditResultText] = useState('')
  const [invmPrfrScdlAmt, setInvmPrfrScdlAmt] = useState('')
  const [exntRsltRmrk, setExntRsltRmrk] = useState('')
  const [alertOpen, setAlertOpen] = useState({
    active : false,
    text : ''
  })

  const userContext = useContext(UserContext)

  const [defaultSelect, setDefaultSelect] = useState (
    {
      active: 'EXN01000'
    }
  )

  // 저장
  const saveResult = async() => {
    const data = {
      invmExntRqstId : params.info.invmExntRqstId,
      amnnUserId : params.info.rgsnUserId,
      exntRsprId: userContext.actions.getIvtAdminUser().adminUserId,
      invmPrfrScdlAmt : parseInt(invmPrfrScdlAmt.replace(',', '')),
      exntRsltRmrk : exntRsltRmrk,
      exntRsltCd : defaultSelect.active,
      exntMsgCon : auditResultText
    }

    const res = await CommonAxios('IVT', getPostConfig(Api.invest.updateAuditResult, data))

    if(res.data.code === "200") {
      setAlertOpen({...alertOpen, active : true, text : '저장이 완료되었습니다.'})
    }else {
      setAlertOpen({...alertOpen, active : true, text : res.data.message})
    }
  }

    /** 금액 숫자 콤마 */
    const handleCommaNum = (val) => {
      if(val !== null) {
        const num = val.toString().replace(/,/g, '', '')
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    }

  // input 작성
  const onInputText = (e, gubun)=> {
    if(gubun === 'invmPrfrScdlAmt') {
      const regex = /^[0-9 ,]*$/
      if (regex.test(e.target.value)) {
        setInvmPrfrScdlAmt(e.target.value)
      }
    }else if(gubun === 'exntRsltRmrk') {
      setExntRsltRmrk(e.target.value)
    }
  }

  // 심사결과 셀렉트박스 
  const handleSelectData = (selected)=> {
    setDefaultSelect({active : selected})
  }

  useEffect(() => {
    if(params !== null && params !== undefined) {
      setAuditResultText(params.info.exntMsgCon)
      setInvmPrfrScdlAmt(params.info.invmPrfrScdlAmt)
      setExntRsltRmrk(params.info.exntRsltRmrk)
      if(params.info.exntRsltCd === null) {
        setDefaultSelect({active : 'EXN01000'})
      }else {
        setDefaultSelect({active : params.info.exntRsltCd})
        if(params.info.exntRsltCd === 'EXN01000' || 
        params.info.exntRsltCd === 'EXN01001' || 
        params.info.exntRsltCd === 'EXN01002') {
          disabledChk.current = true
        }
      }
    }
    setIsOpen(activeOption)
  }, [isOpen])

  return (
    isOpen && (
      <>
        <div className="popup_wrap popup_invest_result">
          <div className="layer">&nbsp;</div>
          <div className="popup_container">
            <div className="popup_content scroll">
              <div className="popup_main_header">
                <div className="title">심사결과</div>
                <Button
                  className="popup_close_button"
                  aria-label="팝업 닫기"
                  onClick={() => {
                    close()
                  }}
                />
              </div>

              <div className={'invest_table_wrap'}>
                <table className="table_invest_result">
                  <caption>심사결과, 거절사유, 심사의견 정보 입력 테이블 </caption>
                  <colgroup>
                    <col width={'15%'} />
                    <col width={'*'} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>심사결과</th>

                      <td>
                        <BtaSelect_copy defaultValue={defaultSelect.active} disabledChk={disabledChk.current} poHandleChange={handleSelectData}>
                          <MenuItem value={'EXN01000'}>투자승인</MenuItem>
                          <MenuItem value={'EXN01001'}>투자보류</MenuItem>
                          <MenuItem value={'EXN01002'}>투자거절</MenuItem>
                        </BtaSelect_copy>
                      </td>
                    </tr>

                    <tr>
                      <th>투자예상액(원)</th>
                      <td>
                        <input
                          name={''}
                          type="text"
                          className="input"
                          value={handleCommaNum(invmPrfrScdlAmt)}
                          title={'투자예상액'}
                          placeholder={'숫자만 입력하세요.'}
                          onChange={(e) => {
                            onInputText(e, 'invmPrfrScdlAmt')
                          }}
                          maxLength={200}
                          disabled={disabledChk.current === true}
                        />
                      </td>
                    </tr>

                    <tr>
                      <th>
                        비고
                        <br />
                        (펀드명 등 입력)
                      </th>
                      <td>
                        <input
                          name={''}
                          type="text"
                          className="input"
                          value={exntRsltRmrk}
                          title={'비고'}
                          placeholder={'비고를 200자 이내로 입력하세요.'}
                          onChange={(e) => {
                            onInputText(e, 'exntRsltRmrk')
                          }}
                          maxLength={200}
                          disabled={disabledChk.current === true}
                        />
                      </td>
                    </tr>

                    <tr>
                      <th>심사의견</th>
                      <td>
                        <textarea
                          className="textarea"
                          placeholder="심사의견을 입력해주세요."
                          maxLength={2000}
                          id=""
                          title="심사의견"
                          value={auditResultText}
                          onChange={(e) => {
                            setAuditResultText(e.target.value)
                          }}
                          disabled={disabledChk.current === true}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>최종업데이트</th>
                      <td>{amnnTs}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded_btn_group">
                <Button
                  className={'basic'}
                  onClick={() => {
                    close()
                  }}
                >
                  닫기
                </Button>
                {
                  params.info.exntRsltCd === null &&
                  <Button
                    className={'full_blue'}
                    onClick={() => {
                      saveResult()
                    }}
                  >
                    저장
                  </Button>
                }
              </div>
            </div>
          </div>
        </div>
        {alertOpen.active && (
          <PopupAlert
            msg={alertOpen.text}
            handlePopup={() => {
              setAlertOpen({ ...alertOpen, active: false, text: '' })
              setIsOpen(false)
              location.reload(true)
            }}
          />
        )}
      </>
    )
  )
}

export default AuditResultPopup
