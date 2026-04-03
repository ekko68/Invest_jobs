import {useState, useRef, useEffect, useContext} from 'react'
import PageLayout from 'components/PageLayout'
import PopupConfirm from 'components/PopupConfirm'
import Button from 'components/atomic/Button'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { useHistory } from 'react-router-dom'
import { getConsultDetail, saveConsultReply } from 'modules/consts/InvestApi'
import { loader } from 'modules/utils/CommonAxios'
import { dateFormat } from 'modules/common'
import Radio from 'components/atomic/Radio'
import {UserContext} from "modules/common/UserContext";
import {InvestContext} from "modules/common/InvestContext";
import {deepCopyByRecursion} from "modules/fns/commonFn";

const View = (props) => {
  const history = useHistory()
  const userContext = useContext(UserContext);
  const investContext = useContext(InvestContext);
  const id = props.match.params.id
  const answerRef = useRef(null)
  const replyRef = useRef(null)
  const [view, setView] = useState(null)
  const [replyInput, setReplyInput] = useState('')
  const [confirmReg, setConfirmReg] = useState(false) // 컨설팅 문의 답변 완료 confirm
  const [confirmCancel, setConfirmCancel] = useState(false) //  답변 취소 confirm

  // const typeRadioList = [
  //   { id: 'consult_invest', value: '투자' },
  //   { id: 'consult_finance', value: '재무' },
  //   { id: 'consult_people', value: '인사' },
  //   { id: 'consult_export', value: '수출' },
  //   { id: 'consult_etc', value: '기타' }
  // ]

  const [typeRadioList, setTypeRadioList] = useState([]);

  // ===== 조회목록
  const getView = async () => {
    loader(true, 'Uploading...')
    const res = await getConsultDetail(id)
    if (res.data.code === '200') {
      setView(res.data.data)
      handleSetRadioCheck(res.data.data)
      loader()
    }
  }

  // 질의타입 세팅
  const handleSetRadioCheck = (data) => {
    if (data?.cnsgPtrnNm) {
      let activeCheck = typeRadioList.filter((chk) => chk.value === data.cnsgPtrnNm)
      let activeCheckId = activeCheck[0].id
      let input = document.getElementById(`${activeCheckId}`)
      input.checked = true
    }
  }

  // ===== 답변 등록
  // 답변 등록 활성화
  const handleAnswerActive = (type) => {
    /**
     * type: 활성화 여부 [boolean]
     * */
    const classList = answerRef.current.classList
    const btnGroup = document.querySelector('.qna_btn_group')
    if (type) {
      // 답변하기 활성화
      classList.remove('display_none')
      btnGroup.classList.add('display_none')
      replyRef.current.focus()
    } else {
      // 답변하기 닫기
      classList.add('display_none')
      btnGroup.classList.remove('display_none')
      setReplyInput('')
    }
  }

  // 답변 등록 컨펌
  const handleConfirmReg = () => {
    setConfirmReg(!confirmReg)
  }
  //  답변 취소 confirm
  const handleConfirmCancel = () => {
    setConfirmCancel(!confirmCancel)
  }
  const handleRegisterConfirm = (type) => {
    if (type) {
      // 등록
      if (replyInput.length <= 0) {
        alert('내용을 입력하세요')
        replyRef.current.focus()
        return false
      }
      handleConfirmReg() // 등록확인 컨펌
    } else {
      // 취소
      handleConfirmCancel() // 취소확인 컨펌
    }
  }

  // 답변 등록 API
  const handleRegister = async () => {
    loader(true, 'Uploading...')
    const data = {
      params: {
        cnsgReqsId: view.cnsgReqsId,
        cnsgRplyCon: replyInput
      },
      adminUser: userContext.actions.getIvtAdminUser()
    }
    const res = await saveConsultReply(data)
    if (res.data.message === 'OK') {
      // 등록완료 후
      setView(null) // state 초기화
      handleConfirmReg() // 팝업닫기
      getView() // 상세 재조회 및 state 세팅
      loader() // loading 닫음
    }
  }

  const isMountedRef = useRef(false);

  useEffect(() => {
    if(isMountedRef.current) id && getView()
  }, [typeRadioList]);

  useEffect(() => {
    if(investContext.state.codeInfo.isLoaded && !isMountedRef.current) {
      isMountedRef.current = true;
      setTypeRadioList(deepCopyByRecursion(investContext.state.codeInfo.consultingTypeList));
    }
  }, [investContext.state.codeInfo]);

  if (view) {
    return (
      <PageLayout currentMenu={'invest'} currentCate={'consult'}>
        {confirmReg && (
          <PopupConfirm msg={'컨설팅 문의에 대한 답변 내용은 수정할 수 없습니다. 답변을 완료하시겠습니까?'}>
            <Button className={'full_grey_dark'} onClick={handleConfirmReg}>
              취소
            </Button>
            <Button className={'full_blue'} onClick={handleRegister}>
              확인
            </Button>
          </PopupConfirm>
        )}
        {confirmCancel && (
          <PopupConfirm msg={'정말로 취소하시겠습니까?'}>
            <Button className={'full_grey_dark'} onClick={handleConfirmCancel}>
              취소
            </Button>
            <Button
              className={'full_blue'}
              onClick={() => {
                setReplyInput('')
                handleAnswerActive(false)
                handleConfirmCancel()
              }}
            >
              확인
            </Button>
          </PopupConfirm>
        )}
        <div className="content_inner page_consult query_form">
          <h4 className="page_title">컨설팅</h4>

          {/*status_stage_section start*/}
          <div className="status_stage_section mb60">
            <div className="section_header">
              <p className="section_title">진행 단계</p>
            </div>
            <div className="table_wrap">
              <table className="table bg_none">
                <caption>컨설팅 테이블</caption>
                <colgroup>
                  <col width={'20%'} />
                  <col width={'*'} />
                </colgroup>
                <tbody>
                  <tr>
                    <th>진행상태</th>
                    <td>{view.cnsgSttsNm}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/*status_stage_section end*/}

          {/*status_stage_section start*/}
          <div className="status_stage_section">
            <div className="section_header">
              <p className="section_title">질문 내용</p>
            </div>
            <div className="table_wrap">
              <table className="table bg_none">
                <caption>컨설팅 테이블</caption>
                <colgroup>
                  <col width={'20%'} />
                  <col width={'*'} />
                </colgroup>
                <tbody>
                  <tr>
                    <th>질의타입</th>
                    <td>
                      <div className="type_list_wrap readonly_layer">
                        {typeRadioList.map((radio) => (
                          <Radio key={radio.id} radio={radio} onChange={(e) => e.preventDefault()} readOnly={true} />
                        ))}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;목</th>
                    <td>
                      <div className="title_wrap">
                        <p className="title">{view.cnsgReqsTtl}</p>
                        <p className="date">{dateFormat(view.rgsnTs)}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th className={'vertical_top border_bottom_none'}>
                      내&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;용
                    </th>
                    <td className={'border_bottom_none'} style={{ whiteSpace: 'pre-wrap' }}>
                      {view.cnsgReqsCon}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/*컨설턴트 답변하기 start*/}
            <div className="answer_wrap display_none" ref={answerRef}>
              <div className="section_header">
                <p className="section_title">컨설턴트 답변</p>
              </div>
              <div className="textarea_form">
                <textarea
                  className="textarea"
                  ref={replyRef}
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  title={'답변'}
                  maxLength={3000}
                  style={{
                    lineHeight: '1.6'
                  }}
                />
              </div>
              <p
                className="require highlight_red"
                style={{
                  margin: '10px 0 0 10px'
                }}
              >
                최대 3,000자까지 등록 가능합니다.
              </p>
              <div className="rounded_btn_group">
                <Button className={'full_blue'} onClick={() => handleRegisterConfirm(true)}>
                  확인
                </Button>
                <Button className={'full_red'} onClick={() => handleRegisterConfirm(false)}>
                  취소
                </Button>
              </div>
            </div>
            {/*컨설턴트 답변하기 end*/}

            {/*컨설턴트 답변완료 start*/}
            {view?.cnsgRplyCon && (
              <div className="answer_wrap border_top_none">
                <div className="section_header">
                  <p className="section_title">컨설턴트 답변</p>
                </div>
                <div className="info_wrap">
                  <p className="date">{dateFormat(view.rplyTs)}</p>
                </div>
                <div className="text_wrap">{view.cnsgRplyCon}</div>
              </div>
            )}

            <div className="rounded_btn_group qna_btn_group">
              <Button className={'full_blue'} onClick={() => history.push(ROUTER_NAMES.INVEST_CONSULT_LIST)}>
                리스트
              </Button>
              {view?.cnsgSttsNm === '대기' && (
                <Button className={'full_blue'} onClick={() => handleAnswerActive(true)}>
                  답변하기
                </Button>
              )}
            </div>
            {/*컨설턴트 답변완료 end*/}
          </div>
          {/*status_stage_section end*/}
        </div>
      </PageLayout>
    )
  } else {
    return <div>&nbsp;</div>
  }
}

export default View
