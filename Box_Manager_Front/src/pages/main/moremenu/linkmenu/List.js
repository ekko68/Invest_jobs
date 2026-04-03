import React, { useEffect, useState } from 'react'
import {useHistory} from "react-router-dom";

//modules
import ROUTER_NAMES from "modules/consts/RouterConst"
import {getMoreLinkList} from 'modules/consts/MainApi'

//components
import PageLayout from 'components/PageLayout'
import Button from "components/atomic/Button";
import PopupAlert from 'components/PopupAlert'
import NoResult from 'components/NoResult'

const List = () => {

  const history = useHistory()

  const [linkList, setLinkList] = useState([]);
  const [popup, setPopup] = useState({active: false, type: null});

  useEffect(() => {
    apiGetLinkList();
  }, [])

  const apiGetLinkList = async () => {
    let res = await getMoreLinkList();
    if(res.data?.code === "200"){
      setLinkList(res.data.data.list);
    } else {
      setPopup({active: true, type: "error"});
    }
  }


  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainMoreMenu'} currentPage={'mainMoreLinkMenu'}>

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={'오류가 발생했습니다.'}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

      <div className='content_inner page_main'>
        <div className="page_header">
          <h4 className="page_title">링크메뉴설정</h4>
        </div>

        <div className={'section banner_main_section'}>
          {
            linkList && linkList.length > 0 ? (
              <div className="table_wrap border_bottom_none table_th_border main_more_link scroll">
                <div className="custom_table apply_prod_table">
                  <div className="t_header">
                    <div className="t_row header">
                      <div className="t_cell">순서</div>
                      <div className="t_cell">타이틀</div>
                      <div className="t_cell">링크</div>
                      <div className="t_cell">상태</div>
                      <div className="t_cell">&nbsp;</div>
                    </div>
                  </div>
                  <div className="t_body">
                    {
                      linkList.map((item, index) => (
                        <div className="item-container">
                          <div className="t_row">
                            <div className="t_cell">{index + 1}</div>
                            <div className="t_cell">
                              <span className="ellipsis2">{item?.boxLinkTtl || "-"}</span>
                            </div>
                            <div className="t_cell">
                              {item?.linkUrl ? (
                                <a className="text_url ellipsis2" href={item.linkUrl} target={"_blank"}  rel="noreferrer">
                                  {item.linkUrl}
                                </a>
                              ) : (
                                "-"
                              )}
                            </div>
                            <div className="t_cell ta_center">
                              {
                                item?.oppbYn === "Y" ? (
                                  <div className="status_public">공개</div>
                                ) : (
                                  <div className="status_private">비공개</div>
                                )
                              }
                            </div>
                            <div className="t_cell">
                              <Button className={'basic w80'}
                                      onClick={() => history.push(`${ROUTER_NAMES.MAIN_MOREMENU_LINKMENU_WRITE}/${item?.boxLinkId}`)}>
                                수정
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            ) : (
              <div className="table_no_result">
                <NoResult msg={'등록된 링크메뉴가 없습니다.'} />
              </div>
            )
          }
        </div>
      </div>
    </PageLayout>
  )
}

export default List
