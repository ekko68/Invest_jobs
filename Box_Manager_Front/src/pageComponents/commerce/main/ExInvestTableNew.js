import NoResult from 'components/NoResult'
import Button from 'components/atomic/Button'
import { Link } from 'react-router-dom'
const ExBannerTableNew = (props) => {
  const { dataList } = props

  // if (!dataList || dataList.length === 0) {
  //   return (
  //     <div className="table_no_result">
  //       <NoResult msg={`데이터가 없습니다.`} />
  //     </div>
  //   )
  // } else {
  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>투자희망 신청 결과 테이블</caption>
          <colgroup>
            <col width={'10%'} />
            <col width={'10%'} />
            <col width={'15%'} />
            <col width={'15%'} />
            <col width={'*'} />
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
              <th>업종</th>
              <th>신청서</th>
              <th>상태</th>
              <th>심사결과</th>
              <th>추천 영업점</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={'ta_center'}>C0040594-23001</td>
              <td className={'ta_center'}>2024-05-22</td>
              <td className={'ta_center'}>(주)진솔</td>
              <td className={'ta_center'}>1108147859</td>
              <td className={'ta_center'}>의료용품 및 기타 의약 관련제품 제조</td>
              <td className={'ta_center'}>
                <Link className="btn_link" to={'#'}>
                  상세보기
                </Link>
              </td>
              <td className={'ta_center'}>심사중</td>
              <td className={'ta_center'}>
                <Link className="btn_link" to={'#'}>
                  심사중
                </Link>
              </td>
              <td className={'ta_center'}>을지로</td>
            </tr>
          </tbody>
          <tfoot className={'tfoot_button'}>
            <tr>
              <td className={'ta_right'} colSpan={9}>
                <div className="total_wrap">
                  <Button className={'btn_excel basic'} onClick={() => {}}>
                    현황 다운로드
                  </Button>
                  <Button className={'btn_excel basic'} onClick={() => {}}>
                    세부내용 저장
                  </Button>
                  <Button className={'btn_excel basic'} onClick={() => {}}>
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

export default ExBannerTableNew
