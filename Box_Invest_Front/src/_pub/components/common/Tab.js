/** @jsxImportSource @emotion/react */
import { tabStyle } from 'assets/style/ComponentStyle'
import {createKey} from "modules/utils/CommonUtils";

const Tab = (props) => {
  const { data, handleTabActive } = props

  const onTabActive = (id) => {
    handleTabActive && handleTabActive(id)
  }

  return (
    <div className="tab_wrap" css={tabStyle}>
      {data &&
        data.list?.map((d, idx) => (
          <button
            className={`btn_tab ${data.active === d.id ? 'active' : ''}`}
            style={{cursor: 'pointer'}}
            key={createKey()}
            onClick={() => onTabActive(d.id)}
          >
            {d.label}
          </button>
        ))}
    </div>
  )
}

export default Tab
