import { css } from '@emotion/react'

const EventStyle = css`
  min-width: 1570px;
  margin: 0 auto;
  .event_size01 {
    width: 1170px;
    margin: auto;
  }
  .event_size02 {
    width: 1570px;
    margin: auto;
  }
  .event_header {
    .header_top {
      height: 80px;
      background: #212529;
      .header_top_wrap {
        display: flex;
        height: 100%;
        justify-content: space-between;
        align-items: center;
        .left {
          .info_list {
            display: flex;
            align-items: center;
            .info_item {
              &:nth-of-type(1) {
                margin-right: 90px;
              }
              &:nth-of-type(2) {
                margin-right: 60px;
              }
              &:nth-of-type(1) .img {
                background: #4c6ef5 url('/images/tel.png') center no-repeat;
              }
              &:nth-of-type(2) .img {
                background: #4c6ef5 url('/images/@.png') center no-repeat;
              }
              &:nth-of-type(3) .img {
                background: #4c6ef5 url('/images/w.png') center no-repeat;
              }
              display: flex;
              align-items: center;
              .img {
                width: 30px;
                height: 30px;
              }
              .text {
                margin-left: 12px;
                .title {
                  color: #fff;
                }
                .sub_title {
                  color: #868e96;
                  margin-top: 6px;
                }
              }
            }
          }
        }
        .right {
          height: 100%;
          .button {
            height: 100%;
            border-radius: 0px;
            width: 186px;
            background: #4c6ef5;
          }
        }
      }
    } // header_top end
    .header_bottom {
      .header_bottom_wrap {
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          .logo {
            img {
            }
          }
        }
        .right {
          .nav_list {
            display: flex;
            align-items: center;
            grid-gap: 60px;
            .nav_item {
              font-size: 16px;
              color: #333333;
              letter-spacing: -0.025em;
              font-weight: 500;
            }
          }
        }
      }
    } // header_bottom end
  } // event_header end
  .banner_section {
    position: relative;
    height: 600px;
    background: url('/images/event_banner.png') center center no-repeat;
    background-size: cover;
    .banner_section_wrap {
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      .title {
        color: #fff;
        font-size: 58.74px;
        font-weight: 600;
        letter-spacing: -0.025em;
        line-height: 80px;
      }
      .sub_title {
        color: #fff;
        font-size: 18px;
        letter-spacing: -0.025em;
        line-height: 28px;
        margin-top: 26px;
      }
      .view {
        margin-top: 40px;
        .button {
          width: 140px;
          height: 50px;
        }
      }
    }
  } // banner_section
  .section02 {
    padding: 117px 0 130px 0;
    .section02_wrap {
      display: flex;
      .img {
        width: 500px;
        height: 100%;
        overflow: hidden;
        border-radius: 4px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .text_wrap {
        margin-left: 102px;
        .ibk_title {
          font-size: 18px;
          color: #4c6ef5;
          letter-spacing: -0.025em;
        }
        .title {
          &: after {
            content: '';
            display: block;
            width: 90px;
            height: 2px;
            background: #4c6ef5;
            position: absolute;
            bottom: 0;
            left: 0;
          }
          position: relative;
          font-size: 40px;
          font-weight: 600;
          color: #212529;
          letter-spacing: -0.025em;
          line-height: 54px;
          padding: 20px 0 37px 0px;
        }
        .text_content {
          &:nth-of-type(1) {
            margin-top: 30px;
          }
          &:nth-of-type(2) {
            margin-top: 60px;
          }
          .sub_title {
            font-size: 20px;
            color: #212529;
            letter-spacing: -0.025em;
          }
          .sub_text {
            margin-top: 15px;
            color: #868e96;
            line-height: 24px;
          }
        }
      }
    }
  } // section02 end
  .section03 {
    padding: 60px 0 117px 0px;
    .section03_wrap {
      .section03_list {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        .section03_item {
          text-align: center;
          .content_text {
            font-size: 50px;
            font-weight: 500;
            letter-spacing: -0.025em;
            color: #212529;
            font-family: 'Jost', 'Noto Sans KR';
          }
          .title {
            font-size: 16px;
            letter-spacing: -0.025em;
            color: #868e96;
            margin-top: 23px;
          }
        }
      }
    }
  } // section03 end
  .section04 {
    padding: 62px 0 143px 0;
    background: #f8f9fa;
    .section04_wrap {
      .section_name {
        font-size: 16px;
        letter-spacing: -0.025em;
        color: #4c6ef5;
        text-align: center;
      }
      .section_title {
        font-size: 30px;
        font-weight: 600;
        letter-spacing: -0.025em;
        color: #212529;
        margin-top: 16px;
        text-align: center;
      }
      .card_wrap {
        margin-top: 74px;
        overflow: hidden;
        margin-right: -30px;
        .card {
          float: left;
          width: 25%;
          height: 535px;
          padding-right: 30px;
          margin-bottom: 30px;
          .card_box {
            display: block;
            background: #fff;
            height: 100%;
            border-radius: 10px;
            overflow: hidden;
            .card_inner {
              width: 100%;
              height: 100%;
              .img {
                width: 100%;
                height: 298px;
                overflow: hidden;
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
              }
              .content {
                padding: 48px 48px 28px 48px;
                text-align: center;
                height: calc(100% - 298px);
                .title {
                  font-size: 20px;
                  font-weight: 600;
                  letter-spacing: -0.025em;
                  color: #212529;
                  line-height: 24px;
                  min-height: 50px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                }
                .sub_title {
                  color: #868e96;
                  letter-spacing: -0.025em;
                  line-height: 20px;
                  margin-top: 14px;
                  min-height: 60px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 3;
                }
                .more {
                  &:after {
                    display: block;
                    content: '';
                    position: absolute;
                    bottom: -6px;
                    width: 64px;
                    height: 1px;
                    background: #4c6ef5;
                  }
                  display: inline-block;
                  margin-top: 28px;
                  color: #4c6ef5;
                  letter-spacing: -0.025em;
                  font-weight: 500;
                  position: relative;
                }
              }
            }
          }
        }
      }
    }
  } // section04 end
  .section05 {
    width: 100%;
    height: 820px;
    background: url('/images/img_event_bg01.png') center center no-repeat;
    background-size: cover;
    .section_inner {
      width: 1200px;
      margin: 0 auto;
      color: #fff;
      .section_head {
        padding-top: 85px;
        margin-bottom: 77px;
        text-align: center;
        .section_title {
          font-size: 44px;
          margin-bottom: 29px;
          font-weight: 600;
        }
        .section_info {
          font-size: 20px;
        }
      } // section_head end
      .faq_board_wrap {
        .no_result_wrap {
          font-size: 20px;
          height: 300px;
          border: 1px solid #90a6ff;
        }
        .accordion_list {
          .accordion_item {
            position: relative;
            max-height: 54px;
            overflow: hidden;
            color: #fff;
            &:last-of-type {
              .accordion_title {
                border-bottom: 1px solid #90a6ff;
              }
              .accordion_content {
                border-bottom: 1px solid #90a6ff;
              }
            }
            &.active {
              max-height: 1000%;
              .accordion_title {
                .btn_accordion {
                  background: url('/images/ico_minus.png') center center no-repeat;
                }
              }
            }
            .accordion_title {
              border: 1px solid #90a6ff;
              border-bottom: 0 none;
              padding: 23px;
              height: 54px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 16px;
              font-weight: 500;
              .title {
                max-width: calc(100% - 60px);
                height: 25px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .btn_accordion {
                height: 30px;
                width: 30px;
                background: url('/images/ico_more02.png') center center no-repeat;
              }
            }
            .accordion_content {
              border: 1px solid #90a6ff;
              border-bottom: 0 none;
              padding: 23px;
              line-height: 1.4;
              word-break: keep-all;
              .inner {
                max-height: 60px;
                overflow: hidden;
                overflow-y: auto;
              }
            }
          }
        }
      }
    }
  } // section05 end
  .section06 {
    padding: 80px 0;
    .section06_wrap {
      .company_list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .company_item {
          img {
          }
        }
      }
    }
  } // section06 end
  .event_footer {
    height: 463px;
    background: url('/images/event_footer_bg.png') center center no-repeat;
    background-size: cover;
    .event_footer_wrap {
      .info_list {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        height: 334px;
        overflow: hidden;
        .info_item {
          flex: 1;
          float: left;
          width: 33.33%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          &:nth-of-type(1) .img {
            background: #4c6ef5 url('/images/event_footer_tel.png') center no-repeat;
            box-shadow: 0 0 0 14px #ebeefa;
          }
          &:nth-of-type(2) .img {
            background: #fff url('/images/email.png') center no-repeat;
          }
          &:nth-of-type(3) .img {
            background: #fff url('/images/website.png') center no-repeat;
          }
          .img {
            position: relative;
            width: 80px;
            height: 80px;
            border-radius: 50%;
          }
          .text {
            margin-top: 40px;
            .title {
              font-size: 18px;
              color: #090909;
              font-weight: 600;
            }
            .sub_title {
              color: #868e96;
              margin-top: 20px;
            }
          }
        }
      }
      .footer_copyright {
        border-top: 1px solid #dcdcdc;
        padding-top: 45px;
        .copyright {
          color: #868e96;
          span {
            color: #4c6ef5;
          }
        }
      }
    }
  } // event_footer end
`

export default EventStyle
