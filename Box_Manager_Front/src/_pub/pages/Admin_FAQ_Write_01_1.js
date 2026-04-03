import { useRef, useState } from 'react'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import TextEditor from 'components/TextEditor'

import Select from 'components/atomic/Select'

const Admin_FAQ_Write_01_1 = (props) => {
  const { selectList, onSelectActive } = props

  const searchSelect = useRef(null)
  const defaultSelect = {
    active: 'faq_00',
    list: [
      { id: 'faq_00', value: 'faq_00', label: 'FAQ 유형' },
      { id: 'faq_member', value: 'faq_member', label: '회원가입' },
      { id: 'faq_buyer', value: 'faq_buyer', label: '구매자' },
      { id: 'faq_saller', value: 'faq_saller', label: '판매자' },
      { id: 'faq_agency', value: 'faq_agency', label: '에이전시' }
    ]
  }

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">FAQ</h4>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table form_table bg_none border_none">
            <caption>FAQ 유형, 제목, 내용 입력 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left th_length'}>FAQ 유형</th>
                <td>
                  <Select
                    optionList={selectList ? selectList : defaultSelect}
                    handleSelectActive={onSelectActive}
                    ref={searchSelect}
                  />
                </td>
              </tr>

              <tr>
                <th className={'ta_left'}>제목</th>
                <td>
                  <input
                    type="text"
                    className="input"
                    placeholder="제목을 입력하세요."
                    title="제목"
                    onChange={() => {}}
                  />
                </td>
              </tr>

              <tr>
                <th className={'ta_left th_length'}>내용</th>
                <td>
                  <div className="editor_wrap">
                    <TextEditor data={''} handleChange={() => {}} />
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

export default Admin_FAQ_Write_01_1
