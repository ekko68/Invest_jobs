import React from "react"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

//components
import Button from 'components/atomic/Button'

const ReorderBanner = (props) => {

  const { list, setList, handleButtons, handleMoveDetail } = props;

  const handleDrag = (drag) => {
    if (!drag.destination) return;

    let updatedList = [...list];
    const [reorderedItem] = updatedList.splice(drag.source.index, 1);
    updatedList.splice(drag.destination.index, 0, reorderedItem);

    updatedList.map((item, index) => {
      item["bnnrSqn"] = index + 1;
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
                <Draggable key={item.bnnrImgFileId} draggableId={item.bnnrImgFileId} index={index}>
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
                        <div className="t_cell" onClick={(e) => {e.stopPropagation(); handleMoveDetail(item);}}>
                          <div className="img_title_wrap">
                            <div className="img_wrap">
                              {
                                item.imgUrl && item.imgUrl.length > 0 ? (
                                  <img src={item.imgUrl} alt={`배너_${item.bnnrSqn}`} />
                                ) : (
                                  <div className="no_img">
                                    <img src={require('assets/images/no_img.jpg').default} alt="이미지 없음" />
                                  </div>
                                )
                              }
                            </div>
                            <div className="flex_row" />
                          </div>
                        </div>
                        <div className="t_cell" style={{display: 'inline-block'}}
                             onClick={(e) => {e.stopPropagation(); window.open(item.bnnrLnknUrl, "_blank");}}>
                          <div>{item.bnnrLnknUrl}</div>
                        </div>
                        <div className={`t_cell ta_center ${item.expuYn === "Y" ? "status_public" : "status_private"}`}>
                          {item.expuYn === "Y" ? "공개" : "비공개"}
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

export default ReorderBanner
