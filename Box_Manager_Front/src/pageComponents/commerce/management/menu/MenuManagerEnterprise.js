import 'assets/style/component/menuManager.scss'
import { saveCategoryCompanyOrder } from 'modules/consts/MktApi'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const MenuManagerEnterprise = (props) => {
  const { dataList, setDataList, onClickDepth } = props

  const handleDrag = (drag) => {
    if (!drag.destination || drag.destination.index === drag.source.index) return
    let draggableId = drag.draggableId.substr(0, 3)
    let updateList
    let updateDepthList
    if (draggableId === '대분류') {
      updateList = [...dataList.depth1]
      const [reorderedItem] = updateList.splice(drag.source.index, 1)
      updateList.splice(drag.destination.index, 0, reorderedItem)
      updateList = updateList.map((item, index) => ({
        ...item,
        tms1ClsfSqn: index + 1
      }))
      updateDepthList = { ...dataList, depth1: updateList }
    } else if (draggableId === '중분류') {
      updateList = [...dataList.depth2]
      const [reorderedItem] = updateList.splice(drag.source.index, 1)
      updateList.splice(drag.destination.index, 0, reorderedItem)
      updateList = updateList.map((item, index) => ({
        ...item,
        tms2ClsfSqn: index + 1
      }))
      updateDepthList = { ...dataList, depth2: updateList }
    }
    setDataList(updateDepthList)
    saveData(updateDepthList)
  }

  const saveData = async (updateDepthList) => {
    await saveCategoryCompanyOrder(updateDepthList)
  }

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <div className="menuManager_wrap col2">
        {/* depth01 */}
        {dataList.depth1 && dataList.depth1.length > 0 ? (
          <Droppable droppableId="depth1">
            {(provided) => (
              <div className="menuManager_box" {...provided.droppableProps} ref={provided.innerRef}>
                <ul className="menuManager_list">
                  {dataList.depth1.map((item, index) => (
                    <Draggable key={item.tms1ClsfCd} draggableId={'대분류' + item.tms1ClsfCd} index={index}>
                      {(provided) => (
                        <li
                          className="menuManager_item"
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                        >
                          <div className="menuManager_link" onClick={() => onClickDepth(1, item.tms1ClsfCd, '')}>
                            <button type="button" className="menuManager_drag_button" aria-label="드래그해서 이동">
                              <span className="menuManager_drag_button_inner" />
                            </button>
                            {item.tms1ClsfNm}
                            {/* <button type="button" className="menuManager_modify_button" aria-label="수정" /> */}
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        ) : (
          <div className="menuManager_box">
            <div className="menuManager_box_title">대분류</div>
          </div>
        )}

        {/* depth02 */}
        {dataList.depth2 && dataList.depth2.length > 0 ? (
          <Droppable droppableId="depth2">
            {(provided) => (
              <div className="menuManager_box" {...provided.droppableProps} ref={provided.innerRef}>
                <ul className="menuManager_list">
                  {dataList.depth2.map((item, index) => (
                    <Draggable key={item.tms2ClsfCd} draggableId={'중분류' + item.tms2ClsfCd} index={index}>
                      {(provided) => (
                        <li
                          className="menuManager_item"
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                        >
                          <div className="menuManager_setting_group">
                            <button type="button" className="menuManager_drag_button" aria-label="드래그해서 이동">
                              <span className="menuManager_drag_button_inner" />
                            </button>
                            {item.tms2ClsfNm}
                            {/* <button type="button" className="menuManager_modify_button" aria-label="수정" /> */}
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        ) : (
          <div className="menuManager_box">
            <div className="menuManager_box_title">중분류</div>
          </div>
        )}
      </div>
    </DragDropContext>
  )
}

export default MenuManagerEnterprise
