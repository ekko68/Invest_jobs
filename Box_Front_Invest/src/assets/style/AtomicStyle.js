/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { colors } from 'assets/style/style.config'

export const buttonStyle = (type, theme, color) => {
  let btnStyle = css`
    display: inline-block;
    background: ${theme};
    color: ${color};
    border-radius: 4px;
    &:disabled {
      background: #e3e4e5;
      color: #fff;
      cursor: not-allowed;
    }
  `
  let linearStyle = css`
    background: transparent;
    border: 1px solid ${theme};
    color: ${theme};
    border-radius: 4px;
  `

  let dashedStyle = css`
    ${linearStyle};
    border-style: dashed;
  `

  if (type === 'linear') {
    return linearStyle
  } else if (type === 'dashed') {
    return dashedStyle
  } else {
    return btnStyle
  }
}

export const badgeStyle = (type, theme, color) => {
  let btnStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${theme};
    color: ${color};
    border-radius: 4px;
    &:disabled {
      background: #e3e4e5;
      color: #fff;
      cursor: not-allowed;
    }
  `

  let rounded = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${theme};
    color: ${color};
    border-radius: 45px;
    &:disabled {
      background: #e3e4e5;
      color: #fff;
      cursor: not-allowed;
    }
  `

  let linearStyle = css`
    border: 1px solid ${theme};
    color: ${theme};
    border-radius: 4px;
  `

  if (type === 'linear') {
    return linearStyle
  } else if (type === 'rounded') {
    return rounded
  } else {
    return btnStyle
  }
}

export const checkboxStyle = (shape) => {
  let defaultStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    margin-right: 15px;
    input[type='checkbox'] {
      display: none;
      & + label {
        width: 22px;
        height: 22px;
        border: 2px solid #cccccc;
        margin-right: 10px;
        border-radius: 4px;
        cursor: pointer;
        & + label {
          font: inherit;
          cursor: pointer;
        }
      }
      &:checked + label {
        border: 2px solid ${colors.blue};
        background: ${colors.blue} url('/images/ico_check_wh.png') center center no-repeat;
      }
    }
  `

  let shapeType01Style = css`
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    margin-right: 15px;
    input[type='checkbox'] {
      display: none;
      & + label {
        width: 22px;
        height: 22px;
        border: 1px solid #d7d7d7;
        background: #f8f8f8;
        margin-right: 10px;
        border-radius: 4px;
        cursor: pointer;
        & + label {
          font: inherit;
          cursor: pointer;
        }
      }
      &:checked + label {
        border: 1px solid ${colors.blue};
        background: #fff url('/images/ico_check_blue.png') center center no-repeat;
      }
    }
  `

  if (shape === 'shape01') {
    return shapeType01Style
  } else {
    return defaultStyle
  }
}

export const checkboxReverseStyle = (shape) => {
  let defaultStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    margin-right: 15px;
    input[type='checkbox'] {
      display: none;
      & + label {
        font: inherit;
        cursor: pointer;
        & + label {
          width: 22px;
          height: 22px;
          border: 2px solid #cccccc;
          margin-left: 10px;
          border-radius: 4px;
          cursor: pointer;
        }
      }
      &:checked + label {
        & + label {
          border: 2px solid ${colors.blue};
          background: ${colors.blue} url('/images/ico_check_wh.png') center center no-repeat;
        }
      }
    }
  `

  let shapeType01Style = css`
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    margin-right: 15px;
    input[type='checkbox'] {
      display: none;
      & + label {
        font: inherit;
        cursor: pointer;
        & + label {
          width: 22px;
          height: 22px;
          border: 1px solid #d7d7d7;
          margin-left: 10px;
          border-radius: 4px;
          cursor: pointer;
        }
      }
      &:checked + label {
        & + label {
          border: 1px solid ${colors.blue};
          background: #fff url('/images/ico_check_blue.png') center center no-repeat;
        }
      }
    }
  `

  if (shape === 'shape01') {
    return shapeType01Style
  } else {
    return defaultStyle
  }
}

export const likeBtnStyle = css`
  width: 22px;
  height: 22px;
  background: url('/images/ico_star.png');
`

export const linkBtnStyle = css`
  padding: 0 26px 0 0;
  background: url('/images/ico_link.png') 100% center no-repeat;
  color: #3982d8;
  text-align: left;
  letter-spacing: -0.06em;
`

export const closeBtnStyle = css`
  padding: 10px;
  background: url('/images/ico_close.png') 100% center no-repeat;
  text-align: center;
`

export const informationTooltipStyle = (theme) => {
  let colorStyle
  if (theme === 'blue') {
    colorStyle = css`
      border: 1px solid #b8daff;
      background: #ecf5ff;
      color: #3982d8;
      .btn_close {
        background: url('/images/ico_cancel_blue.png') center center no-repeat;
      }
    `
  } else {
    colorStyle = css`
      border: 1px solid #ffc7e1;
      background: #fdedf4;
      color: #e8297f;
      .btn_close {
        background: url('/images/ico_cancel_red.png') center center no-repeat;
      }
    `
  }

  const defaultStlye = css`
    position: relative;
    width: 100%;

    border-radius: 4px;
    ${colorStyle}
    .btn_close {
      position: absolute;
      height: 30px;
      width: 30px;
      top: 50%;
      right: 21px;
      z-index: 1;
      transform: translateY(-50%);
    }
  `
  return defaultStlye
}

