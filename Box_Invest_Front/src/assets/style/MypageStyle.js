import { css } from '@emotion/react'
import { colors } from 'assets/style/style.config'

// 마이페이지 공통
export const mypageCommonStyle = css`
  position: relative;
  .ico_plus {
    padding-left: 17px;
    background: url('../images/ico_more03.png') 0 center no-repeat;
    font-size: 12px;
  }
  .gallery_logo_wrap {
    .logo_wrap {
      position: absolute;
      top: 60px;
      left: calc(50% - 620px);
      z-index: 1;
      .img_wrap {
        width: 160px;
        height: 160px;
        background: #fff;
        border-radius: 4px;
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
      .name {
        color: #fff;
        text-align: center;
        margin-top: 13px;
      }
    }
  } // gallery_logo_wrap
  .section_header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 10px;
    border-bottom: 1px solid #d4d6e4;
    margin-bottom: 30px;
    .section_title {
      font-size: 20px;
    }
    .button {
      min-width: 100px;
      height: 38px;
    }
    .btn_more {
      width: 30px;
      height: 20px;
      display: inline-flex;
      background: url('/images/ico_more_dark.png') center center no-repeat;
    }
  } // section_header end
  .card_header {
    border-bottom: 2px solid #3982d8;
    padding-bottom: 7px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 17px;
    .title {
      font-size: 18px;
      font-weight: 500;
      color: #333;
      .badge {
        font-size: 16px;
        min-width: 34px;
        height: 24px;
        margin-left: 7px;
        font-weight: 300;
      }
    }
    .btn_more {
      display: inline-flex;
      width: 45px;
      background: url('/images/ico_more_dark.png') 100% center no-repeat;
    }
  } // card_header end
  .page_title {
    font-size: 36px;
    text-align: center;
    margin-bottom: 36px;
    font-weight: 500;
    letter-spacing: -0.06em;
    strong {
      font-weight: 800;
    }
  }
  .ico_title {
    font-size: 20px;
    color: #333333;
    padding-bottom: 12px;
    border-bottom: 2px solid ${colors.blue};
    letter-spacing: -0.06em;
    font-weight: 500;
    &:before {
      transform: translateY(calc(-50% - 6px));
    }
  } // ico_title end
  .table {
    th,
    td {
      text-align: left;
      font-size: 14px;
    }
    td {
      background: #fff !important;
    }
  } // table end
  .prev_next_wrap {
    position: relative;
    z-index: 0;
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
  } // prev_next_wrap end
  .input_wrap {
    display: flex;
    align-items: center;
    grid-gap: 6px;
    height: 38px;
    &.datepicker_wrap {
      grid-gap: 0;
    }
    input,
    .select {
      height: 38px;
      border: 1px solid #d7d7d7;
      border-radius: 4px;
      flex: 1;
      padding: 0 11px;
      color: #999999;
      width: 100%;
      &::placeholder {
        color: #dddddd;
      }
    }
    .button {
      font-size: 14px;
      height: 100%;
    }
  } // input_wrap end
  
  } // datepicker_wrap end
`
/* ===================
마이페이지 - 메인
=================== */
// 마이페이지 메인
export const mypageMainStyle = css`
  .container {
    padding: 30px 0 183px 0;

    .info_wrap {
      letter-spacing: -0.03em;
      margin-bottom: 30px;
      .information_tooltip {
        margin-bottom: 10px;
        &:last-of-type {
          margin-bottom: 0;
        }
        .info_content {
          display: flex;
          justify-content: space-between;
          margin-right: 46px;
          padding: 13px 16px;
          &.ico_smile {
            padding-left: 56px;
            background: url('/images/ico_smile_blue.png') left 16px center no-repeat;
          }
          &.ico_warning {
            padding-left: 56px;
            background: url('/images/ico_warning_red.png') left 16px center no-repeat;
          }
          .text {
            .date {
              font-size: 12px;
              margin-left: 28px;
            }
          }
        }
      }
    } // info_wrap end
    .section {
      margin-bottom: 50px;
      &.section03 {
        .card_header {
          margin-bottom: 0;
        }
      }

      .screening_wrap {
        display: flex;
        grid-gap: 0;
        height: 343px;
        .screening_section {
          position: relative;
          flex: 1;
          &.send {
            &:after {
              content: '';
              display: block;
              position: absolute;
              top: 30px;
              right: 0;
              z-index: 1;
              width: 1px;
              height: calc(100% - 60px);
              border-right: 1px dashed #e9ebf7;
            }
          }
          .card_layout {
            box-shadow: 0 0 0 0 transparent;
          }
          .invest_board_list {
            .invest_board_item {
              display: flex;
              align-items: center;
              height: 41px;
              border-bottom: 1px solid #e9ebf7;
              .date {
                font-size: 14px;
                font-weight: 300;
                color: #999;
                margin-right: 28px;
              }
              .name_wrap {
                color: #333;
                flex: 1;
                .name {
                  width: 280px;
                  height: 16px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
              .info {
                color: #999;
                font-weight: 300;
                margin-right: 25px;
                width: 78px;
                height: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .badge {
                width: 52px;
                height: 26px;
              }
            }
          } // invest_board_list end
        }
      } // screening_wrap end

      .recommend_invest_wrap {
        position: relative;
        .recommend_invest_section {
          display: flex;
          grid-gap: 20px;
          .carditem03 {
            flex: 1;
            width: 190px;
            height: 260px;
          }
        }
      } // recommand_invest_wrap end

      .latest_message_list {
        .board_header,
        .board_row {
          display: flex;
          flex-wrap: wrap;
          height: 41px;
          align-items: center;
          border-bottom: 1px solid #e8ebf1;
        }
        .board_header {
          //border-bottom: 2px solid ${colors.blue};
          font-weight: 500;
          color: #666666;
          font-size: 12px;
          .board_item {
            &.date {
              text-align: center;
            }
          }
        } // board_header end
        .board_row {
          &:nth-of-type(odd) {
            background: #f9fbfe;
          }
          .board_item {
            font-weight: 400;
            color: #333333;
            &.content {
              text-align: left;
              .board_title {
                display: inline-block;
                max-width: 680px;
                height: 17px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            &.group {
              height: 17px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        } // board_row end
        .board_item {
          text-align: center;
          &.type {
            width: 6%;
          }
          &.content {
            width: 60%;
            .board_title {
            }
          }
          &.user {
            width: 10%;
          }
          &.group {
            width: 16%;
          }
          &.date {
            width: 8%;
            //text-align: right;
          }
        }
      }
    } // section end
  } // container end
`
/* ===================
마이페이지 - 내정보
=================== */
// 마이페이지-내정보
export const mypageInfoStyle = css`
  padding-bottom: 300px;
  .section {
    margin-top: 32px;
    .info_section {
      margin-bottom: 48px;
      &.basic_wrap {
        th,
        td {
          text-align: left;
        }
      } // &basic_wrap end
      .card_header {
        margin-bottom: 0 !important;
      }
      .info_table {
        td {
          background: #fff !important;
        }
      }
      .introduce_text {
        padding: 20px;
        line-height: 1.6;
        white-space: pre-wrap;
      }
    } // info_section end
  } // section end
`

