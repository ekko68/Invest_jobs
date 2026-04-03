import PageLayout from 'components/PageLayout'
import { useState, useEffect, useContext } from 'react'
import BoardViewBtnGroup from 'pageComponents/invest/BoardViewBtnGroup'
import { useHistory } from 'react-router-dom'
import { loader } from 'modules/utils/CommonAxios'
import { deleteDocDetail, getDocDetail } from 'modules/consts/InvestApi'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { fileDownload } from 'modules/utils/CommonUtils'
import { UserContext } from 'modules/common/UserContext'

const View = (props) => {
  const history = useHistory()
  const userContext = useContext(UserContext)
  const id = props.match.params.id
  const [view, setView] = useState(null)

  // ===== 상세조회
  const getView = async () => {
    loader(true, 'Uploading...')
    const res = await getDocDetail(id)
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
    const res = await deleteDocDetail(data)
    if (res.data.code === '200') {
      history.push(ROUTER_NAMES.INVEST_DOCUMENT_LIST)
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
    <PageLayout currentMenu={'invest'} currentCate={'document'}>
      {view && (
        <div className="content_inner page_document">
          <h4 className="page_title">문서 관리</h4>
          {/*board_view_wrap start*/}
          <div className="board_view_wrap">
            <div className="board_header">
              <p className="section_title">문서 읽기</p>
            </div>
            <div className="board_title">{view.dcmnNm}</div>
            <div className="board_content">{view.dcmnCon}</div>
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
              <BoardViewBtnGroup id={id} page={'document'} writerId={view.rgsnUserId} handleDelete={handleDelete} />
            </div>
          </div>
          {/*board_view_wrap end*/}
        </div>
      )}
    </PageLayout>
  )
}

export default View
