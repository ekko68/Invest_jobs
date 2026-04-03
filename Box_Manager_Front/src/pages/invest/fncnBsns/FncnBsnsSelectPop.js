import Button from 'components/atomic/Button'
import Checkbox from 'components/atomic/Checkbox'
import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'
import { getConfig } from 'modules/utils/CommonUtils'
import FncnBsnsManagePop from 'pages/invest/fncnBsns/FncnBsnsManagePop'
import { useEffect, useState } from 'react'

const FncnBsnsSelectPop = (props) => {
  const { close, onComplete, list, idx } = props
  const [typeCheckboxList, setTypeCheckboxList] = useState([])
  
  const [isOpen, setIsOpen] = useState({
    active : false
  })
  
  const [isUpdate, setIsUpdate] = useState(true)
  const [chkBox, setChkBox] = useState([])

  // 항목관리 팝업 호출
  const openManagePopup = ()=> {
    setIsOpen({ ...isOpen , active: true})
  }

  // 항목 조회
  const getList = async()=> {
    let res = await CommonAxios('IVT', getConfig(Api.invest.fncnBsnsEnlsFildList, null))
    if(res.data.code === '200') {
      let arr = []
      for(let i=0 ; i<res.data.data.list.length ; i++) {
        const list = {
          ...res.data.data.list[i],
          status : false
        }
        arr.push(list)
      }  
      setTypeCheckboxList(arr)
    }
  }

  // 지원분야 체크박스 선택
  const selectChkData = (e)=> {
    let arr = [...chkBox]
    
    if(e.target.checked === true) {
      for(let i=0 ; i<typeCheckboxList.length ; i++) {
        if(e.target.id === typeCheckboxList[i].comCdId) {
          typeCheckboxList[i].status = true
          if( typeCheckboxList[i].status === true) {
            arr.push(typeCheckboxList[i])
          }
        }else {
          typeCheckboxList[i].status = false
          arr.splice(i,1)
        }
      }
      setChkBox(arr)
    }else {
      setChkBox((pre) => pre.filter((data) => data.comCdId !== e.target.id))
    }
  }

  // 지원분야 추가
  const createItem = () => {
    const item = {}
    let listArr = []
    let strArr = []
    let codeArr = []

    item['rgsnSqn'] = idx
    for(let i=0 ; i<chkBox.length ; i++) {
      codeArr.push(chkBox[i].comCdId)
      strArr.push(chkBox[i].comCdNm)
    }
    item['fncnBsnsEnlsFildUqn'] = codeArr.toString()
    item['fncnBsnsEnlsFildNm'] =  strArr.toString()

    listArr.push(item)
    
    return listArr
  }
  
  // 완료버튼 클릭
  const completePop = ()=> {
    const item = createItem();
    setIsUpdate(!isUpdate)
    onComplete(item)
    close()
  }

  useEffect(()=>{
    getList()
  },[])

  return (
    
    <div className="popup_wrap popup_invest">
      {isOpen.active && (
        <FncnBsnsManagePop
          activeOption={isOpen.active}
          close={() => {
            setIsOpen({ ...isOpen , active: false})
            getList()
          }}
        />
      )}
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">지원분야를 선택해 주세요</div>
            <div className="button_group_right">
              <Button className={'line_blue'} onClick={() => {openManagePopup()}}>
                항목 관리
              </Button>
            </div>
          </div>

          <ul className={'popup_supportAreas'}>
            {typeCheckboxList.map((check) => (
              <li key={check.comCdId}>
                <Checkbox checkbox={{ id: check.comCdId, value: check.comCdNm }} checked={check.status} onChange={(e) => {selectChkData(e)}} />
              </li>
            ))}
          </ul>

          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={() => {close()}}>
              취소
            </Button>
            <Button className={'full_blue'} onClick={() => {completePop()}}>
              완료
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FncnBsnsSelectPop
