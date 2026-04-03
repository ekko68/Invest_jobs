import { Button, MenuItem, Stack, TextField, useTheme } from '@mui/material'
import { BtSelect } from 'components/bt/BtSelect/BtSelect'
import NoResult from 'components/common/NoResult'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey } from "modules/utils/CommonUtils"
import { setFunc } from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Paging from 'pageComponents/common/Paging'
import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

const FncnBsnsRcipMyList = (props) => {
  const theme = useTheme()
  const pagingRef = useRef()
  const history = useHistory()
  const [list, setList] = useState([])
  // 검색
  const [searchInput, setSearchInput] = useState('')
  const searchFncnBsnsPgrsScd = useRef('0')
  const [isUpdate, setIsUpdate] = useState(true)
  const commonContext = useContext(CommonContext)

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
      searchFncnBsnsPgrsScd: searchFncnBsnsPgrsScd.current === '0' ? '' : searchFncnBsnsPgrsScd.current,
      searchName : searchInput,
      record: 10,
      pageSize: 5
    }
    const fncnBsnsMyList = await ResponseUtils.getSimpleResponse(Api.fncnBsns.rcipMyList, params, true)

    if(fncnBsnsMyList != null) {  
      setFunc(pagingRef, 'setPaging', fncnBsnsMyList)
      let arr = []
      for(let i=0 ; i<fncnBsnsMyList.list.length ; i++) {
        let number = fncnBsnsMyList.total - (fncnBsnsMyList.page - 1) * fncnBsnsMyList.record - i
        const params = {
          ...fncnBsnsMyList.list[i]
          , sqn : number
        }
        arr.push(params)
      }

      setList(arr)
    } else {
      setList([])
    }
  }

  // 드롭박스 선택
  const onSelectActive = (sel)=> {
    searchFncnBsnsPgrsScd.current = sel
    setIsUpdate(!isUpdate)
    getList(1)
  }

  useEffect(()=> {
    commonContext.actions.callbackAfterSessionRefresh(async () => {
      getList(1)
    }, true, true);
  }, [])

  return (
    <>
      <div className="investBusiness_container">
        <div className="section_header">
          <h3 className={'title'}>나의 출자사업 신청현황</h3>
          <Button disableElevation color="primary" variant="contained" onClick={() => {history.push(ROUTER_NAMES.FNCN_BSNS_PBAN_LIST)}}>
            출자사업 공고
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
            <BtSelect defaultValue={searchFncnBsnsPgrsScd.current} poHandleChange={onSelectActive}>
              <MenuItem value={'0'}>
                전체
              </MenuItem>
              <MenuItem value={'1'}>임시저장</MenuItem>
              <MenuItem value={'2'}>접수완료</MenuItem>
              <MenuItem value={'3'}>접수취소</MenuItem>
              <MenuItem value={'4'}>심사중</MenuItem>
              <MenuItem value={'5'}>심사완료</MenuItem>
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
              {
                list?.length > 0 ?
                  list.map((item, i) => (
                    <tr key={createKey()}>
                      <td className="center">{item.sqn}</td>
                      <td onClick={()=> {
                        if(item.fncnBsnsPgrsScd !== '1') {
                          history.push(ROUTER_NAMES.FNCN_BSNS_RCIP_MY_DETAIL + "?fncnBsnsRcipNo=" + item.fncnBsnsRcipNo , {...item})
                        }else {
                          history.push(ROUTER_NAMES.FNCN_BSNS_RCIP_WRITE, {...item})
                        }
                      }}>
                        <Link to={'#'}>{item.fncnBsnsPbanTtlNm}</Link>
                      </td>
                      <td className="center">{item.iibsFrrgTs}</td>
                      <td className="center comp">
                        {
                          (item.fncnBsnsPgrsScd === '1' && ('임시저장')) ||
                          (item.fncnBsnsPgrsScd === '2' && ('접수완료')) ||
                          (item.fncnBsnsPgrsScd === '3' && ('접수취소')) ||
                          (item.fncnBsnsPgrsScd === '4' && ('심사중')) ||
                          (item.fncnBsnsPgrsScd === '5' && ('심사완료'))
                        }
                      </td>
                    </tr>
                )) : 
                <tr>
                  <td colSpan={4} className="td_noResult">
                    <NoResult msg={'등록된 신청 정보가 없습니다.'} />
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

export default FncnBsnsRcipMyList
