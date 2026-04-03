import Tabs from 'components/common/Tabs'
import { forwardRef, useState, useImperativeHandle } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'

const MainCanDoIt = forwardRef((props, ref) => {
  const {getTabData} = props
  const history = useHistory();
  
  useImperativeHandle(ref, () => ({
    currentTab
  }))

  const currentTab = (e)=> {
    getTabData(e)
  }

  return (
    <div className="section section_canDoit">
      <div className="section_canDoit_inner">
        <div className="section_title">
          <h3 className="title">
            투자,
            <br />
            모두가 할 수 있도록
          </h3>
        </div>
        {/* case 
        두번째 탭 디폴트로 보여야 할 때 사용법:
         <Tabs selectedTab="투자자(VC)에게는"> 
         */}
        <Tabs onChange={(e)=>{currentTab(e)}}>
          <div label="투자 희망 기업에게는">
            <ul className="canDoit_list">
              <li className="canDoit_item">
                <img src={require('assets/images/invest_can_img01.png').default} alt="" />
                <div className="canDoit_item_text">투자 유치의 기회</div>
              </li>
              <li className="canDoit_item">
                <img src={require('assets/images/invest_can_img02.png').default} alt="" />
                <div className="canDoit_item_text">직접 투자 신청</div>
              </li>
              <li className="canDoit_item">
                <img src={require('assets/images/invest_can_img03.png').default} alt="" />
                <div className="canDoit_item_text">벤처 대출 신청</div>
              </li>
            </ul>
          </div>
          <div label="투자자(VC)에게는">
            <ul className="canDoit_list">
              <li className="canDoit_item">
                <img src={require('assets/images/invest_can_img04.png').default} alt="" />
                <div className="canDoit_item_text">투자 희망 기업 탐색</div>
              </li>
              <li className="canDoit_item">
                <img src={require('assets/images/invest_can_img05.png').default} alt="" />
                <div className="canDoit_item_text">IBK에 펀드 제안</div>
              </li>
              <li className="canDoit_item">
                <img src={require('assets/images/invest_can_img06.png').default} alt="" />
                <div className="canDoit_item_text">
                  출자 사업 조회 및 접수
                  {
                    props.type !== 'COM' &&
                    <button type="button" className="canDoit_item_button" onClick={()=> {history.push(ROUTER_NAMES.FNCN_BSNS_PBAN_LIST)}}>
                      공고보기
                    </button>
                  }
                </div>
              </li>
            </ul>
          </div>
        </Tabs>
      </div>
    </div>
  )
})
export default MainCanDoIt
