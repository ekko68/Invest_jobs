/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { colors } from './style.config'

export const investReq01Style = css`
  height: calc(100% - 122px);
  padding: 20px 20px 12px 20px;
  .popup_container01 {
    margin: 9px 10px 38px 10px;
    letter-spacing: -0.05em;
    .main_txt {
      font-weight: 500;
      font-size: 18px;
      color: #3c3b40;
    }
    .txt {
      margin-top: 11px;
      font-weight: 300;
      color: #878296;
    }
    .inner_box {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 28px;
      padding: 19px 19px 19px 75px;
      width: 100%;
      height: 78px;
      border: 1px solid #b8daff;
      border-radius: 4px;
      background: #e9f2ff url('/images/ico_thumbs_up.png') 16px 17px no-repeat;
      &:after {
        position: absolute;
        content: '';
        width: 90%;
        height: 30px;
        left: 50%;
        bottom: 33px;
        transform: translate(-50%);
        box-shadow: 6px 50px 18px 0px rgba(218, 231, 248, 1);
        z-index: -1;
      }
      .txt_wrap {
        display: flex;
        flex-direction: column;
        grid-gap: 6px;
        .sub_txt {
          font-size: 18px;
          letter-spacing: -0.05em;
          color: #3c3b40;
        }
        .DateTime {
          font-size: 12px;
          color: #3982d8;
        }
      }
      .btn_preview {
        display: flex;
        align-items: center;
        justify-content: left;
        padding-left: 34px;
        width: 99px;
        height: 38px;
        border: 1px solid #3982d8;
        border-radius: 4px;
        color: #3982d8;
        background: #fff url('/images/ico_magnifier.png') 12px 50% no-repeat;
        cursor: pointer;
      }
    }
  }
`

export const investReq02Style = css`
  height: calc(100% - 122px);
  padding: 20px 20px 12px 20px;
  .popup_container01 {
    margin: 9px 10px 38px 10px;
    letter-spacing: -0.05em;
    .main_txt {
      font-weight: 500;
      font-size: 18px;
      color: #3c3b40;
    }
    .txt {
      margin-top: 11px;
      font-weight: 300;
      color: #878296;
    }
    .inner_box {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 28px;
      padding: 19px 19px 19px 75px;
      width: 100%;
      height: 78px;
      border: 1px solid #ffc7e1;
      border-radius: 4px;
      background: #fdedf4 url('/images/ico_write.png') 16px 17px no-repeat;
      &:after {
        position: absolute;
        content: '';
        width: 90%;
        height: 30px;
        left: 50%;
        bottom: 33px;
        transform: translate(-50%);
        box-shadow: 6px 50px 18px 0px rgba(250, 228, 240, 1);
        z-index: -1;
      }
      .txt_wrap {
        display: flex;
        flex-direction: column;
        grid-gap: 6px;
        .sub_txt {
          font-size: 18px;
          letter-spacing: -0.05em;
          color: #3c3b40;
        }
      }
      .btn_add {
        display: flex;
        align-items: center;
        justify-content: left;
        padding-left: 34px;
        width: 99px;
        height: 38px;
        border: 1px solid #e8297f;
        border-radius: 4px;
        color: #e8297f;
        background: #fff url('/images/ico_plus_red.png') 12px 50% no-repeat;
        cursor: pointer;
      }
    }
  }
`

export const investReq03Style = css`
  height: calc(100% - 122px);
  padding: 20px 20px 12px 20px;
  .popup_container02 {
    margin: 3px 10px 8px 10px;
    display: flex;
    flex-direction: column;
    grid-gap: 14px;
    .cnt_wrap {
      width: 100%;
      height: 52px;
      .cnt_title {
        font-size: 16px;
        letter-spacing: -0.05em;
        color: #333;
      }
      .input_section {
        margin-top: 6px;
        display: flex;
        grid-gap: 6px;
        input {
          padding: 8px 10px 9px;
          width: 100%;
          height: 30px;
          border-radius: 4px;
          font-size: 12px;
        }
        button {
          min-width: 90px;
          height: 30px;
        }
      }
      .bg_color input {
        background-color: #f3f3f3;
        &::placeholder {
          font-weight: 300;
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
`

export const investReq04Style = css`
  height: calc(100% - 122px);
  padding: 20px 20px 12px 20px;
  .max_count {
    margin-top: 6px;
    display: flex;
    justify-content: flex-end;
  }
  .message_box {
    padding: 15px 16px;
    min-width: 100%;
    height: 177px;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: -0.025em;
    border: 1px solid #d8d6de;
    resize: none;
    outline: none;
    overflow-y: hidden;
    &::placeholder {
      color: #666;
    }
  }
`

export const popupRequestStyle = css`
  &.active_section01 {
    .section01 {
      display: block;
    }
  }
  &.active_section02 {
    .section02 {
      display: block;
    }
  }
  &.active_section03 {
    .section03 {
      display: block;
    }
  }
  &.active_section04 {
    .section04 {
      display: block;
    }
  }
  &.active_section05 {
    .section05 {
      display: block;
    }
  }
  &.active_section06 {
    .section06 {
      display: block;
    }
  }
  .popup_section {
    display: none;
  }
`

