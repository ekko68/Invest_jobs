import Checkbox from 'components/atomic/Checkbox'
import NoResult from 'components/NoResult'
import Toggle from 'components/Toggle'
import { termFormatter } from 'modules/common'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const PopularSearchTable = (props) => {
  const { dataList, setDataList, delRcmdInfIds, setDelRcmdInfIds, handleToggle, goEditPage2 } = props

  const handleAllSelect = (e) => {
    const checked = e.target.checked
    if (checked) {
      // 전체 선택
      setDelRcmdInfIds([...dataList.list])
    } else {
      setDelRcmdInfIds([])
    }
  }

  const handleSelect = (e, id) => {
    const checked = e.target.checked
    if (checked) {
      setDelRcmdInfIds([...delRcmdInfIds, ...dataList.list.filter((_item) => _item.srwdInfId === id)])
    } else {
      setDelRcmdInfIds([...delRcmdInfIds.filter((_item) => _item.srwdInfId !== id)])
    }
  }

  const handleDrag = (drag) => {
    if (!drag.destination) return

    const sourceIndex = drag.source.index
    const destinationIndex = drag.destination.index
    let updateList
    let updateDepthList

    if (dataList.list[sourceIndex].oppbYn !== 'Y' || dataList.list[destinationIndex].oppbYn !== 'Y') {
      return
    }

    updateList = [...dataList.list]
    const [reorderedItem] = updateList.splice(drag.source.index, 1)
    updateList.splice(drag.destination.index, 0, reorderedItem)

    updateList = updateList.map((item, index) => ({
      ...item,
      infoSqn: index + 1
    }))
    updateDepthList = { ...dataList, list: updateList }
    setDataList(updateDepthList)
  }

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>선택, 검색어, 기간, 조회수, 상태, 순서 관리 테이블</caption>
          <colgroup>
            <col width={'10%'} />
            <col width={'*'} />
            <col width={'25%'} />
            <col width={'10%'} />
            <col width={'10%'} />
            <col width={'10%'} />
          </colgroup>
          <thead>
            <tr>
              <th>
                <Checkbox
                  className="no_label"
                  checkbox={{ id: 'cell_checkAll', value: '', status: true }}
                  onChange={(e) => {
                    handleAllSelect(e)
                  }}
                />
              </th>
              <th>검색어</th>
              <th>기간</th>
              <th>조회수</th>
              <th>상태</th>
              <th>순서</th>
            </tr>
          </thead>
          <Droppable droppableId="list-container">
            {(provided) => (
              <tbody {...provided.droppableProps} ref={provided.innerRef}>
                {dataList.isLoading ? (
                  <Skeleton type="list" count={10} colSpan={10} />
                ) : dataList.list && dataList.list.length > 0 ? (
                  dataList.list.map((item, idx) =>
                    item.oppbYn === 'Y' ? (
                      <Draggable key={item.srwdInfId} draggableId={item.srwdInfId} index={idx}>
                        {(provided) => (
                          <tr
                            key={'popular_search_table_item_' + idx}
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                          >
                            <td className={'ta_center'}>
                              <Checkbox
                                className="no_label"
                                checkbox={{ id: 'cell_check' + idx, value: '', status: true }}
                                checked={delRcmdInfIds.some((_item) => _item.srwdInfId === item.srwdInfId)}
                                onChange={(e) => {
                                  handleSelect(e, item.srwdInfId)
                                }}
                              />
                            </td>
                            <td
                              onClick={() => {
                                goEditPage2(item.srwdInfId)
                              }}
                            >
                              {item.srwd}
                            </td>
                            <td
                              className={'ta_center'}
                              onClick={() => {
                                goEditPage2(item.srwdInfId)
                              }}
                            >
                              {termFormatter(item.stdy)}-{termFormatter(item.fnda)}
                            </td>
                            <td className={'ta_center'}>{item.iqcnt}</td>
                            <td className={'ta_center'}>
                              <Toggle
                                className="theme_blue2"
                                data={{
                                  id: 'toggle_' + idx,
                                  value: item?.oppbYn === 'Y' ? 'ON' : 'OFF',
                                  status: item?.oppbYn === 'Y' ? true : false
                                }}
                                onChange={() => handleToggle(item)}
                              />
                            </td>
                            <td className={'ta_center'}>
                              <button type="button" className="drag_button" aria-label="드래그해서 이동" />
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ) : (
                      <tr key={'popular_search_table_item_' + idx}>
                        <td className={'ta_center'}>
                          <Checkbox
                            className="no_label"
                            checkbox={{ id: 'cell_check' + idx, value: '', status: true }}
                            checked={delRcmdInfIds.some((_item) => _item.srwdInfId === item.srwdInfId)}
                            onChange={(e) => {
                              handleSelect(e, item.srwdInfId)
                            }}
                          />
                        </td>
                        <td
                          onClick={() => {
                            goEditPage2(item.srwdInfId)
                          }}
                        >
                          {item.srwd}
                        </td>
                        <td
                          className={'ta_center'}
                          onClick={() => {
                            goEditPage2(item.srwdInfId)
                          }}
                        >
                          {termFormatter(item.stdy)}-{termFormatter(item.fnda)}
                        </td>
                        <td className={'ta_center'}>{item.iqcnt}</td>
                        <td className={'ta_center'}>
                          <Toggle
                            className="theme_blue2"
                            data={{
                              id: 'toggle_' + idx,
                              value: item?.oppbYn === 'Y' ? 'ON' : 'OFF',
                              status: item?.oppbYn === 'Y' ? true : false
                            }}
                            onChange={() => handleToggle(item)}
                          />
                        </td>
                        <td className={'ta_center'}>
                          <button type="button" className="drag_button" aria-label="드래그해서 이동" />
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td className={'ta_center'} colSpan={6}>
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

export default PopularSearchTable
