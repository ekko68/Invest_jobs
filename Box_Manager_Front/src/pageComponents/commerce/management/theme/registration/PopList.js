import NoResult from 'components/NoResult'
import { getTotalNumberBoard, termFormatter } from 'modules/common'
import { Nolast02 } from 'modules/consts/Img'
import Checkbox from 'components/atomic/Checkbox'
import Skeleton from 'pageComponents/commerce/common/Skeleton'
import { useCallback, useEffect, useRef, useState } from 'react'

const PopList = (props) => {
  const { dataList, delvCompanyInfo, setDelvCompanyInfo, mktContext } = props
  const handleAllSelect = (e) => {
    const checked = e.target.checked
    if (checked) {
      // 전체 선택
      setDelvCompanyInfo([...dataList.list.slice(0, 6)])
    } else {
      setDelvCompanyInfo([])
    }
  }

  const handleSelect = (e, id) => {
    const checked = e.target.checked
    const len = delvCompanyInfo.length + (checked ? 1 : -1)

    if (len > 6) {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '최대 6개 선택 가능합니다.'
      })
      return
    }

    if (checked) {
      setDelvCompanyInfo([...delvCompanyInfo, ...dataList.list.filter((_item) => _item.utlinsttId === id)])
    } else {
      setDelvCompanyInfo([...delvCompanyInfo.filter((_item) => _item.utlinsttId !== id)])
    }
  }
  return (
    <>
      <div className={'banner_list_wrap table_th_border'}>
        <table className="table type02">
          <caption>기업명, 카테고리, 기업 형태,IBK 인증여부 정보 테이블</caption>
          <colgroup>
            <col width={'5%'} />
            <col width={'*'} />
            <col width={'30%'} />
            <col width={'15%'} />
            <col width={'15%'} />
          </colgroup>
          <thead>
            <tr key={'banner_board_header'}>
              <th>
                <Checkbox
                  className="no_label"
                  checkbox={{ id: 'cell_checkAll', value: '', status: true }}
                  onChange={(e) => {
                    handleAllSelect(e)
                  }}
                />
              </th>
              <th>기업명</th>
              <th>카테고리</th>
              <th>기업 형태</th>
              <th>IBK 인증</th>
            </tr>
          </thead>
          <tbody>
            {dataList.isLoading ? (
              <Skeleton type="list" count={10} colSpan={5} />
            ) : dataList.list?.length > 0 ? (
              dataList.list.map((item, idx) => (
                <tr key={'banner_board_item_' + idx} onClick={() => {}}>
                  <td className={'ta_center'}>
                    <Checkbox
                      className="no_label"
                      checkbox={{ id: 'cell_check' + idx, value: '', status: true }}
                      checked={delvCompanyInfo.some((_item) => _item.utlinsttId === item.utlinsttId)}
                      onChange={(e) => {
                        handleSelect(e, item.utlinsttId)
                      }}
                    />
                  </td>
                  <td className={'ta_center'}>{item.bplcNm}</td>
                  <td className={'ta_center'}>{item.lctgyNm}</td>
                  <td className={'ta_center'}>{item.useEntrprsSeNm}</td>
                  <td className={'ta_center'}>{item.certNm}</td>
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
    </>
  )
}

export default PopList
