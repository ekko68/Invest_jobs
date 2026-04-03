import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import ExSkeletonTableNew from 'pageComponents/commerce/main/ExSkeletonTableNew'

const Admin_List_Skeleton = (props) => {
  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      <div className="content_inner page_main ">
        <div className="page_header">
          <h4 className="page_title" />
        </div>

        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="highlight_grey" />
          </div>

          {/*tab_header start*/}
          <div className="tab_header">
            <ul className="tab_header_list">
              <li className={`tab_header_item active`}>
                <span className="label" />
              </li>
              <li className={`tab_header_item`}>
                <span className="label" />
              </li>
              <li className={`tab_header_item`}>
                <span className="label" />
              </li>
            </ul>
          </div>
          <ExSkeletonTableNew />
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Admin_List_Skeleton
