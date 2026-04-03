import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef } from 'react'

import { colors } from 'assets/style/style.config'
import Button from 'components/atomic/Button'
import SearchAreaCheckBoxContainer from 'pageComponents/invest/main/SearchAreaCheckBoxContainer'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'

import { exeFunc, getFunc, setFunc } from 'modules/utils/ReactUtils'
import ReactEvent from 'modules/utils/ReactEvent'
import { CodeContext } from 'modules/contexts/common/CodeContext'

const SearchArea = forwardRef((props, ref) => {
  const codeContext = useContext(CodeContext)

  const selectedTotalCountRef = useRef(0)

  const categoryListRef = useRef()
  const techListRef = useRef()
  const investStepListRef = useRef()
  const regionListRef = useRef()
  const alertPopRef = useRef()

  useImperativeHandle(ref, () => ({
    getSelectedCheckList,
    search,
    onClickSearchReset
  }))

  const getSelectedCheckList = () => {
    const params = {
      categoryList: getFunc(categoryListRef, 'getSelectedCheckList'),
      techList: getFunc(techListRef, 'getSelectedCheckList'),
      investStepList: getFunc(investStepListRef, 'getSelectedCheckList'),
      regionList: getFunc(regionListRef, 'getSelectedCheckList')
    }

    return params
  }

  const onClickSearchReset = () => {
    exeFunc(categoryListRef, 'resetList')
    exeFunc(techListRef, 'resetList')
    exeFunc(investStepListRef, 'resetList')
    exeFunc(regionListRef, 'resetList')
    if (props.resetSearchInttNm) props.resetSearchInttNm()

    selectedTotalCountRef.current = 0
  }

  const search = () => {
    // const list = getSelectedCheckList()

    // const params = getSelectedCheckList();
    //
    // const list = [];
    // list.push(params['categoryList']);
    // list.push(params['techList']);
    // list.push(params['investStepList']);
    // list.push(params['regionList']);
    //
    // if (list.length === 0) {
    //     exeFunc(alertPopRef, 'open', '선택된 투자분야가 없습니다.');
    //     return
    // }
    // if (list.length > 5) {
    //     exeFunc(alertPopRef, 'open', '최대 5까지 복수 선택 가능');
    //     return
    // }
    // ReactEvent.dispatchEvent('search', list)
    ReactEvent.dispatchEvent('search')
  }

  const isMountedRef = useRef(false)

  useEffect(() => {
    if (codeContext.state.isLoaded && !isMountedRef.current) {
      isMountedRef.current = true

      setFunc(categoryListRef, 'setCheckList', codeContext.actions.getCategoryList())
      setFunc(techListRef, 'setCheckList', codeContext.actions.getTechList())
      setFunc(investStepListRef, 'setCheckList', codeContext.actions.getInvestStepList())
      setFunc(regionListRef, 'setCheckList', codeContext.actions.getRegionList())
    }
  }, [codeContext.state.isLoaded])

  return (
    <div className="search_bottom">
      <div className="category_wrap">
        <div className="category_header">
          <p className="category_title">투자분야</p>
          <p className="category_info">* 최대 5개까지 복수 선택 가능</p>
        </div>
        <SearchAreaCheckBoxContainer
          {...props}
          alertPopRef={alertPopRef}
          selectedTotalCountRef={selectedTotalCountRef}
          type={'category'}
          ref={categoryListRef}
        />
      </div>
      <div className="category_wrap ">
        <div className="category_header">
          <p className="category_title">관심기술</p>
        </div>
        <SearchAreaCheckBoxContainer
          {...props}
          alertPopRef={alertPopRef}
          selectedTotalCountRef={selectedTotalCountRef}
          type={'tech'}
          ref={techListRef}
        />
      </div>
      <div className="category_wrap ">
        <div className="category_header">
          <p className="category_title">투자단계</p>
        </div>
        <SearchAreaCheckBoxContainer
          {...props}
          alertPopRef={alertPopRef}
          selectedTotalCountRef={selectedTotalCountRef}
          type={'investStep'}
          ref={investStepListRef}
        />
      </div>
      <div className="category_wrap ">
        <div className="category_header">
          <p className="category_title">지역</p>
        </div>
        <SearchAreaCheckBoxContainer
          {...props}
          alertPopRef={alertPopRef}
          selectedTotalCountRef={selectedTotalCountRef}
          type={'region'}
          ref={regionListRef}
        />
      </div>
      <div className="btn_wrap">
        <Button type={'linear'} theme={colors.lightGrey} onClick={props.handleSearch}>
          닫기
        </Button>
        <Button type={'linear'} theme={colors.blue} onClick={onClickSearchReset}>
          초기화
        </Button>
        <Button theme={colors.blue} onClick={search}>
          검색
        </Button>
      </div>
      <AlertPopup ref={alertPopRef} />
    </div>
  )
})
export default SearchArea
