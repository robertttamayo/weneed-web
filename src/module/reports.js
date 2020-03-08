import React from "react";

import { ItemPieChart } from "./reports/itempiechart";
import { ItemUsers } from "./reports/itemusers";
import { ItemFrequencyList } from "./reports/itemfrequencylist";
import { Loading } from "./loading";
import { DatePicker, PageHeader, Card, Select, Radio } from "antd";
import { withRouter } from "react-router";

import { endpoints } from "./endpoints";

import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

class Main extends React.Component {
    constructor(props){
        super(props);
        this.onRangeChange = this.onRangeChange.bind(this);
        this.onRangeOK = this.onRangeOK.bind(this);
        this.backToList = this.backToList.bind(this);
        this.fetchReportingData = this.fetchReportingData.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
        this.onSortTypeChange = this.onSortTypeChange.bind(this);

        this.dateFormat = 'YYYY-MM-DD';

        this.state = {
            items_dates: {},
            user_transactions: [],
            distinct_item_count: [],
            earliest_date: null,
            toDate: null,
            chartRenderKey: 0,
            loading: true,
            sortType: 'occurence',
            sort: 'most'
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
                    sort: 'most',
                    sortType: 'occurence',
                });
            } catch (e) {
                console.error(e);
            }
        });
    }
    onSortTypeChange(value) {
        this.setState({
            sortType: value
        });
    }
    onSortChange(event) {
        this.setState({
            sort: event.target.value
        });
    }
    onRangeOK(value) {
        console.log('on okay', value);
    }

    render(){
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
                <PageHeader
                ghost={true}
                onBack={this.backToList}
                title="Reports"
                subTitle="View shopping information"
                >
                    {this.state.earliest_date && (
                        <div className="reports-dates">
                            <h3>Date range: </h3>
                            <RangePicker 
                                key="1"
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
                        </div>
                    )}
                    <div className="reports-options">
                        <h3>Sort by: </h3>
                        <Radio.Group onChange={this.onSortChange} value={this.state.sort}>
                            <Radio value="most">Most</Radio>
                            <Radio value="least">Least</Radio>
                        </Radio.Group>
                        <Select defaultValue="occurence" onChange={this.onSortTypeChange}>
                            <Option value="occurence">Occurring</Option>
                            <Option value="frequency">Frequent</Option>
                            <Option value="recency">Recent</Option>
                        </Select>
                    </div>
                </PageHeader>
                <div className="reports">
                    { this.state.loading ? (
                        <Loading title="Loading Reports..."/>
                    ) : (
                        <>
                            <div className="reports-main">
                                <Card>
                                    <div className="reports-most-frequent">
                                        <h2>
                                            Item {this.state.sortType}:&nbsp;
                                            {this.state.sort} to {this.state.sort == 'most' ? 'least' : 'most'}
                                        </h2>
                                        <ItemFrequencyList 
                                        sort={this.state.sort}
                                        sortType={this.state.sortType}
                                        distinct_item_count={this.state.distinct_item_count}
                                        items_dates={this.state.items_dates}
                                        toDate={this.state.toDate}/>
                                    </div>
                                </Card>
                            </div>
                            <div className="reports-quick">
                                <Card>
                                    <ItemUsers 
                                        user_transactions={this.state.user_transactions}
                                    />
                                </Card>
                                {pieChartData.length > 0 && (
                                    <Card>
                                        <ItemPieChart 
                                            distinct_item_count={pieChartData}
                                        />
                                    </Card>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }
    componentDidMount(){
        console.log('reports did mount');
        this.fetchReportingData();
    }
}

export const Reports = withRouter(Main);