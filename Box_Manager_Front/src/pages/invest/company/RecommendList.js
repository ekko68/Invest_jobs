import { useState, useEffect, useContext, useLayoutEffect } from 'react'

import PageLayout from 'components/PageLayout'
import NoResult from 'components/NoResult'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import PopupAlert from 'components/PopupAlert'
import Checkbox from 'components/atomic/Checkbox'
import { useLocation } from 'react-router-dom'
import { UserContext } from 'modules/common/UserContext'
import { getCompanyList, saveRecommend, deleteRecommend } from 'modules/consts/InvestApi'
import { NoImage02 } from 'modules/consts/Img'
import { loader } from 'modules/utils/CommonAxios'

const RecommendList = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[2]
  const userContext = useContext(UserContext)

  const SEL_FILTER = {
    ALL: 'all',
    NORMAL: 'normal',
    RECOMMEND: 'recommend',
    // OSIV_HOPE: 'osivHope'
  };


  // ===== states
  const [list, setList] = useState(null)
  const [paging, setPaging] = useState(null)
  const [selectList, setSelectList] = useState(null) // 체크박스 선택한 목록

  // 검색
  const [searchSelList, setSearchSelList] = useState({
    active: SEL_FILTER.ALL,
    list: [
      { id: SEL_FILTER.ALL, value: SEL_FILTER.ALL, label: '전체' },
      { id: SEL_FILTER.NORMAL, value: SEL_FILTER.NORMAL, label: '일반기업' },
      { id: SEL_FILTER.RECOMMEND, value: SEL_FILTER.RECOMMEND, label: '추천기업' },
      // { id: SEL_FILTER.OSIV_HOPE, value: SEL_FILTER.OSIV_HOPE, label: '해외투자희망' },
    ]
  });

  const [searchInput, setSearchInput] = useState('')
  const [confirm, setConfirm] = useState({
    status: false,
    msg: '',
    type: ''
  })
  const [alert, setAlert] = useState({
    status: false,
    msg: ''
  })

  // ===== getList
  const getList = async (params, afterAlert) => {
    loader(true, 'Uploading...')
    let param = { page: 1 }
    if (params) {
      param = params
    }
    const res = await getCompanyList({ ...param, record: 12 })
    if (res.status === 200) {
      const data = res.data.data
      handleSetList(data.list, afterAlert)
      setPaging({
        endPage: data.endPage,
        next: data.next,
        page: data.page,
        prev: data.prev,
        record: data.record,
        startPage: data.startPage,
        total: data.total,
        totalPage: data.totalPage
      })
    }
  }
  // ===== set Initial checkbox
  const handleSetList = (list, afterAlert) => {
    const checkList = list.map((item) => ({ ...item, status: false }))
    setList(checkList)
    if (afterAlert === 'register') {
      setAlert({
        status: true,
        msg: '추천기업으로 등록되었습니다.'
      })
    } else if (afterAlert === 'delete') {
      setAlert({
        status: true,
        msg: '추천기업에서 제외되었습니다.'
      })
    }
  }

  // ===== checkbox
  // select checkbox
  const handleCheckbox = (e) => {
    let newList = []
    newList = list.map((it) => (e.target.id === it.utlinsttId ? { ...it, status: e.target.checked } : { ...it }))
    setList(newList)
    handleSelectList(newList)
  }

  // reset checkbox
  const handleResetCheckbox = () => {
    let newList = []
    newList = list.map((it) => ({ ...it, status: false }))
    setList(newList)
    setSelectList(null)
    handleSelectList(newList)
  }

  // ===== set checkbox selected list
  const handleSelectList = (selList) => {
    let selectedList = selList.filter((it) => it.status)
    setSelectList(selectedList)
  }

  // ===== confirm
  const handleConfirm = (type) => {
    if (!selectList || selectList.length <= 0) {
      setAlert({
        status: true,
        msg: '선택된 기업이 없습니다.'
      })
      return false
    }
    // type : register (등록) || delete (삭제)
    let _msg = ''
    if (type) {
      type === 'register'
        ? (_msg = '선택한 기업을 추천기업에서\n등록하시겠습니까?')
        : (_msg = '선택한 기업을 추천기업으로\n제외하시겠습니까?')
      setConfirm({
        status: true,
        msg: _msg,
        type: type
      })
    } else {
      setConfirm({
        status: false,
        msg: '',
        type: ''
      })
    }
  }

  // ===== register
  const handleRegister = async () => {
    handleConfirm(null)
    let checkList = selectList.filter((it) => it.rcmdEnprStupYn === 'Y')
    if (checkList.length > 0) {
      setAlert({
        status: true,
        msg: '선택하신 기업들 중 이미 추천기업으로 등록된 기업이 있습니다.'
      })
      return false
    }

    const idList = selectList.map((item) => item.utlinsttId)
    const data = {
      list: idList,
      adminUser: userContext.actions.getIvtAdminUser()
    }
    const res = await saveRecommend(data)
    if (res.data.code === '200') {
      await handleReset('register')
    }
  }

  // ===== delete
  const handleDelete = async () => {
    handleConfirm(null)
    let checkList = selectList.filter((it) => it.rcmdEnprStupYn === 'N')
    if (checkList.length > 0) {
      setAlert({
        status: true,
        msg: '선택하신 기업들 중 추천기업이 아닌 기업이 있습니다.'
      })
      return false
    }

    const idList = selectList.map((item) => item.utlinsttId)
    const data = {
      list: idList,
      adminUser: userContext.actions.getIvtAdminUser()
    }
    const res = await deleteRecommend(data)
    if (res.data.code === '200') {
      handleReset('delete')
    }
  }

  // ===== search
  const onSelectActive = (selected) => {
    setSearchSelList({
      ...searchSelList,
      active: selected
    })
  }
  const handleSearch = async () => {
    const params ={
      bplcNm: searchInput,
      page: 1
    };

    switch (searchSelList.active) {
      case SEL_FILTER.NORMAL:
        params.rcmdEnprStupYn = 'N';
        params.osivHopeyn = 'N';
        break;
      case SEL_FILTER.RECOMMEND:
        params.rcmdEnprStupYn = 'Y';
        break;
      // case SEL_FILTER.OSIV_HOPE:
      //   params.osivHopeyn = 'Y';
      //   break;
    }
    await getList(params)
  }

  // ===== 페이징
  const handlePaging = async (param) => {
    await getList(param)
  }

  // ===== 초기화
  const handleReset = async (afterAlert) => {
    await getList({ page: 1 }, afterAlert)
    setSelectList(null)
    setSearchSelList({
      ...searchSelList,
      active: 'all'
    })
    setSearchInput('')
  }

  // 카테고리 변경시 목록 갱신을 할 경우 활성화
  useEffect(() => {
    handleSearch();
  }, [searchSelList.active]);

  useEffect(async () => {
    await getList()
  }, [])

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      userContext.actions.setCategory(category)
    }
  }, [userContext.state.category])

  return (
    <PageLayout currentMenu={'invest'} currentCate={'investCompany'} currentPage={'investCompanyRecommendList'}>
      {alert.status && <PopupAlert msg={alert.msg} handlePopup={() => setAlert({ status: false, msg: '' })} />}
      {confirm.status && (
        <PopupConfirm msg={confirm.msg}>
          <Button className={'full_grey_dark'} onClick={() => handleConfirm(null)}>
            취소
          </Button>
          {confirm.type === 'register' ? (
            <Button className={'full_blue'} onClick={handleRegister}>
              확인
            </Button>
          ) : (
            <Button className={'full_blue'} onClick={handleDelete}>
              확인
            </Button>
          )}
        </PopupConfirm>
      )}
      <div className="content_inner page_recommend">
        <h4 className="page_title">추천기업 관리</h4>
        <div className="header_search">
          <SearchForm
            selectList={searchSelList}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            onSelectActive={onSelectActive}
            handleSearch={handleSearch}
            placeholder="회사명을 입력하세요."
          />
        </div>
        {/*section_header start*/}
        <div className="section_header">
          <div className="button_group">
            <Button className={'full_blue'} onClick={() => handleConfirm('delete')}>
              삭제
            </Button>
            <Button className={'full_blue'} onClick={() => handleConfirm('register')}>
              등록
            </Button>
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
              <span className="hide">새로고침</span>
            </button>
          </div>
        </div>
        {/*section_header end*/}
        {/*recommend_list start*/}
        {!list || list.length <= 0 ? (
          <div className="table_no_result">
            <NoResult style={{ border: 'none' }} />
          </div>
        ) : (
          <ul className="recommend_list">
            {list.map((item, idx) => {
              return (
                <li className="recommend_item" key={'item_item' + idx}>
                  <div className="recommend_item_inner">
                    {item.rcmdEnprStupYn === 'Y' && <div className="badge_wrap">추천기업</div>}
                    <div className="checkbox_wrap">
                      <Checkbox
                        checkbox={{ id: item.utlinsttId, value: '' }}
                        onChange={handleCheckbox}
                        checked={item.status}
                      />
                    </div>
                    <div className="img_wrap">
                      <img src={item.logoImageUrl ? item.logoImageUrl : NoImage02} alt="logo" />
                    </div>
                    <div className="text_info">
                      <div className="etc">
                        <span className="title line">{item.bsunDwarNm ? item.bsunDwarNm : '-'}</span>
                        <span className="title">{item.yearCnt}년</span>
                      </div>
                      <div className="com_name">{item.bplcNm}</div>
                      <div className="team">{item.btnm}</div>
                      <div className="text">{item.enprInrdCon}</div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
        {/*recommend_list end*/}
        <div className={'paging_wrap'}>{paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}</div>
      </div>
    </PageLayout>
  )
}

export default RecommendList
