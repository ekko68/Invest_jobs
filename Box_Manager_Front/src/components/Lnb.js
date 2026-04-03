import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StringUtils } from "../modules/utils/StringUtils";

/*
 * currentMenu : 현재 대메뉴 [invest || commerce || global || admin ]
 * currentCate : 현재 중메뉴 - modules/common.js > lnbList 의 id값
 * currentPage: 현재 페이지 - modules/common.js > lnbList > subList 의 id값
 * */

const Lnb = (props) => {
  const { currentMenu, currentCate, currentPage, navList } = props
  // const { currentMenu, currentCate, currentPage } = props
  const [menu, setMenu] = useState('')
  const [lnbList, setLnbList] = useState(null) // lnb 목록

  // subMenu를 가공하여 List로 넘겨줌
  const returnSubMenu = (subList) => {
    return subList.map((sub) =>
      sub.menuId === currentPage ? { ...sub, subMenuActive: true } : { ...sub, subMenuActive: false }
    )
  }

  // LnbMenu에서 LnbMenuActive 키값만을 true로 변경하여 넘겨줌.
  const returnLnbMenuOnlyActive = (list) => {
    return { ...list, menuActive: true }
  }

  // LnbMenu를 가공하여 Object로 넘겨줌
  const returnLnbMenu = (list) => {
    return {
      ...list,
      menuActive: false,
      subActive: true,
      subList: returnSubMenu(list.subList)
    }
  }

  // 처음 렌더 됬을때 메뉴 설정
  const setInitialLnbSetting = (list) => {
    if (list && list.length > 0) {
      // 투자Box, 커머스Box, 관리자계정 메뉴 목록을 가져옴
      let tmpList = list.filter((item) => item.menuId === currentMenu)

      // 메뉴 권한이 없는 경우
      if(tmpList.length == 0) {
        return;
      }

      setMenu(tmpList[0].menuNm)

      // 헤더의 선택 메뉴의 하위 메뉴가 없는 경우 label값만 설정한다.
      if (!tmpList[0].lnbList) {
        return
      }

      // 현재 페이지에 맞춰 상태값을 설정함
      let activeMenu = tmpList[0].lnbList.map((list) =>
        list.menuId === currentCate // 현재 페이지가 해당 메뉴면
          ? list.subList
            ? returnLnbMenu(list) // 하위 메뉴가 있으면 하위 메뉴 열어줌
            : returnLnbMenuOnlyActive(list) // 하위 메뉴 없으면 해당 메뉴가 활성화
          : list
      )
      setLnbList(activeMenu)
      // console.log("list--->",list)
    }
  }

  const handlSubActive = (id) => {
    let newList = lnbList.map((list) =>
      list.menuId === id
        ? (list.subList?.length > 0)
          ? {
              ...list,
              subActive: !list.subActive,
              menuActive: true,
              // subList: list.subList.map((sub) => ({ ...sub, subMenuActive: false }))
            }
          : { ...list, subActive: !list.subActive, menuActive: true }
        : { ...list, subActive: false, menuActive: false }
    )
    setLnbList(newList)
  }

  useEffect(() => {
    if (navList && navList.length !== 0) {
      setInitialLnbSetting(navList)
      // console.log('Lnb navList ', navList)
    }
  }, [navList])

  return (
    <nav className="lnb_wrap">
      <div className="lnb_inner">
        <h2 className="lnb_menu">{menu ? menu : ''}</h2>
        <ul className="lnb_list">
          {/*
          has_sub: 하위메뉴 있는경우 아이콘 표시
          active_sub: 하위메뉴 활성화
          active: 활성화
          */}
          {lnbList &&
            lnbList?.map((lnb, idx) => (
              <li
                // className={`lnb_item ${lnb.subList ? ' has_sub' : ''}${lnb.subActive ? ' active_sub' : ''}${lnb.menuActive ? ' active' : ''}`}
                className={`lnb_item ${lnb.subList ? ' has_sub' : ''}${lnb.subActive ? ' active_sub' : ''}${(lnb.menuId === currentCate && !(lnb.subList?.length > 0)) ? ' active' : ''}`}
                key={lnb.menuId + '_' + idx}
              >
                <p className={`main_menu`} onClick={() => handlSubActive(lnb.menuId)}>
                  {
                    lnb.subList ?
                      lnb.menuUrl ? <Link to={lnb.menuUrl}>{lnb.menuNm}</Link>: <span>{lnb.menuNm}</span>
                    :
                      <Link to={lnb.menuUrl}>{lnb.menuNm}</Link>}
                </p>
                {lnb.subList && (
                  <ul className="sub_lnb_list">
                    {lnb.subList.map((sub, idx) =>
                      sub.menuUrl ? (
                        <li
                          className={`sub_lnb_item ${sub.subMenuActive ? 'active' : ''} ${
                          // className={`sub_lnb_item ${(sub.menuId == currentCate) ? 'active' : ''} ${
                            lnb.menuId === 'static' ? 'static' : ''
                          }`}
                          key={sub.menuId + '_' + idx}
                        >
                          {/*<p className="sub_menu">*/}
                          {/*  <Link to={sub.menuUrl}>*/}
                          {/*    {sub.menuNm}*/}
                          {/*  </Link>*/}
                          {/*</p>*/}
                          <Link to={sub.menuUrl}>
                            <p className="sub_menu" dangerouslySetInnerHTML={{__html: StringUtils.toBr(sub.menuNm)}}/>
                          </Link>
                        </li>
                      ) : (
                        <li className={`sub_lnb_item `} key={sub.menuId + '_' + idx}>
                            <p className="sub_menu_cate">{sub.menuNm}</p>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </li>
            ))}
        </ul>
      </div>
    </nav>
  )
}

export default Lnb
