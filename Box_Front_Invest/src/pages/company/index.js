/** @jsxImportSource @emotion/react */

import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { companyMainStyle } from 'assets/style/CompanyStyle'
import { colors } from 'assets/style/style.config'

import { SwiperSlide } from 'swiper/react'
import Slider6 from 'components/common/slider/Slider6'
import Gallery01 from 'components/common/Gallery01'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import BreadCrumbs from 'components/common/BreadCrumbs'
import NoResult from 'components/common/NoResult'
import Slider4 from 'components/common/slider/Slider4'

import RecommendCompanyCard from 'pageComponents/mypage/investor/dashboard/RecommendCompanyCard'
import CompanyInfoCard from 'pageComponents/company/CompanyInfoCard'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import CompanySearch from 'pageComponents/company/CompanySearch'

import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import { exeFunc, getFunc, setFunc } from 'modules/utils/ReactUtils'
import QueryUtils from 'modules/utils/QueryUtils'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { StringUtils } from 'modules/utils/StringUtils'
import { createKey, deepCopyByRecursion, randomEmptyLogoImageIdx } from 'modules/utils/CommonUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { AlertLabels, CheckYn, CompanyListSortType, CprSe, SelCmmId, UsisType } from 'modules/consts/BizConst'
import CommonAxios, { getPostConfig } from 'modules/utils/CommonAxios'

