import Button from 'components/atomic/Button'
import NoResult from 'components/NoResult'
import Checkbox from 'components/atomic/Checkbox'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import Badge from 'components/atomic/Badge'
import * as commonFn from 'modules/fns/commonFn'
import { getTotalNumberBoard } from 'modules/common'
import { useState } from 'react'

const ProdTable = (props) => {
  const {
    prodList,
    checkAll,
    tab,
    handlePaging,
    handleCheckbox,
    paging,
    handleApprove,
    handleSearch,
    searchInput,
    setSearchInput,
    selectList,
    setSelectList,
    statusCode
  } = props

  const onSelectActive = (selected) => {
    setSelectList({
      ...selectList,
      active: selected
    })
  }
console.log(prodList)
  const extractCategory = (category) =>
    category
      ?.replace(/\{/g, '')
      .replace(/\}/g, '')
      .replace(/11번가,/g, '')
      .replace(/,/g, '>')

  return (
    <div className={'section prod_section'}>
      <div className="table_header">
        <h4 className="table_title">
          {tab === 'applyProd' ? `이벤트 신청 상품 목록` : `전체 상품 목록`}({paging ? paging?.total : 0})
        </h4>
        <div className="btn_group">
          <Button
            className={'full_blue'}
            onClick={handleApprove}
            disabled={prodList?.filter((item) => item.checked)?.length <= 0}
          >
            ({prodList?.filter((item) => item.checked)?.length}) 승인
          </Button>
        </div>
      </div>
      {prodList?.length === 0 ? (
        <div className="table_no_result">
          <NoResult msg={'이벤트를 신청한 상품이 없습니다.'} />
        </div>
      ) : (
        <div className="table_wrap border_bottom_none table_th_border">
          <table className="table type02">
            <caption>상품 목록 테이블</caption>
            <colgroup>
              <col width={'5%'} />
              <col width={'*'} />
              <col width={'12%'} />
              <col width={'12%'} />
              <col width={'30%'} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <div className="number_checkbox_wrap">
                    <p className={'number'}>NO</p>
                    {statusCode !== 'ETS00003' && (
                      <Checkbox
                        key={checkAll.id}
                        checkbox={checkAll}
                        onChange={handleCheckbox}
                        checked={checkAll.checked}
                      />
                    )}
                  </div>
                </th>
                <th>상품명</th>
                <th>판매사</th>
                <th>판매가</th>
                <th>분류</th>
              </tr>
            </thead>
            <tbody>
              {prodList?.map((item, idx) => (
                <tr
                  key={'apply_prod_' + idx}
                  className={`${item?.approvalStatus?.status || item.checked ? 'selected' : ''}`}
                >
                  <td className={'ta_center'}>
                    <div className="number_checkbox_wrap">
                      <p className={'number'}>
                        {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                      </p>
                      {statusCode !== 'ETS00003' && (
                        <Checkbox
                          checkbox={{ id: item.pdfInfoId, value: true }}
                          onChange={handleCheckbox}
                          checked={item?.checked}
                        />
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="img_title_wrap">
                      <div className="img_wrap">
                        {item.imgUrl ? (
                          <img src={item.imgUrl} alt={item.fileNm} />
                        ) : (
                          <div className="no_img">
                            <img src={require('assets/images/no_img.jpg').default} alt="이미지 없음" />
                          </div>
                        )}
                      </div>
                      <div className={'flex_row'}>
                        {item.pdfAgenState === 'Y' && (
                          <Badge className={'full_blue square'} style={{ borderRadius: '3px' }}>
                            에이전시
                          </Badge>
                        )}
                        {item.pdfAgenOrgBplcNm !== null && (item.pdfAgenOrgBplcNm)}
                        <p className="name">{item.pdfNm}</p>
                      </div>
                    </div>
                  </td>
                  <td className={'ta_center'}>{item.bplcNm}</td>
                  <td className={'ta_center'}>
                    {item.prcDscsYn === 'Y'
                      ? '가격협의'
                      : commonFn.krwFormatter(Number(item.pdfPrc) - Number(item.salePrc)) + item.comPrcutNm}
                  </td>
                  <td className={'ta_center'} style={{ wordBreak: 'keep-all' }}>
                    {extractCategory(item.ctgyData)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {paging && prodList?.length > 0 && (
        <>
          <div className={'paging_wrap'}>
            <Pagination pagingData={paging} handlePaging={handlePaging} />
          </div>
        </>
      )}
      <SearchForm
        selectList={selectList}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSelectActive={onSelectActive}
        handleSearch={handleSearch}
      />
    </div>
  )
}

export default ProdTable
