import React from "react"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

//components
import Button from 'components/atomic/Button'

const ReoderEDocuPackage = (props) => {

  const { list, setList, handleButtons, handleMoveDetail } = props;


  const handleDrag = (drag) => {

    if (!drag.destination) return;

    let updatedList = [...list];
    const [reorderedItem] = updatedList.splice(drag.source.index, 1);
    updatedList.splice(drag.destination.index, 0, reorderedItem);

    updatedList.map((item, index) => {
      item["order"] = index + 1;
      return item;
    })

    setList(updatedList);
  }


  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="list-container">
        {
          (provided) => (
            <div className="t_body" {...provided.droppableProps} ref={provided.innerRef}>
              {list?.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      className="item-container"
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      <div className="t_row">
                        <div className="t_cell">
                          <div className="btn_menu">
                            <span className="bar">&nbsp;</span>
                            <span className="bar">&nbsp;</span>
                            <span className="bar">&nbsp;</span>
                          </div>
                        </div>
                        <div className="t_cell" onClick={(e) => { e.stopPropagation(); handleMoveDetail(item); }}>{item.name}</div>
                        <div className="t_cell">
                          <div className="ellipsis">{item.desc}</div>
                        </div>
                        <div className="t_cell">
                          <div>{item.item_names}</div>
                        </div>
                        <div className={`t_cell ta_center ${item.public_access === true ? 'status_public' : 'status_private'}`}>
                          {item.public_access === true ? '공개' : '비공개'}
                        </div>
                        <div className="t_cell">
                          <Button className={'basic w80'} onClick={() => handleButtons("edit", item)}>
                            수정
                          </Button>
                          <Button className={'basic w80'} onClick={() => handleButtons("delete", item)}>
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )
        }
      </Droppable>
    </DragDropContext>
  )
}

export default ReoderEDocuPackage
