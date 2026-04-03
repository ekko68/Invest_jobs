/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { colors } from 'assets/style/style.config'
import { StringUtils } from 'modules/utils/StringUtils'

export const bannerItem01Style = (img) => {
  return css`
    position: relative;
    background: url(${img}) 0 center no-repeat;
    background-size: cover;
    height: 320px;
    .container {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1;
      transform: translateY(-50%);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
      color: #fff;
      .content {
        white-space: pre-wrap;
        font-size: 20px;
        line-height: 1.5;
        margin-bottom: 30px;
      }
    }
  `
}

export const breadCrumbsStyle = css`
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d4d6e4;
  height: 50px;
  display: flex;
  align-items: center;
  .breadcrumbs_inner {
    display: flex;
    .home_wrap {
      width: 50px;
      height: 50px;
      border-right: 1px solid #e9ebf7;
      border-left: 1px solid #e9ebf7;
      .home {
        display: inline-flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
      }
    }
  }
`

export const selectionBoxStyle = css`
  border-right: 1px solid #e9ebf7;
  position: relative;
  width: 188px;
  height: inherit;
  &.type01 {
    .selected {
      background: url('/images/ico_sm-dash.png') right 18px center no-repeat;
    }
  }
  &.type02 {
    .selected {
      background: url('/images/ico_arr_down.png') right 18px center no-repeat;
    }
  }
  .selected {
    width: 100%;
    height: 100%;
    text-align: left;
    padding: 0 18px;
  }
  .selection_list_wrap {
    display: none;
    &.active {
      display: block;
    }
  }
  .selection_list {
    border: 1px solid #d4d6e3;
    width: 100%;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 48px;
    left: 0;
    z-index: 3;
    .selection_item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 50px;
      color: #555360;
      font-size: 15px;
      transition: 0.3s;
      text-align: left;
      padding: 0 18px;
      background: #fff;
      &.logout {
        background: #fff url('/images/ico_logout.png') right 18px center no-repeat;
        &:hover,
        &.active {
          background: #f6f6f6 url('/images/ico_logout.png') right 18px center no-repeat;
          color: #01b8f1;
        }
      }
      &:hover,
      &.active {
        background: #f6f6f6;
        color: #01b8f1;
      }
    }
  }
`

export const cardItem01Style = css`
  float: left;
  width: 25%;
  height: 550px;
  //width: 100%;
  //height: 100%;
  padding-right: 27px;
  margin-bottom: 27px;
  .inner {
    display: block;
    background: #fff;
    height: 100%;
    border-radius: 6px;
    overflow: hidden;
    .img_wrap {
      width: 100%;
      height: 250px;
      background-color: #acb6c0;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    } // img_wrap end
    .container {
      position: relative;
      padding: 30px;
      height: calc(100% - 250px);
      .cont_header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 34px;
        .tit {
          font-size: 20px;
          font-weight: 500;
          letter-spacing: -0.03em;
        }
      } // cont_header end
      .tag_list {
        overflow: hidden;
        margin-bottom: 27px;
        .tag_item {
          position: relative;
          margin-right: 8px;
          padding-right: 11px;
          &:last-of-type {
            &:after {
              display: none;
              margin-right: 0;
              padding-right: 0;
            }
          }
          &:after {
            content: '';
            display: block;
            width: 1px;
            height: 15px;
            background: #cccccc;
            position: absolute;
            top: 0;
            right: 0;
            z-index: 1;
          }
        }
      } // tag_list end
      .content {
        font-size: 14px;
        line-height: 1.4;
        color: #666666;
        font-weight: 300;
        word-break: keep-all;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        max-height: 7em;
      }
      .cont_footer {
        border-top: 1px solid #e5e5e5;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 55px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        grid-gap: 20px;
        padding: 0 29px;
        font-size: 14px;
        color: #666666;
        font-weight: 500;
        .location {
          padding-left: 18px;
          background: url('/images/ico_location.png') 0 center no-repeat;
        }
      } // cont_footer
    } // container end
  }
`

