import Button from 'components/atomic/Button'
import NoResult from 'components/NoResult'
import Checkbox from 'components/atomic/Checkbox'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import PopupAlert from 'components/PopupAlert'
import { useEffect, useState } from 'react'

const BindProdList = (props) => {
  const {
    mainBindList,
    bindProdList,
    setBindProdList,
    handleSearch,
    handleLinkDetail,
    handleApprove,
    handleReset,
    paging,
    handlePaging,
    searchInput,
    setSearchInput
  } = props

  const [confirmBtnStatus, setConfirmBtnStatus] = useState(true)

  // ===== 묶음상품 선택 2개 이상만 가능 Alert
  const [alertMax, setAlertMax] = useState({
    status: false,
    msg: ''
  })
  const handleAlertMax = () => {
    setAlertMax({
      status: false,
      msg: ''
    })
  }
  // 2개 이상 체크
  const handleCheckLimit = (e) => {
    let mainSelected = [...mainBindList]
    let bindSelected = bindProdList.filter((d) => d.status === true)
    if (e.target.checked) {
      let checkCnt = mainSelected.length + bindSelected.length + 1
      if (checkCnt > 2) {
        setAlertMax({
          status: true,
          msg: '메인 묶음 상품은 2개까지만 등록이 가능합니다.'
        })
        return false
      }
    }
    handleCheckbox(e.target.id, e.target.checked)
  }

  // ===== 묶음상품리스트 선택된 상품 0개 체크
  const handleCheckSelectedList = () => {
    let statusCnt = 0
    let selected = bindProdList.map((d) => d.status === true)
    selected.map((s) => s === true && statusCnt++)
    setConfirmBtnStatus(statusCnt <= 0)
  }

  // ===== 체크박스
  const handleCheckbox = (id, checked) => {
    let newList = []
    bindProdList.map((chk) => {
      if (chk.bunInfId === id) {
        chk.status = checked
      }
      newList.push(chk)
    })
    setBindProdList(newList)
  }

  useEffect(() => {
    bindProdList && handleCheckSelectedList()
    if (bindProdList) console.log('bindProdList', bindProdList)
  }, [bindProdList])

  return (
    <>
      {alertMax.status && <PopupAlert msg={alertMax.msg} handlePopup={handleAlertMax} />}
      <div className="section prod_bind_section">
        <div className="table_header">
          <h3 className="table_title">
            <p className="text">묶음상품 리스트</p>
          </h3>
          <div className="btn_group" style={{ display: 'flex', gridGap: '8px', alignItems: 'center' }}>
            <Button className={'full_blue'} disabled={confirmBtnStatus} onClick={() => handleApprove(null)}>
              승인
            </Button>
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
              <span className="hide">새로고침</span>
            </button>
          </div>
        </div>
        {!bindProdList || bindProdList.length === 0 ? (
          <div className="table_no_result">
            <NoResult msg={'현재 등록된 묶음상품이 없습니다.'} />
          </div>
        ) : (
          <div className="table_wrap border_bottom_none table_th_border">
            <table className="table type02">
              <caption>묶음상품 목록 테이블</caption>
              <colgroup>
                <col width={'8%'} />
                <col width={'*'} />
                <col width={'15%'} />
                <col width={'15%'} />
                <col width={'15%'} />
              </colgroup>
              <thead>
                <tr>
                  <th>선택</th>
                  <th>묶음상품명</th>
                  <th>등록된 상품 수</th>
                  <th>판매사</th>
                  <th>바로가기</th>
                </tr>
              </thead>
              <tbody>
                {bindProdList?.map((item, idx) => (
                  <tr key={'prod_bind_item_' + idx} className={`${item.status ? 'selected' : ''}`}>
                    <td className={'ta_center'}>
                      <Checkbox
                        key={item.bunInfId + '_idx'}
                        type={'reverse'}
                        checkbox={{ id: item.bunInfId, value: '' }}
                        onChange={handleCheckLimit}
                        checked={item.status}
                      />
                    </td>
                    <td>
                      <div className="img_title_wrap">
                        <div className="img_wrap">
                          {item.imgUrl ? (
                            <img src={item.imgUrl} alt={item.pdfNm} />
                          ) : (
                            <div className="no_img">
                              <img src={require('assets/images/no_img.jpg').default} alt="이미지 없음" />
                            </div>
                          )}
                        </div>
                        <p className="name">{item.pdfNm}</p>
                      </div>
                    </td>
                    <td className={'ta_center'}>{item.items?.length ? item.items?.length : 0}</td>
                    <td className={'ta_center'}>{item.selrUsisName}</td>
                    <td className={'ta_center'}>
                      <Button className={'basic'} onClick={() => handleLinkDetail(item.bunInfId)}>
                        묶음상품 페이지
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className={'paging_wrap'}>{paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}</div>
        <SearchForm
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
          selectNone={true}
        />
      </div>
    </>
  )
}

export default BindProdList
