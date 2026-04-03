import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from '_pub/modules/consts/RouterConst'
import { Button, MenuItem, TextField, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { DescriptionOutlined, FileDownloadOutlined } from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { BtSelect } from '_pub/components/bt/BtSelect/BtSelect'

const Accept_State_Detail_InvestBusiness = () => {
  return (
    <>
      {/* Contents */}
      <div className="investBusiness_container investBusiness_accept">
        <div className="section_header">
          <h3 className={'title'}>출자사업 접수</h3>
        </div>
        <div className="investBusiness_box">
          <h3 className="accept_title">출자사업 개요</h3>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>출자사업명</th>
                <td>핀테크 혁신펀드 위탁운용사 선정</td>
                <th>공고일자</th>
                <td>2024-06-11</td>
              </tr>
            </tbody>
          </table>
          <h3 className="accept_title">운용사 정보</h3>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>
                  운용사명
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>기은캐피탈</td>
                <th>
                  대표자명
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>이순신</td>
              </tr>

              <tr>
                <th>
                  설립일자
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>2020-01-01</td>
                <th>
                  회사 형태
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>자산운용사</td>
              </tr>

              <tr>
                <th>
                  사업자등록번호
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>123-45-67890</td>
                <th>
                  담당자
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>홍길동</td>
              </tr>

              <tr>
                <th>
                  연락처
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>010-1234-1234</td>
                <th>
                  이메일
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>abc@gmail.com</td>
              </tr>

              <tr>
                <th>
                  공동GP여부
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>Y</td>
              </tr>

              <tr>
                <th>
                  공동GP정보
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">공동GP명</th>
                          <th scope="col">대표자명</th>
                          <th scope="col">설립일자</th>
                          <th scope="col">사업자등록번호</th>
                          <th scope="col">담당자</th>
                          <th scope="col">연락처</th>
                          <th scope="col">이메일</th>
                        </tr>
                        <tr>
                          <td>OO인베스트</td>
                          <td>이OO</td>
                          <td>2000.01.01</td>
                          <td>111-22-33333</td>
                          <td>김OO</td>
                          <td>010-1111-2222</td>
                          <td>aaa@gmail.com</td>
                        </tr>
                        <tr>
                          <td>OO인베스트</td>
                          <td>이OO</td>
                          <td>2000.01.01</td>
                          <td>111-22-33333</td>
                          <td>김OO</td>
                          <td>010-1111-2222</td>
                          <td>aaa@gmail.com</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 className="accept_title">출자제안서 정보</h3>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>지원분야</th>
                <td colSpan="3">이차전지</td>
              </tr>
              <tr>
                <th>
                  조합명
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>기은벤처투자</td>
                <th>
                  펀드구분
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>벤처투자조합</td>
              </tr>
              <tr>
                <th>
                  IBK출자요청액(억원)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>1,000</td>
                <th>
                  펀드결성규모(억원)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>1,000</td>
              </tr>
              <tr>
                <th>
                  존속기간(년)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>5</td>
                <th>
                  출자금 납부방식
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>분할납</td>
              </tr>
              <tr>
                <th>
                  기준수익률(%)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>19.9</td>
                <th>
                  관리보수(%)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>9.9</td>
              </tr>
              <tr>
                <th>
                  성과보수(%)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>9.9</td>
              </tr>

              <tr>
                <th>
                  펀드참여인력
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">GP명</th>
                          <th scope="col">인력구분</th>
                          <th scope="col">이름</th>
                          <th scope="col">투자경력(년)</th>
                          <th scope="col">대표번호</th>
                          <th scope="col">휴대폰번호</th>
                          <th scope="col">이메일주소</th>
                        </tr>
                        <tr>
                          <td>OO인베스트</td>
                          <td>대표펀드매니저</td>
                          <td>이OO</td>
                          <td>14.5</td>
                          <td>02-123-4567</td>
                          <td>010-1234-5678</td>
                          <td>aaa@gmail.com</td>
                        </tr>
                        <tr>
                          <td>OO인베스트</td>
                          <td>대표펀드매니저</td>
                          <td>이OO</td>
                          <td>14.5</td>
                          <td>02-123-4567</td>
                          <td>010-1234-5678</td>
                          <td>aaa@gmail.com</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <th>
                  출자자 모집현황
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                  <br />
                  (GP 포함)
                  <div className="th_guide_text">관련자료 첨부 필수</div>
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">GP명</th>
                          <th scope="col">발급기관명</th>
                          <th scope="col">진행단계</th>
                          <th scope="col">출자금액(억원)</th>
                        </tr>
                        <tr>
                          <td>OO인베스트</td>
                          <td>OO은행</td>
                          <td>LOI</td>
                          <td>999</td>
                        </tr>
                        <tr>
                          <td>OO인베스트</td>
                          <td>OO은행</td>
                          <td>LOI</td>
                          <td>999</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <th>
                  주목적 추가항목
                  <br />
                  (선택입력사항)
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>(작성한 추가 항목이 이 곳에 보입니다.)</td>
                        </tr>
                        <tr>
                          <td>(작성한 추가 항목이 이 곳에 보입니다.)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <th>
                  선정우대 항목
                  <br />
                  (선택입력사항)
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">선정우대 내용</th>
                          <th scope="col">상세 내용</th>
                        </tr>
                        <tr>
                          <td>(선정우대 내용)</td>
                          <td>(선정우대 상세 내용)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 className="accept_title">비고(보완내용 등 자유작성)</h3>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>
                  추가 내용 입력
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>
                  <div className="textarea_view">
                    작성한 추가 내용이 이 곳에 보입니다작성한 추가 내용이 이 곳에 보입니다작성한 추가 내용이 이 곳에
                    보입니다
                    <br />
                    작성한 추가 내용이 이 곳에 보입니다작성한 추가 내용이 이 곳에 보입니다 작성한 추가 내용이 이 곳에
                    보입니다작성한 추가 내용이 이 곳에 보입니다작성한 추가 내용이 이 곳에 보입니다
                    <br />
                    작성한 추가 내용이 이 곳에 보입니다작성한 추가 내용이 이 곳에 보입니다 작성한 추가 내용이 이 곳에
                    보입니다작성한 추가 내용이 이 곳에 보입니다작성한 추가 내용이 이 곳에 보입니다
                    <br />
                    작성한 추가 내용이 이 곳에 보입니다작성한 추가 내용이 이 곳에 보입니다 작성한 추가 내용이 이 곳에
                    보입니다작성한 추가 내용이 이 곳에 보입니다작성한 추가 내용이 이 곳에 보입니다
                    <br />
                    작성한 추가 내용이 이 곳에 보입니다작성한 추가 내용이 이 곳에 보입니다 작성한 추가 내용이 이 곳에
                    보입니다작성한 추가 내용이 이 곳에 보입니다작성한 추가 내용이 이 곳에 보입니다
                    <br />
                    작성한 추가 내용이 이 곳에 보입니다작성한 추가 내용이 이 곳에 보입니다
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 className="accept_title">관련 자료 첨부</h3>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>
                  파일 첨부
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>
                  <ul className="fileAttach_list">
                    <li className="fileAttach_item">
                      <button type="button" className="fileAttach_download">
                        <FileDownloadOutlined className="fileAttach_download_icon" />
                        위탁운용사_선정계획_공고.pdf
                      </button>
                    </li>
                    <li className="fileAttach_item">
                      <button type="button" className="fileAttach_download">
                        <FileDownloadOutlined className="fileAttach_download_icon" />
                        선정요건.pdf
                      </button>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="bottom_buttons">
            <Button size="large" variant="outlined" disableElevation>
              접수 취소
            </Button>
            <Button size="large" variant="contained" disableElevation>
              목록으로
            </Button>
          </div>
        </div>
      </div>

      {/* End of Contents */}
    </>
  )
}

export default Accept_State_Detail_InvestBusiness