const Company = (props) => {
  const history = useHistory()
  const commonContext = useContext(CommonContext)

  const companySearchRef = useRef()
  const [bannerList, setBannerList] = useState([])

  let alertPopRef = useRef()

  const galleryData = {
    title: '기업정보',
    subInfo: '', // 혁신적인 스타트업을 찾아보세요.
    img: '/images/gallery03_img1.png'
  }
  // 목록헤더 - 필터검색
  const SEL_FILER = {
    ALL: SelCmmId.ALL,
    INVEST_HOPE: 'investHope',
    RECOMMEND: 'recommend',
    POPULARITY: 'popularity'
  }
  const [selectFilterList, setSelectFilterList] = useState({
    selected: SEL_FILER.ALL,
    selList: [
      { id: SEL_FILER.ALL, value: '전체' },
      { id: SEL_FILER.INVEST_HOPE, value: '투자희망기업' },
      { id: SEL_FILER.RECOMMEND, value: '추천기업' },
      { id: SEL_FILER.POPULARITY, value: '선호기업' }
    ]
  })
  const SEL_ORDER = {
    POPULAR: 'popular',
    RECENT: 'recent'
  }
  const [selectPopularOrderList, setSelectPopularOrderList] = useState({
    selected: SEL_ORDER.POPULAR,
    selList: [
      { id: SEL_ORDER.POPULAR, value: '인기 순' },
      { id: SEL_ORDER.RECENT, value: '최신 등록 순' }
    ]
  })

  // 추천기업 목록
  const [rcmdList, setRcmdList] = useState([])

  // 매칭 투자희망기업 목록
  const [matchingList, setMatchingList] = useState([])

  // 기본 기업목록 정보
  const callCheckRef = useRef(0)
  const pageRef = useRef(1)
  const recordRef = useRef(10)

  const totalPageRef = useRef(0)
  const [list, setList] = useState([])

  const searchParamRef = useRef({
    companyNm: '',
    minSale: null,
    maxSale: null,
    minDate: '',
    maxDate: '',
    minMember: null,
    maxMember: null,
    bizSelect: SelCmmId.ALL,
    region: SelCmmId.ALL,
    companyType: SelCmmId.ALL
    // bizSize: '',
  })

  const search = async () => {
    setFunc(companySearchRef, 'close')
    pageRef.current = 1
    recordRef.current = 10
    totalPageRef.current = 1
    searchParamRef.current = { ...getFunc(companySearchRef, 'getSearchItem') }

    return new Promise((resolve) => {
      if (commonContext.state.user?.info?.type === UsisType.INVESTOR) callCheckRef.current = 2
      else callCheckRef.current = 1

      callCheckRef.current > 1 &&
        loadMatchingCompanyInfo()
          .then((res) => {
            callCheckRef.current--
            if (res)
              setMatchingList(
                res.map((item) => {
                  return { ...item, key: createKey() }
                })
              )
          })
          .catch((err) => {
            console.error(err)
            callCheckRef.current--
          })

      loadCompanyInfo(true)
        .then((res) => callCheckRef.current--)
        .catch((err) => {
          console.error(err)
          callCheckRef.current--
        })

      const timer = setInterval(() => {
        if (callCheckRef.current == 0) {
          clearInterval(timer)
          resolve()
        }
      }, 500)
    })
  }

  const onClickSearch = () => {
    commonContext.actions.callbackAfterSessionRefresh(search, true, true)
  }

  const loadRcmdCompanyList = async () => {
    const params = {
      // 추천기업 12개 제한
      page: 1,
      record: 12,

      rcmdEnprStupYn: CheckYn.YES,
      sortType: CompanyListSortType.SORT_RANDOM
    }

    const res = await ResponseUtils.getList(Api.company.infoList, params)
    return res
  }

  const loadMatchingCompanyInfo = async () => {
    if (!(commonContext.state.user?.info?.type === UsisType.INVESTOR)) return null

    const res = await ResponseUtils.getList(Api.my.vc.recommendCompanyList)
    return res
  }

  const loadCompanyInfo = async (isInitList = false, isLoading = false) => {
    exeFunc(companySearchRef, 'close')
    const searchItem = searchParamRef.current

    const params = {
      // 기업 페이지 정보는 로그인 정보에 따라 호출 방식이 다름
      // -> 기업 사용자 : 다음 페이지 목록 추가
      // -> 투자사 사용자 : record를 추가하는 방식
      page: pageRef.current,
      record: recordRef.current,
      pageSize: 1,

      bplcNm: searchItem['companyNm'],

      invmFildCd: searchItem['bizSelect'] === SelCmmId.ALL ? '' : searchItem['bizSelect'],
      enprDsncClsfCd: searchItem['companyType'] === SelCmmId.ALL ? '' : searchItem['companyType'],
      bsunDwarCd: searchItem['region'] === SelCmmId.ALL ? '' : searchItem['region'],

      fondDeSt: searchItem['minDate'],
      fondDeFn: searchItem['maxDate'],

      msrnAmslAmtSt: searchItem['minSale'],
      msrnAmslAmtFn: searchItem['maxSale'],
      empCntSt: searchItem['minMember'],
      empCntFn: searchItem['maxMember'],

      invmHopeYn: selectFilterList.selected === SEL_FILER.INVEST_HOPE ? CheckYn.YES : null,
      rcmdEnprStupYn: selectFilterList.selected === SEL_FILER.RECOMMEND ? CheckYn.YES : null,

      sortType:
        selectFilterList.selected === SEL_FILER.POPULARITY && selectPopularOrderList.selected === SEL_ORDER.POPULAR
          ? CompanyListSortType.SORT_PREFERENCE
          : CompanyListSortType.SORT_DEFAULT,

      isPreferYn: selectFilterList.selected === SEL_FILER.POPULARITY ? CheckYn.YES : null
    }

    const res = await ResponseUtils.getObject(Api.company.infoList, params, ['page', 'totalPage'], 'list', isLoading)

    if (res) {
      pageRef.current = res.page
      totalPageRef.current = res.totalPage
      isInitList
        ? setList(
            res.list?.map((item) => {
              return { ...item, key: createKey() }
            })
          )
        : setList([
            ...list,
            ...res.list?.map((item) => {
              return { ...item, key: createKey() }
            })
          ])
    } else {
      isInitList ? setList([]) : setList([...list])
    }
  }

  const loadBannerList = async () => {
    const resBannerList = await ResponseUtils.getList(Api.company.banner, null, 'list', false)
    console.log('resBannerList = ', resBannerList)
    return resBannerList
  }

  const callNextPage = async () => {
    let isInvestor = false

    if (commonContext.state.user?.info?.type === UsisType.INVESTOR) {
      pageRef.current = 1
      recordRef.current += 10
      callCheckRef.current = 2
      isInvestor = true
    } else {
      pageRef.current++
      recordRef.current = 10
      callCheckRef.current = 1
    }

    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        return new Promise((resolve) => {
          isInvestor &&
            loadMatchingCompanyInfo()
              .then((res) => {
                callCheckRef.current--
                if (res)
                  setMatchingList(
                    res.map((item) => {
                      return { ...item, key: createKey() }
                    })
                  )
              })
              .catch((err) => {
                console.error(err)
                callCheckRef.current--
              })

          loadCompanyInfo(isInvestor)
            .then((res) => {
              callCheckRef.current--
            })
            .catch((err) => {
              console.error(err)
              callCheckRef.current--
            })

          const timer = setInterval(() => {
            if (callCheckRef.current == 0) {
              clearInterval(timer)
              resolve()
            }
          }, 500)
        })
      },
      true,
      true
    )
  }

  const onClickUpdateLikeToggle = async (targetUsisId) => {
    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        const res = await CommonAxios(getPostConfig(Api.company.likeToggleSave, { id: targetUsisId }))
        if (res?.data?.code == '200') {
          const _list = deepCopyByRecursion(list)
          const _matchingList = deepCopyByRecursion(matchingList)

          const _targetIdx = _list.findIndex((e) => e.utlinsttId === targetUsisId)
          const _mTargetIdx = _matchingList.findIndex((e) => e.utlinsttId === targetUsisId)

          const rsltLike = res.data.data.isPrefer

          if (_targetIdx > -1)
            _list[_targetIdx] = {
              ..._list[_targetIdx],
              loginUsisLikeYn: rsltLike === CheckYn.YES ? CheckYn.YES : CheckYn.NO,
              prefCnt: rsltLike === CheckYn.YES ? _list[_targetIdx].prefCnt + 1 : _list[_targetIdx].prefCnt - 1
            }
          if (_mTargetIdx > -1)
            _matchingList[_mTargetIdx] = {
              ..._matchingList[_mTargetIdx],
              loginUsisLikeYn: rsltLike === CheckYn.YES ? CheckYn.YES : CheckYn.NO,
              prefCnt:
                rsltLike === CheckYn.YES
                  ? _matchingList[_mTargetIdx].prefCnt + 1
                  : _matchingList[_mTargetIdx].prefCnt - 1
            }

          setList(_list)
          setMatchingList(_matchingList)
        } else {
          exeFunc(alertPopRef, 'open', AlertLabels.askAdmin)
        }
      },
      true,
      true
    )
  }

  const isMounted = useRef(false) // useEffect에서 mount 유무 동기확인을 위함
  const mountApiCntRef = useRef(0)

  const [mountChkState, setMountChkState] = useState(false) // 초기 마운트 이후 상황에 따른 리랜더링처리를 위함

  const isUpdateBySelectFilterRef = useRef(false)
  const isUpdateByPopularOrderRef = useRef(false)

  useEffect(() => {
    // deps 업데이트 시점만
    if (isUpdateBySelectFilterRef.current) {
      isUpdateBySelectFilterRef.current = false

      if (selectFilterList.selected !== SEL_FILER.POPULARITY && selectPopularOrderList.selected !== SEL_ORDER.POPULAR) {
        // 인기기업 조회가 아닌 경우 selectPopularOrderList selected를 'popular'로 되돌린다.
        // 이때 isUpdateByPopularOrderRef는 false처리
        isUpdateByPopularOrderRef.current = false

        const _selectPopularOrderList = deepCopyByRecursion(selectPopularOrderList)
        _selectPopularOrderList.selected = SEL_ORDER.POPULAR
        setSelectPopularOrderList(_selectPopularOrderList)
      }

      commonContext.actions.callbackAfterSessionRefresh(search, true, true)
    }
    if (isUpdateByPopularOrderRef.current) {
      isUpdateByPopularOrderRef.current = false
      commonContext.actions.callbackAfterSessionRefresh(search, true, true)
    }
  }, [selectFilterList, selectPopularOrderList])

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
      isMounted.current = true

      commonContext.actions.pageMountPathCheck(
        history,
        async () => {
          mountApiCntRef.current = 4
          window.scrollTo(window.scrollX, 0)

          // api 조회

          loadRcmdCompanyList()
            .then((res) => {
              mountApiCntRef.current--
              setRcmdList(
                res?.map((item) => {
                  return { ...item, key: createKey() }
                })
              )
            })
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })

          loadMatchingCompanyInfo()
            .then((res) => {
              mountApiCntRef.current--
              if (res)
                setMatchingList(
                  res.map((item) => {
                    return { ...item, key: createKey() }
                  })
                )
            })
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })

          loadBannerList()
            .then((res) => {
              mountApiCntRef.current--
              console.log('res = ', res)
              setBannerList(res)
            })
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })

          const query = QueryUtils.getQuery(props)
          if (query.hasOwnProperty('invmFildCd')) {
            const param = {
              companyNm: '',
              minSale: null,
              maxSale: null,
              minDate: '',
              maxDate: '',
              minMember: null,
              maxMember: null,
              bizSelect: query['invmFildCd'],
              region: SelCmmId.ALL,
              companyType: SelCmmId.ALL
            }
            setFunc(companySearchRef, 'setSearchInitParam', param)
            searchParamRef.current = { ...param }
          }

          pageRef.current = 1
          recordRef.current = 10
          loadCompanyInfo(false, false)
            .then((res) => {
              mountApiCntRef.current--
              setMountChkState(true)
            })
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })

          // 계정에 따른 드롭박스 처리
          if (commonContext.state.user.info?.type === UsisType.COMPANY) {
            const _selOrderList = deepCopyByRecursion(selectFilterList)
            if (_selOrderList.selList) {
              _selOrderList.selList = _selOrderList.selList.filter((e) => e.id !== SEL_FILER.POPULARITY)
            }
            setSelectFilterList(_selOrderList)
          }
        },
        mountApiCntRef
      )
    }
  }, [commonContext.state.user])

  useEffect(() => {
    return () => {
      isMounted.current = false
      setMountChkState(false)
    }
  }, [])

  return (
    <>
      <Header page={'sub'} {...props} />
      <div className="page_container">
        <div className="wrap company_wrap company_main_wrap bg02" css={companyMainStyle}>
          <div className="gallery_logo_wrap">
            <Gallery01 data={galleryData} />
          </div>
          <BreadCrumbs {...props} />
          <div className="container default_size02" style={{ minHeight: 'calc(100vh - 530px)' }}>
            <CompanySearch ref={companySearchRef} onClickSearch={onClickSearch} alertPopRef={alertPopRef} />

            {/* 추천기업 */}
            <div className="company_list_wrap">
              <div className="list_header">
                <h3 className="title">추천기업</h3>
              </div>
              {rcmdList?.length > 0 ? (
                <div className="recommend_slide_wrap">
                  <Slider6
                    loop={false}
                    autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                  >
                    {rcmdList.map((item, idx) => (
                      <SwiperSlide key={item.key}>
                        <div
                          className="recommend_slide"
                          style={{ cursor: 'pointer' }}
                          onClick={() => history.push(ROUTER_NAMES.COMPANY_DETAIL + '?utlinsttId=' + item.utlinsttId)}
                        >
                          <div className="slide_item">
                            {StringUtils.hasLength(item?.logoImageUrl) && item?.defaultLogoYn === CheckYn.NO ? (
                              <div className="img_wrap">
                                <img src={item.logoImageUrl} alt="추천기업로고" />
                              </div>
                            ) : (
                              <div className="empty_img">
                                <p>{item.defaultLogoChar}</p>
                                {/*<img src={require(`assets/images/empty_${randomEmptyLogoImageIdx(item.key)}.png`).default} alt="추천기업디폴트로고"/>*/}
                                <img
                                  src={
                                    require('assets/images/empty_' + randomEmptyLogoImageIdx(item.key) + '.png').default
                                  }
                                  alt="추천기업디폴트로고"
                                />
                              </div>
                            )}
                            <div className="info_wrap">
                              <p className="title">{item.bplcNm}</p>
                              <p className="sub_text">{item.enprInrdCon}</p>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Slider6>
                </div>
              ) : (
                <NoResult msg={'추천기업 정보가 없습니다.'} style={{ marginTop: '40px', marginBottom: '40px' }} />
              )}
            </div>

            {/* 매칭 투자 희망 기업 (마이페이지 투자희망기업 기준) */}
            {commonContext.state.user?.info?.type === UsisType.INVESTOR && (
              <div className="company_list_wrap">
                <div className="list_header">
                  <h3 className="title">매칭 투자희망기업</h3>
                </div>
                {matchingList?.length > 0 ? (
                  <div className="recommend_invest_wrap">
                    <Slider4 slidesPerView={6}>
                      {matchingList.map((item) => (
                        <SwiperSlide key={item.key}>
                          <div className="recommend_invest_section">
                            <div className="recommend_invest_item">
                              <RecommendCompanyCard
                                item={item}
                                toggleLike={(targetId) => onClickUpdateLikeToggle(targetId)}
                              />
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Slider4>
                  </div>
                ) : (
                  <NoResult
                    msg={'매칭 투자 희망 기업 정보가 없습니다.'}
                    style={{ marginTop: '40px', marginBottom: '40px' }}
                  />
                )}
              </div>
            )}

            {/* 기존 일반 기업 목록*/}
            <div className="company_list_wrap">
              <div className="list_header">
                <h3 className="title">기업정보</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <Select
                    className={'type02'}
                    optList={selectFilterList.selList}
                    selected={selectFilterList.selected}
                    onChange={(event) => {
                      isUpdateBySelectFilterRef.current = true
                      setSelectFilterList({
                        ...selectFilterList,
                        selected: event.target.value
                      })
                    }}
                    title="기업정보필터"
                  />
                  {selectFilterList.selected === SEL_FILER.POPULARITY && (
                    <Select
                      className={'type02'}
                      optList={selectPopularOrderList.selList}
                      selected={selectPopularOrderList.selected}
                      onChange={(event) => {
                        isUpdateByPopularOrderRef.current = true
                        setSelectPopularOrderList({
                          ...selectPopularOrderList,
                          selected: event.target.value
                        })
                      }}
                      title="인기기업 정렬 필터"
                    />
                  )}
                </div>
              </div>
              <div className="company_list">
                {list?.length > 0 ? (
                  list.map((companyInfo, index) => (
                    <CompanyInfoCard
                      key={companyInfo.key}
                      toggleLike={(targetId) => onClickUpdateLikeToggle(targetId)}
                      flgSqn={`CompanyInfoCardItem_${index}`}
                      companyInfo={companyInfo}
                    />
                  ))
                ) : mountChkState ? (
                  <NoResult msg={'검색된 결과가 없습니다.'} style={{ marginTop: '40px' }} />
                ) : (
                  <></>
                )}
              </div>
              <div className="btn_group">
                {totalPageRef.current > pageRef.current && (
                  <Button
                    theme={colors.blue}
                    className={'btn_more'}
                    // onClick={() => commonContext.actions.callbackAfterSessionRefresh(loadCompanyInfo, true, true)}>
                    onClick={callNextPage}
                  >
                    더보기
                  </Button>
                )}
              </div>
              <AlertPopup ref={alertPopRef} />
            </div>

            <div className="banner_wrap">
              {!(bannerList?.length > 0) ? (
                <></>
              ) : (
                <img
                  style={{ cursor: 'pointer' }}
                  src={bannerList[0].imgUrl}
                  alt="기업정보 배너이미지"
                  onClick={() => {
                    if (StringUtils.hasLength(bannerList[0].bnnrLnknUrl)) window.open(bannerList[0].bnnrLnknUrl)
                  }}
                />
              )}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  )
}
export default Company
