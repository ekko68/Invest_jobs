/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
export const consultMainStyle = css`
  .page_container {
    padding-top: 0;
    .wrap {
      /*padding-top: 78px;*/
      .main {
        // height: 1209px;
        height: 1280px;
        background: url('/images/img_main_consult.png') center center / cover no-repeat;
        .main_container {
          max-width: 1920px;
          height: 100%;
          margin: 0 auto;
          padding-top: 243px;
          .container_inner {
            max-width: 1464px;
            width: 100%;
            margin: 0 auto;
            .tit_wrap {
              margin-bottom: 202px;
              & .big_tit {
                font-size: 60px;
                line-height: 80px;
                letter-spacing: -0.025em;
                color: #fff;
                margin-bottom: 25px;
              }
              & .small_tit {
                font-size: 18px;
                line-height: 20px;
                color: #ababab;
                margin-bottom: 40px;
              }
              & .commission_btn {
                width: 200px;
                height: 60px;
                font-size: 20px;
              }
            }
            .card_wrap {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              grid-gap: 17px;
              .card {
                max-width: 350px;
                // height: 350px;
                height: 470px;
                border-radius: 10px;
                padding: 170px 36px 48px 36px;
                &.ico01 {
                  background: rgba(18, 24, 38, 0.67) url('/images/ico_trophy.png') left 41px top 48px no-repeat;
                }
                &.ico02 {
                  background: rgba(18, 24, 38, 0.67) url('/images/ico_book.png') left 36px top 59px no-repeat;
                }
                &.ico03 {
                  background: rgba(18, 24, 38, 0.67) url('/images/ico_twinkle.png') left 35px top 53px no-repeat;
                }
                &.ico04 {
                  background: rgba(18, 24, 38, 0.67) url('/images/ico_order.png') left 34px top 57px no-repeat;
                }
                //& .ico_area {
                //  height: 121px;
                //}

                & .card_tit {
                  font-size: 24px;
                  color: #fff;
                  margin-bottom: 22px;
                }
                & .card_cnt {
                  // font-size: 16px;
                  font-size: 15px;
                  line-height: 32px;
                  color: #939bad;
                  word-break: break-all;
                  display: -webkit-box;
                  overflow: hidden;
                  white-space: normal;
                  // -webkit-line-clamp: 3;
                  -webkit-line-clamp: 7;
                  -webkit-box-orient: vertical;
                }
              }
              /*card end*/
            }
            /*card_wrap end*/
          } // container_inner end
        }
        /*container end*/
      }
      /*main end*/

      .sub_main {
        height: 1025px;
        .sub_container {
          width: 1920px;
          height: 100%;
          margin: 0 auto;
          padding: 187px 230px 0;
          display: flex;
          /*align-items: center;*/
          justify-content: space-between;
          .txt_section {
            width: 680px;
            .txt_wrap {
              margin: 7px 0 98px;
              & .txt01 {
                font-size: 30px;
                letter-spacing: -0.025em;
                color: #696969;
                margin-bottom: 15px;
              }
              & .txt02 {
                font-size: 60px;
                line-height: 80px;
                letter-spacing: -0.025em;
                margin-bottom: 30px;
              }
              & .txt03 {
                font-family: 'Noto Sans KR', sans-serif !important;
                font-size: 16px;
                line-height: 30px;
                color: #4b4b4b;
                word-break: keep-all;
                display: -webkit-box;
                overflow: hidden;
                white-space: normal;
                // -webkit-line-clamp: 4;
                -webkit-line-clamp: 7;
                -webkit-box-orient: vertical;
              }
            }
          }
          .img_section {
            width: 721px;
            height: 637px;
            border-radius: 10px;
            overflow: hidden;
            img {
              width: 100%;
            }
          }
        }
      }
    }
    /*wrap bg end*/
  }
  /*page_container end*/
`

export default {
  consultMainStyle
}
