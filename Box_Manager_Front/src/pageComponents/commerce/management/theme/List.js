import NoResult from 'components/NoResult'
import { Link } from 'react-router-dom'
import Checkbox from 'components/atomic/Checkbox'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import { useCallback, useEffect, useRef, useState } from 'react'
import ROUTER_NAMES from 'modules/consts/RouterConst'

const List = (props) => {
  const { dataList, delThemeIds, setDelThemeIds, onChange, handleView } = props
  const [tableData, setTableData] = useState(dataList.list)
  const dragItem = useRef()
  const dragOverItem = useRef()

  const handleAllSelect = (e) => {
    const checked = e.target.checked
    if (checked) {
      // 전체 선택
      setDelThemeIds([...tableData])
    } else {
      setDelThemeIds([])
    }
  }

  const handleSelect = (e, id) => {
    const checked = e.target.checked
    if (checked) {
      setDelThemeIds([...delThemeIds, ...tableData.filter((_item) => _item.ffpcGrpId === id)])
    } else {
      setDelThemeIds([...delThemeIds.filter((_item) => _item.ffpcGrpId !== id)])
    }
  }

  useEffect(() => {
    setTableData(dataList.list)
  }, [dataList.list])
  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>테마 기업의 테마명, 날짜, 상태, 순서변경 정보 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'30%'} />
            <col width={'*'} />
            <col width={'10%'} />
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
              <th>테마명</th>
              <th>설명</th>
              <th>상태</th>
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
                      checked={delThemeIds.some((_item) => _item.ffpcGrpId === item.ffpcGrpId)}
                      onChange={(e) => {
                        handleSelect(e, item.ffpcGrpId)
                      }}
                    />
                  </td>
                  <td>
                    <Link
                      to={`${ROUTER_NAMES.COMMERCE_MANAGEMENT_THEME_UPDATE}/${item.ffpcGrpId}`}
                      className={'bannerText'}
                    >
                      {item.grpNm}
                    </Link>
                  </td>
                  <td className={'ta_center'}>{item.grpCon}</td>

                  <td
                    className={`ta_center ${
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
                  </td>
                  <td className={'ta_center'}>{item.infoSqn || ''}</td>
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
