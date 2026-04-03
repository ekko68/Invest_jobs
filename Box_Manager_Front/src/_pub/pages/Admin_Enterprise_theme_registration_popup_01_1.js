import { useRef } from 'react'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import ExEnterpriseTableNew from 'pageComponents/commerce/main/ExEnterpriseTableNew '
import Checkbox from 'components/atomic/Checkbox'
import Pagination from 'components/Pagination'

const Admin_Enterprise_theme_registration_popup_01_1 = (props) => {
  const { selectList, selectList2, onSelectActive, onSelectActive2, value } = props
  const categorySelect = useRef(null)
  const categorySelect2 = useRef(null)

  const defaultSelect = {
    active: 'categoryMain',
    list: [
      { id: 'categoryMain', value: 'categoryMain', label: '대분류' },
      { id: 'categoryMain1', value: 'categoryMain1', label: '대분류1' }
    ]
  }
  const defaultSelect2 = {
    active: 'categoryMiddle',
    list: [
      { id: 'categoryMiddle', value: 'categoryMiddle', label: '중분류' },
      { id: 'categoryMiddle1', value: 'categoryMiddle1', label: '중분류1' }
    ]
  }
  const typeCheckboxEnterprise = [
    { id: 'check_allEnterprise', value: '전체', status: true },
    { id: 'check_big', value: '대기업', status: true },
    { id: 'check_medium', value: '중소기업', status: true },
    { id: 'check_small', value: '강소기업', status: true }
  ]

  const typeCheckboxCeo = [
    { id: 'check_allCeo', value: '전체', status: true },
    { id: 'check_ceo', value: '최고 경영자 클럽', status: true },
    { id: 'check_future', value: '미래 경영자 클럽', status: true },
    { id: 'check_female', value: '여성 경영자 클럽', status: true },
    { id: 'check_fame', value: '명예의 전당', status: true }
  ]
  const typeCheckboxCertify = [
    { id: 'check_allCertify', value: '전체', status: true },
    { id: 'check_certify', value: '인증', status: true },
    { id: 'check_certifynot', value: '미인증', status: true }
  ]
  const mainData = {
    header: [
      {
        first: '선택',
        title: '기업명',
        category: '카테고리',
        type: '기업 형태',
        last: 'IBK 인증'
      }
    ],
    data: [
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check01', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '기업명 노출',
        category: '건설 > 종합 건설',
        type: '중소기업',
        last: '인증'
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check02', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '기업명 노출',
        category: '농림어업 > 농업',
        type: '중소기업',
        last: '미인증'
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check03', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '기업명 노출',
        category: '농림어업 > 농업',
        type: '중소기업',
        last: '미인증'
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check04', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '기업명 노출',
        category: '농림어업 > 농업',
        type: '중소기업',
        last: '미인증'
      }
    ]
  }
  return (
    <div className="popup_wrap popup_enterprise">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">기업 검색</div>
            <Button className="popup_close_button" aria-label="팝업 닫기" onClick={() => {}} />
          </div>

          <div className={'search_table_wrap'}>
            <table className="table_search">
              <caption>기업 형태, 경영자 클럽, IBK 인증, 기업명, 카테고리 선택 조회 테이블</caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'*'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>기업 형태</th>
                  <td>
                    {typeCheckboxEnterprise.map((check) => (
                      <Checkbox
                        key={check.id}
                        checkbox={{ id: check.id, value: check.value }}
                        status={check.status}
                        onChange={() => {}}
                      />
                    ))}
                  </td>
                </tr>
                <tr>
                  <th>경영자 클럽</th>
                  <td>
                    {typeCheckboxCeo.map((check) => (
                      <Checkbox
                        key={check.id}
                        checkbox={{ id: check.id, value: check.value }}
                        status={check.status}
                        onChange={() => {}}
                      />
                    ))}
                  </td>
                </tr>
                <tr>
                  <th>IBK 인증</th>
                  <td>
                    {typeCheckboxCertify.map((check) => (
                      <Checkbox
                        key={check.id}
                        checkbox={{ id: check.id, value: check.value }}
                        status={check.status}
                        onChange={() => {}}
                      />
                    ))}
                  </td>
                </tr>
                <tr>
                  <th>기업명</th>
                  <td>
                    <input
                      name={''}
                      type="text"
                      className="input"
                      value={value}
                      defaultValue={value}
                      title={'기업명'}
                      placeholder={'기업명을 입력해주세요'}
                    />
                  </td>
                </tr>
                <tr>
                  <th>카테고리</th>
                  <td>
                    <div className={'selectCategory_wrap'}>
                      <Select
                        optionList={selectList ? selectList : defaultSelect}
                        handleSelectActive={onSelectActive}
                        ref={categorySelect}
                      />
                      <Select
                        optionList={selectList2 ? selectList2 : defaultSelect2}
                        handleSelectActive={onSelectActive2}
                        ref={categorySelect2}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="button_bottom_group">
            <Button className={'basic'} onClick={() => {}}>
              초기화
            </Button>
            <Button className={'full_blue_deep'} onClick={() => {}}>
              검색
            </Button>
          </div>

          <div className="button_group_right">
            <Button className={'full_grey_dark'} onClick={() => {}}>
              초기화
            </Button>
            <Button className={'full_blue'} onClick={() => {}}>
              저장
            </Button>
          </div>
          <ExEnterpriseTableNew dataList={mainData} />
          <div className="pagination_wrap">
            <Pagination
              pagingData={{ totalPage: 40, startPage: 1, page: 5, prev: true, next: true, endPage: 10 }}
              handlePaging={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin_Enterprise_theme_registration_popup_01_1
