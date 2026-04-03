import React, { useContext, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import NoResult from 'components/common/NoResult'

import IrPreviewPopup from 'pageComponents/common/irpreviewpop/IrPreviewPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'

import { AlertLabels, BizStatusCode, CheckYn, RequestStatusCodeLabels, UsisType } from 'modules/consts/BizConst'
import { exeFunc } from 'modules/utils/ReactUtils'
import QueryUtils from 'modules/utils/QueryUtils'
import CommonAxios from 'modules/utils/CommonAxios'
import { fileDownload, getPostConfig } from 'modules/utils/CommonAxios'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { StringUtils } from 'modules/utils/StringUtils'
import IrPreviewApi from 'modules/consts/IrPreviewApi'
import NiceDocUtil from 'modules/utils/NiceDocUtil'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey } from 'modules/utils/CommonUtils'
import RequestDetailCompletePopup from 'pageComponents/mypage/common/request/RequestDetailCompletePopup'
import PopupHeader from '../../../../components/popups/PopupHeader'
import PopupFooter from '../../../../components/popups/PopupFooter'
import moment from 'moment'
import { isNumber } from 'modules/utils/NumberUtils'

export {
  RequestCancelButton,
  RequestReference,
  RequestSuggestBody,
  RequestBody,
  RequestCompleteBody,
  RequestCancelBody
}

const RequestCancelButton = (props) => {
  const history = useHistory()
  const commonContext = useContext(CommonContext)

  const { progressList, alertPopRef } = props
  const [isConfirmPopOpen, setIsConfirmPopOpen] = useState(false)

  const getCancelButton = () => {
    let r = (
      <Button className={'blue'} onClick={() => setIsConfirmPopOpen(true)}>
        요청 취소
      </Button>
    )
    if (progressList.length > 0) {
      for (let i = 0; i < progressList.length; i++) {
        const item = progressList[i]
        if (item['invmExntPgsgCd'] === RequestStatusCodeLabels.EVALUATE) {
          r = ''
          break
        }
      }
    }
    return r
  }

  const onConfirmRequestCancel = async () => {
    const query = QueryUtils.getQuery(props)
    if (query) {
      if (query.hasOwnProperty('invmExntRqstId')) {
        await commonContext.actions.callbackAfterSessionRefresh(
          async () => {
            const params = {
              id: query['invmExntRqstId']
            }
            const saveRes = await CommonAxios(getPostConfig(Api.my.company.auditRequestCancel, params), false)
            if (saveRes) {
              if (saveRes.status === 200) {
                if (saveRes.data.hasOwnProperty('code') && saveRes.data.code === BizStatusCode.NOT_AVAILABLE_STEP) {
                  exeFunc(alertPopRef, 'open', saveRes.data.message)
                  return
                }

                if (saveRes.data.hasOwnProperty('code') && saveRes.data.code !== '200') {
                  exeFunc(alertPopRef, 'open', AlertLabels.askAdmin)
                  return
                }

                let type = 'receive'
                let url = ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_DETAIL + '?invmExntRqstId=' + query['invmExntRqstId']
                if (query.hasOwnProperty('type')) {
                  type = query['type']
                }
                url += '&type=' + type
                history.push(url)
              } else if (saveRes.status !== 200) {
                exeFunc(alertPopRef, 'open', '시스템오류가 발생했습니다. 관리자에게 문의해주세요')
              }
            }
          },
          true,
          true
        )
      }
    }
  }

  return (
    <>
      {getCancelButton()}
      {
        // 팝업 내부 버튼 css 가 overwrite 되어 따로 구현 후 인라인 css 설정함
        isConfirmPopOpen && (
          <div className="popup_wrap popup_nda">
            <div className="popup_layout">&nbsp;</div>
            <div className="popup_container">
              <PopupHeader handlePopup={() => setIsConfirmPopOpen(false)} />
              <div className="popup_content">
                <div className="popup_nda_wrap">
                  <div className="img_wrap">
                    <img src="/images/ico_warning.png" alt="" />
                  </div>
                  <p className="text">{'요청을 취소 하시겠습니까?'}</p>
                  <p className="title_text">
                    {`*요청취소 시 ${
                      isNumber(props?.invmexntRapLmtnMnct) ? props.invmexntRapLmtnMnct : 12
                    }개월 이후에 해당 투자사에게 재신청이 가능합니다.`}
                  </p>
                  <br />
                </div>
              </div>
              <PopupFooter>
                <div className="btn_group gap">
                  <Button
                    className={'light_grey'}
                    style={{ height: '38px', fontSize: '14px' }}
                    onClick={() => setIsConfirmPopOpen(false)}
                  >
                    취소
                  </Button>
                  <Button
                    className={'blue'}
                    style={{ height: '38px', fontSize: '14px' }}
                    onClick={async () => {
                      setIsConfirmPopOpen(false)
                      await onConfirmRequestCancel()
                    }}
                  >
                    확인
                  </Button>
                </div>
              </PopupFooter>
            </div>
          </div>
        )
      }
    </>
  )
}

