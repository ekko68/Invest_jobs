import { useRef } from 'react'
import Button from 'components/atomic/Button'
import Checkbox from 'components/atomic/Checkbox'

const Admin_Accept_InvestBusiness_Select_Pop = (props) => {
  const typeCheckboxList = [
    { id: 'check_support01', value: 'ESG', status: false },
    { id: 'check_support02', value: '이차전지', status: false },
    { id: 'check_support03', value: '소부장', status: false },
    { id: 'check_support04', value: '초기기업', status: false },
    { id: 'check_support05', value: '핀테크', status: false },
    { id: 'check_support06', value: '광고/마케팅', status: false },
    { id: 'check_support07', value: '교육', status: false },
    { id: 'check_support08', value: '금융', status: false },
    { id: 'check_support09', value: '농축수산업', status: false },
    { id: 'check_support10', value: '라이프스타일', status: false }
  ]

  return (
    <div className="popup_wrap popup_invest">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">지원분야를 선택해 주세요</div>
            <div className="button_group_right">
              <Button className={'line_blue'} onClick={() => {}}>
                항목 관리
              </Button>
            </div>
          </div>

          <ul className={'popup_supportAreas'}>
            {typeCheckboxList.map((check) => (
              <li key={check.id}>
                <Checkbox checkbox={{ id: check.id, value: check.value }} status={check.status} onChange={() => {}} />
              </li>
            ))}
          </ul>

          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={() => {}}>
              취소
            </Button>
            <Button className={'full_blue'} onClick={() => {}}>
              완료
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin_Accept_InvestBusiness_Select_Pop
