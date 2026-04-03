import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react'
import {Bar} from 'react-chartjs-2'
import DateUtils from 'modules/utils/DateUtils'
import {FormatUtils} from "modules/utils/StringUtils";
import {isNumber} from "modules/utils/NumberUtils";

const InvestDetailExecChart = forwardRef((props, ref) => {
    const [chartData, setChartData] = useState({labels: [], data: []})
    const [invmPrfrCnt, setInvmPrfrCnt] = useState(0)
    useEffect(() => {
    }, [])
    useImperativeHandle(ref, () => ({
        setData
    }))
    const setData = (temp, tempInvmPrfrCnt) => {
        setInvmPrfrCnt(tempInvmPrfrCnt)
        let labels = []
        let data = []
        if (temp.length > 0) {
            const yearArr = [];

            for (let item of temp) {
                const invmPrfrYmSplit =
                    DateUtils.customDateFormat(
                        item['invmPrfrYm'], 'yyyy,MM', 'en', false, {month: 'short'}).split(',');

                const year = invmPrfrYmSplit[0];
                const mon = invmPrfrYmSplit[1];

                let result = '';

                const yearIdx = yearArr.findIndex(e => e == year);
                if (yearIdx > -1) {
                    result = mon;
                } else {
                    yearArr.push(year);
                    result = [mon, year];
                }

                labels.push(result);

                const invmAmt = item['invmAmt']
                data.push(invmAmt)
            }
        }
        setChartData({labels: labels, data: data})
    }
    return (
        <div className="execution">
            {/*<span className="main_writing">※ 금월 직전 12개월 간 데이터이며 비공개 투자건은 제외한 수치 입니다.</span>*/}
            {/*<span className="main_writing">※ 12개월 간 데이터이며 비공개 투자건은 제외한 수치 입니다.</span>*/}
            <span className="main_writing">※ 직전 12개월 간 데이터이며 비공개 투자건은 제외한 수치 입니다.</span>
            <h3 className="section_title bold">{`총 투자 집행(${invmPrfrCnt}건)`}</h3>
            <div className="line_graph">
                <div>
                    <Bar
                        width={400}
                        height={400}
                        data={{
                            labels: chartData.labels || [],
                            datasets: [
                                {
                                    label: '총 투자 집행',
                                    data: chartData.data || [],
                                    backgroundColor:
                                        [
                                            // 'rgb(225, 225, 225, 1)',
                                            // 'rgb(100, 105, 180, 1)',
                                            // 'rgb(0, 0, 255, 1)',
                                            'rgb(2, 84, 146, 1)',
                                            // 'rgb(248, 207, 64, 1)',
                                            // 'rgb(5, 224, 233, 1)',
                                            // 'rgb(255, 39, 104, 1)'
                                        ],
                                    borderColor:
                                        [
                                            // 'rgb(225, 225, 225, 1)',
                                            // 'rgb(100, 105, 180, 1)',
                                            // 'rgb(0, 0, 255, 1)',
                                            'rgb(2, 84, 146, 1)',
                                            // 'rgb(248, 207, 64, 1)',
                                            // 'rgb(5, 224, 233, 1)',
                                            // 'rgb(255, 39, 104, 1)'
                                        ],
                                    borderWidth: 1,

                                }
                            ]
                        }}
                        options={{
                            // 그래프 사용자 정의 크기 설정
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    // beginAtZero: true
                                    ticks: {
                                        callback: function (label, index, labels) {
                                            const divided = (label / (1000000));

                                            if (divided > 1) return FormatUtils.numberWithCommas.format(divided) + " M";
                                            else return FormatUtils.numberWithCommas.format(label);
                                        }
                                    }
                                },
                                x: {
                                    grid: {
                                        display: false
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    display: false
                                },
                                datalabels: {
                                    display: false,
                                    // display: true,
                                    align: "top",
                                    anchor: "end",
                                    formatter: function (value, context) {
                                        const dataNumber = isNumber(context.dataset.data[context.dataIndex])
                                            ? context.dataset.data[context.dataIndex] : 0;
                                        return FormatUtils.numberWithCommas.format(dataNumber);
                                    }
                                }
                            },
                            animation: {
                                duration: 0, // 애니메이션 삭제
                            },
                            maxBarThickness: 15,
                        }}
                    />
                </div>
            </div>
        </div>
    )
});

export default InvestDetailExecChart;
