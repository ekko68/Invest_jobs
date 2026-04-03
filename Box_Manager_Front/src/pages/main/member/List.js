import { useContext, useEffect, useState } from 'react'

//modules
import { getMemberBoxMemberList } from 'modules/consts/MainApi'
import { MainContext } from 'modules/common/MainContext'

//components
import PageLayout from 'components/PageLayout'
import NoResult from 'components/NoResult'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import MemberListItem from "pageComponents/main/member/MemberListItem";

const List = () => {

  const mainContext = useContext(MainContext);

  const [memberList, setMemberList] = useState([]);
  const [paging, setPaging] = useState(null);

  useEffect(() => {
    return () => {
      mainContext.actions.setMemberListParams();
    }
  }, []);

  useEffect(async () => {
    //IBK BOX 회원 목록
    await apiGetBoxMemberList();
  }, [mainContext.state.memberListParam?.page]);

  const apiGetBoxMemberList = async () => {
    let res = await getMemberBoxMemberList(mainContext.state.memberListParam);
    if (res.data.code ==='200') {
      let data = res.data.data;
      setMemberList(data.list || []);
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
    mainContext.actions.setMemberListParams({
      ...mainContext.state.memberListParam,
      ...param
    });
  }

  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainMember'} >
      <div className='content_inner page_member'>
        <div className='page_header'>
          <h4 className='page_title'>회원사관리</h4>
          <div className='page_header_right'>
            <div className="btn_group">
              <button className={'btn_refresh'} title={'새로고침'} onClick={apiGetBoxMemberList}>
                <span className="hide">새로고침</span>
              </button>
            </div>
          </div>
        </div>
        <div className="section user_table_section">
          {
            memberList && memberList.length > 0 ? (
              <div className="table_over_width scroll">
                <div className="table_wrap border_bottom_none table_th_border">
                  <table className="table type02">
                    <caption>주문 관리 테이블</caption>
                    <colgroup>
                      <col width={'10%'} />
                      <col width={'3%'} />
                      <col width={'10%'} />
                      <col width={'5%'} />
                      <col width={'10%'} />
                      <col width={'8%'} />
                      <col width={'12%'} />
                      <col width={'8%'} />
                      <col width={'5%'} />
                      <col width={'5%'} />
                      <col width={'5%'} />
                    </colgroup>
                    <thead>
                    <tr>
                      <th>회사명</th>
                      <th>구분</th>
                      <th>사업자번호</th>
                      <th>대표자명</th>
                      <th>정회원등록여부(IBK 인증)</th>
                      <th>CEO인증여부</th>
                      <th>클럽인증</th>
                      <th>벤처인증</th>
                      <th>업력</th>
                      <th>매출</th>
                      <th>수출액</th>
                    </tr>
                    </thead>
                    <tbody>
                      {
                        memberList.map((item) => <MemberListItem key={item.utlinsttId} item={item} />)
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="table_no_result">
                <NoResult msg={'해당 서비스를 이용하는 사용자가 없습니다.'} />
              </div>
            )
          }
          <div className={'paging_wrap'}>
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
          <SearchForm selectList={mainContext.state.memberSearchFilter}
                      searchInput={mainContext.state.memberListParam?.searchKeyword || ""}
                      setSearchInput={(text) => mainContext.actions.setMemberSearchInputText(text)}
                      onSelectActive={(selected) => mainContext.actions.setMemberSearchType(selected)}
                      handleSearch={apiGetBoxMemberList} />
        </div>
      </div>
    </PageLayout>
  )
}

export default List
