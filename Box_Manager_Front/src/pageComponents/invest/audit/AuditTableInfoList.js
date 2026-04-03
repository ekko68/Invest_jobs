import Button from 'components/atomic/Button'
import moment from 'moment'
import { useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Api from '../../../modules/consts/Api'
import { excelDownloadIvtByPostConfigOption, getPostConfig } from '../../../modules/utils/CommonUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import AuditResultPopup from '../../../pageComponents/invest/audit/AuditResultPopup'

const AuditTableInfoList = (props) => {
  const { dataList, searchParams, defaultSelect, defaultSelectResult, defaultSelectSort, active } = props
  const history = useHistory();
  const reqParams = {
    searchParams : searchParams,
    defaultSelect : defaultSelect,
    defaultSelectResult : defaultSelectResult,
    defaultSelectSort : defaultSelectSort,
    active : active,
  }
  const [isOpen, setIsOpen] = useState({
    active : false
  })
  const [popParams, setPopParams] = useState({
    info : {},
    amnnTs : ''
  })

  // == 리스트 엑셀다운로드
  const handleExcelDownload = async (gubun) => {
    let startYear = searchParams.searchFromDate.getFullYear().toString()
    let startMonth =
      (searchParams.searchFromDate.getMonth() + 1) < 10
        ? '0' + (searchParams.searchFromDate.getMonth() + 1)
        : searchParams.searchFromDate.getMonth() + 1
    let startDays =
      searchParams.searchFromDate.getDate() < 10
        ? '0' + searchParams.searchFromDate.getDate().toString()
        : searchParams.searchFromDate.getDate().toString()

    let startYmd = startYear + startMonth.toString() + startDays

    let endYear = searchParams.searchToDate.getFullYear().toString()
    let endMonth =
      (searchParams.searchToDate.getMonth() + 1) < 10
        ? '0' + (searchParams.searchToDate.getMonth() + 1)
        : searchParams.searchToDate.getMonth() + 1
    let endDays =
      searchParams.searchToDate.getDate() < 10
        ? '0' + searchParams.searchToDate.getDate().toString()
        : searchParams.searchToDate.getDate().toString()

    let endYmd = endYear + endMonth.toString() + endDays
    
    const params = {
      searchComNm: searchParams.searchComNm,
      searchBzn: searchParams.searchBzn,
      searchFromDate: startYmd,
      searchToDate: endYmd,
      searchType: defaultSelectSort.active,
      page: 1,
      searchResStatus: defaultSelectResult.active,
      searchStatus: defaultSelect.active
    }
    if (gubun === 'list') {
      await excelDownloadIvtByPostConfigOption(
        // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
        getPostConfig(Api.invest.auditExcelList, params, true),
        '투자희망신청현황 목록_' + moment(new Date()).format('YYYYMMDD')
      )
    } else {
      await excelDownloadIvtByPostConfigOption(
        // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
        getPostConfig(Api.invest.auditExcelDetail, params, true),
        '투자희망신청현황 상세목록_' + moment(new Date()).format('YYYYMMDD')
      )
    }
  }

  const onClickPopup = (val)=> {
    setIsOpen({ ...isOpen , active: true})
    setPopParams({
      ...popParams,
      info : val,
      amnnTs : val.amnnTs
    })
  }

  return (
    <>
      {isOpen.active && (
        <AuditResultPopup
          activeOption={isOpen.active}
          amnnTs={popParams.amnnTs}
          params={popParams}
          close={() => setIsOpen({ ...isOpen , active: false})}
        />
      )}
      <div className={'table_wrap table_th_border'}>
        <table className="table type02">
          <caption>투자희망 신청 결과 테이블</caption>
          <colgroup>
            <col width={'10%'} />
            <col width={'10%'} />
            <col width={'15%'} />
            <col width={'10%'} />
            <col width={'8%'} />
            <col width={'8%'} />
            <col width={'8%'} />
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>신청일자</th>
              <th>기업명</th>
              <th>사업자번호</th>
              <th>신청서</th>
              <th>상태</th>
              <th>심사결과</th>
            </tr>
          </thead>
          <tbody>
            {dataList?.length > 0 ? (
              dataList?.map((item, index) => (
                <>
                  <tr key={index + 1}>
                    <td className={'ta_center'}>{index + 1}</td>
                    <td className={'ta_center'}>{item.invmSttgDt}</td>
                    <td className={'ta_center'}>{item.rqstBplcNm}</td>
                    <td className={'ta_center'}>{item.bzn}</td>
                    <td className={'ta_center'}>
                      <a
                        className="btn_link"
                        onClick={() => {
                          history.push(ROUTER_NAMES.INVEST_AUDIT_INFO_DETAIL + '/' + item.invmExntRqstId, reqParams)
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        상세보기
                      </a>
                    </td>
                    <td className={'ta_center'}>{item.invmExntPgsgNm}</td>
                    <td className={'ta_center'}>
                      <Link className="btn_link" onClick={() => onClickPopup(item)}>
                        {item.exntRsltCd !== null && item.exntRsltCdNm}
                        {item.exntRsltCd === null && item.invmExntPgsgNm}
                      </Link>
                    </td>
                    {/* <td className={'ta_center'}>{item.brcd}</td> */}
                  </tr>
                </>
              ))
            ) : (
              <>
                <td colSpan={10} className={'ta_center'}>
                  조회된 내역이 없습니다.
                </td>
              </>
            )}
          </tbody>
          <tfoot className={'tfoot_button'}>
            <tr>
              <td className={'ta_right'} colSpan={10}>
                <div className="total_wrap">
                  {/* <Button className={'btn_excel basic'} onClick={() => {}}>
                    현황 다운로드
                  </Button> */}
                  <Button
                    className={'btn_excel basic'}
                    onClick={() => {
                      handleExcelDownload('list')
                    }}
                  >
                    세부내용 저장
                  </Button>
                  <Button
                    className={'btn_excel basic'}
                    onClick={() => {
                      handleExcelDownload('detail')
                    }}
                  >
                    목록 저장
                  </Button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
  // }
}

export default AuditTableInfoList
