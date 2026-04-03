import React, {useContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

//modules
import {getMoreCreditCardImageList} from 'modules/consts/MainApi'
import { MainContext } from 'modules/common/MainContext'
import ROUTER_NAMES from "modules/consts/RouterConst";

//components
import PageLayout from 'components/PageLayout'
import Button from "components/atomic/Button";
import Pagination from "components/Pagination";
import NoResult from 'components/NoResult';

const List = () => {

  const mainContext = useContext(MainContext);
  const history = useHistory();

  const [cardImgList, setCardImgList] = useState([]);
  const [paging, setPaging] = useState(null);

  useEffect(() => {
    return () => {
      mainContext.actions.setMoreCardImgListParams();
    }
  }, []);

  useEffect(async () => {
    //IBK BOX 회원 목록
    await apiGetCardImageList();
  }, [mainContext.state.moreCardImgListParam?.page]);

  const apiGetCardImageList = async () => {
    let res = await getMoreCreditCardImageList(mainContext.state.moreCardImgListParam);
    if (res.data.code ==='200') {
      let data = res.data.data;
      setCardImgList(data.list || []);
      setPaging({
        endPage: data.endPage,
        next: data.next,
        page: data.page,
        prev: data.prev,
        record: data.record,
        startPage: data.startPage,
        total: data.total,
        totalPage: data.totalPage
      });
    }
  }

  // 페이징
  const handlePaging = async (param) => {
    mainContext.actions.setMoreCardImgListParams({
      ...mainContext.state.moreCardImgListParam,
      ...param
    });
  }

  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainMoreMenu'} currentPage={'mainMoreCardImg'}>
      <div className='content_inner page_main'>
        <div className="page_header">
          <h4 className="page_title">카드이미지등록</h4>
        </div>

        <div className={'section banner_main_section'}>
          <div className="table_wrap border_bottom_none table_th_border main_more_card scroll">
            {
              cardImgList && cardImgList.length > 0 ? (
                <div className="custom_table apply_prod_table">
                  <div className="t_header">
                    <div className="t_row header">
                      <div className="t_cell">순번</div>
                      <div className="t_cell">발급사</div>
                      <div className="t_cell">카드이미지</div>
                      <div className="t_cell">&nbsp;</div>
                    </div>
                  </div>
                  {
                    cardImgList.map((item) => (
                      <div className="t_body" key={item?.rnum}>
                        <div className="item-container">
                          <div className="t_row">
                            <div className="t_cell">{item?.rnum}</div>
                            <div className="t_cell">{item?.crccNm || "-"}</div>
                            <div className="t_cell">
                              <div className="img_wrap">
                                {
                                  item?.crccCardImgFileUrl && <img src={item.crccCardImgFileUrl} alt={item?.crccNm} />
                                }
                              </div>
                            </div>
                            <div className="t_cell">
                              <Button className={'basic w80'} onClick={() => history.push(`${ROUTER_NAMES.MAIN_MOREMENU_CARDIMG_WRITE}/${item.crccCd}`)}>
                                수정
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="table_no_result">
                  <NoResult msg={'등록된 카드이미지가 없습니다.'} />
                </div>
              )
            }
          </div>
          <div className={'paging_wrap'}>
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default List
