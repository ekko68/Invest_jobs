import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'

import ExMenuManagerEnterprise from 'pageComponents/commerce/main/ExMenuManagerEnterprise'

const Admin_Enterprise_Menu_01_1 = (props) => {
  const menuData = {
    depth01: [
      '서비스업',
      '금융/은행업',
      'IT/정보통신',
      '판매 유통업',
      '제조/생산/화학업',
      '교육업',
      '메뉴명',
      '메뉴명3',
      '메뉴명4',
      '메뉴명5',
      '메뉴명6',
      '메뉴명7',
      '메뉴명8',
      '메뉴명9',
      '메뉴명10'
    ],
    depth02: ['가구 부속품', '데코 스티커', '리모델링', '목재', '몰딩', '바닥재', '메뉴명12', '반제품', '메뉴명14']
  }

  const history = useHistory()
  const location = useLocation()
  let path = location.pathname
  let page = path.split('/')[1]

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">기업 메뉴 관리</h4>
        </div>

        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="highlight_grey highlight">* 기업의 메뉴 순서와 이름을 변경할 수 있습니다.</p>
          </div>

          {/*tab_header start*/}
          <div className="tab_header">
            <div className="page_header_right">
              <div className="btn_group">
                <button className={'btn_refresh'} title={'새로고침'} onClick={() => {}}>
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>

          <ExMenuManagerEnterprise dataList={menuData} />
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Admin_Enterprise_Menu_01_1
