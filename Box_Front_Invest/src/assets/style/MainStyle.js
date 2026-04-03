import { css } from '@emotion/react'

const MainStyle = css`
  background: #e9ebf7;
  .section_title {
    font-size: 30px;
    color: #000;
    font-weight: 500;
    margin-bottom: 20px;
    letter-spacing: -0.03em;
  }
  .main_gallery {
    position: relative;
    height: 900px;
  }
  .section {
    margin-top: 79px;
    .divider_title {
      margin-bottom: 36px;
    }
  }

  .category_list {
    overflow: hidden;
    margin-right: -28px;
  }

  .corp_list {
    overflow: hidden;
    margin-right: -28px;
  }

  .section02 {
    .btn_group {
      margin: 39px 0 0 0;
      text-align: center;
      .button {
        width: 137px;
        height: 38px;
      }
    }
  } // section02

  .section03 {
    .banner_inner {
      display: flex;
      .bannerItem01 {
        flex: 1;
        .button {
          width: 100px;
          height: 38px;
        }
      }
    }
  } // section03

  .section04 {
    position: relative;
    margin: 70px auto 56px auto;
    padding-bottom: 70px;
    text-align: center;
    &:after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      left: 50%;
      z-index: 1;
      transform: translateX(-50%);
      width: 100%;
      height: 1px;
      background: linear-gradient(to left, #e4e6f2, #c3c4ce, #e4e6f2);
    }
    .sub_title {
      text-transform: uppercase;
      font-size: 12px;
      color: #505a6e;
      font-weight: 300;
      letter-spacing: 3px;
      margin-bottom: 20px;
    }
    .number_box_wrap {
      display: flex;
      justify-content: center;
      grid-gap: 30px;
    }
  } // section04

  .section05 {
    .sponsor_box {
      width: 1160px;
      height: 270px;
      margin: 0 auto 82px;
      background: #fff;
      border-radius: 4px;
      display: flex;
      align-items: center;
      .info_wrap {
        width: 408px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .title {
          font-size: 40px;
          font-weight: 600;
          letter-spacing: -0.06em;
          margin-bottom: 15px;
        }
        .info {
          font-size: 16px;
          color: #415172;
          margin-bottom: 30px;
        }
        .button {
          width: 100px;
          height: 38px;
        }
      } // info end
      .company_list {
        flex: 1;
        overflow: hidden;
        .company_item {
          float: left;
          display: flex;
          align-items: center;
          width: 30%;
          margin-right: 1%;
          height: 55px;
          margin-bottom: 20px;
          padding-left: 9%;
          img {
            max-height: 55px;
          }
        }
      } // company_list end
    }
  } // section05 end

  .section06 {
    .slider3 {
      margin-bottom: 43px;
    }
  } // section06 end

  .section07 {
    background: #fff;
    border: 1px solid transparent;
    padding: 110px 0 130px 0;
    margin-top: 0;
    .new_wrap {
      display: flex;
      justify-content: space-between;
      .section_a,
      .section_b {
        flex: 1;
        .section_title {
          margin-bottom: 67px;
        }
      }
      .news_list {
        .news_item01 {
          margin-bottom: 15px;
        }
        .news_item02 {
          margin-bottom: 21px;
        }
      }
    } // news_wrap end
  } // section07 end
`

export default MainStyle
