import React from "react";

import { ItemPieChart } from "./reports/itempiechart";
import { ItemUsers } from "./reports/itemusers";
import { ItemFrequencyList } from "./reports/itemfrequencylist";
import { DatePicker } from "antd";
import { withRouter } from "react-router";

import { endpoints } from "./endpoints";

class Main extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            items_dates: {},
            user_transactions: [],
            distinct_item_count: [],
        }
    }
    backToList(){
        this.props.history.push('/');
    }

    render(){
        return (
            <div className="reporting wide-container">
                <h1>Reports</h1>
                <div className="reports-date-filter">
                    <DatePicker />
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
                const { items_dates, user_transactions, distinct_item_count } = data;
                this.setState({
                    items_dates,
                    user_transactions,
                    distinct_item_count,
                });
            } catch (e) {
                console.error(e);
            }
            // this.setState({
            //     items_by_frequency: JSON.parse(results)
            // })
        });
    }
}

export const Reports = withRouter(Main);