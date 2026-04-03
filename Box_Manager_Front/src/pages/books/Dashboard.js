import React, { useEffect, useState } from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import ko from 'date-fns/locale/ko'

//modules
import {getDashboardCount, getDashboardJoined} from "modules/consts/BooksApi";

//components
import PageLayout from 'components/PageLayout'
import ChartDoughnut from "components/ChartDoughnut";
import ChartLine from "components/ChartLine";

//const
const periodJoinInit = {
  stDt: moment().subtract(-1, 'm').format("YYYYMMDD"), //조회 시작일
  enDt : moment().format("YYYYMMDD") //조회 종료일 "20240519"
}

const Dashboard = () => {

  const [countData, setCountData] = useState({});
  const [chartData, setChartData] = useState({});
  const [periodJoin, setPeriodJoin] = useState(periodJoinInit);

  useEffect(async () => {
    //유형별 가입자 수
    let resCount = await getDashboardCount();
    if(resCount?.data.code === "200") setCountData(resCount.data.data);
  }, [])

  useEffect(async () => {
    //기간별 가입자 수
    let resJoined = await getDashboardJoined(periodJoin);
    if(resJoined?.data.code === "200") setChartData(resJoined.data.data?.list);
  }, [periodJoin])

  const convertNumber = (num) => {
    if(num != undefined || num != null){
      return num.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
    } else {
      return 0
    }
  }

  return (
    <PageLayout currentMenu={'dashboard'} currentCate={'dashboardBooks'}>
      <div className='content_inner books_dashboard'>
        <div className='page_header'>
          <h4 className='page_title'>장부(수금)관리 BOX </h4>
        </div>
        <div className='dashboard_list'>
          <div className='dashboard_item'>
            <p className='dashboard_title'>서비스 가입 수</p>
            <div className='number'>{convertNumber(countData?.userCnt)} <span className='case'>건</span></div>
          </div>
          <div className='dashboard_item'>
            <p className='dashboard_title'>최근 1달 가입 수</p>
            <div className='number'>{convertNumber(countData?.recentUserCnt)} <span className='case'>건</span></div>
          </div>
          <div className='dashboard_item'>
            <p className='dashboard_title'>총 등록 장부(거래)명세서</p>
            <div className='number'>{convertNumber(countData?.booksCnt)} <span className='case'>건</span></div>
          </div>
          <div className='dashboard_item'>
            <p className='dashboard_title'>최근 1달 등록 장부(거래)명세서</p>
            <div className='number'>{convertNumber(countData?.recentBooksCnt)} <span className='case'>건</span></div>
          </div>
          <div className='dashboard_item'>
            <p className='dashboard_title'>총 미수금 건</p>
            <div className='number'>{convertNumber(countData?.receivableCnt)} <span className='case'>건</span></div>
          </div>
          <div className='dashboard_item'>
            <p className='dashboard_title'>총 미수금액</p>
            <div className='number'>{convertNumber(countData?.receivableAmt)} <span className='case'>원</span></div>
          </div>
          <div className='dashboard_item'>
            <p className='dashboard_title'>추심신청 건 (접수완료)</p>
            <div className='number'>{convertNumber(countData?.collectionCnt)} <span className='case'>건</span></div>
          </div>
          <div className='dashboard_item'>
            <p className='dashboard_title'>매출채권보험 상담신청</p>
            <div className='number'>{convertNumber(countData?.insuranceCnt)} <span className='case'>건</span></div>
          </div>
        </div>

        <div className='chart_list'>
          <ChartDoughnut type={"amount"} title={"수금 현황"}
                         doughnutSet={[
                           {id: "receivedCnt", label: "수금", value: countData.receivedCnt},
                           {id: "receivableCnt", label: "미수금", value: countData.receivableCnt}
                         ]} />
          <ChartDoughnut type={"joinYn"} title={"서비스 가입 여부"}
                         doughnutSet={[
                           {id: "userCnt", label: "가입", value: countData.userCnt},
                           {id: "nonUserCnt", label: "미가입", value: countData.nonUserCnt}
                         ]} />
          <ChartDoughnut type={"joinType"} title={"서비스 가입 유형"}
                         doughnutSet={[
                           {id: "certCnt", label: "공동인증서 등록", value: countData.certCnt},
                           {id: "nonCertCnt", label: "공동인증서 미등록", value: countData.nonCertCnt}
                         ]} />
        </div>

        <div className='member_chart'>
          <div className='member_chart_header'>
            <p className='member_chart_title'>기간별 가입자 수</p>
            <div className='date_input_wrap'>
              <div className="date_inputs">
                <DatePicker
                  title={'기간조회'}
                  locale={ko}
                  selected={moment(periodJoin?.stDt, "YYYYMMDD").toDate()}
                  dateFormat={'yyyy-MM-dd'}
                  maxDate={moment(periodJoin?.enDt, "YYYYMMDD").toDate()}
                  onChange={(currentDate) => {
                    setPeriodJoin({...periodJoin, stDt: moment(currentDate).format("YYYYMMDD")})
                  }}
                />
                <span>~</span>
                <DatePicker
                  title={'기간조회'}
                  locale={ko}
                  selected={moment(periodJoin?.enDt, "YYYYMMDD").toDate()}
                  dateFormat={'yyyy-MM-dd'}
                  minDate={moment(periodJoin?.stDt, "YYYYMMDD").toDate()}
                  onChange={(currentDate) => {
                    setPeriodJoin({...periodJoin, enDt: moment(currentDate).format("YYYYMMDD")})
                  }}
                />
              </div>
            </div>
          </div>
          <div className='member_chart_box'>
            <div className={"legend"}>
              <div className={"color"} style={{backgroundColor: "#76CDE6"}} />
              <div className={"label"}>가입자 수</div>
            </div>
            <ChartLine lineSet={chartData} />
          </div>
        </div>
      </div>
    </PageLayout>
    )
}

export default Dashboard
