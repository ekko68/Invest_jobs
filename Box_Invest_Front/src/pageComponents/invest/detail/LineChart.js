import React, {useState, useEffect} from 'react'
import {CategoryScale, BarElement} from 'chart.js'
import {Line} from 'react-chartjs-2'
import Chart from 'chart.js/auto'

Chart.register(CategoryScale, BarElement)

const BarChart = () => {
    const [totalInvestExecutionData, setTotalInvestExecutionData] = useState({labels: [], data: []})

    const actTotalInvestExecutionData = () => {
        return new Promise((resolve, reject) => {
            window.setTimeout(() => {
                resolve({
                    labels: ['7월', '8월', '9월', '10월', '11월', '12월'],
                    data: [63, 12, 36, 67, 47, 8]
                })
            }, 100)
        })
    }

    useEffect(() => {
        actTotalInvestExecutionData().then((data) => setTotalInvestExecutionData(data))
    }, [])

    return (
        <div className="execution">
            <h3 className="section_title bold">{`총 투자 집행(${233}건)`}</h3>
            <div className="line_graph">
                {/*이미지 지워주시고 이부분에 그래프 넣어주세요.*/}
                {/*<img src="/images/tmp/invest_line_graph.png" alt="" />*/}
                <div>
                    <Line
                        width={400}
                        height={400}
                        data={{
                            labels: totalInvestExecutionData.labels || [],
                            datasets: [
                                {
                                    label: '총 투자 집행',
                                    data: totalInvestExecutionData.data || [],
                                    backgroundColor: [
                                        'rgb(49, 180, 242, 1)',
                                        'rgb(0, 0, 255, 1)',
                                        'rgb(2, 84, 146, 1)',
                                        'rgb(248, 207, 64, 1)',
                                        'rgb(5, 224, 233, 1)',
                                        'rgb(255, 39, 104, 1)'
                                    ],
                                    borderColor: [
                                        'rgb(49, 180, 242, 1)',
                                        'rgb(0, 0, 255, 1)',
                                        'rgb(2, 84, 146, 1)',
                                        'rgb(248, 207, 64, 1)',
                                        'rgb(5, 224, 233, 1)',
                                        'rgb(255, 39, 104, 1)'
                                    ],
                                    borderWidth: 7
                                }
                            ]
                        }}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                legend: {
                                    display: false
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default BarChart
