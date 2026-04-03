import React, { useContext, useDebugValue, useEffect, useState } from 'react'

import PageLayout from 'components/PageLayout'
import PopupConfirm from 'components/PopupConfirm'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../../../../modules/common/UserContext'
import {
  deleteDocumentPackage,
  getDocumentPackageList,
  saveDocumentPackageOrder
} from '../../../../modules/consts/MainApi'
import ROUTER_NAMES from '../../../../modules/consts/RouterConst'

import NoResult from '../../../../components/NoResult'
import ReoderEDocuPackage from 'pageComponents/main/wallet/ReorderEDocuPackage'


const List = () => {

  const history = useHistory()
  const userContext = useContext(UserContext)

  const [documentPackageList, setDocumentPackageList] = useState([])
  const [popup, setPopup] = useState({ active: false, type: null })
  const [delParam, setDelParam] = useState({})

  useEffect(() => {
    apiGetDocumentPackageList()
  }, [])

  useEffect(async () => {
    await saveDocumentPackageOrder({ items: documentPackageList })
  }, [documentPackageList])

  const apiGetDocumentPackageList = async () => {
    let res = await getDocumentPackageList();
    console.log("res", res)
    if (res?.status === 200) {
      let setDocumentPackagForm = res?.data?.map((item) => {
        let itemNames = "";
        item.items?.filter(ele => ele.deleted === false).map((data, i) => {
          itemNames += data?.name ? data.name + (i == item.items.filter(ele => ele.deleted === false).length - 1 ? "" : ", ") : ""
        })
        return { ...item, item_names: itemNames };
      })
      setDocumentPackageList(setDocumentPackagForm);
    } else {
      setPopup({ active: true, type: "error" });
    }
  }

  const handleButtons = (type, item) => {
    switch (type) {
      case 'add':
        navigatePage(`${ROUTER_NAMES.MAIN_DOCUMENT_PACKAGE_WRITE}`);
        break;
      case 'edit':
        navigatePage(`${ROUTER_NAMES.MAIN_DOCUMENT_PACKAGE_WRITE}/${item.id}`)
        break;
      case 'delete':
        handleDelete(item)
        break;
      default:
    }
  }

  const handleDelete = async(item) => {
    let res = await deleteDocumentPackage({
      ...item,
      userId: userContext.state?.userInfo?.mngrId //수정자 ID
    });
    if(res.status === 200) {
      setPopup({active: true, type: "confirm"});
    } else {
      setPopup({active: true, type: "error"});
    }
  }

  const navigatePage = url => {
    history.push(url)
  }

  return (
    <PageLayout currentMenu={'mainBox'} currentCate={'mainDocument'} currentPage={'mainDocPackage'}>

      {popup.active && popup.type === "delete" && (
        <PopupConfirm msg={'해당 꾸러미를 삭제하시겠습니까?\n(꾸러미를 삭제하실 경우 사용자가 꾸러미를 등록한 내용이 모두 삭제됩니다.)'}>
          <Button className={'full_grey'} onClick={() => {
            setPopup({ active: false, type: null });
            setDelParam({});
          }}>
            취소
          </Button>
          <Button
            className={'full_blue'} onClick={handleDelete}>
            확인
          </Button>
        </PopupConfirm>
      )}

      {popup.active && popup.type === "confirm" && (
        <PopupAlert
          msg={'해당 꾸러미가 삭제되었습니다.'}
          handlePopup={() => {
            setPopup({ active: false, type: null });
            apiGetDocumentPackageList();
          }}
        />
      )}

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={'오류가 발생했습니다.'}
          handlePopup={() => setPopup({ active: false, type: null })} />
      )}

      <div className='content_inner page_main'>
        <div className="page_header">
          <h4 className="page_title">전송꾸러미 설정</h4>
          <div className='btn_group'>
            <Button className={'full_blue w65'} onClick={() => handleButtons("add")}>
              등록
            </Button>
          </div>
        </div>


        <div className={'section documentPackage_main_section'}>
          {
            documentPackageList && documentPackageList.length > 0 ? (
              <div className="table_wrap border_bottom_none table_th_border document_package_list scroll">
                {/*custom_table start*/}
                <div className="custom_table apply_prod_table">
                  <div className="t_header">
                    <div className="t_row header">
                      <div className="t_cell">순서</div>
                      <div className="t_cell">타이틀</div>
                      <div className="t_cell">부가설명</div>
                      <div className="t_cell">구성</div>
                      <div className="t_cell">상태</div>
                      <div className="t_cell">&nbsp;</div>
                    </div>
                  </div>


                  <ReoderEDocuPackage list={documentPackageList} setList={setDocumentPackageList}
                    handleButtons={handleButtons}
                    handleMoveDetail={(item) => navigatePage(`${ROUTER_NAMES.MAIN_DOCUMENT_PACKAGE_VIEW}/${item.id}`)} />

                </div>
                {/*custom_table end*/}
              </div>
            ) : (
              <div className="table_no_result">
                <NoResult msg={'등록된 꾸러미가 없습니다.'} />
              </div>
            )
          }

        </div>

        <div className='etc_text'>
          * 순서변경의 ≡ 아이콘을 마우스 좌클릭으로 드래그하여 순서를 조정할 수 있습니다. 가장 상단에 위치한 것이 첫번째로 노출됩니다.
        </div>


      </div>
    </PageLayout>
  )
}

export default List
