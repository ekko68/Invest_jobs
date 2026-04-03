import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Checkbox from 'components/atomic/Checkbox'
import TextInput from 'components/atomic/TextInput'
import InputImageFile from 'components/atomic/ImageFile'

const Admin_Invest_Detail = (props) => {
  const { onUploadImageFile, onDeleteImageFile, images } = props
  const [confirmDelete, setConfirmDelete] = useState(false)

  const typeCheckboxList = [
    { id: 'check_all', value: '전체', status: true },
    { id: 'check_sale', value: '판매', status: true },
    { id: 'check_sale_no', value: '판매 박탈', status: true }
  ]

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">신청상세내역</h4>
        </div>
        <div className="invest_content_wrap">
          <div className={'maximum_notice'}>
            <p className="highlight_grey">
              투자유치를 희망하는 기업의 신청 상세 내역입니다. 스탭을 클릭해 상태를 변경할 수 있습니다.
            </p>
          </div>
          {/* 상태에 따라 step 에 step01, step02 클래스 추가됨 */}
          <div className="step">
            <ul>
              <li className="step_item">
                <Link to={'#'}>
                  <span>신청</span>
                </Link>
              </li>
              <li className="step_item">
                <Link to={'#'}>
                  <span>심사중</span>
                </Link>
              </li>
              <li className="step_item">
                <Link to={'#'}>
                  <span>심사완료</span>
                </Link>
              </li>
            </ul>
          </div>
          {/* CASE 01:  step01 */}
          <div className="step step01">
            <ul>
              <li className="step_item">
                <Link to={'#'}>
                  <span>신청</span>
                </Link>
              </li>
              <li className="step_item">
                <Link to={'#'}>
                  <span>심사중</span>
                </Link>
              </li>
              <li className="step_item">
                <Link to={'#'}>
                  <span>심사완료</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* CASE 02:  step02 */}
          <div className="step step02">
            <ul>
              <li className="step_item">
                <Link to={'#'}>
                  <span>신청</span>
                </Link>
              </li>
              <li className="step_item">
                <Link to={'#'}>
                  <span>심사중</span>
                </Link>
              </li>
              <li className="step_item">
                <Link to={'#'}>
                  <span>심사완료</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* CASE 03:  step03 */}
          <div className="step step03">
            <ul>
              <li className="step_item">
                <Link to={'#'}>
                  <span>신청</span>
                </Link>
              </li>
              <li className="step_item">
                <Link to={'#'}>
                  <span>심사중</span>
                </Link>
              </li>
              <li className="step_item">
                <Link to={'#'}>
                  <span>심사완료</span>
                </Link>
              </li>
            </ul>
          </div>
          {/*table_wrap start*/}
          <h4 className="table_invest_title">기업프로필</h4>
          <div className="invest_table_wrap">
            <table className="table_invest_coporation">
              <caption>기업명, 사업자등록번호, 업종코드, 주소, 기업소개 등 정보 테이블</caption>
              <colgroup>
                <col width={'20%'} />
                <col width={'30%'} />
                <col width={'20%'} />
                <col width={'30%'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>기업명</th>
                  <td>(주)코스앤바이오</td>
                  <th>사업자등록번호</th>
                  <td>2198130465</td>
                </tr>
                <tr>
                  <th>업종코드</th>
                  <td>J58221</td>
                  <th>업종</th>
                  <td>시스템 소프트웨어 개발 및 공급업</td>
                </tr>

                <tr>
                  <th>주소</th>
                  <td colSpan={3}>경기 성남시 분당구 장미로 42, 407호</td>
                </tr>

                <tr>
                  <th>기업소개</th>
                  <td colSpan={3}>
                    우리 회사는 4차산업혁명 분야중 DNA(Data, Network, AI) 영역에 속하는 AI기반 네트워크 트래픽
                    분석솔루션을 개발하고 있는 회사입니다.{' '}
                  </td>
                </tr>

                <tr>
                  <th>비즈니스 분야</th>
                  <td>방송/통신</td>
                  <th>활용기술</th>
                  <td>AI, 빅데이터, 클라우드, 플랫폼</td>
                </tr>

                <tr>
                  <th>홈페이지</th>
                  <td>
                    <Link to={'#'}>www.lampad.co.kr</Link>
                  </td>
                  <th>직원수</th>
                  <td>9명</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="table_invest_title_small">주식정보</h3>
          <div className="invest_table_wrap">
            <table className="table_invest_coporation">
              <caption>총발행주식수, 자본금 등 정보 테이블</caption>
              <colgroup>
                <col width={'20%'} />
                <col width={'30%'} />
                <col width={'20%'} />
                <col width={'30%'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>총발행주식수</th>
                  <td>3,000,000주</td>
                  <th>자본금</th>
                  <td>300,000,000원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="table_invest_title_small">주주정보</h3>
          <div className="invest_table_wrap">
            <table className="table_invest_coporation table_center">
              <caption>주주명, 생년월일,보유주식수, 보유비율 정보 테이블</caption>
              <colgroup>
                <col width={'19%'} />
                <col width={'27%'} />
                <col width={'27%'} />
                <col width={'27%'} />
              </colgroup>
              <thead>
                <tr>
                  <th>주주명</th>
                  <th>생년월일</th>
                  <th>보유주식수</th>
                  <th>보유비율</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>김신규</td>
                  <td>1974.01.07</td>
                  <td>292,500,000주</td>
                  <td>9750%</td>
                </tr>
                <tr>
                  <td>홍길동</td>
                  <td>1974.01.07</td>
                  <td>292,500,000주</td>
                  <td>9750%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="table_space_title">투자정보</h4>
          <div className="invest_table_wrap">
            <table className="table_invest_coporation">
              <caption>희망기관, 희망 투자 단계, 희망 유치 금액 정보 테이블</caption>
              <colgroup>
                <col width={'20%'} />
                <col width={'30%'} />
                <col width={'20%'} />
                <col width={'30%'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>희망기관</th>
                  <td>IBK금융그룹</td>
                  <th>희망 투자 단계</th>
                  <td>시리즈A</td>
                </tr>
                <tr>
                  <th>희망 유치 금액</th>
                  <td colSpan={3}>500,000,000원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="table_invest_title_small">기존 투자 유치 정보</h3>
          <div className="invest_table_wrap">
            <table className="table_invest_coporation table_center">
              <caption>투자일자, 투자기관, 투자액, 기업가치, 투자단계 정보 테이블</caption>
              <colgroup>
                <col width={'20%'} />
                <col width={'20%'} />
                <col width={'20%'} />
                <col width={'20%'} />
                <col width={'20%'} />
              </colgroup>
              <thead>
                <tr>
                  <th>투자일자</th>
                  <th>투자기관</th>
                  <th>기업가치</th>
                  <th>보유비율</th>
                  <th>투자단계</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1974.01.07</td>
                  <td>기업은행</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="table_invest_title_small">제출서류</h3>
          <Checkbox
            className="check_all_document"
            checkbox={{ id: 'check_table_all', value: '전체', status: true }}
            onChange={() => {}}
          />
          <div className="invest_table_wrap">
            <table className="table_invest_coporation table_document">
              <caption>IR 자료, 법인등기부등본, 사업자등록증명 등 기타 서류 정보 테이블</caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'35%'} />
                <col width={'15%'} />
                <col width={'35%'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>
                    <Checkbox checkbox={{ id: 'check_ir01', value: 'IR 자료', status: true }} onChange={() => {}} />
                  </th>
                  <td>
                    <Checkbox
                      checkbox={{ id: 'check_ir02', value: '기업자료_IR자료.pptx', status: true }}
                      onChange={() => {}}
                    />
                  </td>
                  <th>
                    <Checkbox checkbox={{ id: 'check_docu01', value: '기타자료', status: true }} onChange={() => {}} />
                  </th>
                  <td>
                    <Checkbox
                      checkbox={{ id: 'check_docu02', value: '기업자료_IR자료.pptx', status: true }}
                      onChange={() => {}}
                    />
                  </td>
                </tr>

                <tr>
                  <th>
                    <Checkbox
                      checkbox={{ id: 'check_copy01', value: '법인등기부등본', status: true }}
                      onChange={() => {}}
                    />
                  </th>
                  <td>
                    <Checkbox checkbox={{ id: 'check_copy02', value: '등본.pptx', status: true }} onChange={() => {}} />
                  </td>
                  <th>
                    <Checkbox
                      checkbox={{ id: 'check_certificate01', value: '사업자등록증명', status: true }}
                      onChange={() => {}}
                    />
                  </th>
                  <td>
                    <Checkbox
                      checkbox={{ id: 'check_certificate02', value: '사업자등록증명', status: true }}
                      onChange={() => {}}
                    />
                  </td>
                </tr>

                <tr>
                  <th>
                    <Checkbox
                      checkbox={{ id: 'check_financial01', value: '표준재무제표증명', status: true }}
                      onChange={() => {}}
                    />
                  </th>
                  <td>
                    <Checkbox
                      checkbox={{ id: 'check_financial02', value: '2023-06-27', status: true }}
                      onChange={() => {}}
                    />
                    <Checkbox
                      checkbox={{ id: 'check_financial03', value: '2026-06-27', status: true }}
                      onChange={() => {}}
                    />
                    <Checkbox
                      checkbox={{ id: 'check_financial04', value: '2027-06-27', status: true }}
                      onChange={() => {}}
                    />
                  </td>
                  <th>
                    <Checkbox checkbox={{ id: 'check_tax01', value: '납세증명', status: true }} onChange={() => {}} />
                  </th>
                  <td>
                    <Checkbox
                      checkbox={{ id: 'check_tax02', value: '납세증명.png', status: true }}
                      onChange={() => {}}
                    />
                  </td>
                </tr>

                <tr>
                  <th>
                    <Checkbox
                      checkbox={{ id: 'check_corporate1', value: '법인세 신고내역', status: true }}
                      onChange={() => {}}
                    />
                  </th>
                  <td>
                    <Checkbox
                      checkbox={{ id: 'check_corporate2', value: '2023-06-27', status: true }}
                      onChange={() => {}}
                    />
                    <Checkbox
                      checkbox={{ id: 'check_corporate3', value: '2026-06-27', status: true }}
                      onChange={() => {}}
                    />
                    <Checkbox
                      checkbox={{ id: 'check_corporate4', value: '2027-06-27', status: true }}
                      onChange={() => {}}
                    />
                  </td>
                  <th>
                    <Checkbox
                      checkbox={{ id: 'check_vat01', value: '부가가치세 신고내역', status: true }}
                      onChange={() => {}}
                    />
                  </th>
                  <td>
                    <Checkbox checkbox={{ id: 'check_vat02', value: '2023-06-27', status: true }} onChange={() => {}} />
                    <Checkbox checkbox={{ id: 'check_vat03', value: '2024-06-27', status: true }} onChange={() => {}} />
                    <Checkbox checkbox={{ id: 'check_vat04', value: '2025-06-27', status: true }} onChange={() => {}} />
                    <Checkbox checkbox={{ id: 'check_vat02', value: '2026-06-27', status: true }} onChange={() => {}} />
                    <Checkbox checkbox={{ id: 'check_vat03', value: '2027-06-27', status: true }} onChange={() => {}} />
                    <Checkbox checkbox={{ id: 'check_vat04', value: '2028-06-27', status: true }} onChange={() => {}} />
                  </td>
                </tr>

                <tr>
                  <th>
                    <Checkbox
                      checkbox={{ id: 'check_local01', value: '지방세 납세증명', status: true }}
                      onChange={() => {}}
                    />
                  </th>
                  <td>
                    <Checkbox
                      checkbox={{ id: 'check_local02', value: '2023-06-27', status: true }}
                      onChange={() => {}}
                    />
                    <Checkbox
                      checkbox={{ id: 'check_local03', value: '2026-06-27', status: true }}
                      onChange={() => {}}
                    />
                    <Checkbox
                      checkbox={{ id: 'check_local04', value: '2027-06-27', status: true }}
                      onChange={() => {}}
                    />
                  </td>
                  <th>
                    <Checkbox
                      checkbox={{
                        id: 'check_bysource01',
                        value: '매출처별 및 매입 처별 세금계산서 합계표',
                        status: true
                      }}
                      onChange={() => {}}
                    />
                  </th>
                  <td>
                    <Checkbox
                      checkbox={{ id: 'check_bysource01', value: '매출처별.png', status: true }}
                      onChange={() => {}}
                    />
                  </td>
                </tr>

                <tr>
                  <th>
                    <Checkbox
                      checkbox={{ id: 'check_yearend01', value: '원천징수이행상황 신고서(연말분)', status: true }}
                      onChange={() => {}}
                    />
                  </th>
                  <td>
                    <Checkbox
                      checkbox={{ id: 'check_yearend02', value: '2023-06-27', status: true }}
                      onChange={() => {}}
                    />
                    <Checkbox
                      checkbox={{ id: 'check_yearend03', value: '2026-06-27', status: true }}
                      onChange={() => {}}
                    />
                    <Checkbox
                      checkbox={{ id: 'check_yearend04', value: '2027-06-27', status: true }}
                      onChange={() => {}}
                    />
                  </td>
                  <th>
                    <Checkbox
                      checkbox={{
                        id: 'check_endOfMonth01',
                        value: '원천징수이행상황 신고서(최근월말)',
                        status: true
                      }}
                      onChange={() => {}}
                    />
                  </th>
                  <td>
                    <Checkbox
                      checkbox={{
                        id: 'check_endOfMonth02',
                        value: '원천징수이행상황 신고서(최근월말)',
                        status: true
                      }}
                      onChange={() => {}}
                    />
                  </td>
                </tr>

                <tr>
                  <th>
                    <Checkbox
                      checkbox={{ id: 'check_standards01', value: '부가가치세 과세 표준증명', status: true }}
                      onChange={() => {}}
                    />
                  </th>
                  <td>
                    <Checkbox
                      checkbox={{ id: 'check_standards02', value: '2023-06-27', status: true }}
                      onChange={() => {}}
                    />
                  </td>
                  <th></th>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <div className="download_buttonArea">
              <Button className={'file_download_button grayLine'} onClick={() => {}}>
                선택 다운로드
              </Button>
            </div>
          </div>

          <div className="invest_table_wrap">
            <table className="table_invest_coporation">
              <caption>담당자명, 연락처, 부서, 진행 안내 채널 정보테이블</caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'35%'} />
                <col width={'15%'} />
                <col width={'35%'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>담당자명</th>
                  <td>박담당 대리</td>
                  <th>연락처</th>
                  <td>010-2345-4667</td>
                </tr>
                <tr>
                  <th>부서</th>
                  <td>경영지원</td>
                  <th>진행 안내 채널</th>
                  <td>문자, 앱PUSH, 이메일</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="invest_table_wrap">
            <table className="table_invest_coporation">
              <caption>추천 영업점, 추천 직원 정보테이블</caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'35%'} />
                <col width={'15%'} />
                <col width={'35%'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>추천 영업점</th>
                  <td>
                    답십리(0015)
                    <Button className={'graySmallButton'} onClick={() => {}}>
                      수정
                    </Button>
                    <Button className={'graySmallButton'} onClick={() => {}}>
                      초기화
                    </Button>
                  </td>
                  <th>추천 직원</th>
                  <td>홍길동(022078)</td>
                </tr>
              </tbody>
            </table>
            <div className="download_buttonArea">
              <Button className={'grayLine'} onClick={() => {}}>
                인쇄
              </Button>
            </div>
          </div>

          <div className="rounded_btn_group">
            <Button className={'btn_download basic'} onClick={() => {}}>
              목록
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Admin_Invest_Detail
