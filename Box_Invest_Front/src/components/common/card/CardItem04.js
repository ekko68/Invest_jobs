/** @jsxImportSource @emotion/react */
import { cardItem04Style } from 'assets/style/ComponentStyle'
import { Link, useHistory } from 'react-router-dom'
import {createKey} from "modules/utils/CommonUtils";
const CardItem04 = (props) => {
  const history = useHistory()
  const { data } = props

  const onClickHandler = () => {
    history.push('/invest/detail')
  }

  return (
    <div className="carditem04" css={cardItem04Style} onClick={onClickHandler}>
      <div className="img_wrap">
        <img src="/images/tmp/img_logo_b04.png" alt="" />
      </div>
      <div className="cont_wrap">
        <p className="title">{data.title}</p>
        <p className="content">{data.content}</p>
        <ul className="tag_list">
          {data.tagList &&
            data.tagList.map((tag, idx) => (
              <li className="tag_item" key={createKey()}>
                {tag}
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default CardItem04