export const cardItem02Style = css`
  //width: 650px;
  width: 100%;
  height: 261px;
  border-radius: 8px;
  background: #f5f6fd;
  display: flex;
  align-items: center;
  padding: 40px 0 40px 50px;
  .info_wrap {
    position: relative;
    height: 180px;
    .name {
      color: #415172;
      margin-bottom: 11px;
    }
    .title {
      color: #415172;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 17px;
    }
    .content {
      color: #666666;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      max-height: 40px;
    }
    .button_link {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;
    }
  } // info_wrap end
  .img_section {
    min-width: 262px;
    display: flex;
    align-items: center;
    justify-content: center;
    .img_wrap {
      width: 180px;
      height: 180px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
    }
  } // img_section end
`

export const cardItem03Style = css`
  background: #fff;
  border-radius: 4px;
  box-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.1);
  //max-width: 190px;
  //height: 260px;
  width: 100%;
  height: 100%;
  .img_wrap {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-width: 70%;
    }
  }
  .content {
    padding: 0 20px;
    .type {
      color: #999999;
      font-size: 12px;
      margin-bottom: 12px;
      height: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .name {
      font-size: 20px;
      margin-bottom: 11px;
      color: #333333;
      font-weight: 500;
      height: 21px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .info {
      max-height: 40px;
      overflow: hidden;
      color: #878296;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
    }
  } // default style
  &.type02 {
    //max-width: 230px;
    //height: 320px;
    width: 100%;
    height: 100%;
    border-radius: 1px;
    .title {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 16px;
      height: 47px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-wrap: break-word;
      line-height: 1.2;
    }
    .type {
      display: flex;
      .type_item {
        position: relative;
        padding-right: 7px;
        margin-right: 7px;
        &:last-of-type:after {
          display: none;
        }
        &:after {
          content: '';
          display: block;
          width: 1px;
          height: 10px;
          background: #cccccc;
          position: absolute;
          top: 1px;
          right: 0;
          z-index: 1;
        }
      } // type_item
    }
    .name {
      color: #666666;
      font-size: 14px;
    }
  }
`

export const cardItem04Style = css`
  background: #fff;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  box-shadow: 0 1px 8px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid #fff;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    border: 1px solid #3982d8;
  }
  .img_wrap {
    height: 124px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    overflow: hidden;
    img {
      max-height: 80%;
    }
    .title {
      font-size: 18px;
      color: #415172;
    }
  } // img_wrap end
  .cont_wrap {
    padding: 0 29px;
    margin-top: 10px;
    .title {
      color: #415172;
      font-size: 18px;
      font-weight: 600;
      height: 19px;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      white-space: nowrap;
    }
    .content {
      margin: 20px;
      height: 20px;
      color: #666666;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      word-wrap: break-word;
    }
    .tag_list {
      overflow: hidden;
      color: #999999;
      width: 100%;
      height: 17px;
      margin-right: -4px;
      line-height: 1.2;
      .tag_item {
        float: left;
        margin-right: 4px;
        position: relative;
        &:before {
          content: '#';
        }
      }
    }
  } // cont_wrap
`

export const cardLayoutStyle = (type) => {
  return css`
    width: 100%;
    height: 100%;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.08);
    background: ${type === 'dark' ? '#505a6e' : '#fff'};
    border-radius: 4px;
    overflow: hidden;
    padding: 30px;
  `
}

export const categoryItem01Style = css`
  float: left;
  width: 20%;
  padding-right: 28px;
  margin-bottom: 28px;
  .category_inner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    border-radius: 4px;
    overflow: hidden;
    color: #fff;
    font-size: 20px;
  }
`

export const galleryStyle = css`
  width: 100%;
  height: 380px;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .gallery_inner {
    color: #fff;
    text-align: center;
    .gallery_title {
      font-size: 40px;
      font-weight: 600;
    }
    .gallery_subtitle {
      font-size: 14px;
      font-weight: 300;
      letter-spacing: -0.025em;
      margin-top: 20px;
    }
  }
`

