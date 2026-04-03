import NoResult from 'components/NoResult'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import Button from 'components/atomic/Button'
import * as commonFn from 'modules/fns/commonFn'
import Badge from 'components/atomic/Badge'
import { getTotalNumberBoard } from 'modules/common'

const AddProdtable = (props) => {
  const { addProdList, handleDrop, paging, handleApproveCancel, handleSort } = props
  const extractCategory = (category) =>
    category
      ?.replace(/\{/g, '')
      .replace(/\}/g, '')
      .replace(/11번가,/g, '')
      .replace(/,/g, '>')
  return (
    <div className={'section complete_prod_section'} style={{ marginBottom: '150px' }}>
      <div className="table_header">
        <h4 className="table_title">선정된 상품({paging ? paging?.total : 0})</h4>
        <div className="btn_group">
          <Button
            className={'full_blue'}
            style={{ minWidth: '100px' }}
            onClick={handleSort}
            disabled={!addProdList || addProdList.length <= 0 ? true : false}
          >
            순서 변경 저장
          </Button>
        </div>
      </div>
      {!addProdList || addProdList.length === 0 ? (
        <div className="table_no_result">
          <NoResult msg={'아직 승인된 상품이 없습니다.'} />
        </div>
      ) : (
        <div className="table_wrap border_bottom_none table_th_border add_prod_table scroll">
          {/*custom_table start*/}
          <div className="custom_table apply_prod_table">
            <div className="t_header">
              <div className="t_row header">
                <div className="t_cell">&nbsp;</div>
                <div className="t_cell">NO</div>
                <div className="t_cell">상품명</div>
                <div className="t_cell">판매사</div>
                <div className="t_cell">판매가</div>
                <div className="t_cell">분류</div>
                <div className="t_cell">&nbsp;</div>
              </div>
            </div>
            <div className="t_body">
              {/*sortable start*/}
              <DragDropContext onDragEnd={handleDrop}>
                <Droppable droppableId="list-container">
                  {(provided) => (
                    <div className="list-container" {...provided.droppableProps} ref={provided.innerRef}>
                      {addProdList?.map((item, index) => (
                        <Draggable key={item.pdfInfoId} draggableId={item.pdfInfoId} index={index}>
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
                                <div className="t_cell ta_center">
                                  <span>
                                    {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, index)}
                                  </span>
                                </div>
                                <div className="t_cell">
                                  <div className="img_title_wrap">
                                    <div className="img_wrap">
                                      {item.imgUrl ? (
                                        <img src={item.imgUrl} alt={item.title} />
                                      ) : (
                                        <div className="no_img">
                                          <img src={require('assets/images/no_img.jpg').default} alt="이미지 없음" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex_row">
                                      {item.pdfAgenState === 'Y' && (
                                        <Badge className={'full_blue square'} style={{ borderRadius: '3px' }}>
                                          에이전시
                                        </Badge>
                                      )}

                                      <p className="name">{item.pdfNm}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="t_cell ta_center">{item.bplcNm}</div>
                                <div className="t_cell ta_center">
                                  {item.prcDscsYn === 'Y'
                                    ? '가격협의'
                                    : commonFn.krwFormatter(Number(item.pdfPrc) - Number(item.salePrc)) +
                                      item.comPrcutNm}
                                </div>
                                <div className="t_cell ta_center" style={{ wordBreak: 'keep-all', lineHeight: '1.2' }}>
                                  {extractCategory(item.ctgyData)}
                                </div>
                                <div className="t_cell ta_center">
                                  <Button
                                    className={'full_grey'}
                                    onClick={() => handleApproveCancel(item.evntInfId, item.pdfInfoId)}
                                  >
                                    승인 취소
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              {/*sortable end*/}
            </div>
          </div>
          {/*custom_table end*/}
        </div>
      )}
    </div>
  )
}

export default AddProdtable
