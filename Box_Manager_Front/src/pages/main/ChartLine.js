import React from "react";
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";
import moment from "moment";

const ChartLine = (props) => {

  const {lineSet = []} = props;

  let chartConfig = {
    datasetIdKey: 'user',
    data: {
      labels: lineSet && lineSet.length && lineSet.map((el) => moment(el.dt).format("YY.MM.DD")),
      datasets: [
        { //방문자수
          data: lineSet && lineSet.length && lineSet.map((el) => Number(el.visitUserCnt)),
          fill: false,
          borderColor: "#172277",
          borderWidth: 2,
          pointBorderWidth: 5,
          pointBorderColor: "#172277"
        },
        { //가입자수
          data: lineSet && lineSet.length && lineSet.map((el) => Number(el.joinUserCnt)),
          fill: false,
          borderColor: "#A1AAEB",
          borderWidth: 2,
          pointBorderWidth: 5,
          pointBorderColor: "#A1AAEB"
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          grid: {
            display: false
          },
        }
      }
    }
  };

  return (
    <Line data={chartConfig.data} options={chartConfig.options} />
  )
}

export default ChartLine
