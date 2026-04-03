import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { IconButton } from '@mui/material'
import { grey } from '@mui/material/colors'
import PageLayout from 'components/PageLayout'
import { loader } from 'modules/utils/CommonAxios'
import moment from 'moment'
import { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import NoResult from '../../../components/NoResult'
import Pagination from '../../../components/Pagination'
import SearchForm from '../../../components/SearchForm'
import Button from '../../../components/atomic/Button'
import { GlobalBizContext } from '../../../modules/common/GlobalBizContext'
import { UserContext } from '../../../modules/common/UserContext'
import { getUserListApi } from '../../../modules/consts/AdminApi'
import Api from '../../../modules/consts/Api'
import { getGlobalBizList, updateGlobalBizBranchAdmin, getExcelList } from '../../../modules/consts/GlobalBizApi'
import ROUTER_NAMES from '../../../modules/consts/RouterConst'
import {
  excelDownloadGlbByPostConfigOption,
  generateKey,
  getNationalName,
  getPostConfig
} from '../../../modules/utils/CommonUtils'
import { StringUtils } from '../../../modules/utils/StringUtils'

const List = () => {
  const history = useHistory()
  const globalBizContext = useContext(GlobalBizContext)
  const userContext = useContext(UserContext)

  // 검색 조건
  const [searchFilter, setSearchFilter] = useState({
    active: 'corp',
    list: [{ id: 'corp', value: 'corp', label: '업체명' }]
  })

  const brchAdmRefs = useRef([])
  const [branchAccountList, setBranchAccountList] = useState({
    active: '',
    list: [{ id: '', value: '', label: '선택' }]
  })

  const [searchInput, setSearchInput] = useState('')
  const [excelData, setExcelData] = useState({})
  const [data, setData] = useState({
    total: 0,
    list: []
  })

  // 페이징 정보
  const [paging, setPaging] = useState({
    startPage: 1,
    page: 1,
    endPage: 1,
    prev: false,
    next: false,
    record: 10,
    total: 0,
    totalPage: 1
  })

  const getList = async (params) => {
    params = {
      ...params,
      mngrId: userContext.state.userInfo.mngrId,
      supMngrYn: userContext.state.userInfo.supMngrYn,
      globalAdmYn: userContext.state.userInfo.globalAdmYn,
      searchType: searchInput ? searchFilter.active : '',
      searchKeyword: searchInput
    }

    const res = await getGlobalBizList(params)

    if (res.data?.code === '200') {
      const response = res.data?.data
      const dataList = response.list

      if (dataList) {
        let result = new Array()
        for (let i = 0; i < dataList.length; i++) {
          let item = dataList[i]
          result.push({
            no: item.rnum,
            id: item.fnnccnslId,
            date: item.rgsnTs,
            company: item.cnslEtnm,
            entryNation: item.natlCd,
            entryNationName: getNationalName(item.natlCd),
            amount: item.aplcAmtHnin,
            currency: item.crncCd,
            ovrsDeptRsprId: item.ovrsDeptRsprId
          })
        }
        // 결과 list
        setData({
          params: params,
          total: response.total,
          list: result
        })

        // 페이징 정보 설정
        setPaging({
          startPage: response.startPage,
          page: response.page,
          endPage: response.endPage,
          prev: response.prev,
          next: response.next,
          record: response.record,
          total: response.total,
          totalPage: response.totalPage
        })
      }
    }
  }

  // 국가 정보

  const handlePaging = async (param) => {
    let params = {
      ...globalBizContext.state.globalBizParam,
      ...param
    }
    globalBizContext.actions.handleGlobalBizParam(params)
  }

  const onSelectActive = (selected) => {
    setSearchFilter({
      ...searchFilter,
      active: selected
    })
  }
  const handleSearch = () => {
    const _searchInput = searchInput?.trim()
    let params = {
      ...globalBizContext.state.globalBizParam,
      ...{
        page: 1,
        searchType: _searchInput ? searchFilter.active : '',
        searchKeyword: _searchInput
      }
    }
    globalBizContext.actions.handleGlobalBizParam(params)
  }

  const getBranchAdminList = async () => {
    loader()
    const params = {
      branchAdminYn: true
    }

    const res = await getUserListApi(params)
    if (res.data.code === '200') {
      let data = res.data.data

      let branchAdminArray = new Array()
      branchAdminArray.push(branchAccountList.list[0])
      for (let i = 0; i < data.list.length; i++) {
        let item = data.list[i]
        branchAdminArray.push({
          id: item.mngrId,
          value: item.mngrId,
          label: item.mngrId
        })
      }

      setBranchAccountList({
        ...branchAccountList,
        list: branchAdminArray
      })
    }
  }

  const getAdminExcelList = async () => {
    const res = await getExcelList()
    if (res.data.code === '200') {
      let data = res.data.data
      setExcelData(data)
    }
  }

  // == excel download
  const handleExcelDownload = async () => {
    loader(true, 'Uploading...')

    await excelDownloadGlbByPostConfigOption(
      // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
      getPostConfig(Api.admin.downloadBizListExcel, excelData.list),
      '신청내역리스트' + moment(new Date()).format('YYYYMMDD')
    )
    loader()
  }

  const onBranchAdminActive = async (e) => {
    let fnnccnslId = e.target.parentElement.childNodes[0].value
    let mngrId = e.target.value
    // eslint-disable-next-line no-debugger
    // debugger
    // 상담 신청 지점 관리자 지정 서비스 호출
    const res = await updateGlobalBizBranchAdmin(fnnccnslId, mngrId)
    if (res.data.code === '200') {
      let data = res.data.data
    }
  }

  useEffect(async () => {
    if (StringUtils.hasLength(userContext.state.userInfo?.mngrId)) {
      await getList(globalBizContext.state.globalBizParam)
      await getBranchAdminList()
      await getAdminExcelList()
    }
  }, [userContext.state.userInfo, globalBizContext.state.globalBizParam])
  return (
    // <PageLayout currentMenu={'global'} currentCate={'localConsult'} currentPage={'applyList'}>
    <PageLayout currentMenu={'global'} currentCate={'globalConsult'} currentPage={'globalConsultList'}>
      <div className="content_inner page_document">
        <h4 className="page_title">신청내역</h4>
        {/*section_header start*/}
        <div className="section_header">
          <p className="section_title">신청내역 리스트</p>
          <div className="button_group">
            <p className="total">총 {data.total}건</p>
            <IconButton
              onClick={handleExcelDownload}
              sx={{
                p: 0.75,
                border: `1px solid ${grey[400]}`,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: `${grey[100]}`
                }
              }}
            >
              <InsertDriveFileIcon sx={{ color: '#5FB742' }} />
            </IconButton>
          </div>
        </div>
        {/*section_header end*/}
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table">
            <caption>신청내역 테이블</caption>
            <colgroup>
              <col width={'5%'} />
              <col width={'15%'} />
              <col width={'20%'} />
              <col width={'10%'} />
              <col width={'10%'} />
              <col width={'10%'} />
              {userContext.state.userInfo &&
                (userContext.state.userInfo.supMngrYn == 'Y' || userContext.state.userInfo.globalAdmYn == 'Y') && (
                  <col width={'10%'} />
                )}
              <col width={'*'} />
            </colgroup>
            <thead>
              <tr>
                <th>NO</th>
                <th>신청일</th>
                <th>업체명</th>
                <th>진출국가</th>
                <th>통화</th>
                <th>금액</th>
                {userContext.state.userInfo &&
                  (userContext.state.userInfo.supMngrYn == 'Y' || userContext.state.userInfo.globalAdmYn == 'Y') && (
                    <th>담당 지점 관리자</th>
                  )}
                <th>상세 보기</th>
              </tr>
            </thead>

            <tbody>
              {(!data.list || data.list.length === 0) && (
                <tr>
                  <td colSpan={8}>
                    <NoResult />
                  </td>
                </tr>
              )}
              {data.list.map((apply, idx) => (
                <tr key={generateKey()}>
                  <td className={'ta_center'}>{data.total - apply.no + 1}</td>
                  <td className={'ta_center'}>{moment(apply.date).format('YYYY.MM.DD hh:mm')}</td>
                  <td className={'ta_center'}>{apply.company}</td>
                  <td className={'ta_center'}>{apply.entryNationName}</td>
                  <td className={'ta_center'}>{apply.currency}</td>
                  <td className={'ta_right'}>
                    {apply.amount == null ? '0' : Number(apply.amount.replaceAll(',', '')).toLocaleString()}
                  </td>
                  {userContext.state.userInfo &&
                    (userContext.state.userInfo.supMngrYn == 'Y' || userContext.state.userInfo.globalAdmYn == 'Y') && (
                      <td className={'ta_center'}>
                        <input name={'fnnccnslId'} type={'hidden'} value={apply.id}></input>
                        <select
                          className="custom_select w150"
                          onChange={onBranchAdminActive}
                          value={apply.ovrsDeptRsprId}
                        >
                          {branchAccountList.list.map((brch, idx) => (
                            <option key={generateKey()} value={brch.id ?? ''}>
                              {brch.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}
                  <td className={'ta_center'}>
                    <Button
                      className={'full_grey w80'}
                      onClick={() => history.push(`${ROUTER_NAMES.GLOBAL_CONSULT_VIEW}/${apply.id}`)}
                    >
                      상세보기
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className={'paging_wrap'}>{paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}</div>
        <SearchForm
          selectList={searchFilter}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSelectActive={onSelectActive}
          handleSearch={handleSearch}
        />
      </div>
    </PageLayout>
  )
}

export default List
