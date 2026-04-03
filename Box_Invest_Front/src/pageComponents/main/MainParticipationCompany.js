import React, { forwardRef, useContext, useEffect, useImperativeHandle, useLayoutEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Button from 'components/atomic/Button'
import { colors } from 'assets/style/style.config'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey } from 'modules/utils/CommonUtils'
import { StringUtils } from 'modules/utils/StringUtils'

const MainParticipationCompany = forwardRef((props, ref) => {
  const history = useHistory()
  const commonContext = useContext(CommonContext)

  useLayoutEffect(() => {}, [])
  useEffect(() => {}, [])

  useImperativeHandle(ref, () => ({}))

  const [isViewMore, setIsViewMore] = useState(false)

  const PARTICIPATION_LIST = [
    { name: '500 글로벌', img: '/images/tmp/new_logo_01.png', url: 'https://korea.500.co/kr' },
    { name: '뉴패러다임 인베스트먼트', img: '/images/tmp/new_logo_02.png', url: 'http://www.npinvestment.co.kr/' },
    { name: '데일리파트너스', img: '/images/tmp/new_logo_03.png', url: 'http://dayli.partners/' },
    { name: '메타인베스트먼트', img: '/images/tmp/new_logo_04.png', url: 'https://www.metainvestment.co.kr/' },
    { name: '뮤렉스 파트너스', img: '/images/tmp/new_logo_05.png', url: 'https://murexpartners.com/' },
    { name: '미래에셋 증권', img: '/images/tmp/new_logo_06.png', url: 'https://securities.miraeasset.com/' },
    { name: '블루포인트', img: '/images/tmp/new_logo_07.png', url: 'https://bluepoint.ac/' },
    { name: 'KDB 캐피탈', img: '/images/tmp/new_logo_08.png', url: 'https://www.kdbc.co.kr/' },
    { name: '스타셋 인베스트먼트', img: '/images/tmp/new_logo_09.png', url: 'https://www.stassetsinv.com/' },
    { name: '스톤브릿지 벤처스', img: '/images/tmp/new_logo_10.png', url: 'https://www.stonebridgeventures.vc/' },
    { name: '스틱 벤처스', img: '/images/tmp/new_logo_11.png', url: 'https://www.sticventures.co.kr/' },
    { name: '스프링 캠프', img: '/images/tmp/new_logo_12.png', url: 'http://springcamp.co/' },
    { name: '씨앤티테크', img: '/images/tmp/new_logo_13.png', url: 'https://www.cntt.co.kr/kr/' },
    { name: '알바트로스인베스트먼트', img: '/images/tmp/new_logo_14.png', url: 'http://www.albatrossvc.co.kr/' },
    { name: '얼머스 인베스트먼트', img: '/images/tmp/new_logo_15.png', url: 'http://ulmus.co.kr/' },
    { name: 'HB 인베스트먼트', img: '/images/tmp/new_logo_16.png', url: 'https://www.hbvc.co.kr/' },
    { name: 'LSK 인베스트먼트', img: '/images/tmp/new_logo_17.png', url: 'http://www.lski.co.kr/' }, // (로고 변경됨)
    { name: 'L&S 벤처캐피탈', img: '/images/tmp/new_logo_18.png', url: 'http://www.lnsvc.co.kr/' },
    { name: 'WE 벤처스', img: '/images/tmp/new_logo_19.png', url: 'https://weventures.co.kr/' },
    { name: '은행권청년창업재단', img: '/images/tmp/new_logo_20.png', url: 'https://dcamp.kr/' },
    { name: '이노폴리스 파트너스', img: '/images/tmp/new_logo_21.png', url: 'https://innollc.com/' },
    { name: '인터베스트', img: '/images/tmp/new_logo_22.png', url: 'http://www.intervest.co.kr/kr/' },
    { name: '카카오벤처스', img: '/images/tmp/new_logo_23.png', url: 'https://www.kakao.vc/' },
    { name: '컴퍼니K파트너스', img: '/images/tmp/new_logo_24.png', url: 'http://kpartners.co.kr/' },
    { name: 'K-RUN 벤처스', img: '/images/tmp/new_logo_25.png', url: 'https://www.krunventures.com/' },
    { name: 'K2 인베스트먼트', img: '/images/tmp/new_logo_26.png', url: 'http://k2investment.co.kr/' },
    { name: '코리아 에셋 투자증권', img: '/images/tmp/new_logo_27.png', url: 'https://kasset.co.kr/' },
    { name: 'COMES 인베스트먼트', img: '/images/tmp/new_logo_28.png', url: 'http://comesi.co.kr/' },
    { name: '코오롱 인베스트먼트', img: '/images/tmp/new_logo_29.png', url: 'http://www.koloninvest.com/' },
    { name: '키움인베스트먼트', img: '/images/tmp/new_logo_30.png', url: 'http://www.kiwoominvest.com/' },
    { name: '퓨처플레이', img: '/images/tmp/new_logo_31.png', url: 'https://futureplay.co/' },
    { name: '프리미어 파트너스', img: '/images/tmp/new_logo_32.png', url: 'http://premierpartners.co.kr/' },
    { name: '솔리더스 인베스트먼트', img: '/images/tmp/new_logo_33.png', url: 'http://www.solidusvc.com/' },
    { name: '한국투자 파트너스', img: '/images/tmp/new_logo_34.png', url: 'http://partners.koreainvestment.com/kr/' },
    { name: 'BNH 인베스트먼트', img: '/images/tmp/new_logo_35.png', url: 'http://bnhinv.com/' },
    { name: 'DS Asset 자산운용', img: '/images/tmp/new_logo_36.png', url: 'https://www.dsasset.com/' },
    { name: 'DSC 인베스트먼트', img: '/images/tmp/new_logo_37.png', url: 'http://dscinvestment.com/' },
    { name: 'IBK캐피탈', img: '/images/tmp/new_logo_38.png', url: 'https://www.ibkc.co.kr/ib20/mnu/MNUPCKMAIN000' },
    { name: 'utc 인베스트먼트', img: '/images/tmp/new_logo_39.png', url: 'http://utc.co.kr/' },
    { name: '슈미트', img: '/images/tmp/new_logo_40.png', url: 'http://schmidt.kr/' }
  ]

  return (
    <div className="section section05 default_size">
      <div className="info_wrap">
        <p className="title">참여중인 투자사</p>
        <p className="info">IBK가 운영중인 펀드에 참여중인 투자사</p>
        <div className="btn_group">
          <Button
            theme={colors.blue}
            onClick={() => commonContext.actions.callbackAfterOnlyLoginCheck(() => history.push(ROUTER_NAMES.INVEST))}
          >
            투자사 찾아보기
          </Button>
        </div>
      </div>
      {/* <div className={`sponsor_box${isViewMore ? ' active' : ''}`}> */}
      {/* 팀장님 요청으로 전체 리스트 보여준다. */}
      <div className={`sponsor_box active`}>
        <div className="company_wrap">
          <ul className="company_list">
            {/* {PARTICIPATION_LIST.filter(
              (e, idx) => (!isViewMore && idx < 16) || (isViewMore && idx < PARTICIPATION_LIST.length)
            ).map((item, index) => ( */}
            {PARTICIPATION_LIST.map((item, index) => (
              <li key={createKey()} className={'company_item'}>
                <img
                  src={item.img}
                  alt={`참여 투자사 로고 ${index}`}
                  onClick={() => {
                    if (StringUtils.hasLength(item.url)) window.open(item.url)
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </li>
            ))}
          </ul>

          {/* <div className="more_btn" onClick={() => setIsViewMore(!isViewMore)}>
            <img src={require('assets/images/ico_arr_down_blue.png').default} alt="화살표" />
          </div> */}
        </div>
      </div>
    </div>
  )
})
export default MainParticipationCompany
