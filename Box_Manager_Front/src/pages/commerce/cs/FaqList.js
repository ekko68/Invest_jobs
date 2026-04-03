import { useLayoutEffect, useState, useEffect, useContext } from 'react'

import { useHistory, useLocation } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import PageLayout from 'components/PageLayout'
import NoResult from 'components/NoResult'
import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import { getCsFaqDel, getCsFaqList } from 'modules/consts/MktApi'
import Pagination from 'components/Pagination'

const FaqList = () => {
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()

  // faq 목록
  const [faqListData, setFaqListData] = useState([])
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [faqInfId, setFaqInfId] = useState(null) // id for update or delete
  const [paging, setPaging] = useState(null)
  const handleToggle = (faqInfId) => {
    let list = faqListData.map((item) => (item.faqInfId === faqInfId ? { ...item, status: !item.status } : { ...item }))
    setFaqListData(list)
  }

  const getList = async (param) => {
    let params = {
      page: 1,
      record: 20
    }
    if (param) {
      params = {
        ...params,
        param
      }
    }
    let res = await getCsFaqList(params)
    if (res.data.code === '200') {
      let data = res.data.data.list
      setPaging({
        endPage: data.endPage,
        next: data.next,
        page: data.page,
        prev: data.prev,
        record: data.record,
        startPage: data.startPage,
        total: data.total,
        totalPage: data.totalPage
      })
      //toggle 상태 추가
      data.map((item, idx) => {
        item.status = false
      })
      setFaqListData(data)
    }
  }

  // ===== 수정
  const handleEdit = (e, faqInfId) => {
    e.stopPropagation()
    history.push(`${ROUTER_NAMES.COMMERCE_CS_FAQ_WRITE}/${faqInfId}`)
  }

  // ===== 삭제
  const handleDelete = async (status) => {
    if (status) {
      let params = {
        faqInfId: faqInfId
      }
      let res = await getCsFaqDel(params)
      if (res.data.code === '200') {
        handleConfirmDelete()
        setFaqInfId(null)
        getList()
      }
    } else {
      handleConfirmDelete()
      setFaqInfId(null)
    }
  }

  // 삭제 confirm
  const handleConfirmDelete = (e, faqInfId) => {
    e && e.stopPropagation()
    faqInfId && setFaqInfId(faqInfId)
    setConfirmDelete(!confirmDelete)
  }

  // ===== 페이징
  const handlePaging = async (param) => {
    await getList(param)
  }

  useEffect(async () => {
    await getList()
  }, [])

  useLayoutEffect(() => {
    if ('faq' !== userContext.state.category) {
      userContext.actions.setCategory('faq')
    }
  }, [userContext.state.category])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'cs'} currentPage={'faq'}>
      {confirmDelete && (
        <PopupConfirm msg={'삭제 하시겠습니까?'}>
          <Button className={'full_grey_dark'} onClick={() => handleDelete(false)}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={() => handleDelete(true)}>
            삭제
          </Button>
        </PopupConfirm>
      )}
      <div className="content_inner page_cs">
        <div className="page_header pb10">
          <h4 className="page_title">FAQ관리</h4>
          <div className="btn_group">
            <Button className={'full_blue'} onClick={() => history.push(ROUTER_NAMES.COMMERCE_CS_FAQ_WRITE)}>
              등록하기
            </Button>
          </div>
        </div>
        {/*section start*/}
        <div className="section order_table_section">
          {!faqListData || faqListData.length === 0 ? (
            <div className="table_no_result">
              <NoResult msg={'등록된 FAQ가 없습니다.'} />
            </div>
          ) : (
            <div className="table_wrap table_th_border">
              <div className="accordion_wrap">
                <div className="accordion_list">
                  {faqListData.map((item, idx) => (
                    <div className={`accordion_item ${item.status ? 'active' : ''}`} key={item.faqInfId}>
                      <div className="accordion_header" onClick={() => handleToggle(item.faqInfId)}>
                        <p className="title">{item.ttl}</p>
                        <div className="edit_group">
                          <button className={'button basic'} onClick={(e) => handleEdit(e, item.faqInfId)}>
                            수정
                          </button>
                          <button className={'button full_red'} onClick={(e) => handleConfirmDelete(e, item.faqInfId)}>
                            삭제
                          </button>
                        </div>
                      </div>
                      <div className="accordion_content scroll">
                        <p className="text ">{item.con}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/*section end*/}
        <div className={'paging_wrap'}>{paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}</div>
      </div>
    </PageLayout>
  )
}

export default FaqList
