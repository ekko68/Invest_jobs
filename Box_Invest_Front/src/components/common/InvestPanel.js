/** @jsxImportSource @emotion/react */
import { investPanelStyle, panelItemStyle } from 'assets/style/ComponentStyle'
import {createKey} from "modules/utils/CommonUtils";
// 임시데이터
const investList = [
  {
    name: '제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1',
    price: 10,
    status: 'ing',
    active: true
  },
  {
    name: '제주패스2',
    price: 50,
    status: 'complete'
  },
  {
    name: '제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1',
    price: 10,
    status: 'ing'
  },
  {
    name: '제주패스2',
    price: 50,
    status: 'complete'
  },
  {
    name: '제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1',
    price: 10,
    status: 'ing'
  },
  {
    name: '제주패스2',
    price: 50,
    status: 'complete'
  },
  {
    name: '제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1',
    price: 10,
    status: 'ing'
  },
  {
    name: '제주패스2',
    price: 50,
    status: 'complete'
  },
  {
    name: '제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1',
    price: 10,
    status: 'ing'
  },
  {
    name: '제주패스2',
    price: 50,
    status: 'complete'
  },
  {
    name: '제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1',
    price: 10,
    status: 'ing'
  },
  {
    name: '제주패스2',
    price: 50,
    status: 'complete'
  },
  {
    name: '제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1',
    price: 10,
    status: 'ing'
  },
  {
    name: '제주패스2',
    price: 50,
    status: 'complete'
  },
  {
    name: '제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1',
    price: 10,
    status: 'ing'
  },
  {
    name: '제주패스2',
    price: 50,
    status: 'complete'
  },
  {
    name: '제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1',
    price: 10,
    status: 'ing'
  },
  {
    name: '제주패스2',
    price: 50,
    status: 'complete'
  },
  {
    name: '제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1',
    price: 10,
    status: 'ing'
  },
  {
    name: '제주패스2',
    price: 50,
    status: 'complete'
  },
  {
    name: '제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1제주패스1',
    price: 10,
    status: 'ing'
  },
  {
    name: '제주패스2',
    price: 50,
    status: 'complete'
  }
]

const InvestPanel = () => {
  const invests = investList.map((data, i) => (
    <li className="invest_item" key={createKey()}>
      <StatusRow data={data} />
    </li>
  ))

  return (
    <div className="invest invest_panel" css={investPanelStyle}>
      <div className="panel_head">
        <div className="panel_header_inner">
          <h3 className="title">투자유치 신청 현황</h3>
          <span className="date">2021.09.27 현재</span>
        </div>
      </div>
      <div className="panel_status_wrap">
        <ul className="panel_status_list">
          <li className="panel_status_item">
            <p className="label">투자신청</p>
            <span className="value">100</span>
          </li>
          <li className="panel_status_item ing">
            <p className="label">심사중</p>
            <span className="value">32</span>
          </li>
          <li className="panel_status_item comp">
            <p className="label">심사완료</p>
            <span className="value">64</span>
          </li>
        </ul>
      </div>
      <div className="invest_list_wrap scroll_wh">
        <ul className="invest_list">{invests}</ul>
      </div>
    </div>
  )
}

const StatusRow = ({ data }) => {
  return (
    <div className={`panelItemStyle ${data.active ? 'active' : ''}`} css={panelItemStyle}>
      <p className="name">{data.name}</p>
      <p className="price">{data.price}억원</p>
      <p className={`status ${data.status === 'ing' ? 'ing' : 'comp'}`}>
        {data.status === 'ing' ? '심사중' : '심사완료'}
      </p>
    </div>
  )
}

export default InvestPanel
