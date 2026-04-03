/** @jsxImportSource @emotion/react */
import { mainCompanySwiperStyle } from 'assets/style/ComponentStyle'
import { useEffect, useState } from 'react'
import { Autoplay, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import {createKey} from "modules/utils/CommonUtils";

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

const MainTotalFundAmountBeforeCompanySwiper = (props) => {
  const {data} = props
  const [list, setList] = useState([])
  
  const getSecretCompanyName = (item)=> {
    
    const arr = []
    for (let i = 0; i < item.length; i++) {
      let result = {
        invmExntPgsgCd: item[i].invmExntPgsgCd,
        invmExntPgsgNm: item[i].invmExntPgsgNm,
        invmExntRqstId: item[i].invmExntRqstId,
        rqstBplcNm: '',
        rqstEnprId: item[i].rqstEnprId
      }
      let originStr = item[i].rqstBplcNm
      let tmpName = item[i].rqstBplcNm.replace(/\(주\)/, '')
      let maskingStr = ''
      let strLength = ''

      strLength = tmpName.length

      if (strLength < 3) {
        if (strLength === 1) {
          maskingStr = tmpName.replace(/(?<=.{0})./gi, '*')
        } else {
          maskingStr = tmpName.replace(/(?<=.{1})./gi, '*')
        }
      } else {
        if (strLength === 3) {
          maskingStr = tmpName.replace(/(?<=.{2})./gi, '*')
        } else {
          maskingStr = tmpName.replace(/(?<=.{3})./gi, '*')
        }
      }

      if (originStr.indexOf('(주)', 3) > 0) {
        maskingStr = maskingStr + '*'
      } else if (originStr.indexOf('(주)') > -1) {
        maskingStr = '(주)' + maskingStr
      }
      result.rqstBplcNm = maskingStr
      arr.push(result)
    }
    setList(arr)
  }

  useEffect(()=> {
    if(data.applyList !== undefined) {
      getSecretCompanyName(data.applyList)
    }
  },[data])

  return (
    <div className={'invest_company_list'} css={mainCompanySwiperStyle}>
      <Swiper
        direction={'vertical'}
        centeredSlides={false}
        spaceBetween={20}
        slidesPerView={5}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          type: 'fraction'
        }}
        loop={true}
        loopedSlides={20}
        navigation={true}
        modules={[Pagination, Autoplay]}
      >
        {
          list?.map((item, i)=> (
            <SwiperSlide key={createKey()}>
              <div className="invest_company_item">
                {item.rqstBplcNm}
                <span className="invest_company_status">{item.invmExntPgsgNm}</span>
              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  )
}

export default MainTotalFundAmountBeforeCompanySwiper
