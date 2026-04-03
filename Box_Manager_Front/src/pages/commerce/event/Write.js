import { useEffect, useState, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import EventForm from 'pageComponents/commerce/event/EventForm'
import { getEventDetailApi, saveEventApi } from 'modules/consts/MktApi'
import { MktContext } from 'modules/common/MktContext'
import moment from 'moment'
const Write = () => {
  const { id } = useParams()
  const history = useHistory()
  const [data, setData] = useState({})
  const mktContext = useContext(MktContext)

  // ===== register event
  const handleReg = async (form) => {
    // form - time
    let formParam = {
      ...form,
      enlsSldyTs: moment(form.enlsSldyTs).startOf('day'),
      enlsCldyTs: moment(form.enlsCldyTs).endOf('day'),
      evntStdyTs: moment(form.evntStdyTs).startOf('day'),
      evntFndaTs: moment(form.evntFndaTs).endOf('day')
    }

    formParam = {
      ...formParam,
      enlsSldyTs: formParam.enlsSldyTs._d,
      enlsCldyTs: formParam.enlsCldyTs._d,
      evntStdyTs: formParam.evntStdyTs._d,
      evntFndaTs: formParam.evntFndaTs._d
    }

    console.log('formParam', formParam)
    const res = await saveEventApi(formParam)
    if (res.data.code === '200') {
      mktContext.actions.handleEventParam(null)
      history.push(ROUTER_NAMES.COMMERCE_EVENT_LIST)
    }
  }

  // ===== delete
  const getDetail = async (params) => {
    let res = await getEventDetailApi(params)
    if (res.data.code === '200') {
      let data = res.data.data
      setData(data)
    }
  }

  useEffect(() => {
    id &&
      getDetail({
        evntInfId: id
      })
  }, [])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'event'}>
      <div className="content_inner page_event">
        <div className="page_header">
          <h4 className="page_title">이벤트 {id ? `수정` : `등록`}</h4>
          <div className="btn_group">
            <Button className={'basic'} onClick={() => history.push(ROUTER_NAMES.COMMERCE_EVENT_LIST)}>
              목록
            </Button>
          </div>
        </div>
        <EventForm id={id} handleReg={handleReg} data={{ ...data }} />
      </div>
    </PageLayout>
  )
}

export default Write