/* ===================
마이페이지 - IR작성
=================== */

// 마이페이지-IR작성 메인
export const mypageIrMainStyle = () => {
  return css`
    padding: 0 0 300px 0;
    .section {
      padding-top: 50px;
      .ir_section_wrap {
        .ir_apply_wrap {
          position: relative;
          width: 551px;
          height: 390px;
          margin: 74px auto 0;
          &:after {
            position: absolute;
            bottom: 162px;
            left: 50%;
            z-index: 1;
            transform: translateX(-50%);
          }
          .ir_apply_inner {
            overflow: hidden;
            width: 100%;
            height: 100%;
            padding-top: 228px;
            border-radius: 6px;
            box-shadow: 1px 1px 8px 2px rgba(0, 0, 0, 0.1);
          }
          &.status01 {
            &:after {
              content: url('/images/img_ir01.png');
            }
            .ir_apply_inner {
              width: 100%;
              background: #f1faea;
            }
          } // &status01 end
          &.status02 {
            background: #e7f2f6;
            &:after {
              content: url('/images/img_ir02.png');
            }
            .ir_apply_inner {
              width: 100%;
              box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.1);
            }
          } // &status02 end

          .ir_apply_cont {
            background: #fff;
            height: 100%;
            padding: 20px;
            .title {
              font-weight: 500;
              font-size: 24px;
              margin-bottom: 10px;
              strong {
                font-weight: 600;
              }
            }
            .info {
              color: #666666;
              font-size: 16px;
              margin-bottom: 30px;
            }
            .btn_group {
              text-align: center;
              .button {
                width: 108px;
                height: 38px;
              }
            }
          } // ir_apply_cont end
        } // ir_apply_wrap end
      }
    }
  `
}

