import { useRef, useState } from 'react'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import TextEditor from 'components/TextEditor'

const Admin_Notification_Write_01_1 = (props) => {
  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">공지사항</h4>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table form_table bg_none border_none">
            <caption>제목, 내용 입력 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
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

export default Admin_Notification_Write_01_1