export const headerStyle = (page) => {
  let headerDefaultStyle = css`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 78px;
    padding: 0 30px 0 30px;
    .btn_login {
      color: #fff;
      font-weight: 600;
      font-size: 16px;
    }
    .header_inner {
      height: inherit;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header_right,
    .header_left {
      height: 100%;
      align-items: center;
      display: flex;
    } // header_left && header_right end
    .logo {
      margin-right: 52px;
      }
    }
    .nav_list {
      display: flex;
      align-items: center;
      justify-content: center;
      grid-gap: 50px;
      font-size: 20px;
      color: #ffffff;
      flex: 1;
      height: inherit;
      .nav_item {
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;
        &.active {
          &:after {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 5px;
            background: #ffd800;
          }
        }
      }
    } // nav_list end
    .usermenu_list {
      display: flex;
      grid-gap: 20px;
      margin-right: 23px;
      .usermenu_item {
        position: relative;
        width: 22px;
        height: 22px;
        button {
          width: 100%;
          height: 100%;
          &.alarm {
            display: block;
            background: url('/images/ico_bell.png') center center no-repeat;
          }
          &.msg {
            display: block;
            background: url('/images/ico_message.png') center center no-repeat;
          }
          &.login {
            display: block;
            background: url('/images/ico_cs.png') center center no-repeat;
          }
        }
      }
    } // usermenu_list end
    .userInfo {
      display: flex;
      align-items: center;
      color: #b6b5bd;
      font-size: 14px;
      cursor: pointer;
      .user_name {
        margin-right: 14px;
      }
      .user_img {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #001859;
        border-radius: 100%;
      }
    } // userInfo end
    &:after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      background: linear-gradient(to right, #248acc, #0056a4, #248acc);
      opacity: 0;
      transition: 0.4s;
    }
  `
  let headerMainStyle = css`
    ${headerDefaultStyle};
    &.active {
      &:after {
        opacity: 1;
      }
    }
  `

  let headerSubStyle = css`
    ${headerDefaultStyle};
    background: linear-gradient(to right, #248acc, #0056a4, #248acc);
  `

  let headerSubType02Style = css`
    ${headerSubStyle};
    background: transparent;
    &:after {
      opacity: 0;
    }
    &.active {
      &:after {
        opacity: 1;
      }
    }
  `

  if (page === 'main') {
    return headerMainStyle
  } else if (page === 'type02') {
    return headerSubType02Style
  } else {
    return headerSubStyle
  }
}

export const footerStyle = css`
  height: 234px;
  background: #0a1c3a;
  display: flex;
  align-items: center;
  .footer {
    display: flex;
    align-items: center;
    .footer_left {
      padding-left: 109px;
      h2 {
        img {
        }
      }
    }
    .footer_right {
      color: #aeafb3;
      padding-left: 94px;
      .info_wrap {
        display: flex;
        flex-direction: column;
        .menu_list {
          display: flex;
          grid-gap: 40px;
          align-items: center;
          font-size: 12px;
          .menu_item {
            &:last-of-type {
              font-size: 14px;
            }
            a {
            }
          }
        }
        .copyright {
          margin-top: 18px;
        }
        .info_list {
          display: flex;
          align-items: center;
          margin-top: 15px;
          grid-gap: 26px;
          .info_item {
            &:after {
              content: '';
              display: block;
              width: 2px;
              height: 13px;
              background: #aeafb3;
              position: absolute;
              top: 3px;
              right: -13px;
            }
            &:last-of-type:after {
              content: none;
            }
            position: relative;
          }
        }
      }
    }
  }
`

export const investPanelStyle = css`
  position: absolute;
  top: 78px;
  right: 0;
  z-index: 2;
  width: 380px;
  height: calc(100% - 78px);
  background: rgba(21, 55, 126, 0.7);
  border-radius: 45px 0 0 45px;
  padding: 40px 0;
  .panel_head {
    padding: 0 35px;
    height: 58px;
    .panel_header_inner {
      display: flex;
      width: 100%;
      height: 100%;
      padding: 17px 0;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 1px solid rgba(225, 225, 225, 0.16);
      color: #ffffff;
      font-weight: 600;
      font-size: 24px;
      .date {
        font-size: 14px;
        font-weight: 300;
        color: #8a9bbf;
      }
    }
  } // panel_head end
  .panel_status_wrap {
    padding: 0 35px;
    .panel_status_list {
      display: flex;
      height: 112px;
      border-bottom: 1px solid rgba(225, 225, 225, 0.16);
      .panel_status_item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        &.ing {
          color: ${colors.lightBlue};
        }
        &.comp {
          color: ${colors.orange};
        }
        .label {
          margin-bottom: 21px;
        }
        .value {
          font-family: 'Jost', 'Noto Sans KR';
          font-size: 40px;
        }
      }
    }
  } // panel_status_wrap end
  .invest_list_wrap {
    width: calc(100% - 6px);
    height: calc(100% - 170px);
    overflow: hidden;
    overflow-y: auto;
    padding: 36px 44px 36px 35px;
    .invest_item {
      height: 35px;
    }
  }
`

