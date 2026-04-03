import React, {useEffect, useState} from 'react'
import {registerables} from 'chart.js'
import {Pie} from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import ChartColors from 'modules/utils/ChartColors'
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

const PieChart = (chartData) => {
    const [investmentPreferredTypeData, setInvestmentPreferredTypeData] = useState({labels: [], data: []})
    const chartColor = ChartColors.getColors()

    const actInvestmentPreferredTypeData = async (labels, datas) => {
        if (labels && datas) {
            return new Promise((resolve, reject) => {
                window.setTimeout(() => {
                    resolve({
                        labels: labels,
                        data: datas
                    })
                }, 100)
            })
        }
    }

    useEffect(async () => {
        if (chartData) {
            let d1 = []
            let d2 = []
            if (chartData?.chartData) {
                chartData?.chartData?.map(data => d1.push(data.pfrcInvmFildNm)); // setLegend
                chartData?.chartData?.map(data => d2.push(data.pfrcInvmFildPercent)); // setData
                actInvestmentPreferredTypeData(d1, d2).then((data) => {
                    setInvestmentPreferredTypeData(data)
                })
            }
        }
    }, [chartData])


    return (
        <>
            <div>
                <Pie
                    width={400}
                    height={400}
                    data={{
                        labels: investmentPreferredTypeData.labels || [],
                        datasets: [
                            {
                                label: '선호 투자 유형',
                                data: investmentPreferredTypeData.data || [],
                                backgroundColor: chartColor,
                                borderWidth: 0
                            }
                        ]
                    }}
                    options={{
                        responsive: true,
                        layout: {
                            margin: {
                                bottom: 50
                            }
                        },
                        plugins: {
                            datalabels: {
                                formatter: (value, ctx) => {
                                    let datasets = ctx.chart.data.datasets;
                                    if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
                                        let sum = datasets[0].data.reduce((a, b) => a + b, 0);
                                        let percentage = Math.round((value / sum) * 100) + "%";
                                        return percentage;
                                    } else {
                                        return percentage;
                                    }
                                },
                                color: "white",
                                font: {
                                    size: 14
                                },
                                layout: {
                                    padding: 50
                                },
                                anchor: 'center'

                            },
                            legend: {
                                display: true,
                                position: 'bottom',
                                marginBottom: 10
                            }
                        },
                        animation : {
                            duration: 0 // 애니메이션 삭제
                        }
                    }}
                />
            </div>
        </>
    )
}

export default PieChart
