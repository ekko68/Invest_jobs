import { Button, useTheme, TextField, MenuItem } from '@mui/material'
import { Link } from 'react-router-dom'
import { BtSelect } from '_pub/components/bt/BtSelect/BtSelect'
import QueryUtils from 'modules/utils/QueryUtils'
import { useState } from 'react'
import NoResult from 'components/common/NoResult'

const Accept_State_List_InvestBusiness = (props) => {
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
          <h3 className={'title'}>나의 출자사업 신청현황</h3>
          <Button disableElevation color="primary" variant="contained" onClick={() => {}}>
            출자사업 공고
          </Button>
        </div>
        <div className="investBusiness_box">
          <div className="investBusiness_searchArea">
            <TextField placeholder={'펀드명으로 검색'} size="small" sx={{ width: '32rem' }} onChange={() => {}} />
            <Button disableElevation color="primary" variant="contained" onClick={() => {}}>
              검색
            </Button>
          </div>
          <div className="investBusiness_sort">
            <BtSelect defaultValue={0}>
              <MenuItem disabled value={0}>
                전체
              </MenuItem>
              <MenuItem value={1}>선정공고</MenuItem>
              <MenuItem value={2}>접수현황</MenuItem>
              <MenuItem value={3}>선정공고</MenuItem>
            </BtSelect>
          </div>
          <table className="investBusiness_list_table">
            <colgroup>
              <col width={'8%'} />
              <col width={''} />
              <col width={'15%'} />
              <col width={'12%'} />
            </colgroup>
            <thead>
              <th>NO.</th>
              <th>제목</th>
              <th>접수일</th>
              <th>진행상태</th>
            </thead>
            <tbody>
              <tr>
                <td className="center">10</td>

                <td>
                  <Link to={'#'}>핀테크 혁신펀드 위탁운용사 선정 결과</Link>
                </td>
                <td className="center">2024-06-11</td>
                <td className="center comp">접수완료</td>
              </tr>
              <tr>
                <td className="center">09</td>
                <td>
                  <Link to={'#'}>핀테크 혁신펀드 위탁운용사 선정 결과</Link>
                </td>
                <td className="center">2024-06-11</td>
                <td className="center comp">접수완료</td>
              </tr>
              <tr>
                <td className="center">08</td>
                <td>
                  <Link to={'#'}>핀테크 혁신펀드 위탁운용사 선정 결과</Link>
                </td>
                <td className="center">2024-06-11</td>
                <td className="center">임시저장</td>
              </tr>
              <tr>
                <td className="center">07</td>
                <td>
                  <Link to={'#'}>핀테크 혁신펀드 위탁운용사 선정 결과</Link>
                </td>
                <td className="center">2024-06-11</td>
                <td className="center">심사중</td>
              </tr>
              <tr>
                <td className="center">06</td>
                <td>
                  <Link to={'#'}>핀테크 혁신펀드 위탁운용사 선정 결과</Link>
                </td>
                <td className="center">2024-06-11</td>
                <td className="center">접수취소</td>
              </tr>
              <tr>
                <td className="center">05</td>
                <td>
                  <Link to={'#'}>핀테크 혁신펀드 위탁운용사 선정 결과</Link>
                </td>
                <td className="center">2024-06-11</td>
                <td className="center comp">심사완료</td>
              </tr>
              <tr>
                <td className="center">04</td>
                <td>
                  <Link to={'#'}>핀테크 혁신펀드 위탁운용사 선정 결과</Link>
                </td>
                <td className="center">2024-06-11</td>
                <td className="center">접수취소</td>
              </tr>
            </tbody>
          </table>

          <div className="pagination_wrap">
            {/* <Paging ref={{ totalPage: 40, startPage: 1, page: 5, prev: true, next: true, endPage: 10 }} onChangePage={onChangePage} onPrev={onChangePage} onNext={onChangePage} /> */}
            <div className="pagination01">
              {/* button + active */}
              <button disabled="true">
                <img src="/images/pagination_left.png" alt="" />
              </button>
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <button>
                <img src="/images/pagination_right.png" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Accept_State_List_InvestBusiness
