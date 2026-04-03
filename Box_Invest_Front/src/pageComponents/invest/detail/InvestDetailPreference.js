import React, {forwardRef} from 'react'
import PieChart from 'pageComponents/invest/detail/PieChart'
import CardLayout from 'components/common/card/CardLayout'

const InvestDetailPreference = forwardRef((props, ref) => {
    const {chartData} = props;
    return (
        <CardLayout>
            <div className="invest_type">
                <p className="basic_bold">선호 투자 유형</p>
                <div className="pie_graph">
                    <PieChart chartData={chartData}/>
                </div>
            </div>
        </CardLayout>
    )
});
export default InvestDetailPreference;
