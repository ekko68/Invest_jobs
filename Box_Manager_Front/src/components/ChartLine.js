import React from "react";
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";

const ChartLine = (props) => {

  const {lineSet = []} = props;

  let chartConfig = {
    datasetIdKey: 'period',
    data: {
      labels: lineSet && lineSet.length && lineSet.map((el) => el.dt),
      datasets: [
        {
          data: lineSet && lineSet.length && lineSet.map((el) => Number(el.cnt)),
          fill: false,
          borderColor: "#C7C9CD",
          borderWidth: 2,
          pointBorderWidth: 5,
          pointBorderColor: "#76CDE6"
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
