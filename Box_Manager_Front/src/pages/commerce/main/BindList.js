import { useEffect, useState, useContext, useLayoutEffect } from 'react'

import PageLayout from 'components/PageLayout'
import BindProdList from 'pageComponents/commerce/main/BindProdList'
import MainProdList from 'pageComponents/commerce/main/MainProdList'
import { approveMainBind, getBindListApi } from 'modules/consts/MktApi'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import { useLocation } from 'react-router-dom'
import { loader } from 'modules/utils/CommonAxios'
import BoxUrl from "modules/consts/BoxUrl";

const BindList = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[3]

  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const [mainBindList, setMainBindList] = useState(null) // 메인 묶음 상품
  const [bindProdList, setBindProdList] = useState(null) // 묶음상품 리스트
  const [selectList, setSelectList] = useState([]) // 선택한 목록
  const [paging, setPaging] = useState(null)
  const [searchInput, setSearchInput] = useState('')

  // ===== 목록 조회
  const getList = async (bindParams) => {
    loader(true, 'Uploading...')
    // 묶음상품 파라미터 - 페이징, 검색
    let params = { mainPageFlg: 'list' }
    if (bindParams) {
      params = {
        ...params,
        ...bindParams
      }
    }

    let mainRes = await getBindListApi({ mainPageFlg: 'main' })
    let bindRes = await getBindListApi(params)

    // 메인묶음상품
    if (mainRes.data.code === '200') {
      let data = mainRes.data.data.list
      let newList = data.map((item, idx) => {
        if (idx <= 2) {
          return { ...item }
        }
      })
      setMainBindList(newList)
    }
    // 묶음상품
    if (bindRes.data.code === '200') {
      let data = bindRes.data.data
      setPaging({
        endPage: data.endPage,
        next: data.next,
        page: data.page,
        prev: data.prev,
        record: data.record,
        startPage: data.startPage,
        total: data.total,
        totalPage: data.totalPage
      })
    }
    if (mainRes.data.code === '200' && bindRes.data.code === '200') {
      handleSetBindListCheckbox(mainRes.data.data.list, bindRes.data.data.list)
    }
    loader()
  }

  // ===== 목록에 체크박스 설정
  const handleSetBindListCheckbox = (mainList, bindList) => {
    let newList = []
    if (mainList.length > 0) {
      let list = bindList.filter((item) => mainList.every((it) => item.bunInfId !== it.bunInfId))
      newList = list.map((item) => ({ ...item, status: false }))
    } else {
      newList = bindList.map((item) => ({ ...item, status: false }))
    }
    setBindProdList(newList)
  }

  // ===== 목록 선택
  const handleSetSelect = () => {
    if (bindProdList) {
      let selectList = bindProdList.filter((item) => item.status)
      setSelectList([...mainBindList, ...selectList])
    }
  }

  // ===== 승인
  const handleApprove = async (item) => {
    let paramList = []
    if (!item) {
      // 승인
      paramList = selectList.map((item) => ({
        bunInfId: item.bunInfId,
        mainPageFlg: 'Y'
      }))
    } else {
      // 승인취소
      paramList = [
        {
          bunInfId: item.bunInfId,
          mainPageFlg: 'N'
        }
      ]
    }

    const res = await approveMainBind(paramList)
    if (res.data.message === 'OK') {
      loader(true, 'Uploading...')
      getList()
      handleReset()
    }
  }

  // ===== 검색
  const handleSearch = () => {
    const _searchInput = searchInput.trim()
    let params = {
      page: 1,
      pdfInfoCon: _searchInput
    }
    mktContext.actions.handleSetBindParam(params)
  }

  // ===== 상세페이지이동
  const handleLinkDetail = (id) => {
    // window.open(`${process.env.REACT_APP_MKT_API_URL}/product/bindetail/${id}`, '_blank')
    window.open(`${BoxUrl.getMarketBoxUrl(process.env.REACT_APP_PROFILE)}/product/bindetail/${id}`, '_blank')
  }

  // ===== reset
  const handleReset = () => {
    mktContext.actions.handleSetBindParam(null)
    setSearchInput('')
  }

  // ===== paging
  const handlePaging = (param) => {
    let params = {
      ...mktContext.state.bindParam,
      ...param
    }
    mktContext.actions.handleSetBindParam(params)
  }

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      userContext.actions.setCategory(category)
      handleReset()
    }
  }, [userContext.state.category])

  useEffect(async () => {
    setBindProdList(null)
    if (category !== userContext.state.category) {
      await getList()
    } else {
      await getList(mktContext.state.bindParam)
    }
  }, [mktContext.state.bindParam])

  useEffect(() => {
    bindProdList && handleSetSelect()
  }, [bindProdList])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bindList'}>
      <div className="content_inner page_main">
        <h4 className="page_title">묶음상품관리</h4>
        {/*main_bind_section start*/}
        {mainBindList && (
          <MainProdList mainBindList={mainBindList} handleLinkDetail={handleLinkDetail} handleApprove={handleApprove} />
        )}
        {/*main_bind_section end*/}

        {/*main_bind_section start*/}
        {bindProdList && (
          <BindProdList
            mainBindList={mainBindList}
            bindProdList={bindProdList}
            setBindProdList={setBindProdList}
            handleSearch={handleSearch}
            handleLinkDetail={handleLinkDetail}
            handleApprove={handleApprove}
            handleReset={handleReset}
            paging={paging}
            handlePaging={handlePaging}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
          />
        )}

        {/*main_bind_section end*/}
      </div>
    </PageLayout>
  )
}

export default BindList
