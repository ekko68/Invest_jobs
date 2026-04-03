import { useContext, useEffect, useState } from 'react'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import PageLayout from 'components/PageLayout'
import BoardViewBtnGroup from 'pageComponents/invest/BoardViewBtnGroup'
import { deleteNoticeDetail, getNoticeDetail } from 'modules/consts/InvestApi'
import { useHistory } from 'react-router-dom'
import { fileDownload } from 'modules/utils/CommonUtils'
import { loader } from 'modules/utils/CommonAxios'
import { UserContext } from '../../../modules/common/UserContext'

const View = (props) => {
  const history = useHistory()
  const id = props.match.params.id
  const [view, setView] = useState(null)

  const userContext = useContext(UserContext)

  // ===== 상세조회
  const getView = async () => {
    loader(true, 'Uploading...')
    const res = await getNoticeDetail(id)
    if (res.data.code === '200') {
      setView(res.data.data)
      loader()
    }
  }

  // ===== 삭제
  const handleDelete = async (id) => {
    // const param = [id]
    const data = {
      list: [id],
      adminUser: userContext.actions.getIvtAdminUser()
    }
    const res = await deleteNoticeDetail(data)
    if (res.data.code === '200') {
      history.push(ROUTER_NAMES.INVEST_NOTICE_LIST)
    } else {
      alert('시스템오류입니다. 관리자에게 문의하세요')
    }
  }

  // ===== 파일 다운로드
  const handleFileDownload = async (file) => {
    await fileDownload(file)
  }

  useEffect(() => {
    id && getView()
  }, [])

  return (
    <PageLayout currentMenu={'invest'} currentCate={'notice'}>
      {view && (
        <div className="content_inner page_notice">
          <h4 className="page_title">공지사항</h4>

          {/*board_view_wrap start*/}
          <div className="board_view_wrap">
            <div className="board_header">
              <p className="section_title">공지사항</p>
            </div>
            <div className="board_title">{view.pbnsTtl}</div>
            <div className="board_content">{view.pbnsCon}</div>
            {view.attachFileList && view.attachFileList.length !== 0 && (
              <ul className="file_list">
                {view.attachFileList?.map((file, idx) => (
                  <li className="file_item" key={'file_item_' + idx}>
                    <span className="label">첨부{idx + 1}</span>
                    <p className="file_content">
                      <button className="btn_download" onClick={() => handleFileDownload(file)}>
                        {file.fileNm}
                      </button>
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div className="rounded_btn_group">
              <BoardViewBtnGroup id={id} page={'notice'} writerId={view.rgsnUserId} handleDelete={handleDelete} />
            </div>
          </div>
          {/*board_view_wrap end*/}
        </div>
      )}
    </PageLayout>
  )
}

export default View
