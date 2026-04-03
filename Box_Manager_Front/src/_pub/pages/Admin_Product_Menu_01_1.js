import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'

import ExMenuManager from 'pageComponents/commerce/main/ExMenuManager'

const Admin_Product_Menu_01_1 = (props) => {
  const menuData = {
    depth01: [
      '가구/인테리어',
      '가구인테리어최대열글',
      '도서',
      '디지털/가전',
      '생활 / 건강',
      '메뉴명1',
      '메뉴명2',
      '메뉴명3',
      '메뉴명4',
      '메뉴명5',
      '메뉴명6',
      '메뉴명7',
      '메뉴명8',
      '메뉴명9',
      '메뉴명10'
    ],
    depth02: [
      'DIY자재/용품',
      '거실 가구',
      '서재/사무용 가구',
      '솜류',
      '수납 가구',
      '메뉴명11',
      '메뉴명12',
      '메뉴명13',
      '메뉴명14'
    ],
    depth03: ['가구 부속품', '데코 스티커', '리모델링', '목재', '몰딩']
  }

  const history = useHistory()
  const location = useLocation()
  let path = location.pathname
  let page = path.split('/')[1]

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">상품 메뉴 관리</h4>
        </div>

        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="highlight_grey highlight">* 상품의 메뉴 순서와 이름을 변경할 수 있습니다</p>
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

          <ExMenuManager dataList={menuData} />
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Admin_Product_Menu_01_1
