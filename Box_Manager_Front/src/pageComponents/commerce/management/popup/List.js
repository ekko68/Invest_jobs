import React, { Fragment } from 'react'
import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'
import Checkbox from 'components/atomic/Checkbox'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import { termFormatter } from 'modules/common'
import { NoImage02 } from 'modules/consts/Img'
import ROUTER_NAMES from 'modules/consts/RouterConst'

const List = (props) => {
  const { data, delPopInfIds, setDelPopInfIds } = props

  const handleAllSelect = (e) => {
    const checked = e.target.checked
    if (checked) {
      // 전체 선택
      setDelPopInfIds([...data.list])
    } else {
      setDelPopInfIds([])
    }
  }

  const handleSelect = (e, id) => {
    const checked = e.target.checked
    if (checked) {
      setDelPopInfIds([...delPopInfIds, ...data.list.filter((_item) => _item.popupInfId === id)])
    } else {
      setDelPopInfIds([...delPopInfIds.filter((_item) => _item.popupInfId !== id)])
    }
  }

  return (
    <Fragment>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>선택, 제목, 기간, 상태 , 이미지 정보 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'*'} />
            <col width={'22%'} />
            <col width={'10%'} />
            <col width={'20%'} />
          </colgroup>
          <thead>
            <tr>
              <th>
                <Checkbox
                  className="no_label"
                  checkbox={{ id: 'cell_checkAll', value: '', status: true }}
                  onChange={(e) => {
                    handleAllSelect(e)
                  }}
                />
              </th>
              <th>제목</th>
              <th>기간</th>
              <th>상태</th>
              <th>이미지</th>
            </tr>
          </thead>
          <tbody>
            {data.isLoading ? (
              <Skeleton type="list" count={5} colSpan={5} />
            ) : data.list?.length > 0 ? (
              data.list.map((item, idx) => (
                <tr key={'banner_board_item_' + idx} onClick={() => {}}>
                  <td className={'ta_center'}>
                    <Checkbox
                      className="no_label"
                      checkbox={{ id: 'cell_check' + idx, value: '', status: true }}
                      checked={delPopInfIds.some((_item) => _item.popupInfId === item.popupInfId)}
                      onChange={(e) => {
                        handleSelect(e, item.popupInfId)
                      }}
                    />
                  </td>
                  <td>
                    <Link
                      to={`${ROUTER_NAMES.COMMERCE_MANAGEMENT_POPUP_UPDATE}/${item.popupInfId}`}
                      className={'bannerText'}
                    >
                      {item.ttl}
                    </Link>
                  </td>
                  <td className={'ta_center'}>
                    {termFormatter(item.stdy)}-{termFormatter(item.fnda)}
                  </td>
                  <td className={'ta_center'}>
                    <span
                      className={`${
                        item.status === '공개'
                          ? 'status_public'
                          : item.status === '대기'
                          ? 'status_ready'
                          : item.status === '종료'
                          ? 'status_close'
                          : 'status_private'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className={'ta_center'}>
                    <div className="bannerImg_wrap">
                      <div className="img_wrap">
                        {item.imgUrl ? (
                          <img src={item.imgUrl} alt={item.ttl} />
                        ) : (
                          <div className="no_img">
                            <img src={NoImage02} alt="이미지 없음" />
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={'ta_center'} colSpan={5}>
                  <NoResult msg={`데이터가 없습니다.`} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Fragment>
  )
}

export default List
