import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'
import PopupConfirm from 'components/PopupConfirm'
import { getCsQnaDetail, getCsQnaSave, getCsQnaUpdate, getCsQnaDel } from 'modules/consts/MktApi'
import { fileDownloadMkt } from 'modules/utils/CommonUtils'
import { loader } from 'modules/utils/CommonAxios'
import moment from 'moment'

const QnaView = (props) => {
  const history = useHistory()
  const admInquInfId = props.match.params.id
  const replyInitialData = {
    admInquInfId: admInquInfId,
    admCon: ''
  }
  const [qnaData, setQnaData] = useState(null) // 문의데이터
  const [replyData, setReplyData] = useState(replyInitialData) // 답변데이터

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [completeAlert, setCompleteAlert] = useState({
    status: false,
    msg: ''
  })
  const [rejectAlert, setRejectAlert] = useState(false)

  // ===== get data
  const getDetail = async () => {
    loader(true, 'Uploading...')
    let res = await getCsQnaDetail({ admInquInfId: admInquInfId })
    if (res.data.code === '200') {
      let data = res.data.data
      setQnaData(data.adminQnaVO) // qna data
      // 답변 data
      data.adminQnaAnswerVOList[0] ? setReplyData(data.adminQnaAnswerVOList[0]) : setReplyData(replyInitialData)
      loader()
    }
  }

  // =====  삭제
  const handleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete)
  }
  const handleDelete = async (type) => {
    if (type === 'confirm') {
      let res = await getCsQnaDel(replyData)
      if (res.data.code === '200') {
        linkToList()
      }
    } else {
      setConfirmDelete(!confirmDelete)
    }
  }

  // ===== 등록 & 수정
  const handleRegister = async (state) => {
    if (replyData.admCon.trim().length <= 0) {
      setRejectAlert(true)
      return false
    }
    // 등록
    if (state) {
      let res = await getCsQnaSave(replyData)
      if (res.data.code === '200') {
        setCompleteAlert({
          status: true,
          msg: '등록이 완료되었습니다.'
        })
      }
      //수정
    } else {
      let res = await getCsQnaUpdate(replyData)
      if (res.data.code === '200') {
        setCompleteAlert({
          status: true,
          msg: '수정이 완료되었습니다.'
        })
      }
    }
  }

  // ===== 페이지 이동
  const linkToList = () => {
    // history.push(ROUTER_NAMES.COMMERCE_CS_QNA_VIEW)
    window.location.reload();
  }

  // ===== 파일 다운로드
  const handleFileDownload = async (file) => {
    await fileDownloadMkt(file)
  }

  useEffect(async () => {
    await getDetail()
  }, [])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'cs'} currentPage={'qna'}>
      {rejectAlert && <PopupAlert msg={'답변 내용을 입력하세요'} handlePopup={() => setRejectAlert(false)} />}
      {completeAlert.status && <PopupAlert msg={completeAlert.msg} handlePopup={linkToList} />}
      {confirmDelete && <PopupConfirm msg={'삭제 하시겠습니까?'} handlePopup={handleDelete} />}

      <div className="content_inner page_cs">
        <div className="page_header">
          <h4 className="page_title">문의</h4>
          <div className="btn_group">
            <Button className={'basic'} onClick={() => history.push(ROUTER_NAMES.COMMERCE_CS_QNA_LIST)}>
              목록
            </Button>
            <Button className={'full_blue'} onClick={handleConfirmDelete}>
              삭제
            </Button>
          </div>
        </div>
        {/*section start*/}
        {qnaData && (
          <div className="section filter_section">
            <div className="table_wrap table_th_border">
              {qnaData.rgsnTs && (
                <p className="date">{qnaData.rgsnTs ? moment(qnaData.rgsnTs).format('YYYY-MM-DD HH:mm') : '-'}</p>
              )}

              <table className="table type02" summary={'문의 관리 테이블'}>
                <caption>문의 관리 테이블</caption>
                <colgroup>
                  <col width={'15%'} />
                  <col width={'*'} />
                  <col width={'15%'} />
                  <col width={'18%'} />
                </colgroup>
                <thead>
                  <tr>
                    <th>문의 유형</th>
                    <th>제목</th>
                    <th>상태</th>
                    <th>작성자</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={'ta_center'}>{qnaData.inquTypeName ?? '-'}</td>
                    <td>{qnaData.ttl}</td>
                    <td className={'ta_center'}>{qnaData.inquSttName ?? '-'}</td>
                    <td className={'ta_center'}>{qnaData.bplcNm ?? '-'}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className={'bg_light_grey'}>
                      <div className="cs_content">{qnaData.con ?? '-'}</div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <ul className="file_list">
                        {qnaData.adminQnaFileVOList &&
                          qnaData.adminQnaFileVOList.map((file, idx) => (
                            <li className="file_item" key={'qna_view_file_item_' + idx}>
                              <span className="label">첨부 {idx + 1}</span>
                              <p className="file_content">
                                <button className="btn_download" onClick={() => handleFileDownload(file)}>
                                  {file.fileNm}
                                </button>
                              </p>
                            </li>
                          ))}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/*section end*/}
        <div className="section order_table_section">
          <div className="table_wrap table_th_border">
            <div className="table_header">
              <p className="table_title">
                답변
                {replyData?.amnnTs ? (
                  <small>{moment(replyData?.amnnTs).format('YYYY-MM-DD HH:mm')}</small>
                ) : replyData?.rgsnTs ? (
                  <small>{moment(replyData?.rgsnTs).format('YYYY-MM-DD HH:mm')}</small>
                ) : (
                  ''
                )}
              </p>
            </div>
            <table className="table type02" summary={'문의 답변 테이블'}>
              <caption>문의 답변 테이블</caption>
              <colgroup>
                <col width={'*'} />
              </colgroup>
              <tbody>
                <tr className={'cursor_default'}>
                  <td className={'bg_light_grey'}>
                    <div className="cs_content" style={{ padding: '0 15px 0 15px' }}>
                      <div>
                        <textarea
                          className={'textarea h200'}
                          maxLength={1000}
                          value={replyData.admCon ?? ''}
                          onChange={(e) => setReplyData({ ...replyData, admCon: e.target.value })}
                        />
                        <p className={'max_length'}>{replyData.admCon ? replyData.admCon.length : 0}/1000</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={linkToList}>
            취소
          </Button>
          {qnaData?.inquSttName === '답변완료' ? (
            <Button className={'full_blue'} onClick={() => handleRegister(false)}>
              수정
            </Button>
          ) : (
            <Button className={'full_blue'} onClick={() => handleRegister(true)}>
              등록
            </Button>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default QnaView
