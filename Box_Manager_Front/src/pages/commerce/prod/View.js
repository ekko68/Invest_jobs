import { useEffect, useState, useContext, useLayoutEffect } from 'react'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import PageLayout from 'components/PageLayout'
import NoResult from 'components/NoResult'
import Button from 'components/atomic/Button'
import RegProdTable from 'pageComponents/commerce/prod/RegProdTable'
import PopupConfirm from 'components/PopupConfirm'
import { useHistory, useLocation } from 'react-router-dom'
import { loader } from 'modules/utils/CommonAxios'
import {
  getProdSellerAgencyListApi,
  getProdSellerRegListApi,
  getProductDetailApi,
  prodSellerRegCancel,
  prodSellerRegRecovery
} from 'modules/consts/MktApi'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import BoxUrl from 'modules/consts/BoxUrl'

const View = (props) => {
  const history = useHistory()
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[2]
  const id = props.match.params.id
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)

  // 판매사 목록
  const [sellerData, setSellerData] = useState(null) // 판매사 정보 state
  const [prodData, setProdData] = useState(null) // 등록상품 or 에이전시 상품목록 state
  const [selectedItem, setSelectedItem] = useState(null) // 판매중지할 item
  const [confirmDeprive, setConfirmDeprive] = useState(false) // 판매중지 Confirm
  const [paging, setPaging] = useState(null) // 등록상품 or 에이전시 paging
  // 탭
  const [tabList, setTabList] = useState({
    active: 'regProd',
    list: [
      { id: 'regProd', label: '등록 상품' },
      { id: 'agencyProd', label: '에이전시 상품' }
    ]
  })

  // ===== 상세 조회
  // seller info
  const getData = async () => {
    loader(true, 'Uploading...')
    let res = await getProductDetailApi({ selrUsisId: id })
    if (res.data.code === '200') {
      let data = res.data.data
      setSellerData(data)
      loader()
    }
  }

  // get reg, agency product list
  const getProdData = async (type, param) => {
    loader(true, 'Uploading...')
    setProdData(null)
    let res
    if (type === 'regProd') {
      res = await getProdSellerRegListApi({ selrUsisId: id, ...param })
    } else {
      res = await getProdSellerAgencyListApi({ selrUsisId: id, ...param })
    }
    if (res.data.code === '200') {
      let data = res.data.data
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
      mktContext.actions.handleProdDetailParam(mktContext.state.prodDetailParam)
      setProdData(data)
    }
    loader()
  }

  // ===== 탭
  const handleTab = async (selected) => {
    setTabList({
      ...tabList,
      active: selected
    })
    await getProdData(selected, { page: 1 })
  }

  // ===== 판매중지
  // 판매중지 Confirm
  const handleConfirmDeprive = async (id) => {
    if (confirmDeprive) {
      setSelectedItem(null)
    }
    setSelectedItem(id)
    setConfirmDeprive(!confirmDeprive)
  }
  // 판매중지
  const handleDeprive = async () => {
    loader(true, 'Uploading...')
    let res = await prodSellerRegCancel({ pdfInfoId: selectedItem })
    if (res.data.code === '200') {
      await getProdData(tabList.active)
      await handleConfirmDeprive(null)
    }
  }

  // ===== 판매 중지 취소
  const handleCancelStopSale = async (id) => {
    loader(true, 'Uploading...')
    let res = await prodSellerRegRecovery({ pdfInfoId: id })
    if (res.data.code === '200') {
      await getProdData(tabList.active)
    }
  }

  // ===== 페이징
  const handlePaging = async (param) => {
    console.log('handlePaging', param)
    mktContext.actions.handleProdDetailParam(param)
    await getProdData(tabList.active, param)
  }

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      userContext.actions.setCategory(category)
    }
  }, [userContext.state.category])

  useEffect(async () => {
    await getData()
    await handleTab('regProd')
  }, [])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'prod'}>
      {confirmDeprive && (
        <PopupConfirm
          className={'popup_confirm_deprive'}
          msg={
            '판매 중지 하시겠습니까?\n' +
            '판매 중지할 경우, 해당 판매사는\n' +
            '해당 상품을 더 이상 판매할 수 없습니다.'
          }
        >
          <Button className={'full_grey_dark'} onClick={handleConfirmDeprive}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleDeprive}>
            판매중지
          </Button>
        </PopupConfirm>
      )}

      <div className="content_inner page_prod">
        <div className="page_header">
          <h4 className="page_title">판매사 상품 관리</h4>
          <div className="btn_group">
            <Button
              className={'basic'}
              style={{ width: '80px' }}
              onClick={() => history.push(ROUTER_NAMES.COMMERCE_PROD_LIST)}
            >
              목록
            </Button>
          </div>
        </div>
        {/*section start*/}
        <div className="section seller_list_section">
          {!sellerData ? (
            <div className="table_no_result">
              <NoResult />
            </div>
          ) : (
            <div className="table_wrap border_bottom_none table_th_border">
              <table className="table type02">
                <caption>판매사 상품 관리 테이블</caption>
                <colgroup>
                  <col width={'*'} />
                  <col width={'15%'} />
                  <col width={'10%'} />
                  <col width={'12%'} />
                  <col width={'14%'} />
                  <col width={'14%'} />
                </colgroup>
                <thead>
                  <tr>
                    <th>회사명</th>
                    <th>대표자명</th>
                    <th>회원타입</th>
                    <th>등록 상품 수</th>
                    <th>에이전시 상품 수</th>
                    <th>바로가기</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={'ta_center'}>{sellerData.bplcNm}</td>
                    <td className={'ta_center'}>{sellerData.rprsntvNm}</td>
                    <td className={'ta_center'}>{sellerData.mmbrtypeNm}</td>
                    <td className={'ta_center'}>{sellerData.prdtCnt ? sellerData.prdtCnt : 0}</td>
                    <td className={'ta_center'}>{sellerData.agtPrdtCnt ? sellerData.agtPrdtCnt : 0}</td>
                    <td className={'ta_center'}>
                      <div className="btn_group">
                        <Button
                          className={'basic'}
                          onClick={() =>
                            window.open(
                              // `${process.env.REACT_APP_MKT_API_URL}/sellerstore/${sellerData.selrUsisId}`,
                              `${BoxUrl.getMarketBoxUrl(process.env.REACT_APP_PROFILE)}/sellerstore/${
                                sellerData.selrUsisId
                              }`,
                              '_blank'
                            )
                          }
                        >
                          판매사상점 이동
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/*section end*/}
        {/*section start*/}
        <div className="section prod_tab_section">
          {/*tab_header start*/}
          <div className="tab_header">
            <ul className="tab_header_list">
              {tabList.list.map((tab, idx) => (
                <li
                  className={`tab_header_item ${tabList.active === tab.id ? 'active' : ''}`}
                  key={tab.id}
                  onClick={() => handleTab(tab.id)}
                >
                  <span className="label">{tab.label}</span>
                </li>
              ))}
            </ul>
          </div>
          {/*tab_header end*/}
          <div className="tab_container">
            {paging && prodData && (
              <RegProdTable
                type={tabList.active}
                data={prodData}
                handleConfirmDeprive={handleConfirmDeprive}
                handleCancelStopSale={handleCancelStopSale}
                handlePaging={handlePaging}
                paging={paging}
              />
            )}
          </div>
        </div>
        {/*section end*/}
      </div>
    </PageLayout>
  )
}

export default View
