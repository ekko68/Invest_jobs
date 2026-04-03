import Button from 'components/atomic/Button'
import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'

import { StringUtils } from 'modules/utils/StringUtils'
import PopupAlert from 'components/PopupAlert'
// import { openSessionAlert } from 'pageComponents/common/pop/SessionCheckAlert'
import React, {  useEffect, useRef, useState } from 'react'
import { getPostConfig } from '../../../modules/utils/CommonUtils'
import RecommendBranchPopup from '../../../pageComponents/invest/audit/RecommendBranchPopup'
import RecommendEmployeePopup from '../../../pageComponents/invest/audit/RecommendEmployeePopup'

const RecomendUpdatePopup = (props) => {
  const {invmExntRqstId, activeOption ,close, amnnUserId } = props
  const initData = {
    brcd: '',
    krnBrm: '',
    emn: '',
    emm: ''
  }

  const rcmdBrncEmpPopRef = useRef()
  const [rcmdData, setRcmdData] = useState({ ...initData })
  const [isOpen, setIsOpen] = useState(false)
  const [openPop, setOpenPop] = useState(
    {
      alertPop : {
        text : '',
        active : false
      },
      branchPop : {
        active : false
      },
      emmPop : {
        active : false
      },
      savePop : {
        text : '',
        active : false
      }

    }
  )

  const updateRecommendData = async (val) => {
    if (rcmdData.brcd === '') {
      setOpenPop({...openPop , alertPop : {text : '추천 영업점을 선택해주세요.' , active : true}})
      return
    } else if (rcmdData.emn === '') {
      setOpenPop({...openPop , alertPop : {text : '추천 직원을 선택해주세요.' , active : true}})
      return
    }

    const params = {
      brcd: val.brcd,
      emm: val.emm,
      emn: val.emn,
      invmExntRqstId: invmExntRqstId,
      amnnUserId : amnnUserId
    }
    const recommendObject = await CommonAxios('IVT', getPostConfig(Api.invest.updateRecommendPop, params))
    
    if (recommendObject.data.code === '200') {
      setOpenPop({...openPop , savePop : {text : '수정완료 되었습니다.' , active : true}})
    } else {
      setOpenPop({...openPop , alertPop : {text : recommendObject.data.message , active : true}})
    }
  }

  useEffect(()=> {
    setIsOpen(activeOption)
  })

  return (
    <>
      {isOpen && (
        <>
      <div className="popup_wrap">
        <div className="layer">&nbsp;</div>
          <div className="popup_container" style={{height : '400px', width : '500px'}}>
            <div className="popup_content scroll">
              <div className="popup_main_header">
                <div className="title">추천 영업점 및 직원</div>
                  <Button className="popup_close_button" aria-label="팝업 닫기" onClick={() => {close()}} />
                </div>
                <div className={'invest_table_wrap'}>
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
                          <input
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
                            className={'full_blue'}
                            onClick={() => setOpenPop({...openPop, branchPop : {active: true}})}
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
                          <input
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
                            className={'full_blue'}
                            onClick={() => setOpenPop({...openPop, emmPop : {active: true}})}
                            style={{ width: '20%' }}
                          >
                            찾기
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded_btn_group">
                  <Button className={'basic'} onClick={() => {close()}}>
                    닫기
                  </Button>
                  <Button className={'full_blue'} id='saveBtn' onClick={() => {updateRecommendData(rcmdData)}}>
                    저장
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {openPop.alertPop.active && (
            <PopupAlert
              msg={openPop.alertPop.text}
              handlePopup={() => setOpenPop({ ...openPop, alertPop : {active: false, text : ''} })}
            />
          )}
          {openPop.savePop.active && (
            <PopupAlert
              msg={openPop.savePop.text}
              handlePopup={() => {
                close()
                window.location.reload()}
              }
            />
          )}
          {
            openPop.branchPop.active &&(
              <RecommendBranchPopup 
                activeOption={openPop.branchPop.active} 
                handlePopup={() => setOpenPop({ ...openPop, branchPop : {active: false} })}
                setBranch={(krnBrm, brcd) =>
                  setRcmdData({
                    ...rcmdData,
                    krnBrm: krnBrm,
                    brcd: brcd
                  })
                }
              />
            )
          }
          {
          openPop.emmPop.active &&(
            <RecommendEmployeePopup
              activeOption={openPop.emmPop.active} 
              handlePopup={() => setOpenPop({ ...openPop, emmPop : {active: false} })}
              brcd={rcmdData.brcd}
              setEmp={(emm, emn) =>
                setRcmdData({
                  ...rcmdData,
                  emm: emm,
                  emn: emn
                })
              }
            />
            )
          }
        </>
      )}
    </>
  )
}

export default RecomendUpdatePopup