const RequestSuggestBody = ({ vo, getLogoImage }) => {
  return (
    <div className="card_section card02">
      <CardLayout>
        <div className="company_info_wrap">
          <div className="company_info">
            <div className="img">{getLogoImage(vo.invmLogoImageUrl)}</div>
            <div className="info">
              <p className="title">{vo.invmCmpBplcNm}</p>
              <p className="text">{vo.invmCmpPtrnNm}</p>
            </div>
          </div>
          <div className="text_wrap">
            <p className="title">안녕하세요 {vo.invmCmpBplcNm} 입니다.</p>
            <p
              className="content_text scroll"
              dangerouslySetInnerHTML={{ __html: StringUtils.toBr(vo.prplMsgCon) }}
            ></p>
          </div>
        </div>
      </CardLayout>
    </div>
  )
}

const RequestCancelBody = ({ progressList }) => {
  // todo : 투자심사 취소 코멘트 재확인
  const getCancelOrExpireText = () => {
    let r = ''
    if (progressList.length > 0) {
      for (let i = 0; i < progressList.length; i++) {
        const item = progressList[i]
        if (item['invmExntPgsgCd'] === RequestStatusCodeLabels.EXPIRED) {
          r = '기간 만료 되었습니다.'
          break
        } else if (item['invmExntPgsgCd'] === RequestStatusCodeLabels.CANCEL) {
          r = '요청 취소 되었습니다.'
          break
        }
      }
    }
    return r
  }

  return (
    <div className="card_section card02">
      <CardLayout>
        <div className="end_wrap">
          <div className="end_top">
            <p className="title">투자 심사가 취소되었습니다.</p>
            <p className="sub_title">{getCancelOrExpireText()}</p>
          </div>
        </div>
      </CardLayout>
    </div>
  )
}

const RequestBody = ({ vo, getLogoImage, alertPopRef }) => {
  const previewRef = useRef()

  return (
    <div className="card_section card02">
      <CardLayout>
        <div className="company_info_wrap">
          <div className="company_info">
            <div className="img">{getLogoImage(vo.enprLogoImageUrl)}</div>
            <div className="info">
              <p className="title">{vo.rqstBplcNm}</p>
              <p className="text">{vo.rqstEnprRprsntvNm}</p>
            </div>
          </div>
          <div className="text_wrap">
            <p className="title">안녕하세요. {vo.rqstBplcNm} 입니다.</p>
            <p
              className="content_text scroll"
              dangerouslySetInnerHTML={{ __html: StringUtils.toBr(vo.rqstMsgCon) }}
            ></p>
          </div>

          <RequestReference vo={vo} previewRef={previewRef} />
          <NiceDocReference vo={vo} alertPopRef={alertPopRef} />
          <IrPreviewPopup
            ref={previewRef}
            irTitle={`${vo.rqstBplcNm} IR 자료`}
            isCompanyRequestDetail={true}
            api={IrPreviewApi.myCompanyAudit}
          />
        </div>
      </CardLayout>
    </div>
  )
}

const RequestCompleteBody = ({ vo, getLogoImage, alertPopRef }) => {
  const previewRef = useRef()
  const [isResultPopOpen, setIsResultPopOpen] = useState(false)

  return (
    <>
      {isResultPopOpen && (
        <RequestDetailCompletePopup
          vo={vo}
          usisType={UsisType.COMPANY}
          onClickClose={() => setIsResultPopOpen(false)}
        />
      )}
      <div className="card_section card02">
        <CardLayout>
          <div className="end_wrap judge_end">
            <div className="end_top">
              <p className="title">모든 투자 심사가 종료되었습니다.</p>
              <p className="sub_title">
                심사결과가 스타트업에게 전달되었습니다. <br />
                성공적인 투자를 기원합니다.
              </p>
              <div className="button_wrap">
                <button className="btn" onClick={() => setIsResultPopOpen(true)}>
                  투자심사 내용보기
                </button>
              </div>
            </div>
          </div>

          <div className="company_info_wrap">
            <RequestReference vo={vo} previewRef={previewRef} />
            <NiceDocReference vo={vo} alertPopRef={alertPopRef} />
            <IrPreviewPopup
              ref={previewRef}
              irTitle={`${vo.rqstBplcNm} IR 자료`}
              isCompanyRequestDetail={true}
              api={IrPreviewApi.myCompanyAudit}
            />
          </div>
        </CardLayout>
      </div>
    </>
  )
}

