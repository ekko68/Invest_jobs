import { useRef, useState, useContext, useEffect } from 'react'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import TextEditor from 'components/TextEditor'
import { useHistory, useParams } from 'react-router-dom'
import { UserContext } from 'modules/common/UserContext'
import { loader } from 'modules/utils/CommonAxios'
import { getQnaDetailApiV2, deleteQnaApiV2, saveQnaApiV2 } from 'modules/consts/MktApi'
import { MktContext } from 'modules/common/MktContext'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { StringUtils } from 'modules/utils/StringUtils'
import Select from 'components/atomic/Select'

const Registration = (props) => {
  const searchSelect = useRef(null)
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
      inquTypeId: selected
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
    inquTypeId: '',
    admCon: ''
  })

  //에디터 수정
  const handleChange = (contend) => {
    setData({
      ...data,
      admCon: contend
    })
  }

  const handleRequiredCheck = () => {
    if (StringUtils.hasLength(data.admCon)) {
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
    saveQnaApiV2(data, handleSaveCb, handleSaveErrCb)
  }

  const handleSaveCb = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'function1Btn',
      active: true,
      msg: '저장되었습니다.',
      action: () => {
        history.push(`${ROUTER_NAMES.COMMERCE_CS_QNA_LIST}`)
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
        deleteQnaApiV2(data, handleDeleteCallback, handleErrorCallback)
      }
    })
  }

  //취소 버튼
  const handleClose = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'function',
      active: true,
      msg: 'QNA 작성을 취소하시겠습니까?',
      btnMsg: '취소',
      btnMsg2: '확인',
      action2: () => {
        handleDeleteCallback()
      }
    })
  }

  //삭제 후처리
  const handleDeleteCallback = () => {
    history.push(ROUTER_NAMES.COMMERCE_CS_QNA_LIST)
  }

  //삭제 실패시
  const handleErrorCallback = () => () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  const handleUpdateDataSet = async () => {
    loader(true, 'Uploading...')

    let res = await getQnaDetailApiV2(id)
    if (res.data.code === '200') {
      let data = res.data.data
      setData({
        admInquInfId: data.adminQnaVO.admInquInfId,
        ttl: data.adminQnaVO.ttl,
        con: data.adminQnaVO.con.replace(/<\/?[^>]+(>|$)/g, ''),
        bplcNm: data.adminQnaVO.bplcNm,
        useYn: data.adminQnaVO.useYn,
        delYn: data.adminQnaVO.delYn,
        rgsnUserId: data.adminQnaVO.ansRgsnUserId,
        amnnUserId: data.adminQnaVO.ansRgsnUserId,
        inquTypeId: data.adminQnaVO.inquTypeId,
        inquSttId: data.adminQnaVO.inquSttId,
        admCon: data.adminQnaAnswerVOList[0]?.admCon
      })
      await loader()
    }
  }

  useEffect(() => {
    if (id) {
      handleUpdateDataSet()
      // 수정시 disabled 처리
      const updateList = selectList.list.map((item) => ({ ...item, disabled: true }))
      setSelectList({ ...selectList, list: updateList })
    }
  }, [id])

  useEffect(() => {
    if (data.inquTypeId) {
      setSelectList((prevSelectList) => ({
        ...prevSelectList,
        active: data.inquTypeId
      }))
    }
  }, [data.inquTypeId])

  if (id && !data?.admInquInfId) {
    return null
  }

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'cs'} currentPage={'csQna'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">문의 관리</h4>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table form_table bg_none border_none">
            <caption>문의 관리, 작성자, 제목, 문의, 답변 입력 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left th_length'}>문의 유형</th>
                <td>
                  <Select
                    optionList={selectList}
                    handleSelectActive={onSelectActive}
                    ref={searchSelect}
                    className="select_inquiry"
                    disabled
                  />
                </td>
                <th className={'ta_left th_length'}>작성자</th>
                <td>
                  <input type="text" className="input" value={data.bplcNm} title="작성자" disabled />
                </td>
              </tr>

              <tr>
                <th className={'ta_left'}>제목</th>
                <td colSpan={3}>
                  <input
                    type="text"
                    className="input"
                    placeholder="제목을 입력하세요."
                    value={data.ttl}
                    title="제목"
                    disabled
                  />
                </td>
              </tr>

              <tr>
                <th className={'ta_left th_length'}>내용</th>
                <td colSpan={3}>
                  <textarea
                    className="textarea textarea_h"
                    placeholder=""
                    maxLength={''}
                    id=""
                    value={data.con}
                    title="문의"
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th className={'ta_left th_length'}>답변</th>
                <td colSpan={3}>
                  <div className="editor_wrap">
                    <TextEditor placeholder="설명을 입력하세요." data={data.admCon} handleChange={handleChange} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={handleDelete}>
            삭제
          </Button>
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
