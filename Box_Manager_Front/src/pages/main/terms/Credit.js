import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import TextEditor from 'components/TextEditor'
import { saveIBKBOXCreditTerms, saveTerms } from 'modules/consts/MainApi'
import PopupAlert from 'components/PopupAlert'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from 'modules/common/UserContext'
import Preview from './Preview'

const Credit = () => {
  const [popup, setPopup] = useState({ active: false, type: null, text: null })
  const [showPreview, setShowPreview] = useState(false)
  const userContext = useContext(UserContext)
  const [data, setData] = useState({
    stplCon: ''
  })

  useEffect(() => {
    const getService = async () => {
      const res = await saveIBKBOXCreditTerms()
      setData(res.data.data)
    }
    getService()
  }, [])

  const handleSaveTerms = async () => {
    console.log({
      amnnUserId: userContext.state?.userInfo?.mngrId,
      stplCon: data.stplCon,
      stplId: data.stplId
    })
    let saveRes = await saveTerms({
      amnnUserId: userContext.state?.userInfo?.mngrId,
      stplCon: data.stplCon,
      stplId: data.stplId
    })
    if (saveRes.data.code === '200') {
      setPopup({ active: true, type: 'confirm', text: '수정된 내역이 저장되었습니다.' })
    } else {
      setPopup({ active: true, type: 'error' })
    }
  }

  const handleChange = (content) => {
    setData({
      ...data,
      stplCon: content
    })
  }

  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainTerms'} currentPage={'mainTermsCredit'}>
      {showPreview && <Preview preview={data.stplCon} handlePopup={() => setShowPreview(false)} />}
      {popup.active && popup.type === 'confirm' && (
        <PopupAlert msg={popup.text} handlePopup={() => setPopup({ ...popup, active: false })} />
      )}

      {popup.active && popup.type === 'error' && (
        <PopupAlert msg={'오류가 발생했습니다.'} handlePopup={() => setPopup({ active: false, type: null })} />
      )}
      <div className="content_inner page_terms">
        <div className="page_header">
          <h4 className="page_title">신용정보활용체제</h4>
          <div className="btn_group">
            <Button className={'full_blue w80'} onClick={() => setShowPreview(true)}>
              미리보기
            </Button>
            <Button className={'full_blue w80'} onClick={handleSaveTerms}>
              등록
            </Button>
          </div>
        </div>

        <div className="editor_wrap">
          <TextEditor data={data.stplCon} handleChange={handleChange} />
        </div>
      </div>
    </PageLayout>
  )
}

export default Credit
