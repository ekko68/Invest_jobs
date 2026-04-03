import { useRef, useState } from 'react'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import TextEditor from 'components/TextEditor'

import Select from 'components/atomic/Select'

const Admin_Inquiry_Write_01_1 = (props) => {
  const { selectList, onSelectActive } = props

  const searchSelect = useRef(null)
  const defaultSelect = {
    active: 'inquiry_00',
    list: [
      { id: 'inquiry_00', value: 'inquiry_00', label: '문의유형 노출' },
      { id: 'inquiry_member', value: 'inquiry_member', label: '회원가입' },
      { id: 'inquiry_buyer', value: 'inquiry_buyer', label: '구매자' },
      { id: 'inquiry_saller', value: 'inquiry_saller', label: '판매자' },
      { id: 'inquiry_agency', value: 'inquiry_agency', label: '에이전시' }
    ]
  }

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">문의 관리</h4>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table form_table bg_none border_none">
            <caption>문의 관리, 작성자, 제목, 문의, 답변 입력 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left th_length'}>문의 유형</th>
                <td>
                  <Select
                    optionList={selectList ? selectList : defaultSelect}
                    handleSelectActive={onSelectActive}
                    ref={searchSelect}
                    className="select_inquiry"
                  />
                </td>
                <th className={'ta_left th_length'}>작성자</th>
                <td>
                  <input type="text" className="input" value="회사명/작성자" title="작성자" disabled />
                </td>
              </tr>

              <tr>
                <th className={'ta_left'}>제목</th>
                <td colSpan={3}>
                  <input
                    type="text"
                    className="input"
                    placeholder="제목을 입력하세요."
                    value="입력 제목 노출"
                    title="제목"
                    disabled
                  />
                </td>
              </tr>

              <tr>
                <th className={'ta_left th_length'}>내용</th>
                <td colSpan={3}>
                  <textarea
                    className="textarea textarea_h"
                    placeholder=""
                    maxLength={''}
                    id=""
                    value="사용자가 입력한 문의 내용이 노출"
                    title="문의"
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th className={'ta_left th_length'}>답변</th>
                <td colSpan={3}>
                  <div className="editor_wrap">
                    <TextEditor placeholder="설명을 입력하세요." data={''} handleChange={() => {}} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => {}}>
            삭제
          </Button>
          <Button className={'basic'} onClick={() => {}}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={() => {}}>
            저장
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Admin_Inquiry_Write_01_1