export const panelItemStyle = css`
  position: relative;
  height: inherit;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 300;
  color: #90abe3;
  &.active {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -35px;
      z-index: -1;
      display: block;
      width: calc(100% + 90px);
      height: 100%;
      background: linear-gradient(to right, #031b47, transparent);
    }
  }
  .name {
    flex: 1;
    height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .status {
    min-width: 50px;
    margin-left: 35px;
    display: block;
    text-align: right;
    font-weight: 500;
    letter-spacing: -0.03em;
    &.ing {
      color: ${colors.lightBlue};
    }
    &.comp {
      color: ${colors.orange};
    }
  }
`

export const newsItem01Style = css`
  width: 780px;
  height: 167px;
  background: #fff;
  overflow: hidden;
  .img_wrap {
    float: left;
    width: 222px;
    height: 100%;
    border-radius: 2px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  } // img_wrap end
  .content_wrap {
    float: left;
    width: calc(100% - 222px);
    height: 100%;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    letter-spacing: -0.03em;
    padding: 0 20px 0 54px;
    .company {
      font-size: 16px;
      margin-bottom: 13px;
      font-weight: 600;
    }
    .title {
      width: 100%;
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 18px;
      height: 25px;
      overflow: hidden;
      line-height: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .content {
      color: #6e706e;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      max-height: 40px;
      margin-bottom: 20px;
    }
    .date {
      font-size: 9px;
      color: #666666;
    }
  } // content_wrap end
`

export const newsItem02Style = css`
  display: inline-block;
  width: 305px;
  height: 53px;
  background: #fff;
  overflow: hidden;
  .img_wrap {
    float: left;
    width: 82px;
    height: 100%;
    border-radius: 2px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .content_wrap {
    float: left;
    width: calc(100% - 82px);
    height: 100%;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    letter-spacing: -0.03em;
    padding: 0 10px 0 10px;
    .content {
      font-size: 16px;
      font-weight: 600;
      color: #6e706e;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      max-height: 100%;
    }
  }
`

export const newsItem03Style = css`
  padding: 15px 0px;
  border-bottom: 1px solid #e5e5e5;
  &:first-of-type {
    padding-top: 0;
  }
  .news_content {
    display: flex;
    align-items: center;
    position: relative;
    .news_content_img {
      width: 126px;
      height: 79px;
      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }
    .news_content_info {
      margin-left: 27px;
      flex: 1;
      .title {
        font-size: 16px;
        letter-spacing: -0.05em;
        color: #333333;
        font-weight: 300;
      }
      .subtitle {
        font-size: 14px;
        font-weight: 300;
        color: #666666;
        letter-spacing: -0.025em;
        margin-top: 10px;
        line-height: 1.2;
      }
      .companyNdate {
        position: absolute;
        right: 0px;
        bottom: 0px;
        font-size: 12px;
        font-weight: 300;
        letter-spacing: -0.025em;
        color: #999999;
        span {
          position: relative;
          &:first-of-type {
            padding-right: 20px;
          }
          &:first-of-type:before {
            content: '';
            display: block;
            width: 1px;
            height: 11px;
            background: #e3e3e3;
            position: absolute;
            top: 5px;
            right: 10px;
          }
        }
      }
    }
  }
`

export const numberBoxStyle = css`
  display: inline-flex;
  background: #fff;
  background: linear-gradient(to bottom, #ffffff, #eff2ff);
  border-radius: 4px;
  box-shadow: 0 4px 13px 2px rgba(0, 0, 0, 0.2);
  .number {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 60px;
    color: #3982d8;
    font-size: 36px;
    font-weight: 600;
    line-height: 0;
    &:last-of-type:after {
      display: none;
    }
    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      right: 0;
      z-index: 1;
      transform: translateY(-50%);
      width: 1px;
      height: 29px;
      background: #dfe0e5;
    }
  }
`

