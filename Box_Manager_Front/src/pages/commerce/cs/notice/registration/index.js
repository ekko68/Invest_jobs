import { useRef, useState, useContext, useEffect } from 'react'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import TextEditor from 'components/TextEditor'
import { useHistory, useParams } from 'react-router-dom'
import { UserContext } from 'modules/common/UserContext'
import { loader } from 'modules/utils/CommonAxios'
import { getNoticeDetailApiV2, deleteNoticeApiV2, saveNoticeApiV2 } from 'modules/consts/MktApi'
import { MktContext } from 'modules/common/MktContext'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { StringUtils } from 'modules/utils/StringUtils'

const Registration = (props) => {
  const { id } = useParams()
  const userContext = useContext(UserContext)
  const mktContext = useContext(MktContext)
  const history = useHistory()
  const [data, setData] = useState({
    pbntInfId: '',
    infoSqn: '',
    ttl: '',
    con: '',
    useYn: '',
    delYn: '',
    rgsnUserId: userContext?.state?.userInfo?.mngrId,
    amnnUserId: userContext?.state?.userInfo?.mngrId
  })

  //에디터 수정
  const handleChange = (contend) => {
    setData({
      ...data,
      con: contend
    })
  }

  //데이터 수정
  const handleSetData = (type, value) => {
    setData({
      ...data,
      [type]: value
    })
  }

  const handleRequiredCheck = () => {
    if (StringUtils.hasLength(data.ttl) && StringUtils.hasLength(data.con)) {
      return true
    }
    return false
  }

  // 저장
  const handleSave = () => {
    if (!handleRequiredCheck()) {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '필수 정보를 모두 입력해주세요.'
      })
      return false
    }

    saveNoticeApiV2(data, handleSaveCb, handleSaveErrCb)
  }

  const handleSaveCb = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'function1Btn',
      active: true,
      msg: '저장되었습니다.',
      action: () => {
        history.push(`${ROUTER_NAMES.COMMERCE_CS_NOTICE_LIST}`)
      }
    })
  }

  const handleSaveErrCb = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  //공지 삭제
  const handleDelete = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'function',
      active: true,
      msg: '삭제 하시겠습니까?',
      btnMsg: '취소',
      btnMsg2: '확인',
      action2: () => {
        deleteNoticeApiV2(data, handleDeleteCallback, handleErrorCallback)
      }
    })
  }

  //취소 버튼
  const handleClose = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'function',
      active: true,
      msg: '공지사항 작성을 취소하시겠습니까?',
      btnMsg: '취소',
      btnMsg2: '확인',
      action2: () => {
        handleDeleteCallback()
      }
    })
  }

  //삭제 후처리
  const handleDeleteCallback = () => {
    history.push(ROUTER_NAMES.COMMERCE_CS_NOTICE_LIST)
  }

  //삭제 실패시
  const handleErrorCallback = () => () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  //상세
  const handleUpdateDataSet = async () => {
    loader(true, 'Uploading...')

    let res = await getNoticeDetailApiV2(id)
    if (res.data.code === '200') {
      let data = res.data.data
      setData({
        pbntInfId: data.data.pbntInfId,
        infoSqn: data.data.infoSqn,
        ttl: data.data.ttl,
        con: data.data.con,
        useYn: data.data.useYn,
        delYn: data.data.delYn,
        rgsnUserId: data.data.rgsnUserId,
        amnnUserId: data.data.amnnUserId
      })
      await loader()
    }
  }

  useEffect(() => {
    if (id) {
      handleUpdateDataSet()
    }
  }, [id])

  if (id && !data?.pbntInfId) {
    return null
  }
  return (
    <PageLayout currentMenu={'commerce'} currentCate={'cs'} currentPage={'commerceNotice'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">공지사항</h4>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table form_table bg_none border_none">
            <caption>제목, 내용 입력 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>제목</th>
                <td>
                  <input
                    type="text"
                    className="input"
                    placeholder="제목을 입력하세요."
                    title="제목"
                    value={data.ttl}
                    onChange={(e) => {
                      handleSetData('ttl', e.target.value)
                    }}
                  />
                </td>
              </tr>

              <tr>
                <th className={'ta_left th_length'}>내용</th>
                <td>
                  <div className="editor_wrap">
                    <TextEditor data={data.con} handleChange={handleChange} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="rounded_btn_group">
          {id && (
            <Button className={'basic'} onClick={handleDelete}>
              삭제
            </Button>
          )}
          <Button className={'basic'} onClick={handleClose}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleSave}>
            저장
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Registration
