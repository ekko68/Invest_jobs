import { css } from '@emotion/react'
import { colors } from 'assets/style/style.config'
export const InvestListStyle = css`
  .search_wrap {
    position: relative;
    margin-top: 40px;
    &.active {
      .search_bottom {
        display: block;
      }
    }
    .search_top {
      display: flex;
      justify-content: center;
      align-items: center;
      grid-gap: 10px;
      height: 38px;
      .input {
        width: 420px;
        height: inherit;
        display: inline-block;
        border: 1px solid ${colors.blue};
        border-radius: 4px;
        padding: 0 11px;
      }
      .button {
        height: inherit;
        &.btn_search {
          width: 80px;
          background: #fff;
        }
        &.btn_more {
          width: 90px;
        }
      }
    } // search_top end
    .search_bottom {
      position: absolute;
      top: 44px;
      left: 0;
      z-index: 3;
      width: 100%;
      padding: 30px;
      background: #fff;
      border: 1px solid ${colors.blue};
      border-radius: 10px;
      box-shadow: 1px 1px 13px 6px rgba(0, 0, 0, 0.1);
      display: none;
      .category_wrap {
        border-bottom: 1px solid #e8ebf1;
        padding-top: 30px;
        padding-bottom: 14px;
        &:first-of-type {
          padding-top: 0;
        }
        .category_header {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 30px;
          grid-gap: 12px;
          .category_title {
            font-size: 18px;
          }
          .category_info {
            color: #3982d8;
          }
        }
        .checkbox_list_wrap {
          overflow: hidden;
          &.row_8 {
            .checkbox_item {
              width: 12.5%;
            }
          }
          .checkbox_item {
            float: left;
            width: 16.66%;
            margin-bottom: 16px;
          }
        }
      } // category_wrap end
      .btn_wrap {
        margin-top: 20px;

        .button {
          width: 78px;
          height: 38px;
          margin: 0 3px;
        }
      }
    } // search_bottom end
  }
  .invest_list_wrap {
    margin-top: 30px;
    .invest_list {
      margin-right: -26px;
      &:after {
        content: '';
        display: block;
        clear: both;
      }
      .invest_item {
        float: left;
        display: block;
        width: 316px;
        height: 290px;
        padding-right: 26px;
        margin-bottom: 26px;
      }
    }
  } // invest_list_wrap end
  .btn_wrap {
    text-align: center;
    .btn_more {
      width: 137px;
      height: 38px;
    }
  }
`

