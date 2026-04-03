import { Button, useTheme, TextField, MenuItem } from '@mui/material'
import { Link } from 'react-router-dom'
import { BtSelect } from '_pub/components/bt/BtSelect/BtSelect'
import QueryUtils from 'modules/utils/QueryUtils'
import { useState } from 'react'
import NoResult from 'components/common/NoResult'
import Paging from 'pageComponents/common/Paging'

const Notice_List_InvestBusiness = (props) => {
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
            나의 신청현황
          </Button>
        </div>
        <div className="investBusiness_box">
          <div className="investBusiness_searchArea">
            <TextField placeholder={'제목 검색'} size="small" sx={{ width: '32rem' }} onChange={() => {}} />
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
              <col width={'12%'} />
              <col width={''} />
              <col width={'15%'} />
            </colgroup>
            <thead>
              <th>NO.</th>
              <th></th>
              <th>제목</th>
              <th>작성일</th>
            </thead>
            <tbody>
              <tr>
                <td className="center">10</td>
                <td>선정결과</td>
                <td>
                  <Link to={'#'}>핀테크 혁신펀드 위탁운용사 선정 결과</Link>
                </td>
                <td className="center">2024-06-11</td>
              </tr>
              <tr>
                <td className="center">09</td>
                <td>접수현황</td>
                <td>
                  <Link to={'#'}>핀테크 혁신펀드 위탁운용사 선정 결과</Link>
                </td>
                <td className="center">2024-06-11</td>
              </tr>
              <tr>
                <td className="center">08</td>
                <td>선정결과</td>
                <td>
                  <Link to={'#'}>핀테크 혁신펀드 위탁운용사 선정 결과</Link>
                </td>
                <td className="center">2024-06-11</td>
              </tr>
              <tr>
                <td className="center">07</td>
                <td>접수현황</td>
                <td>
                  <Link to={'#'}>핀테크 혁신펀드 위탁운용사 선정 결과</Link>
                </td>
                <td className="center">2024-06-11</td>
              </tr>
              <tr>
                <td className="center">06</td>
                <td>접수현황</td>
                <td>
                  <Link to={'#'}>핀테크 혁신펀드 위탁운용사 선정 결과</Link>
                </td>
                <td className="center">2024-06-11</td>
              </tr>
              <tr>
                <td className="center">05</td>
                <td>선정결과</td>
                <td>
                  <Link to={'#'}>핀테크 혁신펀드 위탁운용사 선정 결과</Link>
                </td>
                <td className="center">2024-06-11</td>
              </tr>
              <tr>
                <td className="center">04</td>
                <td>선정결과</td>
                <td>
                  <Link to={'#'}>핀테크 혁신펀드 위탁운용사 선정 결과</Link>
                </td>
                <td className="center">2024-06-11</td>
              </tr>
              <tr>
                <td colSpan={4} className="td_noResult">
                  <NoResult msg={'등록된 공고가 없습니다.'} />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="pagination_wrap">
            {/* <Paging ref={pagingRef} onChangePage={onChangePage} onPrev={onChangePage} onNext={onChangePage} /> */}
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

export default Notice_List_InvestBusiness
