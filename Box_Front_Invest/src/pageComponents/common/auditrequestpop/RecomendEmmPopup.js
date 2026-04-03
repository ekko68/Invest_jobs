import { colors } from 'assets/style/style.config'
import Button from 'components/atomic/Button'
import Input from 'components/atomic/Input'
import PopupFooter from 'components/popups/PopupFooter'
import PopupHeader from 'components/popups/PopupHeader'
import { exeFunc } from 'modules/utils/ReactUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { RecommendBranchPopup, RecommendEmployeePopup } from './RcmdBrncSearchPopup'
import { getPostConfig } from 'modules/utils/CommonAxios'
import CommonAxios from 'modules/utils/CommonAxios'
import Api from 'modules/consts/Api'
import { openSessionAlert } from 'pageComponents/common/pop/SessionCheckAlert'

const RecomendEmmPopup = forwardRef((props, ref) => {
  const initData = {
    brcd: '',
    krnBrm: '',

    emn: '',
    emm: ''
  }

  const rcmdBrncPopRef = useRef()
  const rcmdBrncEmpPopRef = useRef()

  const [rcmdData, setRcmdData] = useState({ ...initData })

  useImperativeHandle(ref, () => ({
    open,
    close
  }))

  const alertPopupRef = useRef()

  const [isOpen, setIsOpen] = useState(false)

  const open = async () => {
    setIsOpen(true)
    document.body.classList.add('popupScrollLock')
  }

  const close = () => {
    setIsOpen(false)
    document.body.classList.remove('popupScrollLock')
  }

  const updateRecommendData = async (val) => {
    if (rcmdData.brcd === '') {
      exeFunc(alertPopupRef, 'open', '추천 영업점을 선택해주세요.')
      return
    } else if (rcmdData.emn === '') {
      exeFunc(alertPopupRef, 'open', '추천 직원을 선택해주세요.')
      return
    }

    const params = {
      brcd: val.brcd,
      emm: val.emm,
      emn: val.emn,
      invmExntRqstId: props.invmExntRqstId
    }

    const url = Api.my.vc.updateRecommend
    const config = getPostConfig(url, params)
    const recommendObject = await CommonAxios(config, true)

    if (recommendObject.data.code === '200') {
      openSessionAlert(true, '수정완료 되었습니다.', () => {
        close()
        location.reload(true)
      })
    } else {
      exeFunc(alertPopupRef, 'open', recommendObject.data.message)
    }
  }

  return (
    <>
      {isOpen && (
        <>
          <div className="popup_wrap">
            <div className="popup_layout">&nbsp;</div>
            <div className="popup_container scroll">
              <PopupHeader title={'추천 영업점 및 직원'} handlePopup={close} />
              <div className="popup_content" style={{ height: 'calc(100% - 122px)', padding: '20px 20px 12px 20px' }}>
                <div
                  className="popup_container02"
                  style={{ margin: '3px 10px 8px 10px', display: 'flex', flexDirection: 'column', gridGap: '14px' }}
                >
                  <div className="cnt_wrap" style={{ width: '100%', height: 'auto !important' }}>
                    <p className="cnt_title" style={{ fontSize: '16px', letterSpacing: '-0.05em', color: '#333' }}>
                      추천영업점
                    </p>
                    <div className="input_section" style={{ marginTop: '6px', display: 'flex', gridGap: '6px' }}>
                      <Input
                        name={'input01'}
                        title="추천영업점"
                        value={StringUtils.hasLength(rcmdData.brcd) ? `${rcmdData.krnBrm} (${rcmdData.brcd})` : ''}
                        placeholder={''}
                        style={{
                          padding: '8px 10px 9px',
                          width: '100%',
                          height: '30px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                        readOnly
                      />
                      <Button
                        type={'linear'}
                        theme={colors.blue}
                        onClick={() => exeFunc(rcmdBrncPopRef, 'open')}
                        style={{ width: '20%' }}
                      >
                        찾기
                      </Button>
                    </div>
                  </div>

                  <div className="cnt_wrap" style={{ width: '100%', height: 'auto !important' }}>
                    <p className="cnt_title" style={{ fontSize: '16px', letterSpacing: '-0.05em', color: '#333' }}>
                      추천직원
                    </p>
                    <div className="input_section" style={{ marginTop: '6px', display: 'flex', gridGap: '6px' }}>
                      <Input
                        name={'input02'}
                        title="추천직원"
                        value={StringUtils.hasLength(rcmdData.emn) ? `${rcmdData.emm} (${rcmdData.emn})` : ''}
                        placeholder={''}
                        style={{
                          padding: '8px 10px 9px',
                          width: '100%',
                          height: '30px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                        readOnly
                      />
                      <Button
                        type={'linear'}
                        theme={colors.blue}
                        onClick={() => exeFunc(rcmdBrncEmpPopRef, 'open')}
                        style={{ width: '20%' }}
                      >
                        찾기
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <PopupFooter>
                <div className="btn_group">
                  <Button theme={colors.lightGrey} onClick={() => close()} style={{ marginRight: '3px' }}>
                    취소
                  </Button>
                  <Button
                    theme={colors.blue}
                    onClick={() => updateRecommendData(rcmdData)}
                    style={{ marginLeft: '3px' }}
                  >
                    수정
                  </Button>
                </div>
              </PopupFooter>
            </div>
          </div>
          <AlertPopup ref={alertPopupRef} />
          <RecommendBranchPopup
            ref={rcmdBrncPopRef}
            alertPopupRef={alertPopupRef}
            setBranch={(krnBrm, brcd) =>
              setRcmdData({
                ...rcmdData,
                krnBrm: krnBrm,
                brcd: brcd
              })
            }
          />
          <RecommendEmployeePopup
            ref={rcmdBrncEmpPopRef}
            alertPopupRef={alertPopupRef}
            brcd={rcmdData.brcd}
            setEmp={(emm, emn) =>
              setRcmdData({
                ...rcmdData,
                emm: emm,
                emn: emn
              })
            }
          />
        </>
      )}
    </>
  )
})

export default RecomendEmmPopup