const RequestReference = ({ vo, previewRef }) => {
  const commonContext = useContext(CommonContext)

  const onClickDownload = (id, fileNm) => {
    const item = {
      fileId: id,
      fileNm: fileNm
    }
    commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        await fileDownload(item)
      },
      true,
      true
    )
  }
  const onClickPictUrl = (url) => {
    window.open(url)
  }
  const onClickIrPreview = () => {
    exeFunc(previewRef, 'open')
  }
  return (
    <div className="data_wrap">
      <p className="main_title">첨부자료</p>
      <div className="data_list">
        <div className="data_item">
          <p className="title">IR보기</p>
          {/* {vo?.rqstEnprIrInqYn !== CheckYn.YES ? (
            <Button className="blue" onClick={onClickIrPreview}>
              IR 자료 보기
            </Button>
          ) : (
            <span>기간만료</span>
          )} */}
          <Button className="blue" onClick={onClickIrPreview}>
            IR 자료 보기
          </Button>
        </div>
        {vo?.anncDatFileId && (
          <div className="data_item">
            <p className="title">발표자료 보기</p>
            <p
              className="content"
              onClick={() => onClickDownload(vo.anncDatFileId, vo.anncDatFileNm)}
              style={{ cursor: 'pointer' }}
            >
              {vo.anncDatFileNm}
            </p>
          </div>
        )}
        {vo?.addtDocFileId && (
          <div className="data_item">
            <p className="title">추가자료</p>
            <p
              className="content"
              onClick={() => onClickDownload(vo.addtDocFileId, vo.addtDocFileNm)}
              style={{ cursor: 'pointer' }}
            >
              {vo.addtDocFileNm}
            </p>
          </div>
        )}
        {vo?.pbrlPictUrl && (
          <div className="data_item">
            <p className="title">홍보영상자료</p>
            <p className="content" onClick={() => onClickPictUrl(vo.pbrlPictUrl)} style={{ cursor: 'pointer' }}>
              {vo.pbrlPictUrl}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const NiceDocReference = ({ vo, alertPopRef }) => {
  const commonContext = useContext(CommonContext)
  const list = []

  if (vo.infotechDoc.length > 0) {
    let dateSplit = vo.infotechDoc[0].fileNm.split('_')
    let now = new Date()
    let oneMonthAfter = new Date(now.setMonth(now.getMonth() + 1))
    let papersAtchFlpthNm = ''
    if (dateSplit[0].substr(0, 8) === moment(oneMonthAfter).format('YYYYMMDD')) {
      papersAtchFlpthNm = 'expired'
    } else {
      papersAtchFlpthNm = 'download'
    }
    for (let i = 0; i < vo.infotechDoc.length; i++) {
      const obj = {
        fileName: '',
        papersAtchFlpthNm: papersAtchFlpthNm,
        fileId: vo.infotechDoc[i].fileId
      }

      let strSplit = vo.infotechDoc[i].fileNm.split('_')

      if (strSplit[1] === 'e101') {
        obj.fileName = '사업자등록증명'
      } else if (strSplit[1] === 'e103') {
        obj.fileName = '납세증명'
      } else if (strSplit[2] === 'e102') {
        obj.fileName = '표준재무제표증명(' + strSplit[1] + ')'
      } else if (strSplit[2] === 'e105') {
        obj.fileName = '법인세 신고내역(' + strSplit[1] + ')'
      } else if (strSplit[2] === 'e107') {
        obj.fileName = '부가세 신고내역(' + strSplit[1] + ')'
      }

      list.push(obj)
    }
    list.sort((a, b) => {
      return a.fileName < b.fileName ? -1 : a.fileName > b.fileName ? 1 : 0
    })
  }

  return (
    <div className="data_wrap">
      <p className="main_title">간편서류</p>
      <div className="data_list">
        {list?.length > 0 ? (
          list.map((docItem, index) => {
            return (
              <div className="data_item" key={createKey()}>
                <p className="title">{docItem.fileName}</p>
                <p
                  className={docItem.papersAtchFlpthNm === 'download' ? 'content' : 'title'}
                  onClick={() =>
                    NiceDocUtil.downloadNiceSimpleDoc(docItem, docItem.papersAtchFlpthNm, alertPopRef, commonContext)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  {NiceDocUtil.getDownloadBtnNm(docItem.papersAtchFlpthNm)}
                </p>
              </div>
            )
          })
        ) : (
          <NoResult msg={'제출된 간편서류 정보가 없습니다.'} />
        )}
      </div>
    </div>
  )
}
