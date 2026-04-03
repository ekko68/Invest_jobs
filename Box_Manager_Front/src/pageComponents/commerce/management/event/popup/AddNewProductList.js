import NoResult from 'components/NoResult'
import Checkbox from 'components/atomic/Checkbox'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import { useEffect } from 'react'
import { StringUtils } from 'modules/utils/StringUtils'
const AddNewProduct = (props) => {
  const { data, addProductInfIds, setAddProductInfIds, selectAllController, setSelectAllController } = props

  const handleAllSelect = (e) => {
    const checked = e.target.checked
    setSelectAllController(checked)
    if (checked) {
      // 전체 선택
      setAddProductInfIds([...data.list])
    } else {
      setAddProductInfIds([])
    }
  }

  const handleSelect = (e, id) => {
    const checked = e.target.checked

    if (checked) {
      setAddProductInfIds([...addProductInfIds, ...data.list.filter((_item) => _item.pdfInfoId === id)])
    } else {
      setAddProductInfIds([...addProductInfIds.filter((_item) => _item.pdfInfoId !== id)])
    }
  }
  const codeTranslate = {
    GDS00001: '판매중',
    GDS08001: 'BOX POS 결제',
    GDS08002: '견적 요청 받기',
    GDS08003: '일반 결제(계좌이체)'
  }
  useEffect(() => {
    setAddProductInfIds([])
    setSelectAllController(false)
  }, [])
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
                <Checkbox
                  className="no_label"
                  checkbox={{ id: 'cell_checkAll', value: '', status: true }}
                  onChange={(e) => {
                    handleAllSelect(e)
                  }}
                  checked={selectAllController || ''}
                />
              </th>
              <th>상품명</th>
              <th>소분류 / 세분류</th>
              <th>판매가</th>
              <th>상태</th>
              <th>판매 정책</th>
            </tr>
          </thead>
          <tbody>
            {data.isLoading ? (
              <Skeleton type="list" count={10} colSpan={7} />
            ) : data.list?.length > 0 ? (
              data.list.map((item, idx) => (
                <tr key={'banner_board_item_' + idx} onClick={() => {}}>
                  <td className={'ta_center'}>
                    <Checkbox
                      className="no_label"
                      checkbox={{ id: 'cell_check' + idx, value: '', status: true }}
                      checked={addProductInfIds.some((_item) => _item.pdfInfoId === item.pdfInfoId)}
                      onChange={(e) => {
                        handleSelect(e, item.pdfInfoId)
                      }}
                    />
                  </td>
                  <td>{item.pdfNm}</td>
                  <td className={'ta_center'}>
                    {item.ctgyDataMid} / {item.ctgyDataSm}
                  </td>
                  <td className={'ta_center'}>
                    {item.pdfPrc === null ? '가격 확인 필요' : StringUtils.comma(item.pdfPrc)}
                    {item.pdfPrc && item.comPrcutNm !== null ? item.comPrcutNm : ''}
                  </td>
                  <td className={'ta_center'}>{codeTranslate[item.pdfSttsId]}</td>
                  <td className={'ta_center'}>
                    {item.salePolicy.trim() === ''
                      ? '정책 미정'
                      : item.salePolicy.split(',').map((item) => {
                          return codeTranslate[item] + '\n'
                        })}
                  </td>
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

export default AddNewProduct
