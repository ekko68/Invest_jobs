import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'
import Checkbox from 'components/atomic/Checkbox'
import { termFormatter, fnStatus } from 'modules/common'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import { useCallback, useEffect, useRef, useState } from 'react'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { NoImage02 } from 'modules/consts/Img'

const List = (props) => {
  const { dataList, delBannerIds, setDelBannerIds, onChange, handleView } = props
  const [tableData, setTableData] = useState(dataList.list)
  const dragItem = useRef()
  const dragOverItem = useRef()

  const handleAllSelect = (e) => {
    const checked = e.target.checked
    if (checked) {
      // 전체 선택
      setDelBannerIds([...tableData])
    } else {
      setDelBannerIds([])
    }
  }

  const handleSelect = (e, id) => {
    const checked = e.target.checked
    if (checked) {
      setDelBannerIds([...delBannerIds, ...tableData.filter((_item) => _item.banInfId === id)])
    } else {
      setDelBannerIds([...delBannerIds.filter((_item) => _item.banInfId !== id)])
    }
  }

  const _onDragStart = (e, position) => {
    dragItem.current = position
  }

  // 드래그 중인 대상이 위로 포개졌을 때
  const _onDragEnter = (e, position) => {
    dragOverItem.current = position
  }

  // 드랍 (커서 땠을 때)
  const _onDrag = useCallback(() => {
    const newList = [...tableData]
    const dragItemValue = newList[dragItem.current]
    newList.splice(dragItem.current, 1)
    newList.splice(dragOverItem.current, 0, dragItemValue)
    dragItem.current = null
    dragOverItem.current = null
    setTableData(newList)
    onChange(newList)
  }, [tableData])

  useEffect(() => {
    setTableData(dataList.list)
  }, [dataList.list])
  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>메인 배너 관리 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'30%'} />
            <col width={'22%'} />
            <col width={'10%'} />
            <col width={'*'} />
            <col width={'8%'} />
          </colgroup>
          <thead>
            <tr key={'banner_board_header0'}>
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
              <th>순서</th>
            </tr>
          </thead>
          <tbody>
            {dataList.isLoading ? (
              <Skeleton type="list" count={5} colSpan={5} />
            ) : tableData?.length > 0 ? (
              tableData?.map((item, idx) => (
                <tr key={'banner_board_item_' + idx} data-position={idx} onClick={() => {}}>
                  <td className={'ta_center'}>
                    <Checkbox
                      className="no_label"
                      checkbox={{ id: 'cell_check' + idx, value: '', status: true }}
                      checked={delBannerIds.some((_item) => _item.banInfId === item.banInfId)}
                      onChange={(e) => {
                        handleSelect(e, item.banInfId)
                      }}
                    />
                  </td>
                  <td>
                    <Link to={`${ROUTER_NAMES.COMMERCE_MAIN_PRODUCT_UPDATE}/${item.banInfId}`} className={'bannerText'}>
                      {item.ttl}
                    </Link>
                  </td>
                  <td className={'ta_center'}>
                    {termFormatter(item.stdy)}-{termFormatter(item.fnda)}
                  </td>

                  <td className={`ta_center status_${fnStatus(item.status)}`}>{item.status}</td>
                  <td className={'ta_center'}>
                    <div className="bannerImg_wrap">
                      {item.imgUrl ? (
                        <img src={item.imgUrl} alt={item.ttl} />
                      ) : (
                        <div className="no_img">
                          <img src={NoImage02} alt="이미지 없음" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={'ta_center'}>{item.infoSqn == 0 ? '-' : item.infoSqn}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={'ta_center'} colSpan={6}>
                  <NoResult msg={`데이터가 없습니다.`} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default List
