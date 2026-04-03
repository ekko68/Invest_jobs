import { useState, useEffect, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { getEventDetailApi, deleteEventApi } from 'modules/consts/MktApi'
import moment from 'moment'
import { NoImage02 } from 'modules/consts/Img'
import { fileDownloadMkt } from 'modules/utils/CommonUtils'
import { MktContext } from 'modules/common/MktContext'

const View = () => {
  const history = useHistory()
  const { id } = useParams()
  const mktContext = useContext(MktContext)
  // 삭제 confirm
  const [eventDetail, setEventDetail] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(false)

  // ===== delete
  const handleDeleteEvent = async (type) => {
    if (type === 'confirm') {
      const res = await deleteEventApi(eventDetail)
      if (res.data.code === '200') {
        mktContext.actions.handleEventParam(null)
        history.push(`${ROUTER_NAMES.COMMERCE_EVENT_LIST}`)
      }
    } else {
      setConfirmDelete(false)
    }
  }

  const getList = async (params) => {
    let res = await getEventDetailApi(params)
    if (res.data.code === '200') {
      let data = res.data.data
      setEventDetail(data)
    }
  }

  // ===== 파일 다운로드
  const handleFileDownload = async (file) => {
    await fileDownloadMkt(file)
  }

  useEffect(() => {
    getList({
      evntInfId: id
    })
  }, [])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'event'}>
      {confirmDelete && <PopupConfirm msg={'삭제하시겠습니까?'} handlePopup={handleDeleteEvent} />}
      <div className="content_inner page_event view_table">
        <div className="page_header">
          <h4 className="page_title">이벤트 상세</h4>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table_type02">
            <caption>이벤트 상세 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left bg_light_grey'}>
                  <p>제목</p>
                </th>
                <td>{eventDetail.evntTtl}</td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  <p>이벤트 설명</p>
                </th>
                <td>
                  <p className="content">{eventDetail.evntCon}</p>
                </td>
              </tr>
              <tr>
                <th className={'ta_left'} rowSpan={2}>
                  <p>기간</p>
                </th>
                <td>
                  <div className="date_input_row">
                    <p className="label">신청기간</p>
                    <div className="date_input_wrap ico_type02">
                      <div className="date_inputs">
                        <span>{moment(eventDetail.enlsSldyTs).format('YYYY-MM-DD')}</span>
                        <span>~</span>
                        <span>{moment(eventDetail.enlsCldyTs).format('YYYY-MM-DD')}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="date_input_row">
                    <p className="label">진행기간</p>
                    <div className="date_input_wrap ico_type02 ">
                      <div className="date_inputs">
                        <span>{moment(eventDetail.evntStdyTs).format('YYYY-MM-DD')}</span>
                        <span>~</span>
                        <span>{moment(eventDetail.evntFndaTs).format('YYYY-MM-DD')}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  <p>이미지 등록</p>
                </th>
                <td>
                  {/*attach_content start*/}
                  <div className="attach_content">
                    <div className="img_info_wrap">
                      <div className="img_wrap">
                        {eventDetail?.imgUrl ? (
                          <button onClick={() => handleFileDownload(eventDetail?.imgFileInfo)}>
                            <img src={eventDetail?.imgUrl} alt={eventDetail?.imgFileInfo?.fileNm} />
                            <figcaption className={'highlight_blue'}>{eventDetail?.imgFileInfo?.fileNm}</figcaption>
                          </button>
                        ) : (
                          <div className="no_img">
                            <img src={NoImage02} alt="이미지 없음" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/*attach_content end*/}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => history.push(`${ROUTER_NAMES.COMMERCE_EVENT_LIST}`)}>
            목록
          </Button>
          <Button className={'full_blue'} onClick={() => history.push(`${ROUTER_NAMES.COMMERCE_EVENT_WRITE}/${id}`)}>
            수정
          </Button>
          <Button className={'full_red'} onClick={() => setConfirmDelete(true)}>
            삭제
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

export default View
