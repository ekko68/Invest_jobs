import React, { useContext, useEffect, useState } from 'react'

import PageLayout from 'components/PageLayout'
import Button from "components/atomic/Button";
import { useHistory, useParams } from 'react-router-dom'
import { UserContext } from '../../../../modules/common/UserContext'
import { deleteDocumentPackage, getDocumentPackageDetail } from '../../../../modules/consts/MainApi'
import ROUTER_NAMES from '../../../../modules/consts/RouterConst'
import PopupConfirm from '../../../../components/PopupConfirm'
import PopupAlert from '../../../../components/PopupAlert'

const View = () => {
  const { id } = useParams()
  const history = useHistory()
  const userContext = useContext(UserContext)

  const [documentPackageData, setDocumentPackageData] = useState({
    id: "",
    name: "",
    desc: "",
    public_access: "",
    item_names: ""
  });
  const [popup, setPopup] = useState({active: false, type: null});


  useEffect(async () => {
    if(id) {
      let res = await getDocumentPackageDetail({id: id});
      if(res.status === 200) {
        const documentPackageData = res.data
        let itemNames = "";
        console.log(documentPackageData)
        documentPackageData?.items?.map((data, i)=> {
          itemNames += data?.name ? data.name + (i == res?.data.items.length -1 ? "" : ", ") : ""
        })
        setDocumentPackageData({
          ...documentPackageData,
          item_names: itemNames
        });
      } else {
        setPopup({active: true, type: "error"});
      }
    }
  }, [id])

  const handleDelete = async() => {
    let res = await deleteDocumentPackage({
      ...documentPackageData,
      userId: userContext.state?.userInfo?.mngrId //수정자 ID
    });
    if(res.status === 200) {
      setPopup({active: true, type: "confirm"});
    } else {
      setPopup({active: true, type: "error"});
    }
  }

  const navigatePage = (url) => {
    history.push(url)
  }
  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainDocument'} currentPage={'mainDocPackage'}>

      {popup.active && popup.type === "delete" && (
        <PopupConfirm msg={'해당 꾸러미를 삭제하시겠습니까?'}>
          <Button className={'full_grey'} onClick={() => setPopup({active: false, type: null})}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleDelete}>
            확인
          </Button>
        </PopupConfirm>
      )}

      {popup.active && popup.type === "confirm" && (
        <PopupAlert msg={'해당 꾸러미가 삭제되었습니다.'}
                    handlePopup={() => navigatePage(`${ROUTER_NAMES.MAIN_DOCUMENT_PACKAGE_LIST}`)} />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={'오류가 발생했습니다.'}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

      <div className='content_inner page_main'>
        <h4 className='page_title'>전송꾸러미 상세</h4>

        <div className="table_wrap">
          <table className="table_type02">
            <caption>꾸러미 상세 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
            <tr>
              <th className={'ta_left'}>타이틀</th>
              <td>
                {documentPackageData.name}
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>부가설명</th>
              <td>
                {documentPackageData.desc}
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>공개여부</th>
              <td>{documentPackageData.public_access === true ? "공개" : "비공개"}</td>
            </tr>
            <tr>
              <th className={'ta_left'}>구성목록</th>
              <td>{documentPackageData.item_names}</td>
            </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => navigatePage(`${ROUTER_NAMES.MAIN_DOCUMENT_PACKAGE_LIST}`)}>
            목록
          </Button>
          <Button className={'full_blue'} onClick={() => navigatePage(`${ROUTER_NAMES.MAIN_DOCUMENT_PACKAGE_WRITE}/${documentPackageData.id}`)}>
            수정
          </Button>
          <Button className={'full_red'} onClick={() => setPopup({active: true, type: "delete"})}>
            삭제
          </Button>
        </div>


      </div>
    </PageLayout>
  )
}

export default View
