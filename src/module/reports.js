import React from "react";

import { ItemPieChart } from "./reports/itempiechart";
import { ItemUsers } from "./reports/itemusers";
import { ItemFrequencyList } from "./reports/itemfrequencylist";
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

        this.dateFormat = 'YYYY-MM-DD';

        this.state = {
            items_dates: {},
            user_transactions: [],
            distinct_item_count: [],
            earliest_date: null,
        }
    }
    backToList(){
        this.props.history.push('/');
    }
    onRangeChange(value, dateString) {
        console.log(dateString);
        this.fromDate = dateString[0];
        this.toDate = dateString[1];

    }
    onRangeOK(value) {
        console.log('on okay', value);
    }

    render(){
        return (
            <div className="reporting wide-container">
                <h1>Reports</h1>
                <div className="reports-date-filter">
                    {this.state.earliest_date && (
                        <RangePicker 
                            defaultValue={[moment(this.state.earliest_date, this.dateFormat), moment(new Date())]}
                            onChange={this.onRangeChange}
                            onOk={this.onRangeOk}
                        />
                    )}
                </div>
                <div className="reports">
                    <div className="reports-main">
                        <div className="reports-most-frequent">
                            <h2>Most frequent items</h2>
                            <ItemFrequencyList 
                            distinct_item_count={this.state.distinct_item_count}
                            items_dates={this.state.items_dates}/>
                        </div>
                    </div>
                    <div className="reports-quick">
                        <ItemPieChart />
                        <ItemUsers />
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount(){
        console.log('reports did mount');
        $.ajax(endpoints.main, {
            method: 'POST',
            data: {
                account_id: this.props.user.user_account_id,
                action: 'reporting'
            }
        }).then((results) => {
            try {
                let data = JSON.parse(results);
                const { items_dates, user_transactions, distinct_item_count, earliest_date } = data;
                this.setState({
                    items_dates,
                    user_transactions,
                    distinct_item_count,
                    earliest_date,
                });
            } catch (e) {
                console.error(e);
            }
        });
    }
}

export const Reports = withRouter(Main);