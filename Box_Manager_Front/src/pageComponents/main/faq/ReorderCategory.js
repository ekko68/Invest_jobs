import React from "react"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

//components
import Button from 'components/atomic/Button'
import Checkbox from "../../../components/atomic/Checkbox";

const ReorderCategory = (props) => {

  const { list, setList, handleButtons, handleCheckbox } = props;

  console.log('ddd :', list)

  const handleDrag = (drag) => {
    if (!drag.destination) return;

    let updatedList = [...list];
    const [reorderedItem] = updatedList.splice(drag.source.index, 1);
    updatedList.splice(drag.destination.index, 0, reorderedItem);

    updatedList.map((item, index) => {
      item["lnpSqn"] = index + 1;
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
                <Draggable key={item.faqCtgyId} draggableId={item.faqCtgyId} index={index}>
                  {(provided) => (
                    <div
                      className="item-container"
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      <div className="t_row">
                        <div className="t_cell">
                          <Checkbox
                            key={item.checkbox.faqCtgyId}
                            checkbox={item.checkbox}
                            onChange={(e) => handleCheckbox(e, item.checkbox.faqCtgyId)}
                            checked={item.checkbox.status}
                          />
                        </div>
                        <div className="t_cell">
                          <div className="btn_menu">
                            <span className="bar">&nbsp;</span>
                            <span className="bar">&nbsp;</span>
                            <span className="bar">&nbsp;</span>
                          </div>
                        </div>
                        <div className="t_cell ta_center">
                          {item.faqCtgyNm}
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

export default ReorderCategory
