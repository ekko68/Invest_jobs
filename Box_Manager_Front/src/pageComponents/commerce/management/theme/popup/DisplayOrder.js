import React, { useState, useContext, useEffect, useRef } from 'react'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import { getThemeOrderListApiV2, saveThemeOrder } from 'modules/consts/MktApi'
import { MktContext } from 'modules/common/MktContext'
import { termFormatter } from 'modules/common'
import { StringUtils } from 'modules/utils/StringUtils'

const DisplayOrder = (props) => {
  const { onClose } = props
  const mktContext = useContext(MktContext)

  const sortSelect1 = useRef(null)
  const sortSelect2 = useRef(null)
  const sortSelect3 = useRef(null)
  const sortSelect4 = useRef(null)
  const sortSelect5 = useRef(null)

  const [data, setData] = useState({
    list1Active: '',
    list2Active: '',
    list3Active: '',
    list4Active: '',
    list5Active: '',
    list: [],
    listAndEmpty: []
  })

  const [isUpdate, setIsUpdate] = useState(false)

  const getThemeList = (params) => {
    //aipv2
    getThemeOrderListApiV2(params, getListCallback, handleThemeListErrorCallback)
  }

  const getListCallback = (res) => {
    if (res.data.code === '200') {
      let data = res.data.data?.list
      if (data !== null && data?.length > 0) {
        const items = data.map((_item) => {
          let label = _item.grpNm
          label += ' (' + termFormatter(_item.stdy) + '~' + termFormatter(_item.fnda) + ')'
          return { id: _item.ffpcGrpId, label, disabled: StringUtils.hasLength(_item.infoSqn) ? true : false }
        })

        setData({
          list1Active: data.filter((_item) => _item.infoSqn === 1)[0]?.ffpcGrpId || '',
          list2Active: data.filter((_item) => _item.infoSqn === 2)[0]?.ffpcGrpId || '',
          list3Active: data.filter((_item) => _item.infoSqn === 3)[0]?.ffpcGrpId || '',
          list4Active: data.filter((_item) => _item.infoSqn === 4)[0]?.ffpcGrpId || '',
          list5Active: data.filter((_item) => _item.infoSqn === 5)[0]?.ffpcGrpId || '',
          list: items,
          listAndEmpty: [...items, { id: '', label: '메인 콘텐츠를 선택하세요.' }]
        })
      } else {
        mktContext.actions.setCommonAlertInfo({
          type: 'function1Btn',
          active: true,
          msg: '공개중인 배너가 없습니다.',
          action: () => {
            onClose(false)
          }
        })
      }
    }
  }

  //에러콜백
  const handleThemeListErrorCallback = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  const handleSelectChange = (id, label, index) => {
    let newData = { ...data }
    let oldId = ''
    switch (index) {
      case 1:
        oldId = newData.list1Active
        newData = {
          ...newData,
          list1Active: id
        }
        break
      case 2:
        oldId = newData.list2Active
        newData = {
          ...newData,
          list2Active: id
        }
        break
      case 3:
        oldId = newData.list3Active
        newData = {
          ...newData,
          list3Active: id
        }
        break
      case 4:
        oldId = newData.list4Active
        newData = {
          ...newData,
          list4Active: id
        }
        break
      case 5:
        oldId = newData.list5Active
        newData = {
          ...newData,
          list5Active: id
        }
        break
    }

    const newList = data.list.map((_item) => {
      if (_item.id === id) {
        _item.disabled = true
      } else if (_item.id === oldId) {
        _item.disabled = false
      }
      return _item
    })

    newData = {
      ...newData,
      list: newList,
      listAndEmpty: [...newList, { id: '', label: '메인 콘텐츠를 선택하세요.' }]
    }

    if (!isUpdate) {
      setIsUpdate(true)
    }
    setData(newData)
  }

  const handleSave = () => {
    if (isUpdate) {
      mktContext.actions.setCommonAlertInfo({
        type: 'function',
        active: true,
        msg: '변경 설정한 내용으로 테마기업을 등록하시겠습니까?',
        btnMsg: '닫기',
        btnMsg2: '저장',
        action2: async () => {
          const params = [...Array(5)].map((_, index) => {
            const name = 'list' + (index + 1) + 'Active'
            return data[name]
          })
          await saveThemeOrder(params)
          onClose(true)
        }
      })
      return
    } else {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '변경사항이 없습니다.'
      })
      return
    }
  }

  useEffect(() => {
    getThemeList()
  }, [])

  if (data?.list?.length < 1) {
    return null
  }

  return (
    <div className="popup_wrap popup_manage_order">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">테마기업 노출순서 관리</div>
            <Button className="popup_close_button" aria-label="팝업 닫기" onClick={() => onClose(false)} />
          </div>

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
                <tr>
                  <th>1순위</th>
                  <td>
                    <div className={'order_select_group'}>
                      <Select
                        optionList={
                          StringUtils.hasLength(data.list1Active)
                            ? { active: data.list1Active, list: data.list }
                            : { active: data.list1Active, list: data.listAndEmpty }
                        }
                        handleSelectActive={(id, label) => {
                          handleSelectChange(id, label, 1)
                        }}
                        ref={sortSelect1}
                      />
                      <Button
                        className="unlock_button"
                        disabled={!StringUtils.hasLength(data.list1Active)}
                        onClick={() => {
                          handleSelectChange('', '', 1)
                        }}
                      >
                        해제하기
                      </Button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th>2순위</th>
                  <td>
                    <div className={'order_select_group'}>
                      <Select
                        optionList={
                          StringUtils.hasLength(data.list2Active)
                            ? { active: data.list2Active, list: data.list }
                            : { active: data.list2Active, list: data.listAndEmpty }
                        }
                        handleSelectActive={(id, label) => {
                          handleSelectChange(id, label, 2)
                        }}
                        ref={sortSelect2}
                      />
                      <Button
                        className="unlock_button"
                        disabled={!StringUtils.hasLength(data.list2Active)}
                        onClick={() => {
                          handleSelectChange('', '', 2)
                        }}
                      >
                        해제하기
                      </Button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th>3순위</th>
                  <td>
                    <div className={'order_select_group'}>
                      <Select
                        optionList={
                          StringUtils.hasLength(data.list3Active)
                            ? { active: data.list3Active, list: data.list }
                            : { active: data.list3Active, list: data.listAndEmpty }
                        }
                        handleSelectActive={(id, label) => {
                          handleSelectChange(id, label, 3)
                        }}
                        ref={sortSelect3}
                      />
                      <Button
                        className="unlock_button"
                        disabled={!StringUtils.hasLength(data.list3Active)}
                        onClick={() => {
                          handleSelectChange('', '', 3)
                        }}
                      >
                        해제하기
                      </Button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th>4순위</th>
                  <td>
                    <div className={'order_select_group'}>
                      <Select
                        optionList={
                          StringUtils.hasLength(data.list4Active)
                            ? { active: data.list4Active, list: data.list }
                            : { active: data.list4Active, list: data.listAndEmpty }
                        }
                        handleSelectActive={(id, label) => {
                          handleSelectChange(id, label, 4)
                        }}
                        ref={sortSelect4}
                      />
                      <Button
                        className="unlock_button"
                        disabled={!StringUtils.hasLength(data.list4Active)}
                        onClick={() => {
                          handleSelectChange('', '', 4)
                        }}
                      >
                        해제하기
                      </Button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th>5순위</th>
                  <td>
                    <div className={'order_select_group'}>
                      <Select
                        optionList={
                          StringUtils.hasLength(data.list5Active)
                            ? { active: data.list5Active, list: data.list }
                            : { active: data.list5Active, list: data.listAndEmpty }
                        }
                        handleSelectActive={(id, label) => {
                          handleSelectChange(id, label, 5)
                        }}
                        ref={sortSelect5}
                      />
                      <Button
                        className="unlock_button"
                        disabled={!StringUtils.hasLength(data.list5Active)}
                        onClick={() => {
                          handleSelectChange('', '', 5)
                        }}
                      >
                        해제하기
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={onClose}>
              닫기
            </Button>
            <Button className={'full_blue'} onClick={handleSave}>
              완료
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisplayOrder
