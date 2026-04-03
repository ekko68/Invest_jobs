import { Button, useTheme, TextField, MenuItem } from '@mui/material'
import QueryUtils from 'modules/utils/QueryUtils'
import { useState } from 'react'
import { FileDownloadOutlined } from '@mui/icons-material'
const Notice_Detail_InvestBusiness = (props) => {
  const theme = useTheme()
  // 페이징
  const onChangePage = (pageNumber) => {
    pageReload(pageNumber)
  }

  const [searchInput, setSearchInput] = useState(QueryUtils.getQuery(props).fundNm) // 검색
  return (
    <>
      <div className="investBusiness_container">
        <div className="section_header">
          <h3 className={'title'}>출자사업 공고</h3>
          <Button disableElevation color="primary" variant="contained" onClick={() => {}}>
            공유링크 복사
          </Button>
        </div>
        <div className="investBusiness_box">
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
              <tr>
                <th>제안서 접수마감일</th>
                <td>2024-06-00</td>
                <th>대표연락처</th>
                <td>070-1234-1234</td>
              </tr>
              <tr>
                <td colSpan={4} className="td_view">
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="10%" />
                        <col width="" />
                        <col width="30%" />
                        <col width="20%" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">구분</th>
                          <th scope="col">지원분야</th>
                          <th scope="col">IBK출자금액(억원)</th>
                          <th scope="col">선정운용사수</th>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td className="left">이차전지, 초기기업</td>
                          <td>999</td>
                          <td>2~4</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td className="left">ESG</td>
                          <td>999</td>
                          <td>2~4</td>
                        </tr>
                      </tbody>
                    </table>
                    <ul className="td_view_list">
                      <li>첨부 자료와 같이 위탁운용사 선정계획을 공고합니다.</li>
                      <li>첨부 자료와 같이 위탁운용사 선정계획을 공고합니다.</li>
                      <li>첨부 자료와 같이 위탁운용사 선정계획을 공고합니다.</li>
                      <li>첨부 자료와 같이 위탁운용사 선정계획을 공고합니다.</li>
                      <li>첨부 자료와 같이 위탁운용사 선정계획을 공고합니다.</li>
                      <li>첨부 자료와 같이 위탁운용사 선정계획을 공고합니다.</li>
                    </ul>
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
          <div className="bottom_buttons">
            <Button size="large" className="gray_button" variant="contained" disableElevation>
              목록
            </Button>
            <Button size="large" variant="contained" disableElevation>
              접수하기
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Notice_Detail_InvestBusiness
