import { useRef, useState, useContext, useEffect } from 'react'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import TextEditor from 'components/TextEditor'
import { useHistory, useParams } from 'react-router-dom'
import { UserContext } from 'modules/common/UserContext'
import { loader } from 'modules/utils/CommonAxios'
import { getFaqDetailApiV2, deleteFaqApiV2, saveFaqApiV2 } from 'modules/consts/MktApi'
import { MktContext } from 'modules/common/MktContext'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { StringUtils } from 'modules/utils/StringUtils'
import Select from 'components/atomic/Select'

const Registration = (props) => {
  const sortSelect = useRef(null)

  const [selectList, setSelectList] = useState({
    active: 'AIS00000',
    list: [
      { id: 'AIS00000', label: '분류항목' },
      { id: 'AIS00001', label: '배송' },
      { id: 'AIS00002', label: '구매' },
      { id: 'AIS00003', label: '판매' },
      { id: 'AIS00004', label: '에이전시' },
      { id: 'AIS00005', label: '기타' },
      { id: 'AIS00006', label: '이벤트' },
      { id: 'AIS00007', label: '회원가입' },
      { id: 'AIS00008', label: '구매자' },
      { id: 'AIS00009', label: '판매자' },
      { id: 'AIS00010', label: '상품' },
      { id: 'AIS00011', label: '기업' },
      { id: 'AIS00012', label: '박스포스' },
      { id: 'AIS00013', label: '견적요청' },
      { id: 'AIS00014', label: '결제방법' },
      { id: 'AIS00015', label: '묶음 상품' },
      { id: 'AIS00016', label: '공유 상품' },
      { id: 'AIS00017', label: '기업홍보관' }
    ]
  })

  const onSelectActive = (selected) => {
    setSelectList({
      ...selectList,
      active: selected
    })
    setData({
      ...data,
      ptrn: selected
    })
  }

  const { id } = useParams()
  const userContext = useContext(UserContext)
  const mktContext = useContext(MktContext)
  const history = useHistory()
  const [data, setData] = useState({
    faqInfId: '',
    infoSqn: '',
    ttl: '',
    con: '',
    useYn: '',
    delYn: '',
    rgsnUserId: userContext?.state?.userInfo?.mngrId,
    amnnUserId: userContext?.state?.userInfo?.mngrId,
    ptrn: ''
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
    if (
      StringUtils.hasLength(data.ttl) &&
      StringUtils.hasLength(data.con) &&
      (StringUtils.hasLength(data.ptrn) || StringUtils.hasLength(data.ptrn) === 'AIS00000')
    ) {
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
    saveFaqApiV2(data, handleSaveCb, handleSaveErrCb)
  }

  const handleSaveCb = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'function1Btn',
      active: true,
      msg: '저장되었습니다.',
      action: () => {
        history.push(`${ROUTER_NAMES.COMMERCE_CS_FAQ_LIST}`)
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
        deleteFaqApiV2(data, handleDeleteCallback, handleErrorCallback)
      }
    })
  }

  //취소 버튼
  const handleClose = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'function',
      active: true,
      msg: 'FAQ 작성을 취소하시겠습니까?',
      btnMsg: '취소',
      btnMsg2: '확인',
      action2: () => {
        handleDeleteCallback()
      }
    })
  }

  //삭제 후처리
  const handleDeleteCallback = () => {
    history.push(ROUTER_NAMES.COMMERCE_CS_FAQ_LIST)
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

    let res = await getFaqDetailApiV2(id)
    if (res.data.code === '200') {
      let data = res.data.data
      setData({
        faqInfId: data.faqInfId,
        infoSqn: data.infoSqn,
        ttl: data.ttl,
        con: data.con,
        useYn: data.useYn,
        delYn: data.delYn,
        rgsnUserId: data.rgsnUserId,
        amnnUserId: data.amnnUserId,
        ptrn: data.ptrn
      })
      await loader()
    }
  }

  useEffect(() => {
    if (id) {
      handleUpdateDataSet()
    }
  }, [id])

  useEffect(() => {
    if (data.ptrn) {
      setSelectList((prevSelectList) => ({
        ...prevSelectList,
        active: data.ptrn
      }))
    }
  }, [data.ptrn])

  if (id && !data?.faqInfId) {
    return null
  }
  return (
    <PageLayout currentMenu={'commerce'} currentCate={'cs'} currentPage={'faq'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">FAQ</h4>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table form_table bg_none border_none">
            <caption>FAQ 유형, 제목, 내용 입력 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left th_length'}>FAQ 유형</th>
                <td>
                  <Select optionList={selectList} handleSelectActive={onSelectActive} ref={sortSelect} />
                </td>
              </tr>

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
