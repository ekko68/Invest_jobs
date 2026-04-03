import { useRef } from 'react'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import Swiper from 'components/atomic/Swiper'

const Admin_Enterprise_theme_01_1_Orderpop = (props) => {
  const { selectList00, selectList01, selectList02, selectList03, selectList04, onSelectActive } = props
  const SwiperMain = [
    {
      imgUrlPc: require('assets/images/temp/main_swiper1@2x.png').default,
      imgUrlMo: require('assets/images/temp/main_swiper1@2x.png').default
    },
    {
      imgUrlPc: require('assets/images/temp/main_swiper2@2x.png').default,
      imgUrlMo: require('assets/images/temp/main_swiper2@2x.png').default
    },
    {
      imgUrlPc: require('assets/images/temp/main_swiper3@2x.png').default,
      imgUrlMo: require('assets/images/temp/main_swiper3@2x.png').default
    }
  ]
  const sortSelect00 = useRef(null)
  const sortSelect01 = useRef(null)
  const sortSelect02 = useRef(null)
  const sortSelect03 = useRef(null)
  const sortSelect04 = useRef(null)
  const defaultSelect00 = {
    active: 'bannerOrder',
    list: [
      { id: 'bannerOrder', value: 'bannerOrder', label: '등록시 입력한 배너 제목 노출(YYYY.MM.DD ~ YYYY.MM.DD)' },
      { id: 'bannerOrder1', value: 'bannerOrder1', label: '등록시 입력한 배너 제목 노출2(YYYY.MM.DD ~ YYYY.MM.DD)' }
    ]
  }
  const defaultSelect01 = {
    active: 'bannerOrder01',
    list: [
      { id: 'bannerOrder01', value: 'bannerOrder01', label: '등록시 입력한 배너 제목2222(YYYY.MM.DD ~ YYYY.MM.DD)' },
      {
        id: 'bannerOrder01-1',
        value: 'bannerOrder01-1',
        label: '등록시 입력한 배너 제목3333(YYYY.MM.DD ~ YYYY.MM.DD)'
      }
    ]
  }

  const defaultSelect02 = {
    active: 'bannerOrder02',
    list: [
      { id: 'bannerOrder02', value: 'bannerOrder02', label: '등록시 입력한 배너 제목 셋(YYYY.MM.DD ~ YYYY.MM.DD)' },
      {
        id: 'bannerOrder02-1',
        value: 'bannerOrder02-1',
        label: '등록시 입력한 배너 제목 셋-1(YYYY.MM.DD ~ YYYY.MM.DD)'
      }
    ]
  }
  const defaultSelect03 = {
    active: 'bannerOrder03',
    list: [
      { id: 'bannerOrder03', value: 'bannerOrder03', label: '메인 콘텐츠를 선택하세요.' },
      {
        id: 'bannerOrder03-1',
        value: 'bannerOrder03-1',
        label: '메인 콘텐츠를 선택하세요2.'
      }
    ]
  }

  const defaultSelect04 = {
    active: 'bannerOrder04',
    list: [
      { id: 'bannerOrder04', value: 'bannerOrder04', label: '메인 콘텐츠를 선택하세요55.' },
      {
        id: 'bannerOrder04-1',
        value: 'bannerOrder04-1',
        label: '메인 콘텐츠를 선택하세요66.'
      }
    ]
  }
  return (
    <div className="popup_wrap popup_manage_order">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">테마기업 노출순서 관리</div>
            <Button className="popup_close_button" aria-label="팝업 닫기" onClick={() => {}} />
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
                        optionList={selectList00 ? selectList00 : defaultSelect00}
                        handleSelectActive={onSelectActive}
                        ref={sortSelect00}
                      />
                      <Button className="unlock_button">해제하기</Button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th>2순위</th>
                  <td>
                    <div className={'order_select_group'}>
                      <Select
                        optionList={selectList01 ? selectList01 : defaultSelect01}
                        handleSelectActive={onSelectActive}
                        ref={sortSelect01}
                      />
                      <Button className="unlock_button">해제하기</Button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th>3순위</th>
                  <td>
                    <div className={'order_select_group'}>
                      <Select
                        optionList={selectList02 ? selectList02 : defaultSelect02}
                        handleSelectActive={onSelectActive}
                        ref={sortSelect02}
                      />
                      <Button className="unlock_button">해제하기</Button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th>4순위</th>
                  <td>
                    <div className={'order_select_group'}>
                      <Select
                        optionList={selectList03 ? selectList03 : defaultSelect03}
                        handleSelectActive={onSelectActive}
                        ref={sortSelect03}
                      />
                      <Button className="unlock_button" disabled>
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
                        optionList={selectList04 ? selectList04 : defaultSelect04}
                        handleSelectActive={onSelectActive}
                        ref={sortSelect04}
                      />
                      <Button className="unlock_button" disabled>
                        해제하기
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={() => {}}>
              닫기
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

export default Admin_Enterprise_theme_01_1_Orderpop
