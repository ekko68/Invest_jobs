/** @jsxImportSource @emotion/react */
import { categoryItem01Style } from 'assets/style/ComponentStyle'
import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'

// TODO : 삭제 예정

const MainCategoryCard = (props) => {
  const history = useHistory()
  const { data, index } = props
  const onClickSearchCompany = () => {
    const url = ROUTER_NAMES.COMPANY + '?invmFildCd=' + data['invmFildCd']
    history.push(url)
  }

  const imgList = [
    '/images/img_main_field_01.png',
    '/images/img_main_field_02.png',
    '/images/img_main_field_03.png',
    '/images/img_main_field_04.png',
    '/images/img_main_field_05.png',
    '/images/img_main_field_06.png',
    '/images/img_main_field_07.png',
    '/images/img_main_field_08.png',
    '/images/img_main_field_09.png',
    '/images/img_main_field_10.png'
  ];

  // 리스트 정보는 api에서 넘어오지만
  // 메인에 고정으로 보이는 10개 이미지는 프론트에 존재하므로 id 저장 후 세팅
  const fieldImageList = [
    { fieldId: 'IVF00000', name: '3D프린트', imgUrl: '' },
    { fieldId: 'IVF00040', name: '제조업', imgUrl: '' },
    { fieldId: 'IVF00036', name: '항공기/드론', imgUrl: '' },
    { fieldId: 'IVF00037', name: '헬스케어', imgUrl: '' },
    { fieldId: 'IVF00006', name: '광고마케팅', imgUrl: '' },
    { fieldId: 'IVF00013', name: '바이오', imgUrl: '' },
    { fieldId: 'IVF00019', name: '뷰티', imgUrl: '' },
    { fieldId: 'IVF00026', name: '유아', imgUrl: '' },
    { fieldId: 'IVF00028', name: '자동차', imgUrl: '' },
    { fieldId: 'IVF00008', name: '금융', imgUrl: '' },
  ]

  const getImage = () => {
    if (data.imgUrl === null || data.imgUrl === undefined || String(data.imgUrl).trim() === '') {
      const img = require('assets/images/main_category_no_image.png').default
      return (
        <div
          className="category_inner"
          style={{
            // background: `url(${img}) center center no-repeat`,
            background: `url(${imgList[index]}) center center no-repeat`,
            backgroundSize: 'cover',
            cursor: 'pointer'
          }}
          onClick={onClickSearchCompany}
        >
          {data.value}
        </div>
      )
    } else {
      return (
        <div
          className="category_inner"
          style={{
            // background: `url(${data.imgUrl}) center center no-repeat`,
            background: `url(${imgList[index]}) center center no-repeat`,
            backgroundSize: 'cover',
            cursor: 'pointer'
          }}
          onClick={onClickSearchCompany}
        >
          {data.value}
        </div>
      )
      // require('assets/images/no_img.jpg').default
    }
  }
  return (
    <div className={'category_item01'} css={categoryItem01Style}>
      {getImage()}
    </div>
  )
}

export default MainCategoryCard
