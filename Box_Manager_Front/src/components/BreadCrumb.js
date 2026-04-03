/*
 * currentMenu : 현재 대메뉴 [invest || commerce || global || admin ]
 * currentCate : 현재 중메뉴 - modules/common.js > lnbList 의 id값
 * currentPage: 현재 페이지 - modules/common.js > lnbList > subList 의 id값
 * */

import { isArray } from 'chart.js/helpers'
import { navList } from 'modules/common'
import { useEffect, useState } from 'react'

const BreadCrumb = (props) => {
  const { currentMenu, currentCate, currentPage } = props
  const [breadCrumb, setBreadCrumb] = useState([])

  // const setMenuPage = () => {
  //   // 상단 네비의 선택된 메뉴 추출.
  //   let tmpList = navList.filter((list) => list.id === currentMenu)
  //
  //   // 1 depth 메뉴의 하위 메뉴(2 depth)가 있다면.
  //   if (tmpList[0].lnbList) {
  //     // 2 depth 메뉴를 추출.
  //     let menu = tmpList[0].lnbList.filter((list) => list.id === currentCate)
  //     // props.currentPage (3 depth) 가 존재하면.
  //     if (currentPage != '') {
  //       // 3 depth 메뉴 추출.
  //       let page = menu[0].subList.filter((list) => list.id === currentPage)
  //       // 1 depth label, 2 depth label, 3 depth label을 업데이트 한다.
  //       setBreadCrumb([tmpList[0].label, menu[0].label, page[0].label])
  //     } else {
  //       // 1 depth label, 2 depth label을 업데이트 한다.
  //       setBreadCrumb([tmpList[0].label, menu[0].label])
  //     }
  //   } else {
  //     // 1 depth label을 업데이트 한다.
  //     setBreadCrumb([tmpList[0].label])
  //   }
  // }

  // setMenuPage를 다른 코드로 만들어봄.
  // const getMatchMenu = () => {
  //   const selectMenus = []
  //   navList.forEach((a) => {
  //     if (a.id === currentMenu) {
  //       selectMenus.push(a)
  //       if (!a.lnbList) return
  //       a.lnbList.forEach((b) => {
  //         if (b.id === currentCate) {
  //           selectMenus.push(b)
  //           if (!b.subList) return
  //           b.subList.forEach((c) => {
  //             if (c.id === currentPage) {
  //               selectMenus.push(c)
  //               return
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  //
  //   // .forEach((a) => console.log(a.lnbList))
  //   console.log('selectMenus', selectMenus)
  //   return selectMenus.map((m) => m.label)
  // }

  /** json을 1차 배열로 Object단위로 나열함. json -> [{}, {}, ...] */
  const _flatMap = (iter, arr) => {
    if (isArray(iter)) iter.forEach((el) => _flatMap(el, arr))

    Object.entries(iter).forEach(([key, val]) => {
      if (isArray(val)) _flatMap(val, arr)
    })

    if (!isArray(iter)) arr.push(iter)
    return arr
  }

  /** flat된 Object에서 각각이 해당되는 메뉴의 이름들을 Array로 넘겨줌. json -> flat -> [{currentMenu}, {currentCate}, {currentPage}] */
  const getBreadCrumb = (iter) => {
    const newList = []
    for (const el of _flatMap(iter, [])) {
      if (currentMenu === el.id) newList[0] = el
      if (currentCate === el.id) newList[1] = el
      if (currentPage === el.id) newList[2] = el
    }
    return newList.map((o) => o.label)
  }

  useEffect(() => {
    setBreadCrumb(getBreadCrumb(navList))
  }, [])

  return (
    <ul className="breadcrumb_list">
      <li className="breadcrumb_item home">
        <span className="hide">홈으로</span>
      </li>
      {breadCrumb.map(
        (item, idx) =>
          item && (
            <li className="breadcrumb_item" key={'breadcrumb_item_' + idx}>
              {item}
            </li>
          )
      )}
    </ul>
  )
}

export default BreadCrumb
