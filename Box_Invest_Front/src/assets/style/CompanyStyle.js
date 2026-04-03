/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { colors } from 'assets/style/style.config'

export const companyMainStyle = css`
  .container {
    padding: 50px 0 117px 0;
    .company_list_wrap {
      margin-top: 30px;
      .list_header {
        display: flex;
        height: 51px;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #d4d6e4;
        .title {
          font-size: 20px;
          letter-spacing: -0.03em;
          font-weight: 500;
        }
        .select {
          width: 102px;
          height: 30px;
          font-size: 12px;
          letter-spacing: -0.03em;
          color: #666666;
        }
      } // list_header end
      .company_list {
        padding-top: 30px;
        margin-right: -30px;
        &:after {
          content: '';
          display: block;
          clear: both;
        }
        .company_item {
          position: relative;
          float: left;
          margin: 0 22px 24px 0;
          width: 25%;
          max-width: 230px;
          height: 320px;
          .flag_wrap {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 1;
            display: flex;
          }
        }
      } // company_list end
      .btn_group {
        padding: 44px 0 70px 0;
        text-align: center;
        .btn_more {
          width: 90px;
          height: 38px;
        }
      }
    } // company_list_wrap end
    .banner_wrap {
      width: 100%;
    }
  }
`

// 조건검색
export const searchCorpStyle = css`
  position: relative;
  height: 100px;
  z-index: 2;
  .search_wrap {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: inherit;
    background: #fff;
    border: 1px solid #e9ebf7;
    border-radius: 1px;
    box-shadow: 1px 1px 13px 2px rgba(0, 0, 0, 0.02);
    overflow: hidden;
    transition: all 0.4s;
    &.active {
      height: 288px;
      border: 1px solid #3982d8;
    }
    .search_top {
      height: 100px;
      padding: 0 29px;
      display: flex;
      align-items: center;
      justify-content: center;
      .inner {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        grid-gap: 6px;
        .input,
        button {
          height: 37px;
        }
        .input {
          flex: 1;
          padding: 0 13px;
          border: 1px solid #3982d8;
          border-radius: 4px;
          outline: 0 none;
          &::placeholder {
            color: #999999;
          }
        }
        .search {
          width: 90px;
        }
        .search_detail {
          width: 90px;
        }
        .refresh {
          width: 37px;
          background: url('/images/ico_refresh.png') center center no-repeat;
        }
      }
    } // search_top end
    .search_bottom {
      position: absolute;
      top: 100px;
      left: 0;
      z-index: 2;
      width: 100%;
      border-top: 1px solid #e9ebf7;
      padding: 30px 29px 29px 29px;
      .inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left_section,
        .right_section {
          flex: 1;
          .input_row {
            display: flex;
            margin-bottom: 7px;
            height: 38px;
            .label {
              min-width: 180px;
              color: #333333;
              font-weight: 400;
              .sub_info {
                color: #999999;
              }
            }
            .input_wrap {
              display: flex;
              flex: 1;
              grid-gap: 7px;
              align-items: center;
              color: #999999;
              input,
              select {
                flex: 1;
                height: 100%;
                border: 1px solid #d7d7d7;
                outline: 0 none;
                padding: 0 11px;
                border-radius: 4px;
              }
            }
          }
        } // left_section && right_section end
        .left_section {
          border-right: 1px dashed #e9ebf7;
          padding-right: 30px;
        }
        .right_section {
          padding-left: 30px;
        }
      }
    } // search_bottom end
  }
`

// 기업상세
export const companyDetail = css`
  .gallery_logo_wrap {
    position: relative;
    .btn_request {
      position: absolute;
      bottom: 20px;
      right: calc(50% - 620px);
      z-index: 1;
      width: 130px;
      height: 50px;
    }
  }
  .container {
    padding: 50px 0 167px 0;
    .section_row {
      display: flex;
      grid-gap: 20px;
      margin-bottom: 20px;
      &.section01 {
        height: 676px;
      }
      &.section02 {
        height: 907px;
      }
      .left_section,
      .right_section {
        flex: 1;
        display: flex;
        flex-direction: column;
        grid-gap: 20px;
      }
      .card_section {
        flex: 1;
        &.card01 {
          max-height: 440px;
        }
        &.card02 {
          max-height: 215px;
        }
        &.card03 {
          max-height: 676px;
        }
        &.card04 {
          max-height: 377px;
        }
        &.card05 {
          max-height: 510px;
        }
        &.card06 {
          max-height: 298px;
        }
        &.card07 {
          max-height: 589px;
        }
      }
    } // section_row end
    // content's style inside of card
    .card_section {
      .card_inner {
        height: 100%;
        overflow: hidden;
        //overflow-y: auto;
        color: #999999;
        position: relative;
        .card_header {
          display: flex;
          align-items: center;
          margin-bottom: 18px;
          .card_title {
            font-size: 20px;
            font-weight: 500;
            color: #333333;
          }
          .badge {
            width: 34px;
            height: 24px;
            border-radius: 45px;
            margin-left: 10px;
          }
        } // card_header end
        .form_wrap {
          display: flex;
          flex-direction: column;
          height: 265px;
          .input,
          .textarea {
            border: 1px solid #d7d7d7;
            border-radius: 4px;
          }
          .input {
            margin-bottom: 9px;
            height: 38px;
            padding: 10px;
          }
          .textarea {
            flex: 1;
            margin-bottom: 9px;
            padding: 10px;
            background: #f7f5f5;
            resize: none;
          }
          .info {
            font-size: 12px;
            color: #3982d8;
          }
        }
      }
    }
    .swiper-container {
      height: 100%;
      position: static;
      .swiper-button-prev,
      .swiper-button-next {
        top: 50%;
      }
      .swiper-button-prev {
        left: 0;
        background: url('/images/ico_arr_left.png') 0 center no-repeat;
        &:after {
          display: none;
        }
      }
      .swiper-button-next {
        right: 0;
        background: url('/images/ico_arr_right.png') 100% center no-repeat;
        &:after {
          display: none;
        }
      }
    }
  } // container end
`