export const inputStyle = css`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  color: #282c34;
  outline: 0 none;
`
export const radioStyle = css`
  //display: inline-flex;
  //align-items: center;
  //justify-content: flex-start;
  //margin-right: 15px;
  //input[type='radio'] {
  //  display: none;
  //  & + label {
  //    width: 10px;
  //    height: 10px;
  //    background: lightgrey;
  //    margin-right: 4px;
  //  }
  //  &:checked + label {
  //    background: blue;
  //  }
  //}
`

export const selectStyle = css`
  border: 1px solid rgba(0, 0, 0, 0.1);
  -o-appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: url('/images/ico_arr_down02.png') calc(100% - 5px) center no-repeat;
  padding-right: 11px !important;
  &.type02 {
    background: #fff url('/images/ico_triangle_down.png') calc(100% - 5px) center no-repeat;
    padding-left: 10px;
    font: inherit;
    option {
      border-bottom: 1px solid #e2e2e2;
    }
  }
`

export const titleStyle = css`
  position: relative;
  .title {
    width: 100%;
    font-size: 30px;
    color: #000000;
    text-align: center;
    letter-spacing: -0.03em;
    font-weight: 500;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      z-index: 1;
      display: block;
      width: calc(50% - 95px);
      height: 1px;
      background: #d1d3de;
    }
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 0;
      z-index: 1;
      display: block;
      width: calc(50% - 95px);
      height: 1px;
      background: #d1d3de;
    }
  } // title
`

export const maxCountStyle = css`
  display: flex;
  font-size: 12px;
  color: #878296;
  font-weight: 30;
  .count {
    position: relative;
    &:after {
      content: '/';
      padding: 0 2px;
    }
  }
`

export const flagStyle = (bg) => {
  return css`
    background-color: ${bg};
    width: 44px;
    height: 44px;
    font-size: 12px;
    color: #fff;
    padding: 6px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    line-height: 1.1;
  `
}

export const tableStyle = (type) => {
  if (type === 'type02') {
    return css`
      width: 100%;
      border-right: 0 none;
      caption {
        display: none;
      }
      tr {
        &:nth-of-type(odd) {
          td {
            //background: #f5f9fd;
          }
        }
      }
      th,
      td {
        padding: 12.5px 10px;
        letter-spacing: -0.03em;
        word-spacing: -0.02em;
        border-bottom: 1px solid #e9ebf7;
        background: #fff;
        color: #666666;
      }
      th {
        font-size: 12px;
        color: #666666;
      }
      td {
        color: #333333;
        text-align: center;
      }
    `
  } else {
    return css`
      width: 100%;
      border: 1px solid #e9ebf7;
      border-right: 0 none;
      caption {
        display: none;
      }
      th,
      td {
        border-bottom: 1px solid #e9ebf7;
        border-right: 1px solid #e9ebf7;
        padding: 12.5px 10px;
        letter-spacing: -0.03em;
        word-spacing: -0.02em;
      }
      th {
        background: #f5f9fd;
        color: #666666;
      }
      td {
        color: #333333;
      }
    `
  }
}

export const alertStyle = () => {
  return css`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 30;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .layer {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2);
    }
    .alert_inner {
      min-width: 300px;
      background: #fff;
      position: relative;
      z-index: 2;
      padding: 30px 50px;
      text-align: center;
      font-weight: 500;
      border-radius: 6px;
    }
    .btn_wrap {
      margin-top: 30px;
      .button {
        width: 75px;
        height: 34px;
      }
    }
  `
}

export const prevNextBtnStyle = (type) => {
  let prevStyle = css`
    padding-left: 50px;
    height: 39px;
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    position: relative;
    transition: 0.2s;
    &:after {
      content: '';
      width: 39px;
      height: 39px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      transition: 0.2s;
      background: url('../images/ico_prev.png') 0 0 no-repeat;
    }
    &:hover {
      color: ${colors.blue};
      &:after {
        background: url('../images/ico_prev_active.png') 0 0 no-repeat;
      }
    }
  `
  let nextStyle = css`
    padding-right: 50px;
    height: 39px;
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    position: relative;
    &:after {
      content: '';
      width: 39px;
      height: 39px;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      transition: 0.2s;
      background: url('../images/ico_next.png') 0 0 no-repeat;
    }
    &:hover {
      color: ${colors.blue};
      &:after {
        background: url('../images/ico_next_active.png') 0 0 no-repeat;
      }
    }
  `
  if (type === 'next') {
    return nextStyle
  } else {
    return prevStyle
  }
}

export const datePickerStyle = css`
  width: 100%;
  height: inherit;
  background: url('/images/ico_calendar.png') right 11px center no-repeat;
  input {
    padding-right: 38px;
  }
`

export const minusBtnStyle = () => {
  return css`
    width: 15px;
    height: 15px;
    background: url('../images/ico_minus02.png') center center no-repeat;
  `
}

export default {
  badgeStyle,
  buttonStyle,
  checkboxStyle,
  checkboxReverseStyle,
  likeBtnStyle,
  linkBtnStyle,
  closeBtnStyle,
  informationTooltipStyle,
  inputStyle,
  radioStyle,
  selectStyle,
  titleStyle,
  maxCountStyle,
  flagStyle,
  tableStyle,
  alertStyle,
  prevNextBtnStyle,
  datePickerStyle,
  minusBtnStyle
}
