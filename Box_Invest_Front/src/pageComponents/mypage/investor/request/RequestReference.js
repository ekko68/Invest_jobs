import React, { useContext } from 'react'

import CardLayout from 'components/common/card/CardLayout'
import NoResult from 'components/common/NoResult'

import DateUtils from 'modules/utils/DateUtils'
import { exeFunc } from 'modules/utils/ReactUtils'
import { fileDownload } from 'modules/utils/CommonAxios'
import NiceDocUtil from 'modules/utils/NiceDocUtil'
import { StringUtils } from 'modules/utils/StringUtils'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey } from 'modules/utils/CommonUtils'
import { CheckYn } from 'modules/consts/BizConst'
import moment from 'moment'

const RequestReference = (props) => {
  const { previewRef, vo, alertPopRef } = props
  const commonContext = useContext(CommonContext)

  const onClickIrPreview = () => {
    exeFunc(previewRef, 'open')
  }
  const onClickDownload = async (id, fileNm) => {
    const item = {
      fileId: id,
      fileNm: fileNm
    }
    await commonContext.actions.callbackAfterSessionRefresh(
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
  return (
    <div className="card_section card02 data_group_wrap">
      <CardLayout>
        <div className="data_list">
          <div className="info_header">
            <h3 className="ico_title">IR 자료</h3>
          </div>
          <div className="table_wrap">
            <table className="table">
              <caption>IR자료 테이블</caption>
              <colgroup>
                <col width={'60%'} />
                <col width={'25%'} />
                <col width={'15%'} />
              </colgroup>
              <thead className="hide">
                <tr>
                  <th>IR</th>
                  <th>날짜</th>
                  <th>조회</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="content">
                    <p>{vo.rqstBplcNm} IR 자료</p>
                  </td>
                  {/*<td className="date">{DateUtils.convertYyyyMmDdHhMmSsKrDate(vo.invmRqstDt)}</td>*/}
                  <td className="date">
                    {DateUtils.customDateFormat(vo.invmRqstDt, 'yyyy년 MM월 dd일 HH시 mm분')}
                    {/*<p dangerouslySetInnerHTML={{*/}
                    {/*    __html: DateUtils.customDateFormat(vo.invmRqstDt, 'yyyy년 MM월 dd일 HH시 mm분')*/}
                    {/*}}/>*/}
                  </td>
                  <td className="preview">
                    {/* {vo?.rqstEnprIrInqYn === CheckYn.YES ? ( 08/08 혁신투자부 최세웅 차장님 요청으로 기간만료 안나타나게 수정
                      <button onClick={onClickIrPreview} style={{ fontSize: '12px' }}>
                        자세히보기
                      </button>
                    ) : (
                      <span>조회기간만료</span>
                    )} */}
                      <button onClick={onClickIrPreview} style={{ fontSize: '12px' }}>
                        자세히보기
                      </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="add_data_wrap">
          <div className="info_header">
            <h3 className="ico_title">추가자료</h3>
          </div>
          <div className="table_wrap">
            <table className="table">
              <caption>추가자료 테이블</caption>
              <colgroup>
                <col width={'60%'} />
                <col width={'25%'} />
                <col width={'15%'} />
              </colgroup>
              <thead>
                <tr className="hide">
                  <th>추가자료</th>
                  <th>날짜</th>
                  <th>조회</th>
                </tr>
              </thead>
              <tbody>
                {!StringUtils.hasLength(vo?.anncDatFileId) &&
                  !StringUtils.hasLength(vo?.addtDocFileId) &&
                  !StringUtils.hasLength(vo?.pbrlPictUrl) && (
                    <tr>
                      <td colSpan={3}>
                        <NoResult msg={'제출된 추가자료 정보가 없습니다.'} />
                      </td>
                    </tr>
                  )}
                {StringUtils.hasLength(vo?.anncDatFileId) && (
                  <tr>
                    <td className="content">
                      <p>{vo.anncDatFileNm}</p>
                    </td>
                    <td className="date">
                      {DateUtils.customDateFormat(vo.invmRqstDt, 'yyyy년 MM월 dd일 HH시 mm분')}
                      {/*<p dangerouslySetInnerHTML={{*/}
                      {/*    __html: DateUtils.customDateFormat(vo.invmRqstDt, 'yyyy년 MM월 dd일 HH시 mm분')*/}
                      {/*}}/>*/}
                    </td>
                    <td className="download">
                      <button onClick={() => onClickDownload(vo.anncDatFileId, vo.anncDatFileNm)}>다운로드</button>
                    </td>
                  </tr>
                )}
                {StringUtils.hasLength(vo?.addtDocFileId) && (
                  <tr>
                    <td className="content">
                      <p>{vo.addtDocFileNm}</p>
                    </td>
                    <td className="date">
                      {DateUtils.customDateFormat(vo.invmRqstDt, 'yyyy년 MM월 dd일 HH시 mm분')}
                      {/*<p dangerouslySetInnerHTML={{*/}
                      {/*    __html: DateUtils.customDateFormat(vo.invmRqstDt, 'yyyy년 MM월 dd일 HH시 mm분')*/}
                      {/*}}/>*/}
                    </td>
                    <td className="download">
                      <button onClick={() => onClickDownload(vo.addtDocFileId, vo.addtDocFileNm)}>다운로드</button>
                    </td>
                  </tr>
                )}
                {StringUtils.hasLength(vo?.pbrlPictUrl) && (
                  <tr>
                    <td className="content">
                      <p>{vo.rqstBplcNm} 홍보자료</p>
                    </td>
                    <td className="date">
                      {DateUtils.customDateFormat(vo.invmRqstDt, 'yyyy년 MM월 dd일 HH시 mm분')}
                      {/*<p dangerouslySetInnerHTML={{*/}
                      {/*    __html: DateUtils.customDateFormat(vo.invmRqstDt, 'yyyy년 MM월 dd일 HH시 mm분')*/}
                      {/*}}/>*/}
                    </td>
                    <td className="preview">
                      <button onClick={() => onClickPictUrl(vo.pbrlPictUrl)}>미리보기</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="docs_wrap">
          <div className="info_header">
            <h3 className="ico_title">간편서류</h3>
          </div>
          <div className="table_wrap">
            <NiceDocTable vo={vo} alertPopRef={alertPopRef} />
          </div>
        </div>
      </CardLayout>
    </div>
  )
}

const NiceDocTable = ({ vo, alertPopRef }) => {
  const commonContext = useContext(CommonContext)
  const list = []

  let papersAtchFlpthNm = ''
  if (vo.infotechDoc.length > 0) {
    let dateSplit = vo.infotechDoc[0].fileNm.split('_')
    let now = new Date()
    let oneMonthAfter = new Date(now.setMonth(now.getMonth() + 2))
    if (dateSplit[0].substr(0, 8) === moment(oneMonthAfter).format('YYYYMMDD')) {
      papersAtchFlpthNm = 'expired'
    } else {
      papersAtchFlpthNm = 'download'
    }
  }

  if (vo.infotechDoc !== null) {
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
    <table className="table">
      <caption>간편서류 테이블</caption>
      <colgroup>
        <col width={'60%'} />
        <col width={'25%'} />
        <col width={'15%'} />
      </colgroup>
      <thead className="hide">
        <tr>
          <th>간편서류</th>
          <th>날짜</th>
          <th>조회</th>
        </tr>
      </thead>
      <tbody>
        {list?.length > 0 ? (
          list.map((docItem, index) => {
            return (
              <tr key={createKey()}>
                <td className="content">
                  <p>{docItem.fileName}</p>
                </td>
                <td className="date">
                  {DateUtils.customDateFormat(docItem.papersPresentnDt, 'yyyy년 MM월 dd일 HH시 mm분')}
                  {/*<p dangerouslySetInnerHTML={{*/}
                  {/*    __html: DateUtils.customDateFormat(docItem.papersPresentnDt, 'yyyy년 MM월 dd일 HH시 mm분')*/}
                  {/*}}/>*/}
                </td>
                <td className={docItem.papersAtchFlpthNm === 'download' ? 'download' : 'content'}>
                  <button
                    onClick={() =>
                      NiceDocUtil.downloadNiceSimpleDoc(docItem, docItem.papersAtchFlpthNm, alertPopRef, commonContext)
                    }
                  >
                    {NiceDocUtil.getDownloadBtnNm(docItem.papersAtchFlpthNm)}
                  </button>
                </td>
              </tr>
            )
          })
        ) : (
          <tr>
            <td colSpan={3}>
              <NoResult msg={'제출된 간편서류 정보가 없습니다.'} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default RequestReference