export const pagination01Style = css`
  button {
    width: 32px;
    height: 32px;
    border: 1px solid #dee2e6;
    border-right: none;
    font-size: 14px;
    letter-spacing: -0.025em;
    color: #3982d8;
    &:disabled {
      cursor: default;
      background-color: #d0d0d0;
    }
    &.active {
      background: #3982d8;
      color: #fff;
      border: 1px solid #3982d8;
    }
    &.active + button {
      border-left: 1px solid transparent;
    }
    &:first-of-type {
      width: 28px;
      border-right: none;
      border-radius: 4px 0 0 4px;
    }
    &:last-of-type {
      width: 28px;
      border-right: 1px solid #dee2e6;
      border-radius: 0 4px 4px 0;
    }
  }
`

export const popupFooterStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 59px;
  border-top: 1px solid #e3e4e5;
  .button {
    min-width: 77px;
    height: 38px;
  }
`
export const popupHeaderStyle = css`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 63px;
  padding: 0 20px;
  border-bottom: 1px solid #e3e4e5;
  .title {
    color: #25232a;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.03em;
  }
`

export const popupLayoutStyle = (width) => {
  return css`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .popup_layout {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
    }
    .popup_container {
      position: relative;
      z-index: 3;
      width: ${width};
      max-height: 90%;
      max-width: 90%;
      background: #fff;
      border-radius: 6px;
      overflow: auto;
    }
  `
}

export const sliderStyle = css`
  position: relative;
  height: 100%;
  width: 100%;
  .text {
    white-space: pre-wrap;
  }
  .swiper-container {
    height: inherit;
    .slider_inner {
      width: 100%;
      height: 100%;
      .slider_content {
        position: absolute;
        top: 50%;
        left: 208px;
        z-index: 1;
        transform: translateY(-50%);
        font-size: 60px;
        color: #ffffff;
        line-height: 1.2;
        button {
          width: 170px;
          height: 38px;
          font-size: 14px;
        }
      }
    }
    .swiper-pagination {
      bottom: 19px;
      left: 0;
      width: 100%;
      height: 20px;
      z-index: 3;
      .swiper-pagination-bullet {
        width: 14px;
        height: 14px;
        background: #fff;
        opacity: 1;
        &.swiper-pagination-bullet-active {
          background: #79b7ff;
        }
      }
    }
  }
`

export const sliderStyle02 = css`
  position: relative;
  height: 100%;
  width: 100%;
  .swiper-container {
    overflow: visible;
    height: inherit;
    .slider_inner {
      width: 100%;
      height: 100%;
    }
  }

  .swiper-pagination {
    bottom: -17px;
    left: 0;
    width: 100%;
    height: 20px;
    z-index: 3;
    .swiper-pagination-bullet {
      width: 6px;
      height: 6px;
      background: #bebbc9;
      opacity: 1;
      &.swiper-pagination-bullet-active {
        background: #79b7ff;
      }
    }
  }
`

export const sliderStyle03 = css`
  position: relative;
  height: 340px; // 261 + 47
  width: 100%;
  overflow: hidden;
  .slide_block {
    height: 261px;
    width: calc(100% + 110px);
    //width: 657px;
    transform: translateX(-55px);
  }
  .swiper-container {
    height: inherit;
    overflow: visible;
    .swiper-slide {
      opacity: 0.5;
      transition: 0.3s;
    }
    .swiper-slide-next {
      opacity: 1;
      transition: 0.3s;
    }

    .slider_inner {
      width: 100%;
      height: 100%;
      background: #f5f6fd;
      border-radius: 8px;
      box-shadow: 1px 8px 13px 2px rgba(0, 0, 0, 0.1);
    }
    .swiper-pagination {
      bottom: -47px;
      left: 0;
      width: 100%;
      height: 15px;
      z-index: 3;
      .swiper-pagination-bullet {
        width: 15px;
        height: 15px;
        background: #b9bdcd;
        opacity: 1;
        &.swiper-pagination-bullet-active {
          background: #3982d8;
        }
      }
    }
  }
