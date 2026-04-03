import { useEffect, useRef, useState } from 'react'

import PopupAlert from 'components/PopupAlert'
import Button from 'components/atomic/Button'
import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'
import { createKey } from 'modules/utils/MathUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import { getPostConfig } from '../../../modules/utils/CommonUtils'

const RecommendBranchPopup = (props) => {
  const { activeOption , handlePopup, setBranch} = props
  const inputRef = useRef()

  const [isOpen, setIsOpen] = useState(false)
  const [searchList, setSearchList] = useState([])
  const [alertPop, setAlertPop] = useState({
    text : '',
    active : false
  })

  const search = async () => {
    if (!StringUtils.hasLength(inputRef.current.value)) {
      setAlertPop({...alertPop ,text : '검색어를 입력해주세요.' , active : true})
      return
    }
    const res = await CommonAxios('IVT', getPostConfig(Api.invest.ibkBrncList, { searchContent: inputRef.current.value }))
    if (res?.data?.code == '200' && Array.isArray(res.data.data.list)) setSearchList(res.data.data.list)
    else setSearchList([])
  }

  useEffect(()=> {
    setIsOpen(activeOption)
  })

  return (
    <>
      {isOpen && (
        <div className="popup_wrap">
          <div className="popup_layout">&nbsp;</div>
          <div className="popup_container" style={{height : '400px', width : '500px'}}>
            <div className="popup_main_header">
              <div className="title">추천 영업점 조회</div>
              <Button
                className="popup_close_button"
                aria-label="팝업 닫기"
                onClick={() => {
                  handlePopup()
                }}
              />
            </div>
            <div className="popup_content">
              <div className="cnt_wrap" style={{ width: '100%', height: 'auto !important' }}>
                <div className="input_section" style={{ marginTop: '6px', display: 'flex', gridGap: '6px' }}>
                  <input 
                    ref={inputRef} 
                    placeholder={'영업점이름 또는 영업점 코드를 입력하세요.'} 
                    style={{
                      padding: '8px 10px 9px',
                      width: '100%',
                      height: '30px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}  
                  />
                  <Button className={'full_blue'} type={'linear'} onClick={()=>{search()}}>
                    조회
                  </Button>
                </div>

                <div className="reco_search_wrap">
                  {searchList?.length > 0 ? (
                    <div className="reco_search">
                      <ul className="reco_search_list scroll">
                        <br/>
                        {searchList.map((item) => (
                          <li
                            className="reco_search_item"
                            style={{ cursor: 'pointer' }}
                            key={createKey()}
                            onClick={() => {
                              if (setBranch !== null) {
                                setBranch(item.krnBrm, item.brcd)
                                handlePopup()
                              }
                            }}
                          >
                            {`-${item.krnBrm}(${item.brcd})`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="reco_search">
                      <br/>
                      <div className="reco_search_nodata">일치하는 영업점이 없습니다.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {alertPop.active && (
            <PopupAlert
              msg={alertPop.text}
              handlePopup={() => setAlertPop({ ...alertPop, active: false, text : ''})}
            />
          )}
        </div>
        
      )}
    </>
  )
}

export default RecommendBranchPopup
