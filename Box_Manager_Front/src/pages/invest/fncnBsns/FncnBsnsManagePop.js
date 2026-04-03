import { DoDisturbOnOutlined } from '@mui/icons-material'
import Button from 'components/atomic/Button'
import { getUserInfo } from "modules/consts/AdminApi"
import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'
import { getConfig, getPostConfig } from 'modules/utils/CommonUtils'
import { useEffect, useState } from 'react'

const FcncBsnsManagePop = (props) => {
  const {close} = props
  const [typeInputList, setTypeInputList] = useState([])
  const [isUpdate, setIsUpdate] = useState(true)
  
  // 항목 조회
  const getList = async()=> {
    let res = await CommonAxios('IVT', getConfig(Api.invest.fncnBsnsEnlsFildList, null))
    if(res.data.code === '200') {
      let arr = []
      for(let i=0 ; i<res.data.data.list.length ; i++) {
        const list = {
          ...res.data.data.list[i],
          sqn : i+1
        }
        arr.push(list)
      }  
      setTypeInputList(arr)
    }
  }

  // 항목 등록 및 수정
  const saveInput = async(input)=> {
    const adminInfo = await getUserInfo();
    for(let i=0 ; i<input.length ; i++) {
      if(input[i].rgsnUserId === null || input[i].rgsnUserId === "") {
        input[i].rgsnUserId = adminInfo.data.data.mngrId
        input[i].amnnUserId = adminInfo.data.data.mngrId
      }
    }

    let res = await CommonAxios('IVT', getPostConfig(Api.invest.fncnBsnsEnlsFildSave, input))
    if(res.data.code === '200') {
      close()
    }
  }

  // 항목 삭제
  const deleteInput = async(input)=> {
    if(input.comCdNm !== '') {
      let res = await CommonAxios('IVT', getPostConfig(Api.invest.fncnBsnsEnlsFildDelete, input))
      if(res.data.code === '200') {
        getList()
      }
    }else {
      setTypeInputList((pre) => pre.filter((data) => data.sqn !== input.sqn))
    }
  }

  // 행추가 버튼 클릭
  const onClickAdd = () => {
    const item = createEmptyItem()
    typeInputList.push(item)
    setIsUpdate(!isUpdate)
  }

  // 행추가
  const createEmptyItem = () => {
      const item = {}

      item['sqn'] = typeInputList.length + 1
      item['comCdId'] = ''
      item['comCdNm'] = ''
      item['rgsnUserId'] = ''
      item['amnnUserId'] = ''

      return item
  }

  useEffect(()=> {
    getList()
  },[])

  return (
    <div className="popup_wrap popup_invest">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">지원분야 항목을 관리합니다</div>
            <div className="button_group_right">
              <Button className={'line_blue'} onClick={() => {onClickAdd()}}>
                + 항목 추가
              </Button>
            </div>
          </div>

          <ul className={'popup_supportAreas_inputs'}>
            {typeInputList.map((input) => (
              <li key={input.comCdId}>
                <input
                    type="text"
                    className="input"
                    value={input.comCdNm}
                    onChange={(event) => {
                      input.comCdNm = event.target.value
                      setIsUpdate(!isUpdate)
                    }}
                />
                
                <Button className={'fileAttach_delete_button'} aria-label="삭제" onClick={() => {deleteInput(input)}}>
                  <DoDisturbOnOutlined />
                </Button>
              </li>
            ))}
          </ul>

          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={() => {close()}}>
              취소
            </Button>
            <Button className={'full_blue'} onClick={() => {saveInput(typeInputList)}}>
              적용
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FcncBsnsManagePop