`

export const sliderStyle04 = css`
  position: relative;
  height: 295px; // 260 + 35
  width: 100%;
  overflow: hidden;
  .slide_block {
    height: 260px;
    width: 100%;
  }
  .swiper-container {
    height: inherit;
    overflow: visible;
    .slider_inner {
      width: 100%;
      height: 100%;
      background: #f5f6fd;
      border-radius: 8px;
      box-shadow: 1px 8px 13px 2px rgba(0, 0, 0, 0.1);
    }
    .swiper-pagination {
      bottom: -37px;
      left: 0;
      width: 100%;
      height: 20px;
      z-index: 3;
      .swiper-pagination-bullet {
        width: 15px;
        height: 15px;
        background: #b9bdcd;
        opacity: 1;
        &.swiper-pagination-bullet-active {
          background: #3982d8;
        }
      }
    }
  }
`

export const sliderStyle05 = css`
  position: relative;
  height: 100px;
  width: 100%;
  overflow: hidden;
  .slide_block {
    height: inherit;
    width: 100%;
  }
  .swiper-container {
    height: inherit;
    overflow: visible;
    .slider_inner {
      width: 100%;
      height: 100%;
      background: #f5f6fd;
      border-radius: 8px;
      box-shadow: 1px 8px 13px 2px rgba(0, 0, 0, 0.1);
    }
    .swiper-button-prev {
      background: url('../images/ico_arr_left02.png') center center no-repeat;
      &:after {
        display: none;
      }
    }
    .swiper-button-next {
      background: url('../images/ico_arr_right02.png') center center no-repeat;
      &:after {
        display: none;
      }
    }
  }
`

export const total01Style = css`
  font-size: 12px;
  font-weight: 300;
  color: #3982d8;
`

export const noResultStyle = (styleStr) => {
  return css`
    text-align: center;
    width: 100%;
    height: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    font: inherit;
    padding: 10px 0;
    ${StringUtils.hasLength(styleStr) && styleStr}
  `
}

export const tabStyle = css`
  display: flex;
  grid-gap: 17px;
  border-bottom: 1px solid #d4d6e4;
  .btn_tab {
    position: relative;
    bottom: -1px;
    padding-bottom: 10px;
    border-bottom: 2px solid transparent;
    color: #878296;
    font-size: 16px;
    &.active {
      border-bottom: 2px solid ${colors.blue};
      color: #333333;
    }
  }
`

export const cardItem05Style = css`
  margin: 0 44px;
  width: 592px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-gap: 30px;
  .profile_pic {
    width: 100px;
    height: 100%;
    border-radius: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  } // profile_pic end

  .profile_txt {
    width: calc(100% - 130px);
    & .cnt {
      font-family: 'Noto Sans KR', sans-serif !important;
      font-size: 16px;
      line-height: 20px;
      color: #4b4b4b;
      margin-bottom: 17px;
      word-break: keep-all;
      display: -webkit-box;
      overflow: hidden;
      white-space: normal;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    & .ceo {
      margin-right: 20px;
    }
    & .company {
      font-weight: 300;
      color: #666;
    }
  } // profile_txt end
`

export const cardItem06Style = css`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-shadow: 1px 1px 8px 4px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  .img_wrap {
    min-width: 199px;
    max-width: 199px;
    width: 199px;
    height: 100%;
  }
  .content {
    padding: 30px;
    flex: 1;
    background: #fff;
    .content_inner {
      width: 100%;
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
      .position {
        font-size: 14px;
        color: #aaaaaa;
        margin-bottom: 10px;
      }
      .name {
        color: #333333;
        font-size: 20px;
        font-weight: 500;
        letter-spacing: -0.03em;
      }
      .info {
        color: #666666;
        white-space: pre-wrap;
        line-height: 1.5;
        margin-top: 16px;
      }
    } //  content_inner end
  }
`

export default {
  bannerItem01Style,
  selectionBoxStyle,
  breadCrumbsStyle,
  cardItem01Style,
  cardItem02Style,
  cardItem03Style,
  cardItem04Style,
  cardItem05Style,
  cardItem06Style,
  cardLayoutStyle,
  categoryItem01Style,
  footerStyle,
  galleryStyle,
  headerStyle,
  investPanelStyle,
  panelItemStyle,
  newsItem01Style,
  newsItem02Style,
  newsItem03Style,
  numberBoxStyle,
  pagination01Style,
  popupFooterStyle,
  popupHeaderStyle,
  popupLayoutStyle,
  sliderStyle,
  sliderStyle02,
  sliderStyle03,
  sliderStyle04,
  sliderStyle05,
  total01Style,
  noResultStyle,
  tabStyle
}
