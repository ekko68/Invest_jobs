import NoResult from 'components/NoResult'
import Checkbox from 'components/atomic/Checkbox'
import { StringUtils } from 'modules/utils/StringUtils'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const ProductTable = (props) => {
  const { dataList, setDataList, regPdfInfoIds, setRegPdfInfoIds } = props

  const handleAllSelect = (e) => {
    const checked = e.target.checked
    if (checked) {
      // 전체 선택
      setRegPdfInfoIds([...dataList.recommendProductList])
    } else {
      setRegPdfInfoIds([])
    }
  }

  const handleSelect = (e, id) => {
    const checked = e.target.checked
    if (checked) {
      setRegPdfInfoIds([...regPdfInfoIds, ...dataList.recommendProductList.filter((_item) => _item.pdfInfoId === id)])
    } else {
      setRegPdfInfoIds([...regPdfInfoIds.filter((_item) => _item.pdfInfoId !== id)])
    }
  }

  const handleDrag = (drag) => {
    if (!drag.destination) return

    let updateList
    let updateDepthList

    updateList = [...dataList.recommendProductList]
    const [reorderedItem] = updateList.splice(drag.source.index, 1)
    updateList.splice(drag.destination.index, 0, reorderedItem)

    updateList = updateList.map((item, index) => ({
      ...item,
      infoSqn: index + 1
    }))
    updateDepthList = { ...dataList, recommendProductList: updateList }
    setDataList(updateDepthList)
  }

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>상품명, 분류 판매가, 상태, 판매 정책, 순서 관리 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'*'} />
            <col width={'15%'} />
            <col width={'15%'} />
            <col width={'10%'} />
            <col width={'15%'} />
            <col width={'5%'} />
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
              <th>순서</th>
            </tr>
          </thead>
          <Droppable droppableId="list-container">
            {(provided) => (
              <tbody {...provided.droppableProps} ref={provided.innerRef}>
                {dataList.recommendProductList && dataList.recommendProductList.length > 0 ? (
                  dataList.recommendProductList.map((item, idx) => (
                    <Draggable key={item.pdfInfoId} draggableId={item.pdfInfoId} index={idx}>
                      {(provided) => (
                        <tr
                          key={'product_search_board_item_' + idx}
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                        >
                          <td className={'ta_center'}>
                            <Checkbox
                              className="no_label"
                              checkbox={{ id: 'cell_check' + idx, value: '', status: true }}
                              checked={regPdfInfoIds.some((_item) => _item.pdfInfoId === item.pdfInfoId)}
                              onChange={(e) => {
                                handleSelect(e, item.pdfInfoId)
                              }}
                            />
                          </td>
                          <td>{item.pdfNm}</td>
                          <td className={'ta_center'}>{item.pdfCtgyName}</td>
                          <td className={'ta_center'}>{StringUtils.comma(item.pdfPrc) + item.comPrcutName}</td>
                          <td className={'ta_center'}>{item.pdfSttsName}</td>
                          <td className={'ta_center'}>{item.salePolicyName}</td>
                          <td className={'ta_center'}>
                            <button type="button" className="drag_button" aria-label="드래그해서 이동" />
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <tr>
                    <td className={'ta_center'} colSpan={7}>
                      <NoResult msg={`데이터가 없습니다.`} />
                    </td>
                  </tr>
                )}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </table>
      </div>
    </DragDropContext>
  )
}

export default ProductTable
