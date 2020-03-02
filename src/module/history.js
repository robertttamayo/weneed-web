import React from "react";

import { Timeline, Input, Checkbox, DatePicker, Radio } from "antd";
import { endpoints } from "./endpoints";

import { withRouter } from "react-router";

class Main extends React.Component {
    constructor(props){
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handlePurchasedRadioChange = this.handlePurchasedRadioChange.bind(this);

        this.red = "#b3005a";
        this.green = "#00b359";
        this.blue = "#0066cc";

        this.state = {
            item_history: [],
            loading: true,
            searchTerm: '',
            searchDate: '',
            showOnlyDateAdded: false,
            showOnlyPurchased: false,
        }
    }
    handlePurchasedRadioChange(event) {
        this.setState({item_filter: event.target.value});
    }
    handleOnChange(event){
        this.setState({searchTerm: event.target.value});
    }
    render(){
        let previousDate = '';
        const filteredList = this.state.item_history.filter((item) => {
            return item.item_name_lc.indexOf(this.state.searchTerm) != -1;
        });
        const purchaseTimelineItems = (filteredList.map((item, index)=> {
            let date = item.item_date == previousDate ? '' : `${item.item_date}`;
            if (previousDate != item.item_date) {
                previousDate = item.item_date;
            }
            let color = this.green;
            let status = item.item_status;
            let message = 'added to list';
            if (status == 'blue') {
                color = this.blue;
                message = 'purchased';
            }
            return (
                <Timeline.Item key={index} label={date} color={color}>
                    <b>{item.item_name}</b> {message}
                </Timeline.Item>
            )
        }));
        return (
            <div className="shopping-history-container">
                <h1>History</h1>
                <div className="searchHistory">
                    <Input placeholder="Search your history" onChange={this.handleOnChange} value={this.state.searchTerm}/>
                </div>
                <div class="filters">
                    <Radio value="all">Show date purchased and date added</Radio>
                    <Radio value="purchased">Show date purchased only</Radio>
                    <Radio value="added">Show date added only</Radio>
                </div>
                <div className="timeline">
                    {this.state.loading ? (
                        <div> Loading history... </div>
                    ) : (
                    <Timeline mode="left">
                        {purchaseTimelineItems}
                    </Timeline>
                    )}
                    
                </div>
            </div>
        )
    }
    componentDidMount(){
        $.ajax(endpoints.main, {
            method: "POST",
            data: {
                account_id: this.props.user.user_id,
                action: 'get_history',
            },
        }).then((results) => {
            let item_history = JSON.parse(results);
            item_history.forEach((item)=>item.item_name_lc = item.item_name.toLowerCase());
            this.setState({
                item_history,
                loading: false
            });
        });
    }
}

export const ShoppingHistory = withRouter(Main);