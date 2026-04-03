import PageLayout from 'components/PageLayout'
import React, {useEffect, useState, useRef} from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import ko from 'date-fns/locale/ko'

//modules
import {getDashboardTodayCount, getDashboardPeriod, getDashboardUser} from "modules/consts/MainApi";

//components
import Select from 'components/atomic/Select'
import NoResult from 'components/NoResult'
import ChartLine from "pages/main/ChartLine";
import PopupAlert from 'components/PopupAlert'

//const
const userInit = {
  stDt: moment().subtract(1, 'M').format("YYYYMMDD"), //조회 시작일
  enDt : moment().format("YYYYMMDD") //조회 종료일 "20240519"
}
const periodInit = {
  type: "day", //day or month
  year: moment().year(),
  month: Number(moment().format("M"))
}
const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

const Dashboard = () => {

  const dayRef = useRef(null);
  const yearRef = useRef(null);
  const monthRef = useRef(null);

  const [userParam, setUserParam] = useState(userInit); //사용자 현황 통계 차트 파라미터
  const [periodParam, setPeriodParam] = useState(periodInit); //기간별 분석 테이블 파라미터

  const [countData, setCountData] = useState({}); //통계
  const [userData, setUserData] = useState({}); //사용자 현황 통계 차트
  const [periodData, setPeriodData] = useState([]); //기간별 분석 테이블

  const [popup, setPopup] = useState({active: false, type: null});
  const [filterDate, setFilterData] = useState({
    active: "day",
    list: [
      { id: 'day', value: 'day', label: '일자별 요약' },
      { id: 'month', value: 'month', label: '월별 요약'}
    ]
  });
  const [filterYear, setFilterYear] = useState({
    active: "",
    list: []
  })
  const [filterMonth, setFilterMonth] = useState({
    active: "",
    list: []
  })


  useEffect(() => {
    //서비스 통계
    apiGetTodayCount();

    //필터 셋팅
    const nowYear = moment().year();
    const optionYearList = [];
    for(var year = 0; year < 10; year++) {
      var optionYearItem = {
        id: year + nowYear,
        value: year + nowYear,
        label: year + nowYear
      }
      optionYearList.push(optionYearItem);
    }

    setFilterYear({
      active: optionYearList[0].id,
      list: optionYearList
    })

    const nowMonth = Number(moment().format("M"));
    const optionMonthList = [];
    for(var month = 0; month < 12; month++) {
      var optionMonthItem = {
        id: month + 1,
        value: month + 1,
        label: `${month +1}월`
      }
      optionMonthList.push(optionMonthItem);
    }

    setFilterMonth({
      active: nowMonth,
      list: optionMonthList
    })

  }, [])


  useEffect(async () => {
    //사용자 현황 통계 차트
    let resUser = await getDashboardUser(userParam);
    if(resUser?.data.code === "200") setUserData(resUser.data.data?.list);
    else setPopup({active: true, type: "error"});
  }, [userParam])

  useEffect(async () => {
    //기간별 분석 테이블
    let params = periodParam;
    params["month"] = Number(periodParam.month) < 10 ? `0${Number(periodParam.month)}` : periodParam.month
    let resTable = await getDashboardPeriod(periodParam);
    if(resTable?.data.code === "200") setPeriodData(resTable.data.data?.list);
    else setPopup({active: true, type: "error"});
  }, [periodParam])

  const apiGetTodayCount = async () => {
    //서비스 통계
    let resCount = await getDashboardTodayCount();
    if(resCount?.data.code === "200") setCountData(resCount.data.data);
    else setPopup({active: true, type: "error"});
  }

  const convertNumber = (num) => {
    if(num != undefined || num != null){
      return num.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
    } else {
      return 0
    }
  }

  const onFilterActive = (type, selected) => {
    if (selected) {
      switch (type) {
        case "DATE":
          setFilterData({
            ...filterDate,
            active: selected
          })

          if(selected === "month"){
            var targetYear = moment().year();
            var targetMonth = Number(moment().format("M"));

            setPeriodParam({
              ...periodParam,
              type: selected,
              year: targetYear,
              month: targetMonth
            })

            setFilterYear({
              ...filterYear,
              active: targetYear
            })

            setFilterMonth({
              ...filterMonth,
              active: targetMonth
            })

          } else {
            setPeriodParam({
              ...periodParam,
              type: selected,
            })
          }

          break;
        case "YEAR":
          setFilterYear({
            ...filterYear,
            active: selected
          })
          setPeriodParam({
            ...periodParam,
            year: selected
          })
          break;
        case "MONTH":
          setFilterMonth({
            ...filterMonth,
            active: selected
          })
          setPeriodParam({
            ...periodParam,
            month: selected
          })
          break;
        default:
          return;
      }
    }
  }


  return (
    <PageLayout currentMenu={'dashboard'} currentCate={'dashboardMain'}>

      {popup.active && popup.type === "error" && (
        <PopupAlert msg={'오류가 발생했습니다.'}
                    handlePopup={() => setPopup({active: false, type: null})} />
      )}

      <div className='content_inner main_dashboard'>
        <div className='page_header'>
          <h4 className='page_title'>메인BOX 사용자 통계</h4>
        </div>
        <div className='card_list_wrap'>
          <div className='card_list_header'>
            <div className='card_list_title'>
              {moment().format("YYYY년 MM월 DD 일")}
            </div>
            <button className={'btn_refresh'} title={'새로고침'} onClick={apiGetTodayCount}>
              <span className="hide">새로고침</span>
            </button>
          </div>
          <div className='card_list'>
            <div className='card_item'>
              <p className='card_title'>서비스 방문자 수</p>
              <div className='number'>{convertNumber(countData?.visitUserCnt) || 0} <span className='case'>명</span></div>
            </div>
            <div className='card_item'>
              <p className='card_title'>서비스 가입 수</p>
              <div className='number'>{convertNumber(countData?.joinUserCnt) || 0} <span className='case'>건</span></div>
            </div>
            <div className='card_item'>
              <p className='card_title'>누적 정회원 인증 회원사 수</p>
              <div className='number'>{convertNumber(countData?.admUserCnt) || 0} <span className='case'>개</span></div>
            </div>
            <div className='card_item'>
              <p className='card_title'>누적 CEO 인증 회원사 수</p>
              <div className='number'>{convertNumber(countData?.ceoUserCnt) || 0} <span className='case'>개</span></div>
            </div>
          </div>
        </div>

        <div className='card_list_wrap'>
          <div className='card_list_header'>
            <div className='card_list_title'>사용자 현황 통계</div>
            <div className='date_input_wrap'>
              <div className="date_inputs">
                <DatePicker
                  title={'기간조회'}
                  locale={ko}
                  selected={moment(userParam.stDt, "YYYYMMDD").toDate()}
                  dateFormat={'yyyy-MM-dd'}
                  maxDate={moment(userParam?.enDt, "YYYYMMDD").toDate()}
                  onChange={(currentDate) => {
                    setUserParam({...userParam, stDt: moment(currentDate).format("YYYYMMDD")})
                  }}
                />
                <span>~</span>
                <DatePicker
                  title={'기간조회'}
                  locale={ko}
                  selected={moment(userParam?.enDt, "YYYYMMDD").toDate()}
                  dateFormat={'yyyy-MM-dd'}
                  minDate={moment(userParam?.stDt, "YYYYMMDD").toDate()}
                  onChange={(currentDate) => {
                    setUserParam({...userParam, enDt: moment(currentDate).format("YYYYMMDD")})
                  }}
                />
              </div>
            </div>
          </div>
          <div className='user_box' style={{height: 'auto'}}>
            <div className={"legend"}>
              <div className={"color"} style={{backgroundColor: "#172277"}} />
              <div className={"label"} style={{marginRight: 15}}>방문자 수</div>
              <div className={"color"} style={{backgroundColor: "#A1AAEB"}} />
              <div className={"label"}>가입자 수</div>
            </div>
            <ChartLine lineSet={userData} />
          </div>
        </div>

        <div className='card_list_wrap'>
          <div className='card_list_header'>
            <div className='card_list_title'>기간별 분석</div>
            <div className='select_list_wrap'>
              <Select ref={dayRef} optionList={filterDate} handleSelectActive={(selected) => onFilterActive("DATE", selected)} />
              {
                periodParam.type === "day" && filterYear.active && (
                  <Select ref={yearRef} optionList={filterYear} handleSelectActive={(selected) => onFilterActive("YEAR", selected)} />
                )
              }
              {
                periodParam.type === "day" && filterMonth.active && (
                  <Select ref={monthRef} optionList={filterMonth} handleSelectActive={(selected) => onFilterActive("MONTH", selected)} />
                )
              }
            </div>
          </div>
          <div className="section">
            <div className="table_over_width">
              <div className="table_wrap border_bottom_none table_th_border">
                {
                  periodData && periodData.length > 0 ? (
                    <table className="table type02">
                      <caption>기간별 분석 테이블</caption>
                      <colgroup>
                        <col width={'20%'} />
                        <col width={'20%'} />
                        <col width={'20%'} />
                        <col width={'20%'} />
                        <col width={'20%'} />
                      </colgroup>
                      <thead>
                      <tr>
                        <th>일자</th>
                        <th>방문자</th>
                        <th>가입</th>
                        <th>정회원 인증</th>
                        <th>CEO 인증</th>
                      </tr>
                      </thead>
                      <tbody>
                        {
                          periodData.map((item, index) => (
                            <tr key={index}>
                              <td>
                                {
                                  periodParam.type === "month" ? (
                                    `${moment(item.dt).format("YYYY-MM")}`
                                  ) : (
                                    `${moment(item.dt).format("YYYY-MM-DD")} (${dayLabels[moment(item.dt).day()]})`
                                  )
                                }
                              </td>
                              <td>{convertNumber(item?.visitUserCnt) || 0}</td>
                              <td>{convertNumber(item?.joinUserCnt) || 0}</td>
                              <td>{convertNumber(item?.admUserCnt) || 0}</td>
                              <td>{convertNumber(item?.ceoUserCnt) || 0}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  ) : (
                    <div className="table_no_result">
                      <NoResult msg={"기간별 분석 데이터가 없습니다."} />
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
    )
}

export default Dashboard
