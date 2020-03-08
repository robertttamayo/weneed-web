import React from "react";

import { ItemPieChart } from "./reports/itempiechart";
import { ItemLineChart } from "./reports/itemlinechart";
import { ItemUsers } from "./reports/itemusers";
import { ItemFrequencyList } from "./reports/itemfrequencylist";
import { Loading } from "./loading";
import { DatePicker } from "antd";
import { withRouter } from "react-router";

import { endpoints } from "./endpoints";

import moment from 'moment';

const { RangePicker } = DatePicker;
class Main extends React.Component {
    constructor(props){
        super(props);
        this.onRangeChange = this.onRangeChange.bind(this);
        this.onRangeOK = this.onRangeOK.bind(this);
        this.backToList = this.backToList.bind(this);
        this.fetchReportingData = this.fetchReportingData.bind(this);

        this.dateFormat = 'YYYY-MM-DD';

        this.state = {
            items_dates: {},
            user_transactions: [],
            distinct_item_count: [],
            earliest_date: null,
            toDate: null,
            chartRenderKey: 0,
            loading: true,
        }
    }
    backToList(){
        this.props.history.push('/');
    }
    onRangeChange(value, dateString) {
        console.log(dateString);
        this.setState({
            loading: true,
            toDate: dateString[1]
        });
        this.fetchReportingData(dateString[0], dateString[1]);
    }
    fetchReportingData(fromDate, toDate){
        let data = {
            account_id: this.props.user.user_account_id,
            action: 'reporting',
            from_date: fromDate || '',
            to_date: toDate || '',
        }
        $.ajax(endpoints.main, {
            method: 'POST',
            data
        }).then((results) => {
            try {
                let data = JSON.parse(results);
                const { items_dates, user_transactions, distinct_item_count, earliest_date } = data;
                this.setState({
                    items_dates,
                    user_transactions,
                    distinct_item_count,
                    earliest_date,
                    loading: false,
                });
            } catch (e) {
                console.error(e);
            }
        });
    }
    onRangeOK(value) {
        console.log('on okay', value);
    }

    render(){
        if (this.state.loading) {
            return (
                <Loading title="Loading Reports..."/>
            );
        } else {
            const pieChartData = this.state.distinct_item_count.filter((item, index) => {
                    return index < 10; // top 10 items only
                })
                .map(item => {
                    return {
                        name: item.item_name,
                        value: parseInt(item.item_count)
                    }
                });
            return (
                <div className="reporting wide-container">
                    <h1>Reports</h1>
                    <div className="reports-date-filter">
                        {this.state.earliest_date && (
                            <RangePicker 
                                defaultValue={[moment(this.state.earliest_date, this.dateFormat), moment(new Date())]}
                                onChange={this.onRangeChange}
                                onOk={this.onRangeOk}
                                ranges={{
                                    All: [moment(this.state.earliest_date, this.dateFormat), moment()],
                                    'Last Month': [moment().subtract('1', 'month'), moment()],
                                    'Last 3 Months': [
                                        moment().subtract('3', 'months'),
                                        moment()
                                    ],
                                    'Last 1 Year': [
                                        moment().subtract('1', 'year'),
                                        moment()
                                    ],
                                }}
                            />
                        )}
                    </div>
                    <div className="reports">
                        <div className="reports-main">
                            <div className="reports-most-frequent">
                                <h2>Most frequent items</h2>
                                <ItemFrequencyList 
                                distinct_item_count={this.state.distinct_item_count}
                                items_dates={this.state.items_dates}
                                toDate={this.state.toDate}/>
                            </div>
                        </div>
                        <div className="reports-quick">
                            <ItemLineChart 
                                distinct_item_count={this.state.distinct_item_count}
                            />

                            {pieChartData.length > 0 && (
                                <ItemPieChart 
                                    distinct_item_count={pieChartData}
                                />
                            )}

                            <ItemUsers />
                        </div>
                    </div>
                </div>
            )
        }
    }
    componentDidMount(){
        console.log('reports did mount');
        this.fetchReportingData();
    }
}

export const Reports = withRouter(Main);