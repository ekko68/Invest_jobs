import 'assets/style/component/menuManager.scss'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { saveCategoryProductOrder } from 'modules/consts/MktApi'

// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const MenuManager = (props) => {
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
        tms2ClsfSqn: index + 1
      }))
      updateDepthList = { ...dataList, depth1: updateList }
    } else if (draggableId === '중분류') {
      updateList = [...dataList.depth2]
      const [reorderedItem] = updateList.splice(drag.source.index, 1)
      updateList.splice(drag.destination.index, 0, reorderedItem)
      updateList = updateList.map((item, index) => ({
        ...item,
        tms3ClsfSqn: index + 1
      }))
      updateDepthList = { ...dataList, depth2: updateList }
    } else if (draggableId === '소분류') {
      updateList = [...dataList.depth3]
      const [reorderedItem] = updateList.splice(drag.source.index, 1)
      updateList.splice(drag.destination.index, 0, reorderedItem)
      updateList = updateList.map((item, index) => ({
        ...item,
        tms4ClsfSqn: index + 1
      }))
      updateDepthList = { ...dataList, depth3: updateList }
    }
    setDataList(updateDepthList)
    saveData(updateDepthList)
  }

  const saveData = async (updateDepthList) => {
    await saveCategoryProductOrder(updateDepthList)
  }

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <div className="menuManager_wrap">
        {/* depth01 */}
        {dataList.depth1 && dataList.depth1.length > 0 ? (
          <Droppable droppableId="depth1">
            {(provided) => (
              <div className="menuManager_box" {...provided.droppableProps} ref={provided.innerRef}>
                <ul className="menuManager_list">
                  {dataList.depth1.map((item, index) => (
                    <Draggable key={item.tms2ClsfNm} draggableId={'대분류' + item.tms2ClsfNm} index={index}>
                      {(provided) => (
                        <li
                          className="menuManager_item"
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                        >
                          <div className="menuManager_link" onClick={() => onClickDepth(1, item.tms2ClsfCd, '')}>
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
            <div className="menuManager_box_title">대분류</div>
          </div>
        )}
        {/* depth02 */}
        {/* case1: 상위 메뉴(카테고리 선택시) */}
        {dataList.depth2 && dataList.depth2.length > 0 ? (
          <Droppable droppableId="depth2">
            {(provided) => (
              <div className="menuManager_box" {...provided.droppableProps} ref={provided.innerRef}>
                <ul className="menuManager_list">
                  {dataList.depth2.map((item, index) => (
                    <Draggable key={item.tms3ClsfNm} draggableId={'중분류' + item.tms3ClsfNm} index={index}>
                      {(provided) => (
                        <li
                          className="menuManager_item"
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                        >
                          <div
                            className="menuManager_link"
                            onClick={() => onClickDepth(2, item.tms2ClsfCd, item.tms3ClsfCd)}
                          >
                            <button type="button" className="menuManager_drag_button" aria-label="드래그해서 이동">
                              <span className="menuManager_drag_button_inner" />
                            </button>
                            {item.tms3ClsfNm}
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
        {/* end: case1: 상위 메뉴(카테고리 선택시) */}

        {/* depth03 */}
        {dataList.depth3 && dataList.depth3.length > 0 ? (
          <Droppable droppableId="depth3">
            {(provided) => (
              <div className="menuManager_box" {...provided.droppableProps} ref={provided.innerRef}>
                <ul className="menuManager_list">
                  {dataList.depth3.map((item, index) => (
                    <Draggable key={item.tms4ClsfNm} draggableId={'소분류' + item.tms4ClsfNm} index={index}>
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
                            {item.tms4ClsfNm}
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
            <div className="menuManager_box_title">소분류</div>
          </div>
        )}
      </div>
    </DragDropContext>
  )
}

export default MenuManager
