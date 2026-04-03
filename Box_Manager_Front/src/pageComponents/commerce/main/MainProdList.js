import NoResult from 'components/NoResult'
import Button from 'components/atomic/Button'
import { useEffect } from 'react'

const MainProdList = (props) => {
  const { mainBindList, handleLinkDetail, handleApprove } = props

  return (
    <div className="section main_bind_section">
      <div className="table_header">
        <h3 className="table_title">
          메인 묶음 상품
          <p className="info highlight_pink">* 최대 2개까지 등록 가능</p>
        </h3>
      </div>
      {!mainBindList || mainBindList.length === 0 ? (
        <div className="table_no_result">
          <NoResult msg={'지정된 메인 묶음 상품이 없습니다.'} />
        </div>
      ) : (
        <div className="table_wrap border_bottom_none table_th_border">
          <table className="table type02">
            <caption>메인 묶음 상품 목록 테이블</caption>
            <colgroup>
              <col width={'*'} />
              <col width={'8%'} />
              <col width={'15%'} />
              <col width={'15%'} />
              <col width={'15%'} />
              <col width={'12%'} />
            </colgroup>
            <thead>
              <tr>
                <th>묶음상품명</th>
                <th>
                  등록된
                  <br />
                  상품 수
                </th>
                <th>등록일</th>
                <th>판매사</th>
                <th>바로가기</th>
                <th>선택</th>
              </tr>
            </thead>
            <tbody>
              {mainBindList &&
                mainBindList?.map((item, idx) => (
                  <tr key={'main_bind_item_' + idx}>
                    <td>
                      <div className="img_title_wrap">
                        <div className="img_wrap">
                          {item?.imgUrl ? (
                            <img src={item?.imgUrl} alt={item?.pdfNm} />
                          ) : (
                            <div className="no_img">
                              <img src={require('assets/images/no_img.jpg').default} alt="이미지 없음" />
                            </div>
                          )}
                        </div>
                        <p className="name">{item?.pdfNm}</p>
                      </div>
                    </td>
                    <td className={'ta_center'}>{item?.items?.length}</td>
                    <td className={'ta_center'}>{'2022-08-01'}</td>
                    <td className={'ta_center'}>{item?.selrUsisName}</td>
                    <td className={'ta_center'}>
                      <Button className={'basic'} onClick={() => handleLinkDetail(item?.bunInfId)}>
                        묶음상품 페이지
                      </Button>
                    </td>
                    <td className={'ta_center'}>
                      <Button className={'full_red'} onClick={() => handleApprove(item)}>
                        선택 해제
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MainProdList
