import React from 'react'
import { Link } from 'react-router-dom'

import 'assets/style/component/menuManager.scss'
// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const ExMenuManager = (props) => {
  const { dataList } = props

  return (
    <div className="menuManager_wrap col2">
      {/* depth01 */}
      <div className="menuManager_box">
        <ul className="menuManager_list">
          {dataList.depth01.map((item, idx) => {
            return (
              <li className="menuManager_item" key={'menuManager_depth01' + idx}>
                <Link to={'#'} className="menuManager_link">
                  <button type="button" className="menuManager_drag_button" aria-label="드래그해서 이동">
                    <span className="menuManager_drag_button_inner" />
                  </button>
                  {item}
                  <button type="button" className="menuManager_modify_button" aria-label="수정" />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* depth02 */}
      <div className="menuManager_box">
        <ul className="menuManager_list">
          {dataList.depth02.map((item, idx) => {
            return (
              <li className="menuManager_item" key={'menuManager_depth03' + idx}>
                <div className="menuManager_setting_group">
                  <button type="button" className="menuManager_drag_button" aria-label="드래그해서 이동">
                    <span className="menuManager_drag_button_inner" />
                  </button>
                  {item}
                  {/* <button type="button" className="menuManager_setting_button" aria-label="설정" /> */}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* depth02 */}
      {/* case2: 상위 메뉴(카테고리 미선택시) */}
      <div className="menuManager_box">
        <div className="menuManager_box_title">중분류</div>
      </div>
      {/* end2: case: 상위 메뉴(카테고리 미선택시) */}
    </div>
  )
}

export default ExMenuManager
