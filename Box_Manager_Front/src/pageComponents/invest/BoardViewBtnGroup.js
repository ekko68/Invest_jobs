import { useState, useContext, useEffect } from 'react'
import Button from 'components/atomic/Button'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { useHistory } from 'react-router-dom'
import PopupConfirm from 'components/PopupConfirm'
import { UserContext } from 'modules/common/UserContext'

const BoardViewBtnGroup = (props) => {
  const userContext = useContext(UserContext)
  const { userInfo } = userContext.state
  const history = useHistory()
  const { id, page, handleDelete, writerId } = props

  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleRoutes = (id) => {
    if (id) {
      // 수정
      page === 'notice' && history.push(`${ROUTER_NAMES.INVEST_NOTICE_WRITE}/${id}`)
      page === 'document' && history.push(`${ROUTER_NAMES.INVEST_DOCUMENT_WRITE}/${id}`)
    } else {
      // 목록
      page === 'notice' && history.push(`${ROUTER_NAMES.INVEST_NOTICE_LIST}`)
      page === 'document' && history.push(`${ROUTER_NAMES.INVEST_DOCUMENT_LIST}`)
    }
  }

  useEffect(() => {
    userInfo && console.log('userInfo >> ', userInfo)
  }, [userInfo])

  const handleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete)
  }

  const handleDeleteProvider = async (status) => {
    if (status) {
      // 삭제
      await handleDelete(id)
      await handleConfirmDelete()
    } else {
      // 삭제 취소
      handleConfirmDelete()
    }
  }

  return (
    <>
      {confirmDelete && (
        <PopupConfirm msg={'정말 삭제하시겠습니까?'}>
          <Button className={'full_grey_dark'} onClick={() => handleDeleteProvider(false)}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={() => handleDeleteProvider(true)}>
            확인
          </Button>
        </PopupConfirm>
      )}
      <div className="rounded_btn_group">
        <Button className={'basic'} onClick={() => handleRoutes()}>
          화면
        </Button>
        {(userInfo?.supMngrYn === 'Y' || userInfo?.mngrId === writerId) && (
          <>
            <Button className={'full_blue'} onClick={() => handleRoutes(id)}>
              수정
            </Button>
            <Button className={'full_red'} onClick={handleConfirmDelete}>
              삭제
            </Button>
          </>
        )}
      </div>
    </>
  )
}

export default BoardViewBtnGroup