export const InvestViewStyle = css`
  .section_title {
    font-size: 18px;
    letter-spacing: -0.025em;
    &.bold {
      font-weight: 500;
    }
  }
  .page_wrap {
    display: flex;
    justify-content: flex-end;
  }
  .basic_bold {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: -0.025em;
  }
  .invest_inner {
    display: flex;
    grid-gap: 21px;
    .invest_left {
      width: 390px;
      display: flex;
      flex-direction: column;
      grid-gap: 20px;

      .section {
        .section01 {
          //width: 100%;
          height: 100%;
        }

        .section02 {
          width: 100%;
          height: 100%;
        }

        .company_info {
          display: flex;
          align-items: center;

          .img_wrap {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 1px solid #eceef8;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .company_text {
            margin-left: 17px;
            flex: 1;
            .sub_name {
              font-size: 12px;
              color: #999999;
              letter-spacing: -0.025em;
            }

            .name {
              font-size: 20px;
              letter-spacing: -0.025em;
              color: #000;
              margin-top: 10px;
            }

            .info {
              font-size: 12px;
              color: #999999;
              letter-spacing: -0.025em;
              margin-top: 10px;
            }
          }
        }
        //company_info end
        .execution {
          margin-top: 20px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          height: 90px;
          background: rgb(2, 88, 167);
          background: -moz-linear-gradient(
            90deg,
            rgba(2, 88, 167, 1) 0%,
            rgba(26, 116, 228, 1) 50%,
            rgba(2, 88, 167, 1) 100%
          );
          background: -webkit-linear-gradient(
            90deg,
            rgba(2, 88, 167, 1) 0%,
            rgba(26, 116, 228, 1) 50%,
            rgba(2, 88, 167, 1) 100%
          );
          background: linear-gradient(
            90deg,
            rgba(2, 88, 167, 1) 0%,
            rgba(26, 116, 228, 1) 50%,
            rgba(2, 88, 167, 1) 100%
          );

          .number {
            text-align: center;
            flex: 1;
            position: relative;
            &:after {
              content: '';
              position: absolute;
              width: 1px;
              height: 69px;
              top: -10px;
              right: 0;
              background: #1879cf;
            }
          }

          .money {
            text-align: center;
            flex: 1;
            position: relative;
            &:before {
              content: '';
              position: absolute;
              width: 1px;
              height: 69px;
              top: -10px;
              left: 0;
              background: #0b55bb;
            }
          }

          .sub_title {
            font-size: 14px;
            color: #b0d1fe;
            letter-spacing: -0.025em;
          }

          .title {
            font-size: 24px;
            color: #fff;
            letter-spacing: -0.025em;
            font-weight: 600;
            margin-top: 8px;
          }
        }
        //execution end
        .request {
          margin-top: 30px;

          .request_box {
            background: #f5f5f5;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 120px;
            justify-content: center;
            margin-top: 20px;

            .title {
              letter-spacing: -0.025em;
              font-weight: 300;
            }

            .button {
              margin-top: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 140px;
              height: 38px;
            }
          }
        }
        //request end
        .info_detail {
          margin-top: 40px;

          .top {
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e5e5;

            .ceo {
              font-size: 12px;
              font-weight: 300;
              color: #7e7e7e;
              margin-bottom: 15px;

              strong {
                font-size: 18px;
                font-weight: 500;
                letter-spacing: -0.05em;
                color: #000;
              }
            }

            .tel_email_addr {
              font-size: 14px;
              font-weight: 300;
              color: #666666;
              margin-top: 10px;

              &:first-of-type {
                margin-top: 0px;
              }

              &:last-of-type {
                line-height: 22px;
              }

              strong {
                font-weight: 600;
                color: #333333;
                letter-spacing: -0.01em;
                padding-right: 10px;
              }
            }
          }

          //info_detail end
          .bottom {
            margin-top: 20px;

            .info_list {
              margin-top: 15px;
              color: #666666;
              font-size: 14px;
              font-weight: 300;
              letter-spacing: -0.025em;

              .info_item {
                line-height: 22px;
              }
            }
          }
        }
        .invest_type {
          .pie_graph {
            margin-top: 30px;
            width: 100%;
            height: 100%;
          }
          .button {
            margin-top: 30px;
            width: 100%;
            height: 49px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
    .invest_right {
      flex: 1;
      display: flex;
      flex-direction: column;
      grid-gap: 20px;
      .section01 {
        width: 100%;
        height: 100%;
      }
      .section02 {
        width: 100%;
        height: 100%;
      }
      //execution start
      .execution {
        .line_graph {
          margin-top: 30px;
          width: 100%;
          height: 100%;
        }
      } // excution end
      //portfolio start
      .portfolio {
        margin-top: 40px;
        .company_list_wrap {
          margin: 45px 0 10px 0;
          .name {
            min-width: 210px;
          }
          .field {
            min-width: 130px;
            text-align: left;
          }
          .skill {
            min-width: 107px;
            text-align: center;
          }
          .group {
            min-width: 107px;
            text-align: center;
          }
          .amount {
            min-width: 107px;
            text-align: center;
          }
          .y_m {
            min-width: 107px;
            text-align: right;
          }
          .company_list_title {
            display: flex;
            align-items: center;
            padding-bottom: 12px;
            border-bottom: 2px solid #3982d8;
            div {
              font-size: 14px;
              letter-spacing: -0.025em;
              font-weight: 500;
              color: #666666;
            }
          }
          .company_list_item {
            display: flex;
            align-items: center;
            height: 60px;
            border-bottom: 1px solid #e8ebf1;
            font-weight: 300;
            .name {
              display: flex;
              align-items: center;
              .img {
                width: 40px;
                height: 40px;
                border: 1px solid #e8ebf1;
                border-radius: 2px;
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
              }
              .title {
                margin-left: 10px;
                font-weight: 600;
                color: #333;
              }
            }
            .field {
              text-align: center;
            }
            .skill {
            }
            .group {
            }
            .amount {
            }
            .y_m {
            }
          }
        }
      }
      // portfolio end
      //news start
      .news_inner {
        margin: 20px 0 10px 0;
      }
      //news end
    }
  }
`

export default {
  InvestViewStyle,
  InvestListStyle
}