// 기업소개
export const corpIntroduceStyle = css`
  height: 100%;
  .card_content {
    overflow: hidden;
    overflow-y: auto;
    max-height: 280px;
    .logo_wrap {
      display: flex;
      grid-gap: 18px;
      align-items: center;
      .info_box {
        flex: 1;
        .name {
          font-size: 20px;
          color: #333333;
          margin-bottom: 10px;
          font-weight: 500;
          letter-spacing: -0.03em;
        }
      }
    } // logo_wrap end
    .introduce_wrap {
      margin: 28px 0 32px 0;
      line-height: 1.8;
    } // introduce_wrap end
  } // card_content end
  .tag_list {
    overflow: hidden;
    margin-top: 30px;
    .tag_item {
      float: left;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      height: 28px;
      margin: 0 5px 5px 0;
      padding: 0 10px;
      border: 1px solid #ebe9f1;
      border-radius: 45px;
      color: #878296;
    }
  }
`

// 서비스/제품
export const serviceProductStyle = css`
  .slider_wrap {
    position: relative;
    width: 100%;
    max-width: 550px;
    height: 115px;
    padding: 0 25px;
    .swiper-container {
      width: 502px;
      .img_wrap {
        overflow: hidden;
        height: 100%;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
`

// 기업상세
export const companyDetailInfoStyle = css`
  .table_wrap {
    overflow: hidden;
    overflow-y: auto;
    height: 577px;
    .type_info {
      font-size: 12px;
      color: #3982d8;
      margin-left: 16px;
    }
  }
`
// 사업문의
export const businessInquiryStyle = css`
  .card_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn_inquiry {
      width: 72px;
      height: 26px;
    }
  }
`
// 팀원정보
export const teamInfoStyle = css`
  .team_info_wrap {
    overflow: hidden;
    overflow-y: auto;
    max-height: 420px;
    padding-right: 5px;
    .team_info_list {
      overflow: hidden;
      margin-right: -10px;
      .team_info_item {
        border: 1px solid #d7d7d7;
        float: left;
        width: calc(50% - 10px);
        margin-right: 10px;
        margin-bottom: 9px;
        border-radius: 4px;
        padding: 14px 15px;
        .team_user_head {
          display: flex;
          align-items: center;
          grid-gap: 9px;
          margin-bottom: 15px;
          .name {
            font-size: 14px;
            color: #333333;
            font-weight: 500;
            margin-bottom: 4px;
          }
          .position {
            color: #999999;
            font-size: 12px;
            letter-spacing: -0.03em;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-wrap: break-word;
            line-height: 1.2;
          }
        } // team_user_head end
        .user_info_sub {
          font-size: 12px;
          color: #666666;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-wrap: break-word;
        }
      } // team_info_item end
    } // team_info_list end
  }
`

// 소개영상
export const introVideoStyle = css`
  .intro_video_slider {
    width: 547px;
    height: 200px;
    overflow: hidden;
    position: relative;
    padding: 0 22px;
    .swiper-container {
      position: static;
      height: 100%;
    }
  }
`

export const newsStyle = css`
  .card_header {
    display: flex;
    align-items: center;
  }
  .news_wrap {
    overflow: hidden;
    overflow-y: auto;
    height: 483px;
    .news_list {
      padding-right: 15px;
      .news_item {
        width: 100%;
        .news_item_inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          grid-gap: 17px;
          padding: 20px 0;
          border-bottom: 1px solid #e9ebf7;
          .news_content {
            height: 112px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .title {
              min-height: 35px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-wrap: break-word;
              font-size: 16px;
              font-weight: 600;
              color: #333333;
              line-height: 1.2;
            }
            .content {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-wrap: break-word;
              font-size: 14px;
              font-weight: 400;
              color: #666666;
              line-height: 1.2;
              overflow: hidden;
            }
            .write_info {
              font-size: 12px;
              display: flex;
              .write_info_item {
                display: block;
                position: relative;
                padding-right: 11px;
                margin-right: 11px;
                overflow: hidden;
                height: 14px;
                &.writer {
                  width: 127px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                &:last-of-type {
                  &:after {
                    display: none;
                  }
                }
                &:after {
                  content: '';
                  position: absolute;
                  top: 50%;
                  right: 0;
                  z-index: 1;
                  transform: translateY(-50%);
                  display: block;
                  width: 1px;
                  height: 12px;
                  background: #cccccc;
                }
              }
            }
          } //  news_content end
          .news_img {
            min-width: 180px;
            max-width: 180px;
            height: 114px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        } // news_item_inner end
      } // news_item end
    } // news_list end
  } // news_wrap end
`

export default {
  companyMainStyle,
  searchCorpStyle,
  companyDetail,
  corpIntroduceStyle,
  companyDetailInfoStyle,
  businessInquiryStyle,
  teamInfoStyle,
  introVideoStyle,
  newsStyle
}
