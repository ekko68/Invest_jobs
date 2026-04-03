/** @jsxImportSource @emotion/react */
import { pagination01Style } from 'assets/style/ComponentStyle'
import { useEffect, useState } from 'react'
import {createKey} from "modules/utils/CommonUtils";


/**
 * 페이지 네비게이션 버튼을 그림.
 * @param onChangePageNum 페이지 버튼이 클릭시 부모에게 요청함.
 * @param currentPage 현재페이지 수.
 * @param perPageNum 한페이지에서 보여줄 Row 수.
 * @param total 총 게시글의 수.
 */
const Pagination01 = ({ onChangePageNum, currentPage, perPageNum, total }) => {
  /**
   * @element startPage 시작 페이지 번호.
   * @element endPage 시작 페이지 번호.
   * @element prev 이전 버튼 생성 여부.
   * @element next 다음 버튼 생성 여부.
   * @element displayPageNum 화면에 보여질 페이지 번호의 갯수.
   */
  const [pageMaker, setPageMaker] = useState({
    startPage: 0,
    endPage: 0,
    prev: false,
    next: false,
    displayPageNum: 3
  })

  const { startPage, endPage, prev, next, displayPageNum } = pageMaker

  /**
   * 첫페이지 번호, 마지막페이지 번호, 이전, 다음 버튼 표시 여부 계산후 상태값 변경.
   */
  const calcData = () => {
    if (!total) return
    const page = currentPage <= 0 ? 1 : currentPage
    let endPage = Math.ceil(page / displayPageNum) * displayPageNum
    let startPage = endPage - displayPageNum + 1

    if (startPage <= 0) startPage = 1

    const tempEndPage = Math.ceil(total / perPageNum)
    if (endPage > tempEndPage) endPage = tempEndPage

    const prev = startPage === 1 ? false : true
    const next = endPage * perPageNum < total ? true : false

    setPageMaker((prevState) => {
      return { ...prevState, endPage: endPage, startPage: startPage, prev: prev, next: next }
    })
  }

  /**
   * 이전 버튼 클릭시 페이지 계산후 부모에게 요청.
   * @param e
   */
  const onPrevious = (e) => {
    const page = startPage - displayPageNum
    onChangePageNum(page)
  }

  /**
   * 다음 버튼 클릭시 페이지 계산후 보모에게 요청.
   * @param e
   */
  const onNext = (e) => {
    const page = startPage + displayPageNum
    onChangePageNum(page)
  }

  /**
   * 나열되어 있는 페이지 버튼을 클릭시 해당 번호를 보모에게 요청.
   * @param e
   */
  const onSelectPage = (e) => {
    const pageNumber = Number(e.target.dataset.pageNumber)
    onChangePageNum(pageNumber)
  }

  /**
   * 계산된 값으로 페이지 네비게이션 버튼을 나열함.
   * @returns [페이지 네비게이션 버튼 리스트 jsx]
   */
  const getButtons = () => {
    const list = []

    let cnt = 0;

    if (prev) {
      list.push(
        <button key={createKey()} onClick={onPrevious}>
          <img src={'/images/pagination_left.png'} alt="" />
        </button>
      )
      cnt++;
    }

    for (let i = 0; i < displayPageNum; i++) {
      const pageNum = Number(i + startPage)
      if (pageNum > endPage) {
        continue
      }
      const button = (
        <button
          className={currentPage === pageNum ? 'active' : ''}
          data-page-number={pageNum}
          onClick={onSelectPage}
          key={createKey()}
        >
          {pageNum}
        </button>
      )
      list.push(button)
      cnt++;
    }

    if (next) {
      list.push(
        <button key={createKey()} onClick={onNext}>
          <img src={'/images/pagination_right.png'} alt="" />
        </button>
      )
      cnt++;
    }
    return list
  }

  /**
   * 페이지 네비게이션 버튼 저장.
   */
  let pageButtons = getButtons()

  useEffect(() => {
    if (total) {
      calcData()
    }
  }, [total, currentPage])

  return (
    <div className="pagination01" css={pagination01Style}>
      {/* button + active */}
      {pageButtons}
    </div>
  )
}

export default Pagination01
