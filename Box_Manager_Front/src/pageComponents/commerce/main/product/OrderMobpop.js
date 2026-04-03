import { useRef, useState, useContext } from 'react'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import Swiper from 'pageComponents/commerce/main/product/OrderSwiper'
import { createKey } from 'modules/utils/MathUtils'
import { MktContext } from 'modules/common/MktContext'

const OrderMobpop = (props) => {
  const mktContext = useContext(MktContext)
  const { onClosed, selectList, orderBaseList, saveBannerOrder, itmSelect, maintype, defList } = props
  const [swipeList, setSwipeList] = useState(orderBaseList) //미리보기용 데이터
  const [ctrlList, setCtrlList] = useState(selectList) //노출순서설정 목록
  const numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] //루프용 배열
  const [isUpdate, setIsUpdate] = useState(false)
  const [isPreView, setIsPreView] = useState(false)
  const [cpitmSelect, setCpItmSelect] = useState(JSON.parse(JSON.stringify(itmSelect))) //이벤트시 데이터 수정용 데이터
  const [swipeNum, setSwipeNum] = useState(1)
  const [swipeYmd, setSwipeYmd] = useState('')
  const itmRef = cpitmSelect.map(() => useRef(null))

  const handleSetItemId = (index, newId, newOrder) => {
    let newCtrlList = ctrlList
    const oldIndex = newCtrlList.findIndex((item) => item.id != '' && item.id === cpitmSelect[index].id)
    const newIndex = newCtrlList.findIndex((item) => item.id != '' && item.id === newId)

    setCpItmSelect((prev) => {
      const newItems = [...prev]
      newItems[index].id = newId
      newItems[index].order = newOrder
      return newItems
    })

    if (oldIndex != -1) {
      newCtrlList[oldIndex].disabled = false
      newCtrlList[oldIndex].order = 0
    }

    if (newIndex != -1) {
      newCtrlList[newIndex].disabled = true
      newCtrlList[newIndex].order = newOrder
    }

    setCtrlList(newCtrlList)
    setIsUpdate(true)
  }

  const handlePreview = () => {
    if (isUpdate) {
      const itmArr = cpitmSelect.filter((_item) => _item.id !== '').map((itm) => itm.id)

      let newList = [...defList]
      if (itmArr?.length > 0) {
        newList = itmArr
          .map((item) => {
            return ctrlList.filter((_item) => _item.id != '' && _item.id === item)
          })
          .flat()
      }

      setSwipeList(newList)
      setIsPreView(true)
      setSwipeNum(1)
      setSwipeYmd(newList[0].ymd)
    } else {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '수정한 내용이 없습니다.'
      })
      return
    }
  }

  const handleOnClosed = () => {
    setSwipeList([])
    setCtrlList([])
    setCpItmSelect([
      { id: '', order: 0 },
      { id: '', order: 0 },
      { id: '', order: 0 },
      { id: '', order: 0 },
      { id: '', order: 0 },
      { id: '', order: 0 },
      { id: '', order: 0 },
      { id: '', order: 0 },
      { id: '', order: 0 },
      { id: '', order: 0 }
    ])
    onClosed()
  }

  const handleUpdate = () => {
    if (isUpdate) {
      if (isPreView) {
        mktContext.actions.setCommonAlertInfo({
          type: 'function',
          active: true,
          msg: '설정한 콘텐츠로 최종 반영 하시겠습니까?',
          btnMsg: '닫기',
          btnMsg2: '저장',
          action2: async () => await saveBannerOrder(swipeList)
        })
        return
      } else {
        mktContext.actions.setCommonAlertInfo({
          type: 'alert',
          active: true,
          msg: '미리보기 하여 업데이트 내용을 확인 후 완료하세요.'
        })
        return
      }
    } else {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '수정한 내용이 없습니다.'
      })
      return
    }
  }
  const handleAcitveSwipe = (idx) => {
    setSwipeNum(idx + 1)
    setSwipeYmd(swipeList[idx].ymd)
  }

  return (
    <div className="popup_wrap popup_manage_order">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">{`${
              maintype === 'mainBanner' ? '상품' : maintype === 'companyBanner' ? '기업' : '이벤트'
            }메인 모바일 노출순서 관리`}</div>
            <Button className="popup_close_button" aria-label="팝업 닫기" onClick={handleOnClosed} />
          </div>

          <div className="order_prewview_section order_prewview_mobile_section">
            <div className="mobile_view">
              {swipeList?.length > 0 ? (
                <div className="swiper_wrap">
                  <Swiper data={swipeList} handleAcitveSwipe={handleAcitveSwipe} maintype={maintype} />
                </div>
              ) : (
                <div className="swiper_wrap is-skeleton">
                  <div className="swiper_inner" />
                </div>
              )}
            </div>
          </div>
          <div className="order_prewview_text">
            {`${swipeNum}순위 노출 : ${swipeYmd}`}
            <div className="button_group_right">
              <Button
                className={'full_blue'}
                onClick={() => {
                  if (isUpdate) {
                    setSwipeList([])
                    setTimeout(() => {
                      handlePreview()
                    }, 500)
                  }
                }}
              >
                미리보기
              </Button>
            </div>
          </div>

          <div className="popup_title">노출 순서 설정</div>
          <ul className="caution_list">
            <li>
              비공개, 노출 기간이 종료된 항목은 선택할 수 없습니다. 등록하려는 콘텐츠가 보이지 않으신다면 콘텐츠의
              상태값을 확인하세요.
            </li>
            <li>
              실제 서비스에서는 5개 콘텐츠만 출력됩니다. 6~10순위의 콘텐츠를 미리 등록하여 메인 콘텐츠를 사전 관리할 수
              있습니다.
            </li>
          </ul>
          <div className={'order_table_wrap'}>
            <table className="table_search">
              <caption>순위별 배너선택 등록, 해제 관리 테이블 </caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'*'} />
              </colgroup>
              <tbody>
                {numArray.map((num, idx) => {
                  return (
                    <tr key={createKey()}>
                      <th>{`${num}순위`}</th>
                      <td>
                        <div className={'order_select_group'}>
                          <Select
                            optionList={{ active: cpitmSelect[idx].id, list: ctrlList }}
                            handleSelectActive={(id) => handleSetItemId(idx, id, num)}
                            ref={itmRef[idx]}
                          />
                          <Button
                            className="unlock_button"
                            onClick={() => {
                              handleSetItemId(idx, '', num)
                            }}
                          >
                            해제하기
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={handleOnClosed}>
              닫기
            </Button>
            <Button className={'full_blue'} onClick={handleUpdate}>
              완료
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderMobpop
