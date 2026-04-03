import { useState, useRef } from 'react'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import Radio from 'components/atomic/Radio'
import ko from 'date-fns/locale/ko'

const Admin_Invest_Result_Popup = (props) => {
  const { resultList, reasonList, onSelectActive, value } = props
  const reasonSelect = useRef(null)
  const resultSelect = useRef(null)
  const defaultSelect = {
    active: 'investApprove',
    list: [
      { id: 'investApprove', value: 'investApprove', label: '투자승인' },
      { id: 'investHold', value: 'investHold', label: '투자보류' },
      { id: 'investReview', value: 'investReview', label: '심사중' }
    ]
  }

  const reasonDefault = {
    active: 'rejectReason1',
    list: [
      { id: 'rejectReason1', value: 'rejectReason1', label: '선택' },
      { id: 'rejectReason2', value: 'rejectReason2', label: '사유1' },
      { id: 'rejectReason3', value: 'rejectReason3', label: '사유2' }
    ]
  }
  return (
    <div className="popup_wrap popup_invest_result">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">심사결과</div>
            <Button className="popup_close_button" aria-label="팝업 닫기" onClick={() => {}} />
          </div>

          <div className={'invest_table_wrap'}>
            <table className="table_invest_result">
              <caption>심사결과, 거절사유, 심사의견 정보 입력 테이블 </caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'*'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>심사결과</th>

                  <td>
                    <Select
                      optionList={resultList ? resultList : defaultSelect}
                      handleSelectActive={onSelectActive}
                      ref={resultSelect}
                      className="select_result"
                    />
                  </td>
                </tr>

                <tr>
                  <th>거절사유</th>
                  <td>
                    <Select
                      optionList={reasonList ? reasonList : reasonDefault}
                      handleSelectActive={onSelectActive}
                      ref={reasonSelect}
                      className="select_reason"
                    />
                    <input
                      name={''}
                      type="text"
                      className="input"
                      value={value}
                      defaultValue={value}
                      title={'거절사유'}
                      placeholder={'사유를 200자 이내로 입력하세요.'}
                    />
                  </td>
                </tr>
                <tr>
                  <th>심사의견</th>
                  <td>
                    <textarea
                      className="textarea"
                      placeholder="심사의견을 입력해주세요."
                      maxLength={''}
                      id=""
                      title="심사의견"
                    />
                  </td>
                </tr>
                <tr>
                  <th>최종업데이트</th>
                  <td>2021.12.31 14:44:56</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={() => {}}>
              닫기
            </Button>
            <Button className={'full_blue'} onClick={() => {}}>
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin_Invest_Result_Popup
