import { useRef } from 'react'
import Button from 'components/atomic/Button'
import { DoDisturbOnOutlined } from '@mui/icons-material'
import TextInput from 'components/atomic/TextInput'

const Admin_Accept_InvestBusiness_Manage_Pop = (props) => {
  const typeInputList = [
    { id: 'check_support_input01', value: 'ESG' },
    { id: 'check_support_input02', value: '이차전지' },
    { id: 'check_support_input03', value: '소부장' },
    { id: 'check_support_input04', value: '초기기업' },
    { id: 'check_support_input05', value: '핀테크' },
    { id: 'check_support_input06', value: '광고/마케팅' },
    { id: 'check_support_input07', value: '교육' },
    { id: 'check_support_input08', value: '금융' },
    { id: 'check_support_input09', value: '농축수산업' },
    { id: 'check_support_input10', value: '라이프스타일' },
    { id: 'check_support_input10', value: '', placeholder: '10자 이내 입력' }
  ]

  return (
    <div className="popup_wrap popup_invest">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">지원분야 항목을 관리합니다</div>
            <div className="button_group_right">
              <Button className={'line_blue'} onClick={() => {}}>
                + 항목 추가
              </Button>
            </div>
          </div>

          <ul className={'popup_supportAreas_inputs'}>
            {typeInputList.map((input) => (
              <li key={input.id}>
                <TextInput value={input.value} onChange={() => {}} placeholder={input.placeholder} />
                <Button className={'fileAttach_delete_button'} aria-label="삭제" onClick={() => {}}>
                  <DoDisturbOnOutlined />
                </Button>
              </li>
            ))}
          </ul>

          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={() => {}}>
              취소
            </Button>
            <Button className={'full_blue'} onClick={() => {}}>
              적용
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin_Accept_InvestBusiness_Manage_Pop
