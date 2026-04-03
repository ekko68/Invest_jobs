import Checkbox from 'components/atomic/Checkbox'
import NoResult from 'components/NoResult'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import { StringUtils } from 'modules/utils/StringUtils'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const ProductAddTable = (props) => {
  const { dataList, addPdfInfoIds, setAddPdfInfoIds } = props

  const handleAllSelect = (e) => {
    const checked = e.target.checked
    if (checked) {
      // 전체 선택
      setAddPdfInfoIds([...dataList.list])
    } else {
      setAddPdfInfoIds([])
    }
  }

  const handleSelect = (e, id) => {
    const checked = e.target.checked
    if (checked) {
      setAddPdfInfoIds([...addPdfInfoIds, ...dataList.list.filter((_item) => _item.pdfInfoId === id)])
    } else {
      setAddPdfInfoIds([...addPdfInfoIds.filter((_item) => _item.pdfInfoId !== id)])
    }
  }
  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>상품명, 분류 판매가, 상태, 판매 정책 관리 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'*'} />
            <col width={'15%'} />
            <col width={'15%'} />
            <col width={'10%'} />
            <col width={'15%'} />
          </colgroup>
          <thead>
            <tr key={'banner_board_header'}>
              <th>
                {' '}
                <Checkbox
                  className="no_label"
                  checkbox={{ id: 'cell_checkAll', value: '', status: true }}
                  onChange={(e) => {
                    handleAllSelect(e)
                  }}
                />
              </th>
              <th>상품명</th>
              <th>소분류/세분류</th>
              <th>판매가</th>
              <th>상태</th>
              <th>판매 정책</th>
            </tr>
          </thead>
          <tbody>
            {dataList.isLoading ? (
              <Skeleton type="list" count={10} colSpan={10} />
            ) : dataList.list && dataList.list.length > 0 ? (
              dataList.list.map((item, idx) => (
                <tr key={'product_search_board_item_' + idx}>
                  <td className={'ta_center'}>
                    <Checkbox
                      className="no_label"
                      checkbox={{ id: 'cell_check' + idx, value: '', status: true }}
                      checked={addPdfInfoIds.some((_item) => _item.pdfInfoId === item.pdfInfoId)}
                      onChange={(e) => {
                        handleSelect(e, item.pdfInfoId)
                      }}
                    />
                  </td>
                  <td>{item.pdfNm}</td>
                  <td className={'ta_center'}>{item.pdfCtgyName}</td>
                  <td className={'ta_center'}>{StringUtils.comma(item.pdfPrc) + item.dscnUt}</td>
                  <td className={'ta_center'}>{item.pdfSttsName}</td>
                  <td className={'ta_center'}>{item.salePolicyName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={'ta_center'} colSpan={6}>
                  <NoResult msg={`데이터가 없습니다.`} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ProductAddTable
