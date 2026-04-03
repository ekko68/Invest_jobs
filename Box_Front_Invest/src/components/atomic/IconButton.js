/** @jsxImportSource @emotion/react */
import {likeBtnStyle, linkBtnStyle, closeBtnStyle, prevNextBtnStyle, minusBtnStyle} from 'assets/style/AtomicStyle'

export const LikeBtn = (props) => {
  const { active, children, ...other } = props
  return (
    <button className={`button  like ${active ? 'active' : ''}`} {...other} css={likeBtnStyle}>
      <span className="hide">즐겨찾기</span>
    </button>
  )
}

export const LinkBtn = (props) => {
  const { children, ...other } = props
  return (
    <button className={'button button_link'} {...other} css={linkBtnStyle}>
      {children}
    </button>
  )
}

export const CloseBtn = (props) => {
  const { children, ...other } = props
  return (
    <button className={'button button_close'} {...other} css={closeBtnStyle}>
      {children}
    </button>
  )
}

export const MinusBtn = (props) => {
  const { children, ...other } = props
  return (
    <button className={'button btn_minus'} {...other}>
      {children}
    </button>
  )
}

export const PrevBtn = (props) => {
  const { text = '이전', children, ...other } = props
  return (
    <button className={'button btn_prev_round'} {...other}>
      {text}
    </button>
  )
}

export const NextBtn = (props) => {
  const { text = '다음', children, ...other } = props
  return (
    <button className={'button btn_next_round'} {...other}>
      {text}
    </button>
  )
}

export default {
  LinkBtn,
  LikeBtn,
  CloseBtn,
  PrevBtn,
  NextBtn,
  MinusBtn
}
