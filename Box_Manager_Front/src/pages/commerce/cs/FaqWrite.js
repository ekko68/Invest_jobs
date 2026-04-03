import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'
import { getCsFaqDetail, getCsFaqSave, getCsFaqUpdate } from 'modules/consts/MktApi'

const FaqWrite = (props) => {
  const history = useHistory()
  const faqInfId = props.match.params.id
  const [faqData, setFaqData] = useState({
    ttl: '',
    con: ''
  })

  // ===== 완료 알림
  const [completeAlert, setCompleteAlert] = useState({
    status: false,
    msg: ''
  })

  // ===== 경고 알림
  const [warningAlert, setWarningAlert] = useState({
    status: false,
    msg: ''
  })

  // ===== 등록
  const handleRegister = async (state) => {
    if (faqData.ttl.trim().length <= 0) {
      setWarningAlert({
        status: true,
        msg: '제목을 입력하세요.'
      })
      return false
    }
    if (faqData.con.trim().length <= 0) {
      setWarningAlert({
        status: true,
        msg: '내용을 입력하세요.'
      })
      return false
    }

    //등록
    if (state) {
      let res = await getCsFaqSave(faqData)
      if (res.data.code === '200') {
        setCompleteAlert({
          status: true,
          msg: '등록이 완료되었습니다.'
        })
      }
      //수정
    } else {
      let res = await getCsFaqUpdate(faqData)
      if (res.data.code === '200') {
        setCompleteAlert({
          status: true,
          msg: '수정이 완료되었습니다.'
        })
      }
    }
  }

  // ===== 정보 조회
  const getDetail = async () => {
    let res = await getCsFaqDetail({ faqInfId: faqInfId })
    if (res.data.code === '200') {
      let data = res.data.data
      setFaqData(data)
    }
  }

  // ==== form 입력
  const changeValue = (e) => {
    setFaqData({ ...faqData, [e.target.name]: e.target.value })
  }

  // 목록으로 페이지 이동
  const linkToList = () => {
    history.push(ROUTER_NAMES.COMMERCE_CS_FAQ_LIST)
  }

  useEffect(() => {
    faqInfId && getDetail()
  }, [])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'cs'} currentPage={'faq'}>
      {completeAlert.status && <PopupAlert msg={completeAlert.msg} handlePopup={linkToList} />}
      {warningAlert.status && (
        <PopupAlert msg={warningAlert.msg} handlePopup={() => setWarningAlert({ msg: '', status: false })} />
      )}

      <div className="content_inner page_cs">
        <div className="page_header pb10">
          <h4 className="page_title">FAQ관리</h4>
        </div>

        {/*table_wrap start*/}
        <div className="table_wrap cs_faq_write_table">
          <div className="table_header">
            <p className="table_title">FAQ {faqInfId ? `수정` : `등록`}</p>
          </div>
          <table className="table form_table bg_none border_none">
            <caption>기본 정보 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>
                  <p>제목</p>
                </th>
                <td>
                  <input
                    type="text"
                    className="input"
                    name={'ttl'}
                    value={faqData.ttl}
                    onChange={changeValue}
                    title={'제목'}
                  />
                </td>
              </tr>
              <tr>
                <th className={'ta_left vertical_top'}>
                  <p>내용</p>
                </th>
                <td>
                  <textarea
                    className={'textarea h200'}
                    maxLength={500}
                    name={'con'}
                    value={faqData.con}
                    onChange={changeValue}
                    title={'내용'}
                  />
                  <p className={'max_length'}>{faqData.con?.length ? faqData.con?.length : 0}/500</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => linkToList()}>
            취소
          </Button>
          {faqInfId ? (
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

export default FaqWrite
