import NoResult from 'components/NoResult'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import Button from 'components/atomic/Button'
import { StringUtils } from 'modules/utils/StringUtils'
const EventDetailList = (props) => {
  const { data, getStatusParams, evntStatus } = props
  const codeTranslate = {
    GDS00001: '판매중',
    GDS00007: '판매대기',
    GDS08001: 'BOX POS 결제',
    GDS08002: '견적 요청 받기',
    GDS08003: '일반 결제(계좌이체)',
    ETS01001: '승인', // 데이터 베이스 상으로는 접수코드 이나 화면에 보여질때는 클릭했을때 변경되는 상태를 보여줌
    ETS01002: '승인 취소' // 데이터 베이스 상으로는 선정코드 이나 화면에 보여질때는 클릭했을때 변경되는 상태를 보여줌
  }

  const handleStatus = (item) => {
    let paramspcsnsttsId = ''
    if (item.pcsnsttsId == 'ETS01001') paramspcsnsttsId = 'ETS01002'
    else if (item.pcsnsttsId == 'ETS01002') paramspcsnsttsId = 'ETS01003'
    const selectedstatusParams = {
      evntInfId: item.evntInfId,
      pdfInfoId: item.pdfInfoId,
      pcsnsttsId: paramspcsnsttsId
    }
    getStatusParams(selectedstatusParams)
  }

  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>상품명, 소분류 / 세분류, 판매가, 상태 정보 , 판매 정책, 순서 변경 테이블</caption>
          <colgroup>
            <col width={'25%'} />
            <col width={'15%'} />
            <col width={'15%'} />
            <col width={'10%'} />
            <col width={'20%'} />
            <col width={'15%'} />
          </colgroup>
          <thead>
            <tr key={'banner_board_header'}>
              <th>상품명</th>
              <th>소분류 / 세분류</th>
              <th>판매가</th>
              <th>상태</th>
              <th>판매 정책</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.isLoading ? (
              <Skeleton type="list" count={10} colSpan={7} />
            ) : data.list.length > 0 ? (
              data.list.map((item, idx) => (
                <tr key={'banner_board_item_' + idx}>
                  <td className={'ta_center'}> {item.pdfNm}</td>
                  <td className={'ta_center'}>
                    {item.ctgyDataMid} / {item.ctgyDataSm}
                  </td>
                  <td className={'ta_center'}>
                    {item.pdfPrc === null ? '가격 확인 필요' : StringUtils.comma(item.pdfPrc)}
                    {item.pdfPrc && item.dscnUt !== null ? item.dscnUt : ''}
                  </td>
                  <td className={'ta_center'}>{codeTranslate[item.pdfSttsId]}</td>
                  <td className={'ta_center'}>
                    {item.salePolicy.trim() === ''
                      ? '정책 미정'
                      : item.salePolicy.split(',').map((item) => {
                          return codeTranslate[item] + '\n'
                        })}
                  </td>
                  <td className={'ta_center'}>
                    <Button
                      className="grayLine"
                      onClick={() => handleStatus(item)}
                      disabled={evntStatus == '종료' ? true : false}
                    >
                      {codeTranslate[item.pcsnsttsId]}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={'ta_center'} colSpan={7}>
                  <NoResult msg={`데이터가 없습니다.`} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default EventDetailList
