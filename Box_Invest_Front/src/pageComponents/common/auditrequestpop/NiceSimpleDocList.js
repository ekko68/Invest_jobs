import React, { forwardRef, useContext, useEffect, useRef, useState } from 'react'
import Button from 'components/atomic/Button'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import ResponseUtils from 'modules/utils/ResponseUtils'
import NiceDocUtil from 'modules/utils/NiceDocUtil'
import DateUtils from 'modules/utils/DateUtils'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey } from 'modules/utils/CommonUtils'
import NoResult from 'components/common/NoResult'
import moment from 'moment'
const NiceSimpleDocList = forwardRef((props, ref) => {
  const commonContext = useContext(CommonContext)

  const [groupList, setGroupList] = useState([])
  const alertPopRef = useRef()
  const resArr = []

  const loadRecentDocList = async () => {
    //const resListData = await ResponseUtils.getList(Api.common.niceSimpleList, null, 'list', false);

    const resListData = await ResponseUtils.getList('/api/doc/infotech/simple/list', null, 'list', false)
    const arr = []
    let papersAtchFlpthNm = ''

    if (resListData.length > 0) {
      let dateSplit = resListData[0].fileNm.split('_')
      let now = new Date()
      let oneMonthAfter = new Date(now.setMonth(now.getMonth() + 2))
      if (dateSplit[0].substr(0, 8) === moment(oneMonthAfter).format('YYYYMMDD')) {
        papersAtchFlpthNm = 'expired'
      } else {
        papersAtchFlpthNm = 'download'
      }
      for (let i = 0; i < resListData.length; i++) {
        const obj = {
          fileId: resListData[i].fileId,
          fileName: '',
          papersAtchFlpthNm: papersAtchFlpthNm,
          rgsnTs: resListData[i].rgsnTs
        }
        const compareStr1 = resListData[i].fileNm.split('_')

        if (compareStr1[1] === 'e101') {
          obj.fileName = '사업자등록증명'
        } else if (compareStr1[1] === 'e103') {
          obj.fileName = '납세증명'
        } else if (compareStr1[2] === 'e102') {
          obj.fileName = '표준재무제표증명(' + compareStr1[1] + ')'
        } else if (compareStr1[2] === 'e105') {
          obj.fileName = '법인세 신고내역(' + compareStr1[1] + ')'
        } else if (compareStr1[2] === 'e107') {
          obj.fileName = '부가세 신고내역(' + compareStr1[1] + ')'
        }

        arr.push(obj)
      }

      arr.sort((a, b) => {
        return a.fileName < b.fileName ? -1 : a.fileName > b.fileName ? 1 : 0
      })
      resArr.push(arr)

      setGroupList(resArr)
    }
  }

  useEffect(() => {
    commonContext.actions.callbackAfterSessionRefresh(loadRecentDocList, true, true)
  }, [])

  return (
    <div className={'ir_doc_list_wrap'}>
      <div className="list_header">
        <p className="info highlight_blue">* 발급한 서류는 IBK기업은행 제출용으로만 사용할 수 있습니다.</p>
        <Button
          className={'btn_refresh blue linear'}
          type={'linear'}
          onClick={() => commonContext.actions.callbackAfterSessionRefresh(loadRecentDocList, true, true)}
        >
          <span className="">새로고침</span>
        </Button>
      </div>

      <div className="ir_doc_list_table">
        <table className="table type02">
          <caption>간편서류발급 & 제출 테이블</caption>
          <colgroup>
            <col width={'25%'} />
            <col width={'*'} />
            <col width={'15%'} />
          </colgroup>
          <thead>
            <tr>
              <th>제출일시</th>
              <th colSpan={2}>발급서류</th>
            </tr>
          </thead>
          <tbody>
            {groupList?.length > 0 ? (
              groupList?.map((group, index) => {
                return <DocGroup group={group} alertPopRef={alertPopRef} index={index} key={createKey()} />
              })
            ) : (
              <>
                <td colSpan={3}>
                  <NoResult msg={'제출된 간편서류 정보가 없습니다.'} />
                </td>
              </>
            )}
          </tbody>
        </table>
        <AlertPopup ref={alertPopRef} />
      </div>
    </div>
  )
})

const DocGroup = ({ group, alertPopRef, index }) => {
  const commonContext = useContext(CommonContext)
  console.log('group = ', group)
  return (
    <>
      <tr>
        <th rowSpan={group?.length}>
          <p
            className="date"
            dangerouslySetInnerHTML={{
              __html: DateUtils.customDateFormat(group[0].rgsnTs, 'yyyy.MM.dd<br/>HH:mm')
            }}
          >
            {/*2022.03.29 <br /> 11:10*/}
          </p>
        </th>
        {group?.length > 0 && (
          <>
            <td>{group[0].fileName}</td>
            <td>
              <button
                className={group[0].papersAtchFlpthNm === 'download' ? 'btn_download' : 'btn_download off'}
                onClick={() =>
                  NiceDocUtil.downloadNiceSimpleDoc(group[0], group[0].papersAtchFlpthNm, alertPopRef, commonContext)
                }
              >
                {NiceDocUtil.getDownloadBtnNm(group[0].papersAtchFlpthNm)}
              </button>
            </td>
          </>
        )}
      </tr>
      {group?.length > 1 &&
        group?.map(
          (groupItem, itemIdx) =>
            itemIdx > 0 && (
              <tr key={createKey()}>
                <td>{groupItem.fileName}</td>
                <td>
                  <button
                    className={groupItem.papersAtchFlpthNm === 'download' ? 'btn_download' : 'btn_download off'}
                    onClick={() =>
                      NiceDocUtil.downloadNiceSimpleDoc(
                        groupItem,
                        groupItem.papersAtchFlpthNm,
                        alertPopRef,
                        commonContext
                      )
                    }
                  >
                    {NiceDocUtil.getDownloadBtnNm(groupItem.papersAtchFlpthNm)}
                  </button>
                </td>
              </tr>
            )
        )}
    </>
  )
}

export default NiceSimpleDocList
