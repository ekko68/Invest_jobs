import { Button, useTheme, TextField, MenuItem, Stack } from '@mui/material'
import { Link,useHistory } from 'react-router-dom'
import { BtSelect } from 'components/bt/BtSelect/BtSelect'
import { useState, useRef, useEffect  } from 'react'
import NoResult from 'components/common/NoResult'
import Paging from 'pageComponents/common/Paging'
import {setFunc } from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import {createKey} from "modules/utils/CommonUtils";

const FncnBsnsPbanList = (props) => {
  const theme = useTheme()
  const history = useHistory()
  const [list, setList] = useState([])
  // 검색
  const [searchInput, setSearchInput] = useState('')
  const searchFncnBsnsPbanDcd = useRef('0')
  const pagingRef = useRef()
  const [isUpdate, setIsUpdate] = useState(true)

  // 페이징
  const onChangePage = (pageNumber) => {
    pageReload(pageNumber)
  }

  // 페이지 번호 조회
  const pageReload = async (pageNumber = 1) => {
    await getList(pageNumber)
  }

  // 출자사업 공고 리스트 조회
  const getList = async(pageNumber)=> {
    const params = {
      page: pageNumber,
      searchFncnBsnsPbanDcd: searchFncnBsnsPbanDcd.current === '0' ? '' : searchFncnBsnsPbanDcd.current,
      searchName : searchInput,
      record: 10,
      pageSize: 5
    }
    const fncnBsnsList = await ResponseUtils.getSimpleResponse(Api.fncnBsns.pbanList, params, true)
    if(fncnBsnsList.list.length > 0) {  
      setFunc(pagingRef, 'setPaging', fncnBsnsList)
      let arr = []
      for(let i=0 ; i<fncnBsnsList.list.length ; i++) {
        if(fncnBsnsList.list[i].fncnBsnsPbanDcd === '1') {
          fncnBsnsList.list[i].fncnBsnsPbanDcd = '선정공고'
        }else if(fncnBsnsList.list[i].fncnBsnsPbanDcd === '2'){
          fncnBsnsList.list[i].fncnBsnsPbanDcd = '접수현황'
        }else if(fncnBsnsList.list[i].fncnBsnsPbanDcd === '3'){
          fncnBsnsList.list[i].fncnBsnsPbanDcd = '선정결과'
        }
        let number = fncnBsnsList.total - (fncnBsnsList.page - 1) * fncnBsnsList.record - i
        const params = {
          ...fncnBsnsList.list[i]
          , sqn : number
        }
        arr.push(params)
      }
      setList(arr)
    } else {
      setList([])
    }
  }

  // 상세화면 이동
  const fncnBsnsPbanDetail = (data)=> {
    const url = ROUTER_NAMES.FNCN_BSNS_PBAN_DETAIL + '?fncnBsnsPbanNo=' + data.fncnBsnsPbanNo
    history.push(url)
  }

  // 드롭박스 선택
  const onSelectActive = (sel)=> {
    searchFncnBsnsPbanDcd.current = sel
    setIsUpdate(!isUpdate)
    getList(1)
  }

  useEffect(()=> {
    getList(1)
  },[])

  return (
    <>
      <div className="investBusiness_container">
        <div className="section_header">
          <h3 className={'title'}>출자사업 공고</h3>
          <Button disableElevation color="primary" variant="contained" onClick={() => {history.push(ROUTER_NAMES.FNCN_BSNS_RCIP_MY_LIST)}}>
            나의 신청현황
          </Button>
        </div>
        <div className="investBusiness_box">
          <div className="investBusiness_searchArea">
            <TextField placeholder={'제목 검색'} size="small" sx={{ width: '32rem' }} value={searchInput} onChange={(event) => {setSearchInput(event.target.value)}} />
            <Button disableElevation color="primary" variant="contained" onClick={() => {getList(1)}}>
              검색
            </Button>
          </div>
          <div className="investBusiness_sort">
            <BtSelect defaultValue={searchFncnBsnsPbanDcd.current} poHandleChange={onSelectActive}>
              <MenuItem value={'0'}>
                전체
              </MenuItem>
              <MenuItem value={'1'}>선정공고</MenuItem>
              <MenuItem value={'2'}>접수현황</MenuItem>
              <MenuItem value={'3'}>선정결과</MenuItem>
            </BtSelect>
          </div>
          <table className="investBusiness_list_table">
            <colgroup>
              <col width={'8%'} />
              <col width={''} />
              <col width={'15%'} />
            </colgroup>
            <thead>
              <th>NO.</th>
              <th>제목</th>
              <th>작성일</th>
            </thead>
            <tbody>
              {
                list?.length > 0 ?
                  list.map((item, i) => (
                    <tr key={createKey()}>
                      <td className="center">{item.sqn}</td>
                      <td onClick={()=> {fncnBsnsPbanDetail(item)}}>
                        <Link to={'#'}>{'['+ item.fncnBsnsPbanDcd + '] ' + item.fncnBsnsPbanTtlNm}</Link>
                      </td>
                      <td className="center">{item.iibsFrrgTs}</td>
                    </tr>
                )) : 
                  <tr>
                    <td colSpan={4} className="td_noResult">
                      <NoResult msg={'등록된 공고가 없습니다.'} />
                    </td>
                  </tr>
              }
            </tbody>
          </table>
          <div className="pagination_wrap">
            <Stack alignItems={'center'}>
              <Paging ref={pagingRef} onChangePage={onChangePage} onPrev={onChangePage} onNext={onChangePage} />
            </Stack>
          </div>
        </div>
      </div>
    </>
  )
}

export default FncnBsnsPbanList