// 정책동의 스타일
export const PopupInvestReqAgreeStyle = css`
  max-height: 600px;
  background: #f5f5f5;
  .popup_content_wrap {
    .agree_box_wrap {
      padding: 30px;
    }
    .popup_title {
      font-size: 18px;
      color: #3c3b40;
      letter-spacing: -0.05em;
      font-weight: 500;
    }
    .agree_box {
      margin-top: 20px;
      .all_agree {
        display: flex;
        justify-content: flex-end;
      }
      .checkbox_wrap {
        margin-right: 0px;
        letter-spacing: -0.05em;
        color: #878296;
      }
      &:nth-of-type(3) {
        margin-top: 25px;
      }
      &:last-of-type {
        margin-top: 15px;
      }
      .agree_box_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          font-size: 14px;
          color: #878296;
          letter-spacing: -0.05em;
          font-weight: 300;
        }
      }
      .agree_box_bottom {
        margin-top: 10px;
        .content {
          padding: 15px 15px 8px 15px;
          background: #fff;
          border: 1px solid #d8d6de;
          border-radius: 4px;
          color: #878296;
          font-size: 12px;
          letter-spacing: -0.025em;
          line-height: 16px;
          font-weight: 300;
          height: 134px;
          overflow-y: auto;
        }
      }
    }
  }
  & + .popup_footer {
    .btn_group {
      display: flex;
      grid-gap: 6px;
    }
  }
`

// 기업정보_상세정보보기 제품정보 팝업
export const popupProdInfoStyle = css`
  .prod_info_wrap {
    padding: 30px;
    .img_wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 100%;
      height: 240px;
      overflow: hidden;
      border-radius: 4px;
      .btn_cart {
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 1;
        width: 33px;
        height: 33px;
        background: #111 url('/images/ico_cart.png') center center no-repeat;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    } //  img_wrap end
    .prod_info {
      margin-top: 29px;
      .name {
        font-size: 16px;
        color: #333333;
        margin-bottom: 8px;
      }
      .cont {
        color: #878296;
        line-height: 1.4;
      }
    }
  }
`

// IR자료요청
export const requestIrStyle = css`
  .ir_request_wrap {
    padding: 30px;
    display: flex;
    align-items: center;
    grid-gap: 20px;
    .img_wrap {
      width: 140px;
      height: 140px;
      border-radius: 100%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    } // img_wrap end
    .form_wrap {
      .info {
        margin-bottom: 12px;
        font-weight: 500;
        font-size: 18px;
        color: #3c3b40;
        letter-spacing: -0.06em;
      }
      .textarea {
        width: 100%;
        height: 140px;
        border-radius: 4px;
        border: 1px solid #d7d7d7;
        padding: 15px;
        resize: none;
        &::placeholder {
          color: #bbbbbb;
        }
      }
      .number_wrap {
        display: flex;
        justify-content: flex-end;
        margin-top: 7px;
      }
    } // form_wrap end
  } //  ir_request_wrap end
  .btn_group {
    grid-gap: 6px;
    display: flex;
    justify-content: center;
  }
`

// ir 자료요청 완료
export const completeIrStyle = css`
  .popup_content {
    padding: 153px 0 30px 0;
    text-align: center;
    background: url('/images/ico_thumbs_up02.png') center top 43px no-repeat;
    .text {
      font-size: 24px;
      color: #333333;
      font-weight: 500;
      letter-spacing: -0.06em;
      margin-bottom: 13px;
    }
    .info {
      font-size: 12px;
      color: #bbbbbb;
      margin-bottom: 20px;
    }
    .btn_goto {
      color: #3982d8;
      padding-right: 28px;
      background: url('/images/ico_link.png') left 100% bottom 4px no-repeat;
    }
  }
`

// 투자심사-신청요청제한
export const warningIrStyle = css`
  .btn_popup_close {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1;
  }
  .ir_warning_wrap {
    height: 249px;
    text-align: center;
    padding-top: 147px;
    background: url('/images/ico_warning.png') center top 61px no-repeat;
    .text {
      color: #3c3b40;
      font-size: 18px;
      letter-spacing: -0.05em;
      font-weight: 500;
      margin-bottom: 10px;
    }
    .info {
      color: #878296;
      letter-spacing: -0.03em;
    }
  }
`

// 컨설팅 의뢰하기
export const popupConsultReqStyle = css`
  /*popup_content start*/
  .popup_content {
    padding: 20px 30px;
    .input_wrap {
      display: flex;
      align-items: center;
      justify-content: left;
      grid-gap: 22px;
      margin-bottom: 10px;
      & .tit {
        font-size: 16px;
        letter-spacing: -0.05em;
        color: #333;
        width: 31px;
      }
      
      /*radio_inner start*/
      & .radio_inner {
        letter-spacing: -0.05em;
        color: #666;
        width: 100%;
        height: 50px;
        border: 1px solid #3982d8;
        border-radius: 4px;
        background-color: #eef4fb;
        padding: 14px 9px;
        input[type='radio'] + label {
          width: 19px;
          height: 19px;
          margin-right: 9px;
          background: url('/images/ico_check.png');
          background-size: cover;
        }
        input[type='radio']:checked + label {
            background: url('/images/ico_checked.png');
            background-size: cover;
        }
      }
      /*radio_inner end*/
      
      .input {
        width: 100%;
        height: 38px;
        border-radius: 4px;
        padding: 10px 10px;
        &::placeholder {
          color: #efefef;
          letter-spacing: -0.05em;
        }
      }
      .input.textarea {
        height: 300px;
        line-height: 20px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        resize: none;
      }
    }
    /*input_wrap end*/
    
    .input_wrap.tit_top {
      align-items: start;
      margin-bottom: 0;
      & .tit {
        margin-top: 10px;
      }
    }
  }
  /*popup_content end*/
  
  /*PopupFooter start*/
  .btn_group {
    display: flex;
    grid-gap: 6px;
  }
  /*PopupFooter end*/
`

export default {
  investReq01Style,
  investReq02Style,
  investReq03Style,
  investReq04Style,
  PopupInvestReqAgreeStyle,
  popupProdInfoStyle,
  requestIrStyle,
  completeIrStyle,
  warningIrStyle,
  popupConsultReqStyle
}
