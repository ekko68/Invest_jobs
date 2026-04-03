import React from "react";
import Chart from 'chart.js/auto';
import { Doughnut } from "react-chartjs-2";

//const
const typeColors = {
  amount: ["#3966FB", "#DF5697"],
  joinYn: ["#9FCB77", "#F2CB72"],
  joinType: ["#8E76D4", "#E4D4FD"],
}

const ChartDoughnut = (props) => {

  const {type = "", title = "", doughnutSet = []} = props;

  let chartConfig = {
    datasetIdKey: type,
    data: {
      labels: doughnutSet && doughnutSet.length && doughnutSet.map((el) => el.label),
      datasets: [
        {
          data: doughnutSet && doughnutSet.length && doughnutSet.map((el) => el.value),
          backgroundColor: typeColors[type]
        },
      ],
    },
    options: {
      animation: { // 차트 애니메이션 사용시간
        duration: 1500,
      },
      layout: { //지정된 레이아웃 영역에 대한 값 조정
        padding: 0
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      }
    }
  };

  return (
    <div className='chart_item'>
      <p className='chart_title'>{title}</p>
      <div className="chart_box">
        <div className='doughnut'>
          <Doughnut data={chartConfig.data} options={chartConfig.options} />
        </div>
        <div className='legend'>
          {
            doughnutSet && doughnutSet.length && doughnutSet.map((item, index) => (
              <div className="legendItem" key={item.id}>
                <div className={"color"} style={{backgroundColor: typeColors[type]?.[index]}} />
                <div className={"label"}>{item.label}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ChartDoughnut
