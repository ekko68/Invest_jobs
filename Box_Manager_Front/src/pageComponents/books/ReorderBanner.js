import React from "react"
import {Link} from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import moment from "moment";

//components
import Button from 'components/atomic/Button'

const ReorderBanner = (props) => {

  const { type = "main", list, setList, handleButtons, handleMoveDetail } = props;

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

  const layoutAdStatus = (type, item) => {
    if(item === undefined || item === null || type == undefined) return;

    let fromStart = moment().diff(moment(item.bltddSttgDt),'days')
    let fromEnd = moment(item.bltddFnshDt).diff(moment(),'days')

    switch (type){
      case "class" :
        if(fromStart < 0){ //게시 이전
          return "status_ready"
        } else if(fromEnd < 0){ //게시 종료
          return "status_close"
        } else { //게시 중
          if(item.expuYn === "Y") return "status_public"
          else return "status_private";
        }
      case "label":
        if(fromStart < 0){ //게시 이전
          return "대기"
        } else if(fromEnd < 0){ //게시 종료
          return "종료"
        } else { //게시 중
          if(item.expuYn === "Y") return "공개"
          else return "비공개";
        }
    }
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
                          </div>
                        </div>
                        {
                          type === "ad" ? (
                            <div className="t_cell" style={{display: 'inline-block'}}
                                 onClick={(e) => {e.stopPropagation(); window.open(item.bnnrLnknUrl, "_blank");}}>
                              <div>{item.bnnrLnknUrl}</div>
                            </div>
                          ) : (
                            <div className="t_cell" style={{display: 'inline-block'}}
                                 onClick={(e) => {e.stopPropagation(); handleMoveDetail(item);}}>
                              <div>{item.bnnrPhrsCon}</div>
                              <div>{item.lrrnPhrsCon}</div>
                            </div>
                          )
                        }
                        {
                          type === "ad" && (
                            <div className="t_cell ta_center" onClick={(e) => {e.stopPropagation(); handleMoveDetail(item);}}>
                              <div>{`${moment(item.bltddSttgDt).format("YYYY.MM.DD")} - ${moment(item.bltddFnshDt).format("YYYY.MM.DD")}`}</div>
                            </div>
                          )
                        }
                        {
                          type === "ad" ? (
                            <div className={`t_cell ta_center ${layoutAdStatus("class", item)}`}>
                              {layoutAdStatus("label", item)}
                            </div>
                          ) : (
                            <div className={`t_cell ta_center ${item.expuYn === "Y" ? "status_public" : "status_private"}`}>
                              {item.expuYn === "Y" ? "공개" : "비공개"}
                            </div>
                          )
                        }
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