// 마이페이지-IR작성
export const mypageIrStyle = () => {
  return css`
    .container {
      padding: 50px 0 178px 0;
      .section_header {
        border-bottom: 0 none;
        margin-bottom: 8px;
      } // section_header end
      .tab_header {
        position: relative;
        .btn_group {
          position: absolute;
          bottom: 12px;
          right: 0;
          z-index: 1;
          display: flex;
          grid-gap: 6px;
          .button {
            width: 90px;
            height: 38px;
          }
        }
      } // tab_header end
      .ir_section_wrap {
        padding: 30px 0;
      }
    }
  `
}

// IR 기본정보
export const irBasicStyle = css`
  &.ir_write {
    .table {
      td {
        padding-top: 6px;
        padding-bottom: 6px;
      }
    } // table end
    .info_list {
      .info_cell {
        height: 51px !important;
        &.price {
          input {
            text-align: right;
          }
        }
      }
    } // info_list end
  }
  .section {
    margin-bottom: 50px;
    &.section03 {
      overflow: hidden;
      margin-right: -39px;
      .info_area {
        float: left;
        width: 50%;
        padding-right: 39px;
        margin-bottom: 50px;
        .info_header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 38px;
          .info_title {
            margin-bottom: 12px;
          }
          .sub_info {
            font-size: 12px;
            color: #999999;
          }
          .btn_add {
            width: 104px;
            height: 26px;
            font-size: 12px;
            border-radius: 0;
          }
        } // info_header end
        .info_content {
          width: 100%;
          height: 159px;
          .no_result_wrap {
            height: 110px;
            color: #999999;
            font-size: 12px;
          }
          .info_text_box {
            height: inherit;
            background: #f9fbfe;
            border: 1px solid #e9ebf7;
            border-radius: 6px;
            padding: 21px 10px 21px 21px;
            white-space: pre-wrap;
            word-break: keep-all;
            line-height: 1.5;
            .inner {
              width: 100%;
              height: 100%;
              overflow: hidden;
              overflow-y: auto;
            }
          } // info_text_box end
          .info_textarea_box {
            height: inherit;
            background: #fff;
            border: 1px solid #e9ebf7;
            border-radius: 6px;
            padding: 21px 10px 21px 21px;
            white-space: pre-wrap;
            word-break: keep-all;
            line-height: 1.5;
            textarea {
              width: 100%;
              height: 100%;
              resize: none;
              border: 0 none;
              outline: 0 none;
              color: #999;
              &::placeholder {
                color: #999;
              }
            }
          } // info_textarea_box end
          .list_box {
            height: 100%;
            overflow: hidden;
            border-top: 1px solid #e9ebf7;
            border-bottom: 1px solid #e9ebf7;
            .info_list_header {
              height: 40px;
              border-bottom: 1px solid #e9ebf7;
              overflow: hidden;
              color: #666;
              .info_cell {
                justify-content: center;
              }
            } // info_list_header end
            .info_list {
              overflow: hidden;
              max-height: calc(100% - 40px);
              overflow-y: auto;
              .info_row {
                float: left;
                width: 100%;
                overflow: hidden;
                cursor: pointer;
                border-bottom: 1px solid #e9ebf7;
                transition: 0.3s;
                &:hover {
                  background: #f9fbfe;
                }
                .info_cell {
                  font-weight: 500;
                }
              }
            } // info_list end
            .info_cell {
              float: left;
              height: 40px;
              align-items: center;
              display: inline-flex;
              padding: 0 10px;
              &.date {
                width: 30%;
              }
              &.name {
                width: 40%;
              }
              &.price {
                width: 30%;
              }
            } // info_cell end
          } // list_box end
        } // info_content end
        .max_count {
          margin-top: 10px;
          justify-content: flex-end;
        }
      } // info_area end
    } // &section03 end
  }
`
// IR 주요연혁
export const irHistoryStyle = css`
  &.ir_write {
    .history_wrap {
      display: block;
      .history_section {
        padding-top: 0;
        padding-bottom: 0;
        .history_form_list {
          .history_form_item {
            display: flex;
            align-items: center;
            grid-gap: 7px;
            padding: 6px 0;
            border-bottom: 1px solid #e9ebf7;
            .input_wrap {
              grid-gap: 0;
            }
            .date {
              min-width: 170px;
            }
            .content {
              flex: 1;
            }
          } // history_form_item end
        } // history_form_list end
      } //  history_section end
    }
  }
  .info_header {
    position: relative;
    .btn_wrap {
      position: absolute;
      bottom: 10px;
      right: 0;
      z-index: 1;
      .button {
        width: 105px;
        height: 27px;
      }
    }
  } //  info_header end
  .history_wrap {
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr;
    .history_section {
      padding: 21px 20px 20px 0;
      .year {
        color: #00a4ff;
        font-size: 20px;
        margin-bottom: 20px;
        letter-spacing: -0.06em;
      }
      .history_list {
        .history_item {
          position: relative;
          display: flex;
          grid-gap: 32px;
          padding-left: 20px;
          min-height: 40px;
          &:last-of-type {
            &:after {
              display: none;
            }
          }
          &:before {
            content: '';
            display: block;
            width: 10px;
            height: 10px;
            border: 1px solid #00a4ff;
            box-sizing: border-box;
            background: #fff;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            border-radius: 100%;
          }
          &:after {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            left: 5px;
            transform: translateX(-50%);
            z-index: 1;
            width: 1px;
            height: 100%;
            background: #dddddd;
          }
          .date {
            font-weight: 500;
          }
          .content {
            color: #666666;
            max-width: calc(100% - 100px);
            line-height: 1.2;
          }
        } //  history_item end
      } // history_list end
    }
  } //  history_wrap end
`
// IR 주요인력
export const irWorkerStyle = css`
  .worker_list {
    overflow: hidden;
    .worker_item {
      float: left;
      width: 50%;
      height: 199px;
      padding-right: 16px;
      margin-bottom: 20px;
    }
  }
`
// IR 주주현황
export const irStockStyle = css`
  //border: 1px solid red;
`
// IR 채무정보
export const irFinanceStyle = css`
  //border: 1px solid red;
`
// IR 제품/기술/시장
export const irProdTechMraketStyle = css`
  //border: 1px solid red;
`
// IR 성과 및 계획
export const irResultPlans = css`
  //border: 1px solid red;
`

export default {
  mypageCommonStyle,
  mypageMainStyle,
  mypageInfoStyle,
  mypageIrMainStyle,
  mypageIrStyle,
  irBasicStyle,
  irHistoryStyle,
  irWorkerStyle,
  irStockStyle,
  irFinanceStyle,
  irProdTechMraketStyle,
  irResultPlans
}
