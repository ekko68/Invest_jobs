import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import Select from 'components/atomic/Select'
import { FileDownloadOutlined, DoDisturbOnOutlined } from '@mui/icons-material'

const Admin_Accept_State_Detail_InvestBusiness = (props) => {
  const { selectList, onSelectActive } = props

  const searchSelect = useRef(null)
  const defaultSelect = {
    active: 'select00',
    list: [
      { id: 'select00', value: 'select00', label: '선택' },
      { id: 'selectCompRegi', value: 'selectCompRegi', label: '접수완료' },
      { id: 'searchReview', value: 'searchReview', label: '심사중' },
      { id: 'selectCompExam', value: 'selectCompExam', label: '심사완료' }
    ]
  }

  return (
    <PageLayout currentMenu={'invest'} currentCate={'investUser'} currentPage={'bannerList'}>
      <div className="content_inner page_invest_user page_invest_view">
        <div className="page_header">
          <h4 className="page_title">출자사업 접수현황 상세</h4>
        </div>
        <div className="section_header mb_none">
          <p className="section_title">출자사업 개요</p>
        </div>
        <div className="table_wrap">
          <table className="table form_table">
            <caption>출자사업명, 공고일자 를 나타내는 테이블</caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>출자사업명</th>
                <td>핀테크 혁신펀드 위탁운용사 선정</td>
                <th className={'ta_left'}>공고일자</th>
                <td>2024-06-11</td>
              </tr>
            </tbody>
          </table>
          <div className="section_header mb_none">
            <p className="section_title">운용사 정보</p>
          </div>
          <table className="table form_table">
            <caption>
              운영사명, 대표자명, 설립일자, 회사형태, 사업자등록번호,담당자,연락처, 공동GP여부, 공동GP정보 등 정보
              테이블
            </caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>운용사명</th>
                <td>기은캐피탈</td>
                <th className={'ta_left'}>대표자명</th>
                <td>이순신</td>
              </tr>
              <tr>
                <th className={'ta_left'}>설립일자</th>
                <td>2020-01-01</td>
                <th className={'ta_left'}>회사형태</th>
                <td>자산운용사</td>
              </tr>
              <tr>
                <th className={'ta_left'}>사업자등록번호</th>
                <td>123-45-67890</td>
                <th className={'ta_left'}>담당자</th>
                <td>홍길동</td>
              </tr>
              <tr>
                <th className={'ta_left'}>연락처</th>
                <td>010-1234-1234</td>
                <th className={'ta_left'}>이메일</th>
                <td>abc@gmail.com</td>
              </tr>
              <tr>
                <th className={'ta_left'}>공동GP여부</th>
                <td colSpan={3}>Y</td>
              </tr>
              <tr>
                <th className={'ta_left'}>공동GP정보</th>
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
                          <td className="center">OO인베스트</td>
                          <td className="center">이OO</td>
                          <td className="center">2000.01.01</td>
                          <td className="center">111-22-33333</td>
                          <td className="center">김OO</td>
                          <td className="center">010-1111-2222</td>
                          <td className="center">aaa@gmail.com</td>
                        </tr>
                        <tr>
                          <td className="center">OO인베스트</td>
                          <td className="center">이OO</td>
                          <td className="center">2000.01.01</td>
                          <td className="center">111-22-33333</td>
                          <td className="center">김OO</td>
                          <td className="center">010-1111-2222</td>
                          <td className="center">aaa@gmail.com</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="section_header mb_none">
            <p className="section_title">출자제안서 정보</p>
          </div>
          <table className="table form_table">
            <caption>
              지원분야, 조합명, 펀드구분, 회사형태, IBK출자요청액 ,펀드결성규모,존속기간, 출자금 납부방식,
              기준수익률,관리보수,성과보수 , 펀드참여인력, 출자자 모집현황, 주목적 추가항목, 선정우대 항목 등 정보
              테이블
            </caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>지원분야</th>
                <td colSpan={3}>이차전지</td>
              </tr>
              <tr>
                <th className={'ta_left'}>조합명</th>
                <td>기은벤처투자</td>
                <th className={'ta_left'}>펀드구분</th>
                <td>벤처투자조합</td>
              </tr>
              <tr>
                <th className={'ta_left'}>IBK출자요청액(억원)</th>
                <td>1,000</td>
                <th className={'ta_left'}>펀드결성규모(억원)</th>
                <td>10,000</td>
              </tr>
              <tr>
                <th className={'ta_left'}>존속기간(년)</th>
                <td>5</td>
                <th className={'ta_left'}>출자금 납부방식</th>
                <td>분할납</td>
              </tr>
              <tr>
                <th className={'ta_left'}>기준수익률(%)</th>
                <td>19.9</td>
                <th className={'ta_left'}>관리보수(%)</th>
                <td>9.9</td>
              </tr>
              <tr>
                <th className={'ta_left'}>성과보수(%)</th>
                <td colSpan={3}>9.9</td>
              </tr>
              <tr>
                <th className={'ta_left'}>펀드참여인력</th>
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
                          <th scope="col">인력구분</th>
                          <th scope="col">이름</th>
                          <th scope="col">투자 경력(년)</th>
                          <th scope="col">회사번호</th>
                          <th scope="col">휴대폰번호</th>
                          <th scope="col">이메일주소</th>
                        </tr>
                        <tr>
                          <td className="center">OO인베스트</td>
                          <td className="center">대표펀드매니저</td>
                          <td className="center">김OO</td>
                          <td className="center">9.0</td>
                          <td className="center">02-123-4567</td>
                          <td className="center">010-1111-2222</td>
                          <td className="center">aaa@gmail.com</td>
                        </tr>
                        <tr>
                          <td className="center">OO인베스트</td>
                          <td className="center">대표펀드매니저</td>
                          <td className="center">김OO</td>
                          <td className="center">9.0</td>
                          <td className="center">02-123-4567</td>
                          <td className="center">010-1111-2222</td>
                          <td className="center">aaa@gmail.com</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  출자자 모집현황
                  <br />
                  (GP포함)
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
                          <td className="center">OO인베스트</td>
                          <td className="center">OO은행</td>
                          <td className="center">LOI</td>
                          <td className="center">999</td>
                        </tr>
                        <tr>
                          <td className="center">OO인베스트</td>
                          <td className="center">OO은행</td>
                          <td className="center">LOI</td>
                          <td className="center">999</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
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
                          <td className="left">(작성한 추가 항목이 이 곳에 보입니다.)</td>
                        </tr>
                        <tr>
                          <td className="left">(작성한 추가 항목이 이 곳에 보입니다.)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <th className={'ta_left'}>
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
                          <td className="left">(선정우대 내용)</td>
                          <td className="left">(선정우대 상세 내용)</td>
                        </tr>
                        <tr>
                          <td className="left">(선정우대 내용)</td>
                          <td className="left">(선정우대 상세 내용)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="section_header mb_none">
            <p className="section_title">비고(보완내용 등 자유작성)</p>
          </div>
          <table className="table form_table">
            <caption>추가 내용 입력 정보 테이블</caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>추가 내용 입력</th>
                <td colSpan={3}>
                  <textarea
                    readOnly
                    className="textarea textarea_h200"
                    maxLength={''}
                    id=""
                    title="내용"
                    value="작성한 추가 내용이 이 곳에 보입니다 작성한 추가 내용이 이 곳에 보입니다"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="section_header mb_none">
            <p className="section_title">관련 자료 첨부</p>
          </div>

          <table className="table form_table">
            <caption>첨부 파일 정보 테이블</caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>첨부파일</th>
                <td colSpan={3}>
                  <div className="fileAttach_wrap">
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
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="section_header mb_none">
            <p className="section_title">상태</p>
          </div>
          <table className="table form_table">
            <caption>상태 정보 테이블</caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>상태</th>
                <td colSpan={3}>
                  {' '}
                  <Select
                    className="select_sort"
                    optionList={selectList ? selectList : defaultSelect}
                    handleSelectActive={onSelectActive}
                    ref={searchSelect}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => {}}>
            목록
          </Button>
          <Button className={'full_blue'} onClick={() => {}}>
            저장
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Admin_Accept_State_Detail_InvestBusiness
